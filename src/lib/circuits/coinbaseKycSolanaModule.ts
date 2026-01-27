import type { CircuitModule, PortalContext, Logger } from "./types";
import { ethers, BrowserProvider, SigningKey, JsonRpcProvider, Transaction } from "ethers";

// Sunspot proving server API URL
const SUNSPOT_API_URL = process.env.NEXT_PUBLIC_SUNSPOT_API_URL || "http://localhost:3001";

// Coinbase attestor contract address (same as Base)
const COINBASE_CONTRACT = "0x357458739F90461b99789350868CD7CF330Dd7EE";

const ETH_SIGNED_PREFIX = "\x19Ethereum Signed Message:\n32";

function generateSignalHash(origin: string, nonce: string): string {
  const signal_bytes = ethers.toUtf8Bytes(origin + nonce);
  return ethers.keccak256(signal_bytes);
}

// Fetch KYC attestation from EAS
async function fetchKycAttestation(address: string): Promise<any> {
  const now = Math.floor(Date.now() / 1000);
  const query = `query GetAttestations($recipient: String!, $attester: String!, $schemaId: String!, $now: Int!) {
    attestations(
      where: {
        recipient: { equals: $recipient }
        schemaId: { equals: $schemaId }
        attester: { equals: $attester }
        revocationTime: { equals: 0 }
        OR: [
          { expirationTime: { equals: 0 } }
          { expirationTime: { gt: $now } }
        ]
      }
      orderBy: { time: desc }
      take: 1
    ) {
      txid
    }
  }`;

  const res = await fetch("https://base.easscan.org/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        recipient: address,
        attester: COINBASE_CONTRACT,
        schemaId: "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9",
        now,
      },
    }),
  });

  const json = await res.json();
  return json.data?.attestations?.[0] || null;
}

export const coinbaseKycSolanaModule: CircuitModule = {
  id: "coinbase_kyc_solana",
  title: "Solana KYC Verification",
  eyebrow: "Proof Portal (Solana)",
  description:
    "Zero-knowledge proof generation for Solana. Your wallet signs a challenge, and a ZK proof is generated to verify your identity.",

  steps: [
    { action: "Connecting wallet", done: "Wallet connected" },
    { action: "Fetching KYC attestation", done: "KYC attestation found" },
    { action: "Signing challenge", done: "Challenge signed" },
    { action: "Generating ZK proof", done: "Proof generated" },
  ],

  prove: async (ctx: PortalContext, log: Logger) => {
    const { address, walletClient, rpcUrl, origin, nonce } = ctx;

    if (!address || !walletClient || !rpcUrl || !origin || !nonce) {
      throw new Error("Missing required context for proving.");
    }

    let attestation: any;
    let calldata: string;
    let signatureData: {
      digest: string;
      signature: string;
      pubkey_x: string;
      pubkey_y: string;
    };

    const step = async (i: number, fn: () => Promise<void>) => {
      log.append(coinbaseKycSolanaModule.steps[i].action + "...", "info");
      await fn();
      log.markStep(i);
      log.append(`✔ ${coinbaseKycSolanaModule.steps[i].done}`, "success");
    };

    // Step 0: Wallet Connection
    await step(0, async () => {
      log.append(`Wallet: ${address}`, "info");
    });

    // Step 1: Fetch KYC Attestation and extract calldata
    await step(1, async () => {
      attestation = await fetchKycAttestation(address!);
      if (!attestation) throw new Error("No valid KYC attestation found on Base.");
      log.append(`Attestation tx: ${attestation.txid}`, "info");

      // Fetch raw transaction to get calldata
      const baseProvider = new JsonRpcProvider(rpcUrl);
      const tx = await baseProvider.getTransaction(attestation.txid);
      if (!tx) throw new Error(`Transaction not found: ${attestation.txid}`);

      // Extract first 36 bytes of calldata (function selector + 32 bytes param)
      // calldata format: 0x + function_selector(4 bytes) + padding(12 bytes) + address(20 bytes)
      calldata = tx.data.slice(0, 74); // 0x + 72 hex chars = 36 bytes
      log.append(`Calldata: ${calldata.slice(0, 20)}...`, "info");
    });

    // Step 2: Sign Challenge
    await step(2, async () => {
      const signal_hash = generateSignalHash(origin, nonce);
      const digest = ethers.keccak256(
        ethers.concat([ethers.toUtf8Bytes(ETH_SIGNED_PREFIX), ethers.getBytes(signal_hash)])
      );

      const signer = new BrowserProvider(walletClient).getSigner();
      const sigRaw = await walletClient.signMessage({
        account: (await signer).address as `0x${string}`,
        message: { raw: signal_hash as `0x${string}` },
      });
      
      const sig = ethers.Signature.from(sigRaw);
      const pubKeyHex = SigningKey.recoverPublicKey(digest, sig);
      const pubKeyBytes = ethers.getBytes(pubKeyHex);

      signatureData = {
        digest,
        signature: sig.r + sig.s.slice(2), // r || s without 0x prefix in s
        pubkey_x: ethers.hexlify(pubKeyBytes.slice(1, 33)),
        pubkey_y: ethers.hexlify(pubKeyBytes.slice(33)),
      };

      log.append("Signature captured, generating proof...", "info");
    });

    // Step 3: Generate ZK Proof
    let finalProof: string = "";
    let finalPublicInputs: string[] = [];

    await step(3, async () => {
      // Trigger spinner animation
      log.append("Generating ZK proof... (this may take 15-30 seconds)", "info");
      
      const start = Date.now();

      const res = await fetch(`${SUNSPOT_API_URL}/prove/solana`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          calldata,
          contract_address: COINBASE_CONTRACT,
          ...signatureData,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Proof generation failed: ${err}`);
      }

      const result = await res.json();
      const duration = ((Date.now() - start) / 1000).toFixed(1);

      finalProof = result.proof;
      // Solana uses publicWitness, not publicInputs
      finalPublicInputs = result.publicWitness || result.publicInputs || [];

      log.updateLast(`✔ Proof generated (${duration}s)`, "highlight");
      log.append("# Proof tied to this request (anti-replay).", "note");
      log.append("", "info", true); // interactive flag triggers the button
    });

    return {
      proof: finalProof,
      publicInputs: finalPublicInputs, // This is actually publicWitness for Solana
    };
  },
};


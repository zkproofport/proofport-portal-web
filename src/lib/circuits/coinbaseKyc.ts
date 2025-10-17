import type { CircuitModule, PortalContext, Logger } from "./types";
import { ethers } from "ethers";
import { Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";

const COINBASE_CONTRACT = "0x357458739F90461b99789350868CD7CF330Dd7EE" as const;
const ETH_SIGNED_PREFIX = "\x19Ethereum Signed Message:\n32";
const CIRCUIT_URL =
  "https://raw.githubusercontent.com/hsy822/zk-coinbase-attestor/develop/packages/circuit/target/zk_coinbase_attestor.json";

async function fetchKycAttestation(address: string) {
  const now = Math.floor(Date.now() / 1000);
  const query = `query GetAttestations($recipient: String!, $attester: String!, $schemaId: String!, $now: Int!) {
    attestations(
      where: {
        recipient: { equals: $recipient }
        schemaId: { equals: $schemaId }
        attester: { equals: $attester }
        revocationTime: { equals: 0 }
        OR: [{ expirationTime: { equals: 0 } }, { expirationTime: { gt: $now } }]
      }
      orderBy: { time: desc }
      take: 1
    ) { txid }
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

async function fetchRawTx(rpcUrl: string, txHash: string) {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getTransactionByHash",
      params: [txHash],
    }),
  });
  const json = await res.json();
  return json.result;
}

export const coinbaseKyc: CircuitModule = {
  id: "coinbase_kyc",
  title: "Private Coinbase KYC Verification",
  eyebrow: "Proof Portal",
  description:
    "Generate a zero-knowledge proof that you own a Coinbase-KYCed account—without revealing your wallet address or calldata.",
  steps: [
    { action: "Connecting wallet", done: "Wallet connected" },
    { action: "Fetching KYC attestation", done: "KYC attestation fetched" },
    { action: "Extracting calldata from tx", done: "Calldata extracted" },
    { action: "Generating digest from calldata", done: "Digest generated" },
    { action: "Signing digest and recovering public key", done: "User signature verified" },
    { action: "Generating ZK proof", done: "ZK proof generated" },
  ],

  prove: async (ctx: PortalContext, log: Logger) => {
    if (!ctx.address) throw new Error("Wallet address missing");
    if (!ctx.rpcUrl) throw new Error("RPC URL missing");
    const userAddr = ctx.address;

    const step = async (i: number, fn: () => Promise<void>) => {
      log.append(coinbaseKyc.steps[i].action + "...", "info");
      await fn();
      log.markStep(i);
      log.append(`✔ ${coinbaseKyc.steps[i].done}`, "success");
    };

    await step(0, async () => { log.append(`Wallet: ${userAddr}`, "info"); });

    const attestation = await (async () => {
      let out: any = null;
      await step(1, async () => {
        out = await fetchKycAttestation(userAddr);
        if (!out) throw new Error("No valid KYC attestation found.");
        log.append("Attestation tx: " + out.txid, "info");
      });
      return out!;
    })();

    const { calldata } = await (async () => {
      let _calldata: Uint8Array = new Uint8Array();
      await step(2, async () => {
        const tx = await fetchRawTx(ctx.rpcUrl, attestation.txid);
        let calldataHex: string = tx?.input ?? "0x";
        if (calldataHex.length < 74) calldataHex = calldataHex.padEnd(74, "0");
        _calldata = ethers.getBytes(calldataHex.slice(0, 74));
        log.append(`Extracted calldata (${_calldata.length} bytes)`, "info");
      });
      return { calldata: _calldata };
    })();

    const { rawDigest, digest } = await (async () => {
      let _raw: `0x${string}` = "0x";
      let _dig: `0x${string}` = "0x";
      await step(3, async () => {
        _raw = ethers.keccak256(calldata) as `0x${string}`;
        _dig = ethers.keccak256(
          ethers.concat([ethers.toUtf8Bytes(ETH_SIGNED_PREFIX), ethers.getBytes(_raw)])
        ) as `0x${string}`;
        log.append("Generated Ethereum-signed digest from calldata", "info");
      });
      return { rawDigest: _raw, digest: _dig };
    })();

    const { sigUser, user_pubkey_x, user_pubkey_y } = await (async () => {
      let _sig!: ethers.Signature;
      let _x!: Uint8Array; let _y!: Uint8Array;
      await step(4, async () => {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const sigHex: string = await (window as any).ethereum.request({
          method: "personal_sign",
          params: [rawDigest, await signer.getAddress()],
        });
        _sig = ethers.Signature.from(sigHex);

        const pubKeyHex = ethers.SigningKey.recoverPublicKey(digest, _sig);
        const pubKeyBytes = ethers.getBytes(pubKeyHex);
        _x = pubKeyBytes.slice(1, 33);
        _y = pubKeyBytes.slice(33);
        if (_x.length !== 32 || _y.length !== 32) throw new Error("Recovered public key is malformed");
        log.append("Recovered public key from user signature", "info");
      });
      return { sigUser: _sig, user_pubkey_x: _x, user_pubkey_y: _y };
    })();

    const result = await (async () => {
      let out!: { proof: any; publicInputs: any };
      await step(5, async () => {
        const sigBytes = new Uint8Array([
          ...ethers.getBytes(sigUser.r),
          ...ethers.getBytes(sigUser.s),
        ]);

        const circuitInput = {
          calldata: Array.from(calldata),
          contract_address: Array.from(ethers.getBytes(COINBASE_CONTRACT)),
          user_address: Array.from(ethers.getBytes(userAddr)),
          digest: Array.from(ethers.getBytes(digest)),
          user_sig: Array.from(sigBytes),
          user_pubkey_x: Array.from(user_pubkey_x),
          user_pubkey_y: Array.from(user_pubkey_y),
        };

        const metaRes = await fetch(CIRCUIT_URL);
        const metadata = await metaRes.json();
        const noir = new Noir(metadata);

        const backend = new UltraHonkBackend(metadata.bytecode, { threads: 4 } as any);

        const { witness } = await noir.execute(circuitInput);

        const t0 = Date.now();
        const proofObj = await backend.generateProof(witness, { keccak: true });
        const secs = ((Date.now() - t0) / 1000).toFixed(1);

        log.updateLast(`✔ ZK Proof generated (${secs}s)`, "highlight");
        log.append(`# Your Coinbase KYC proof was generated locally in your browser.`, "note");
        log.append(`# It will only be posted back to the requesting dApp.`, "note");

        out = { proof: proofObj.proof, publicInputs: proofObj.publicInputs };
      });
      return out;
    })();

    return result;
  },
};

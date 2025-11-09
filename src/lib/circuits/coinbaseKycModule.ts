import type { CircuitModule, PortalContext, Logger } from "./types";
import { ethers, Transaction, SigningKey, BrowserProvider, JsonRpcProvider } from "ethers";
import { MerkleTree } from "merkletreejs";
import { Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";

const COINBASE_CONTRACT = "0x357458739F90461b99789350868CD7CF330Dd7EE";
const ETH_SIGNED_PREFIX = "\x19Ethereum Signed Message:\n32";
const CIRCUIT_URL =
  "https://raw.githubusercontent.com/zkproofport/circuits/main/coinbase-kyc/target/zk_coinbase_attestor.json";

const AUTHORIZED_SIGNERS = [
  '0x952f32128AF084422539C4Ff96df5C525322E564',
  '0x8844591D47F17bcA6F5dF8f6B64F4a739F1C0080',
  '0x88fe64ea2e121f49bb77abea6c0a45e93638c3c5',
  '0x44ace9abb148e8412ac4492e9a1ae6bd88226803'
];

function padArray(arr: Uint8Array, targetLength: number): Uint8Array {
  if (arr.length >= targetLength) return arr;
  const padded = new Uint8Array(targetLength);
  padded.set(arr);
  return padded;
}

function extractPubkeyCoordinates(pubkey: string): { x: string; y: string } {
  const pubkeyHex = pubkey.startsWith('0x04') ? pubkey.slice(4) : pubkey.slice(2);
  const x = '0x' + pubkeyHex.slice(0, 64);
  const y = '0x' + pubkeyHex.slice(64, 128);
  return { x, y };
}

function generateSignalHashes(origin: string, nonce: string): { signal_hash: string, message_hash_to_sign: string } {
  const signal_bytes = ethers.toUtf8Bytes(origin + nonce);
  const signal_hash = ethers.keccak256(signal_bytes); 
  
  const message_hash_to_sign = ethers.keccak256(
    ethers.concat([ethers.toUtf8Bytes(ETH_SIGNED_PREFIX), ethers.getBytes(signal_hash)])
  );
  
  return { signal_hash, message_hash_to_sign };
}

function buildMerkleProof(signerAddress: string): {
  merkle_root: string;
  merkle_proof: number[][];
  leaf_index: number;
  depth: number;
  signerInList: boolean;
} {
  const leaves = AUTHORIZED_SIGNERS.map(addr =>
    ethers.keccak256(ethers.getBytes(ethers.getAddress(addr)))
  );

  const tree = new MerkleTree(leaves, ethers.keccak256, {
    sortPairs: false, 
  });

  const merkle_root = tree.getHexRoot();

  const leafIndex = AUTHORIZED_SIGNERS.findIndex(
    addr => addr.toLowerCase() === signerAddress.toLowerCase()
  );

  if (leafIndex === -1) {
    return { merkle_root, merkle_proof: [], leaf_index: 0, depth: 0, signerInList: false };
  }

  const signerLeaf = leaves[leafIndex];
  const proof = tree.getProof(signerLeaf);
  const depth = proof.length;

  const maxDepth = 8;
  const proofArray: number[][] = [];
  for (let i = 0; i < maxDepth; i++) {
    if (i < proof.length) {
      proofArray.push(Array.from(ethers.getBytes('0x' + proof[i].data.toString('hex'))));
    } else {
      proofArray.push(Array(32).fill(0));
    }
  }

  return {
    merkle_root,
    merkle_proof: proofArray,
    leaf_index: leafIndex,
    depth: depth,
    signerInList: true,
  };
}

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

async function fetchRawTx(rpcUrl: string, txHash: string): Promise<any> {
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

export const coinbaseKycModule: CircuitModule = {
  id: "coinbase_kyc",
  title: "Private Coinbase KYC Verification",
  eyebrow: "Proof Portal",
  description:
    "Prove identity and eligibility without exposing your wallet or personal data. Proofs are generated locally and only cryptographic results leave the browser.",
  
  steps: [
    { action: "Connecting wallet", done: "Wallet connected" },
    { action: "Fetching KYC attestation", done: "KYC attestation fetched" },
    { action: "Fetching raw transaction", done: "Raw transaction fetched" },
    { action: "Verifying Coinbase signer", done: "Coinbase signer verified" },
    { action: "Signing dApp challenge", done: "User signature verified" },
    { action: "Generating ZK proof", done: "ZK proof generated" },
  ],

  prove: async (ctx: PortalContext, log: Logger) => {
    const { address, walletClient, rpcUrl, origin, nonce } = ctx;

    if (!address || !walletClient || !rpcUrl || !origin || !nonce) {
      throw new Error("Missing required context for proving.");
    }

    let attestation: any;
    let tx: any, txFull: Transaction;
    let raw_transaction: number[], tx_length: number;
    let coinbasePubkeyCoords: { x: string, y: string };
    let merkle_root: string, merkle_proof: number[][], leaf_index: number, depth: number;
    let signal_hash: string, message_hash_to_sign: string;
    let userX: Uint8Array, userY: Uint8Array, sigUser: ethers.Signature, userAddress: string;

    const step = async (i: number, fn: () => Promise<void>) => {
      log.append(coinbaseKycModule.steps[i].action + "...", "info");
      await fn();
      log.markStep(i);
      log.append(`✔ ${coinbaseKycModule.steps[i].done}`, "success");
    };

    // Step 0: Wallet Connection
    await step(0, async () => {
      log.append(`Wallet: ${address}`, "info");
    });

    // Step 1: Fetch KYC Attestation
    await step(1, async () => {
      attestation = await fetchKycAttestation(address!);
      if (!attestation) throw new Error("No valid KYC attestation found.");
      log.append("Attestation tx: " + attestation.txid, "info");
    });

    // Step 2: Fetch Raw Transaction
    await step(2, async () => {
      const baseProvider = new JsonRpcProvider(rpcUrl);
      
      tx = await baseProvider.getTransaction(attestation.txid);
      
      if (!tx) {
        throw new Error(`Transaction not found: ${attestation.txid}`);
      }
      if (tx.type !== 2) {
          throw new Error("Attestation is not an EIP-1559 (Type 2) transaction. Circuit only supports Type 2.");
      }

      txFull = Transaction.from(tx); 
      
      const serialized_tx = ethers.getBytes(txFull.serialized);
      tx_length = serialized_tx.length;
      if (tx_length > 300) {
          throw new Error(`Transaction is too large (${tx_length} bytes). Circuit max is 300.`);
      }
      
      raw_transaction = Array.from(padArray(serialized_tx, 300));
      log.append(`Fetched raw EIP-1559 tx (${tx_length} bytes)`, "info");
    });

    // Step 3: Verify Coinbase Signer
    await step(3, async () => {
      const unsigned_tx_hash = txFull.unsignedHash;
      const coinbaseSig = txFull.signature!;
      
      const coinbasePubkey = SigningKey.recoverPublicKey(unsigned_tx_hash, coinbaseSig);
      coinbasePubkeyCoords = extractPubkeyCoordinates(coinbasePubkey);
      const coinbaseSignerAddress = ethers.computeAddress(coinbasePubkey);
      
      log.append(`Recovered Coinbase signer: ${coinbaseSignerAddress}`, "info");
      
      const merkleData = buildMerkleProof(coinbaseSignerAddress);
      if (!merkleData.signerInList) {
        throw new Error("Recovered signer is not in the authorized list. Please contact dApp admin.");
      }
      
      merkle_root = merkleData.merkle_root;
      merkle_proof = merkleData.merkle_proof;
      leaf_index = merkleData.leaf_index;
      depth = merkleData.depth;
      
      log.append(`Signer is valid (index ${leaf_index}). Merkle root: ${merkle_root.slice(0, 10)}...`, "info");
    });

    // Step 4: Sign dApp Challenge
    await step(4, async () => {
      const hashes = generateSignalHashes(origin, nonce);
      signal_hash = hashes.signal_hash;
      message_hash_to_sign = hashes.message_hash_to_sign;
      
      log.append(`Generated public signal_hash: ${signal_hash.slice(0, 10)}...`, "info");
      
      const signer = new BrowserProvider(walletClient!).getSigner();
      const sigUserRaw = await walletClient!.signMessage({
        account: (await signer).address as `0x${string}`,
        message: { raw: signal_hash as `0x${string}` }, 
      });
      sigUser = ethers.Signature.from(sigUserRaw);

      const pubKeyHex = SigningKey.recoverPublicKey(message_hash_to_sign, sigUser);
      const pubKeyBytes = ethers.getBytes(pubKeyHex);
      userX = pubKeyBytes.slice(1, 33);
      userY = pubKeyBytes.slice(33);

      userAddress = (await signer).address;
      log.append("Recovered public key from user signature", "info");
    });

    // Step 5: Generate ZK Proof
    let finalProof: string | null = null;
    let finalPublicInputs: string[] = [];

    await step(5, async () => {
      const circuitInput = {
        signal_hash: Array.from(ethers.getBytes(signal_hash)),
        signer_list_merkle_root: Array.from(ethers.getBytes(merkle_root)),
        user_address: Array.from(ethers.getBytes(userAddress)),
        user_signature: Array.from(new Uint8Array([...ethers.getBytes(sigUser.r), ...ethers.getBytes(sigUser.s)])),
        user_pubkey_x: Array.from(userX),
        user_pubkey_y: Array.from(userY),
        raw_transaction: raw_transaction,
        tx_length: tx_length,
        coinbase_attester_pubkey_x: Array.from(ethers.getBytes(coinbasePubkeyCoords.x)),
        coinbase_attester_pubkey_y: Array.from(ethers.getBytes(coinbasePubkeyCoords.y)),
        coinbase_signer_merkle_proof: merkle_proof,
        coinbase_signer_leaf_index: leaf_index,
        merkle_proof_depth: depth,
      };

      log.append("Fetching circuit...", "info");
      const metaRes = await fetch(CIRCUIT_URL);
      const metadata = await metaRes.json();
      const noir = new Noir(metadata);
      
      log.append("Initializing UltraHonk backend...", "info");
      const backend = new UltraHonkBackend(metadata.bytecode, { threads: (ctx as any).threads ?? 1 });

      log.append("Executing circuit to get witness...", "info");
      const { witness } = await noir.execute(circuitInput);
      
      log.append("Generating ZK proof... (this may take a moment)", "info");

      const start = Date.now();
      const proof = await backend.generateProof(witness, { keccak: true });
      const duration = ((Date.now() - start) / 1000).toFixed(1);

      log.updateLast(`✔ ZK Proof generated (${duration}s)`, "highlight");
      log.append(`# A privacy-enhanced proof verifying your KYC was successfully generated.`, "note");
      log.append(`# Your wallet address was NOT revealed to the dApp.`, "note");
      log.append(`# This proof is tied to this specific request (anti-replay).`, "note");
      log.append(``, "info", true);

      const publicInputsFeBytes32: string[] = proof.publicInputs.map((fe: any) => {
        if (typeof fe === "bigint") return ("0x" + fe.toString(16).padStart(64, "0"));
        if (typeof fe === "number") return ("0x" + fe.toString(16).padStart(64, "0"));
        if (typeof fe === "string") {
          const h = fe.startsWith("0x") ? fe.slice(2) : BigInt(fe).toString(16);
          return "0x" + h.padStart(64, "0");
        }
        return ethers.hexlify(fe).padEnd(66, "0");
      });

      finalProof = ethers.hexlify(proof.proof);
      finalPublicInputs = publicInputsFeBytes32;
    });

    if (!finalProof) {
      throw new Error("Proof generation failed to produce a result.");
    }

    return {
      proof: finalProof,
      publicInputs: finalPublicInputs,
    };
  },
};
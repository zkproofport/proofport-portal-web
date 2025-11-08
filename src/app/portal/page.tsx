"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ethers, Transaction, SigningKey, BrowserProvider, JsonRpcProvider } from "ethers";
import { MerkleTree } from "merkletreejs";
import { Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";
import { Sparkles, CheckCircle, Cpu, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const STEPS = [
  { action: "Connecting wallet", done: "Wallet connected" },
  { action: "Fetching KYC attestation", done: "KYC attestation fetched" },
  { action: "Fetching raw transaction", done: "Raw transaction fetched" },
  { action: "Verifying Coinbase signer", done: "Coinbase signer verified" },
  { action: "Signing dApp challenge", done: "User signature verified" },
  { action: "Generating ZK proof", done: "ZK proof generated" },
];

const COINBASE_CONTRACT = "0x357458739F90461b99789350868CD7CF330Dd7EE";
const ETH_SIGNED_PREFIX = "\x19Ethereum Signed Message:\n32";

const CIRCUIT_URL =
  "https://raw.githubusercontent.com/zkproofport/circuits/main/coinbase-kyc/target/zk_coinbase_attestor.json";

// =================================================================
// AUTHORIZED SIGNERS
// (This list must be kept in sync with the SDK/dApp)
// =================================================================
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
  // This logic MUST match the SDK's verifier
  const signal_bytes = ethers.toUtf8Bytes(origin + nonce);
  const signal_hash = ethers.keccak256(signal_bytes); // This is the public input
  
  // This is what the wallet will sign (and the circuit will check)
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
  // Hash leaves to match Noir's keccak256(address, 20)
  const leaves = AUTHORIZED_SIGNERS.map(addr =>
    ethers.keccak256(ethers.getBytes(ethers.getAddress(addr)))
  );

  const tree = new MerkleTree(leaves, ethers.keccak256, {
    sortPairs: false, // Match Noir's index-based ordering
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

  // Pad proof to a fixed depth (e.g., 8) for the circuit
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


export default function PortalPage() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [logs, setLogs] = useState<{ text: string; type: "info" | "success" | "error" | "highlight" | "note"; interactive?: boolean }[]>([]);
  const [proofResult, setProofResult] = useState<null | { proof: any; publicInputs: string[]; meta: any }>(null);
  const [fromSdk, setFromSdk] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: walletClient } = useWalletClient();

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const origin = params.get("origin");
  const nonce = params.get("nonce");

  useEffect(() => {
    if (origin && nonce) {
      setFromSdk(true);
    }
  }, [origin, nonce]); 

  useEffect(() => {
    if (isConnected) setCompletedSteps([0]); 
  }, [isConnected]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const appendLog = (text: string, type: "info" | "success" | "error" | "highlight" | "note" = "info", interactive = false) =>
    setLogs((prev) => [...prev, { text, type, interactive }]);

  const updateLastLog = (text: string, type: "info" | "success" | "error" | "highlight" | "note" = "info") =>
    setLogs((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], text, type };
      return next;
    });

  const markStepComplete = (i: number) => setCompletedSteps((prev) => [...prev, i]);

  const handleProve = async () => {
    try {
      if (!isConnected) {
        openConnectModal?.();
        return;
      }
      if (!fromSdk || !origin || !nonce) {
        appendLog("Portal is read-only or session is invalid. Open via SDK.", "error");
        return; 
      }

      setLoading(true);
      setCurrentStep(null);
      setLogs([]);
      setCompletedSteps([]);
      setProofResult(null);

      // Variable declarations
      let attestation: any;
      let tx: any, txFull: Transaction;
      let raw_transaction: number[], tx_length: number;
      let coinbasePubkeyCoords: { x: string, y: string };
      let merkle_root: string, merkle_proof: number[][], leaf_index: number, depth: number;
      let signal_hash: string, message_hash_to_sign: string;
      let userX: Uint8Array, userY: Uint8Array, sigUser: ethers.Signature, userAddress: string;


      const step = async (i: number, fn: () => Promise<void>) => {
        setCurrentStep(i);
        appendLog(STEPS[i].action + "...", "info");
        await fn();
        markStepComplete(i);
        appendLog(`✔ ${STEPS[i].done}`, "success");
      };

      // Step 0: Wallet Connection
      await step(0, async () => {
        appendLog(`Wallet: ${address}`, "info");
      });

      // Step 1: Fetch KYC Attestation
      await step(1, async () => {
        attestation = await fetchKycAttestation(address!);
        if (!attestation) throw new Error("No valid KYC attestation found.");
        appendLog("Attestation tx: " + attestation.txid, "info");
      });

      // Step 2: Fetch Raw Transaction
      await step(2, async () => {
        const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL as string;
        if (!rpcUrl) {
          throw new Error("NEXT_PUBLIC_BASE_RPC_URL is not defined in .env.local");
        }

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
        appendLog(`Fetched raw EIP-1559 tx (${tx_length} bytes)`, "info");
      });

      // Step 3: Verify Coinbase Signer
      await step(3, async () => {
        const unsigned_tx_hash = txFull.unsignedHash;
        const coinbaseSig = txFull.signature!;
        
        const coinbasePubkey = SigningKey.recoverPublicKey(unsigned_tx_hash, coinbaseSig);
        coinbasePubkeyCoords = extractPubkeyCoordinates(coinbasePubkey);
        const coinbaseSignerAddress = ethers.computeAddress(coinbasePubkey);
        
        appendLog(`Recovered Coinbase signer: ${coinbaseSignerAddress}`, "info");
        
        const merkleData = buildMerkleProof(coinbaseSignerAddress);
        if (!merkleData.signerInList) {
          throw new Error("Recovered signer is not in the authorized list. Please contact dApp admin.");
        }
        
        merkle_root = merkleData.merkle_root;
        merkle_proof = merkleData.merkle_proof;
        leaf_index = merkleData.leaf_index;
        depth = merkleData.depth;
        
        appendLog(`Signer is valid (index ${leaf_index}). Merkle root: ${merkle_root.slice(0, 10)}...`, "info");
      });

      // Step 4: Sign dApp Challenge
      await step(4, async () => {
        const hashes = generateSignalHashes(origin, nonce);
        signal_hash = hashes.signal_hash;
        message_hash_to_sign = hashes.message_hash_to_sign;
        
        appendLog(`Generated public signal_hash: ${signal_hash.slice(0, 10)}...`, "info");
        
        const signer = new BrowserProvider(walletClient!).getSigner();
        const sigUserRaw = await walletClient!.signMessage({
          account: (await signer).address as `0x${string}`,
          message: signal_hash as `0x${string}`, // Sign the 32-byte digest (Wallet will add EIP-191 prefix)
        });
        sigUser = ethers.Signature.from(sigUserRaw);

        // Recover pubkey to send to circuit
        const pubKeyHex = SigningKey.recoverPublicKey(message_hash_to_sign, sigUser);
        const pubKeyBytes = ethers.getBytes(pubKeyHex);
        userX = pubKeyBytes.slice(1, 33);
        userY = pubKeyBytes.slice(33);

        userAddress = (await signer).address;
        appendLog("Recovered public key from user signature", "info");
      });

      // Step 5: Generate ZK Proof
      await step(5, async () => {
        const circuitInput = {
          // Public Inputs
          signal_hash: Array.from(ethers.getBytes(signal_hash)),
          signer_list_merkle_root: Array.from(ethers.getBytes(merkle_root)),
          
          // Private Inputs
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

        appendLog("Fetching circuit...", "info");
        const metaRes = await fetch(CIRCUIT_URL);
        const metadata = await metaRes.json();
        const noir = new Noir(metadata);
        
        appendLog("Initializing UltraHonk backend...", "info");
        const backend = new UltraHonkBackend(metadata.bytecode, { threads: 4 });

        appendLog("Executing circuit to get witness...", "info");
        const { witness } = await noir.execute(circuitInput);
        
        appendLog("Generating ZK proof... (this may take a moment)", "info");
        const start = Date.now();
        const proof = await backend.generateProof(witness, { keccak: true });
        const duration = ((Date.now() - start) / 1000).toFixed(1);

        updateLastLog(`✔ ZK Proof generated (${duration}s)`, "highlight");
        appendLog(`# A privacy-enhanced proof verifying your KYC was successfully generated.`, "note");
        appendLog(`# Your wallet address was NOT revealed to the dApp.`, "note");
        appendLog(`# This proof is tied to this specific request (anti-replay).`, "note");
        appendLog(``, "info", true);

        const meta = {
          origin,
          timestamp: Math.floor(Date.now() / 1000),
          nonce,
        };

        setProofResult({
          proof: proof.proof,
          publicInputs: proof.publicInputs, // Will be [signal_hash, merkle_root]
          meta,
        });
      });

      setCurrentStep(null);
    } catch (err: any) {
      appendLog(`${err?.message || "Unknown error"}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRequest = () => {
    console.log("[PORTAL] Close button clicked. Sending close request to parent.");
    window.parent.postMessage({ type: "zk-coinbase-close-request" }, origin as any);
  };

  const sendProofToDappAndClose = () => {
    if (!proofResult) {
      console.error("[PORTAL] Proof result is missing. Cannot send.");
      return;
    }

    const msg = {
      type: "zk-coinbase-proof",
      proof: proofResult.proof,
      publicInputs: proofResult.publicInputs,
      meta: proofResult.meta,
    };

    const targetOrigin = proofResult.meta.origin;

    console.log('[PORTAL] Sending proof...', {
      messagePayload: msg,
      targetOrigin: targetOrigin,
      isOpenerAvailable: !!window.opener, 
    });

    try {
      window.parent.postMessage(msg, targetOrigin);
      console.log("[PORTAL] Message sent successfully!");
    } catch (error) {
      console.error("[PORTAL] Failed to send message:", error);
    }

  };

  const modePill = fromSdk ? "SDK Session" : "Read-only (Web)";
  const modePillClass = fromSdk ? "pill pill--ok" : "pill";

  return (
    <div className="portal-wrap">
      <button 
        onClick={handleCloseRequest}
        title="Close"
        style={{
          position: 'absolute',
          top: '15px',
          right: '20px',
          background: 'transparent',
          border: 'none',
          fontSize: '28px',
          color: '#888',
          cursor: 'pointer',
          lineHeight: '1',
          padding: '0',
          zIndex: 10
        }}
      >
        &times;
      </button>
      <div className="portal-topbar">
        <div className="brand">
          <Image src="/logo.png" alt="" width={28} height={28} style={{ borderRadius: 8 }} />
          <div className="title">zkProofport — Privacy-Preserving Identity Proofs</div>
        </div>
        <div className="portal-status">
          <span className={modePillClass}>{modePill}</span>
          {!fromSdk && <span className="pill">Features disabled</span>}
        </div>
      </div>

      {fromSdk ? (
        <div className="portal-grid">
          <section className="panel" aria-label="Run panel">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Proof Portal</div>
            <h2 className="text-xl">Private Coinbase KYC Verification</h2>
            <p className="sub text-xs">
              Prove identity and eligibility without exposing your wallet or personal data. Proofs are generated locally and
              only cryptographic results leave the browser.
            </p>
            <ul className="step-list text-xs">
              {STEPS.map((s, i) => {
                const done = completedSteps.includes(i);
                const active = currentStep === i;
                return (
                  <li key={i} className={`step${done ? " done" : ""}`}>
                    {active ? <Loader2 className="icon animate-spin" /> : done ? <CheckCircle className="icon" /> : <span className="dot" />}
                    <span>{active ? s.action : done ? s.done : s.action}</span>
                  </li>
                );
              })}
            </ul>
            <div className="portal-actions">
              <button
                onClick={handleProve}
                className="btn btn-primary btn-lg"
                disabled={!fromSdk || loading}
                title={fromSdk ? "Generate proof" : "Open via SDK to enable"}
              >
                {!isConnected ? "Connect Wallet" : loading ? "Generating ZK Proof..." : "Generate ZK Proof"}
              </button>
            </div>
          </section>
          <section className="terminal" aria-label="Terminal">
            <div className="bar">
              <Cpu className="icon" /> <span>UltraHonk Engine</span>
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles className="icon" /> <span>Live logs</span>
              </span>
            </div>
            {logs.map((log, i) => {
              const cls = log.type === "success" ? "log-success" : log.type === "error" ? "log-error" : log.type === "highlight" ? "log-highlight" : log.type === "note" ? "log-note" : "log-info";
              return <div key={i} className={cls}>{log.text}</div>;
            })}
            <div ref={terminalEndRef} />
            {logs.some((l) => l.interactive) && proofResult && (
              <button onClick={sendProofToDappAndClose} className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 14 }}>
                Send Proof to dApp
              </button>
            )}
          </section>
        </div>
      ) : (
        <div className="portal-grid">
          <section 
            className="panel" 
            style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center',
              padding: '48px' 
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 12 }}>Information</div>
            <h2 className="text-xl" style={{ color: 'white' }}>This is the zkProofport Portal</h2>
            <p className="sub text-xs" style={{ maxWidth: '650px', margin: '16px auto 0' }}>
              This is a secure environment for generating private, zero-knowledge proofs for various applications. 
              It can only be activated when accessed from an integrated dApp using the **zkProofport SDK**.
            </p>
            <div className="portal-actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
              <Link className="btn btn-ghost btn-lg" href="/">
                Learn More at Homepage
              </Link>
            </div>
          </section>
        </div>
      )}

      <footer className="footer" role="contentinfo" aria-label="site footer">
        <span>© {new Date().getFullYear()} zkProofport</span>
        <span>•</span>
        <span>**Coming soon** — private beta</span>
        <span>•</span>
        <span>
          <ShieldCheck className="inline-block" style={{ width: 14, height: 14, verticalAlign: "-2px" }} />{" "}
          Powered by Noir & zk
        </span>
        <span>•</span>
        <span>X: <a href="https://x.com/zkproofport">@zkproofport</a></span>
      </footer>
    </div>
  );
}

// =================================================================
// 6. UNMODIFIED FUNCTIONS
// =================================================================

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

async function fetchRawTx(txHash: string): Promise<any> {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_RPC_URL as string, {
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
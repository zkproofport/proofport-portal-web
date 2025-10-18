"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";
import { Sparkles, CheckCircle, Cpu, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const STEPS = [
  { action: "Connecting wallet", done: "Wallet connected" },
  { action: "Fetching KYC attestation", done: "KYC attestation fetched" },
  { action: "Extracting calldata from tx", done: "Calldata extracted" },
  { action: "Generating digest from calldata", done: "Digest generated" },
  { action: "Signing digest and recovering public key", done: "User signature verified" },
  { action: "Generating ZK proof", done: "ZK proof generated" },
];

const COINBASE_CONTRACT = "0x357458739F90461b99789350868CD7CF330Dd7EE";
const ETH_SIGNED_PREFIX = "\x19Ethereum Signed Message:\n32";
const CIRCUIT_URL =
  "https://raw.githubusercontent.com/hsy822/zk-coinbase-attestor/develop/packages/circuit/target/zk_coinbase_attestor.json";

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
  const origin = params.get("origin") || "unknown";
  const nonce = params.get("nonce") || "missing";

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
      if (!fromSdk) {
        appendLog("Portal is read-only in web mode. Open via SDK.", "error");
        return;
      }

      setLoading(true);
      setCurrentStep(null);
      setLogs([]);
      setCompletedSteps([]);
      setProofResult(null);

      let attestation: any;
      let tx: any;
      let calldata: Uint8Array;
      let digest: string, rawDigest: string;
      let userX: Uint8Array, userY: Uint8Array, sigUser: ethers.Signature, userAddress: string;

      const step = async (i: number, fn: () => Promise<void>) => {
        setCurrentStep(i);
        appendLog(STEPS[i].action + "...", "info");
        await fn();
        markStepComplete(i);
        appendLog(`✔ ${STEPS[i].done}`, "success");
      };

      await step(0, async () => {
        appendLog(`Wallet: ${address}`, "info");
      });

      await step(1, async () => {
        attestation = await fetchKycAttestation(address!);
        if (!attestation) throw new Error("No valid KYC attestation found.");
        appendLog("Attestation tx: " + attestation.txid, "info");
      });

      await step(2, async () => {
        tx = await fetchRawTx(attestation.txid);
        let calldataHex: string = tx.input;
        if (calldataHex.length < 74) calldataHex = calldataHex.padEnd(74, "0");
        calldata = ethers.getBytes(calldataHex.slice(0, 74));
        appendLog("Extracted calldata (" + calldata.length + " bytes)", "info");
      });

      await step(3, async () => {
        rawDigest = ethers.keccak256(calldata);
        digest = ethers.keccak256(ethers.concat([ethers.toUtf8Bytes(ETH_SIGNED_PREFIX), ethers.getBytes(rawDigest)]));
        appendLog("Generated Ethereum-signed digest from calldata", "info");
      });

      await step(4, async () => {
        const signer = await new ethers.BrowserProvider(walletClient!).getSigner();
        const sigUserRaw = await walletClient!.signMessage({
          account: signer.address as `0x${string}`,
          message: { raw: rawDigest as `0x${string}` },
        });
        sigUser = ethers.Signature.from(sigUserRaw);

        const pubKeyHex = ethers.SigningKey.recoverPublicKey(digest, sigUser);
        const pubKeyBytes = ethers.getBytes(pubKeyHex);
        userX = pubKeyBytes.slice(1, 33);
        userY = pubKeyBytes.slice(33);

        userAddress = signer.address;
        appendLog("Recovered public key from user signature", "info");
      });

      await step(5, async () => {
        const circuitInput = {
          calldata: Array.from(calldata),
          contract_address: Array.from(ethers.getBytes(COINBASE_CONTRACT)),
          user_address: Array.from(ethers.getBytes(userAddress)),
          digest: Array.from(ethers.getBytes(digest)),
          user_sig: Array.from(new Uint8Array([...ethers.getBytes(sigUser.r), ...ethers.getBytes(sigUser.s)])),
          user_pubkey_x: Array.from(userX),
          user_pubkey_y: Array.from(userY),
        };

        const metaRes = await fetch(CIRCUIT_URL);
        const metadata = await metaRes.json();
        const noir = new Noir(metadata);
        const backend = new UltraHonkBackend(metadata.bytecode, { threads: 4 });

        const { witness } = await noir.execute(circuitInput);

        const start = Date.now();
        const proof = await backend.generateProof(witness, { keccak: true });
        const duration = ((Date.now() - start) / 1000).toFixed(1);

        updateLastLog(`✔ ZK Proof generated (${duration}s)`, "highlight");
        appendLog(`# A zero-knowledge proof verifying your Coinbase KYC attestation was successfully generated.`, "note");
        appendLog(`# Entirely inside your browser memory. It was never stored or uploaded.`, "note");
        appendLog(`# This proof will be sent just once to the originating dApp for verification via postMessage.`, "note");
        appendLog(`# Afterwards it is discarded. Your wallet & onchain history remain private.`, "note");
        appendLog(``, "info", true);

        const meta = {
          origin,
          timestamp: Math.floor(Date.now() / 1000),
          nonce,
        };

        setProofResult({
          proof: proof.proof,
          publicInputs: proof.publicInputs,
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

      <div className="portal-grid">
        {/* 좌측: 안내/버튼 (원본 기능 + 최신 디자인) */}
        <section className="panel" aria-label="Run panel">
          <div className="eyebrow" style={{ marginBottom: 10 }}>Proof Portal</div>
          <h2>Private Coinbase KYC Verification</h2>
          <p className="sub">
            Prove identity and eligibility without exposing your wallet or personal data. Proofs are generated locally and
            only cryptographic results leave the browser.
          </p>

          <ul className="step-list">
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
              {!isConnected ? "Connect Wallet" : loading ? "Generating ZK Proof..." : fromSdk ? "Generate ZK Proof" : "Proof Generation Disabled"}
            </button>

            {!fromSdk && (
              <Link className="btn btn-ghost btn-lg" href="/" title="Back to Landing">
                Back
              </Link>
            )}
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
            const cls =
              log.type === "success" ? "log-success" :
              log.type === "error" ? "log-error" :
              log.type === "highlight" ? "log-highlight" :
              log.type === "note" ? "log-note" : "log-info";
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

      <footer className="footer" role="contentinfo" aria-label="site footer">
        <span>© {new Date().getFullYear()} zkProofport</span>
        <span>•</span>
        <span><strong>Coming soon</strong> — private beta</span>
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

const handleCloseRequest = () => {
  console.log("[PORTAL] Close button clicked. Sending close request to parent.");
  window.parent.postMessage({ type: "zk-coinbase-close-request" }, origin);
};

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

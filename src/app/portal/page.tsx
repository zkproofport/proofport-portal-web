"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Sparkles, CheckCircle, Cpu, ShieldCheck } from "lucide-react";
import { resolveCircuit, availableCircuits } from "@/lib/circuits/registry";
import type { LogType } from "@/lib/circuits/types";
import Image from "next/image";
import Link from "next/link";

type Log = { text: string; type: LogType; interactive?: boolean };

export default function PortalPage() {
  const [fromSdk, setFromSdk] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [proofPayload, setProofPayload] = useState<any>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const DEBUG = params.get('debug') === '1';
  const NO_CLOSE = params.get('noclose') === '1';
  const parentOrigin = useMemo(() => {
    const o = params.get("origin");
    return o && /^https?:\/\//.test(o) ? o : "*";
  }, [params]);
  const circuitId = params.get("circuit");
  const nonce = params.get("nonce") || "missing";
  const origin = params.get("origin") || "unknown";
  const circuit = useMemo(() => resolveCircuit(circuitId), [circuitId]);

  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);
  useEffect(() => { if (window.opener || params.get("sdk") === "1") setFromSdk(true); }, [params]);

  const append = (text: string, type: LogType = "info", interactive = false) =>
    setLogs((p) => [...p, { text, type, interactive }]);
  const updateLast = (text: string, type: LogType = "info") =>
    setLogs((p) => { const n = [...p]; n[n.length - 1] = { ...n[n.length - 1], text, type }; return n; });
  const markStep = (i: number) => setCompleted((p) => [...p, i]);

  async function handleProve() {
    if (!isConnected) { openConnectModal?.(); return; }
    if (!fromSdk) { append("Portal is read-only in web mode. Open via SDK.", "error"); return; }
    if (!circuit) { append("Unknown or missing circuit id.", "error"); return; }

    try {
      setLogs([]); setCompleted([]); setProofPayload(null);
      const ctx = { rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL as string, address: (address || null) as any };
      const result = await circuit.prove(ctx, { append, updateLast, markStep });
      const meta = { origin, nonce, timestamp: Math.floor(Date.now() / 1000), circuit: circuit.id };
      setProofPayload({ ...result, meta });
      append("", "info", true);
    } catch (e: any) {
      append(`${e?.message || "Unknown error"}`, "error");
    }
  }

function sendProofToSdk() {
  if (!proofPayload) return;

  const params = new URLSearchParams(window.location.search);
  const nonce = params.get("nonce") || "missing";
  const rawOrigin = params.get("origin") || "*";
  const targetOrigin = /^https?:\/\/[^/]+$/.test(rawOrigin) ? rawOrigin : "*";

  const msg = {
    type: "zk-coinbase-proof", // 기존 타입 유지
    proof: proofPayload.proof,
    publicInputs: proofPayload.publicInputs,
    meta: proofPayload.meta,
  };

  console.log("[PORTAL] postMessage -> opener", {
    openerExists: !!window.opener,
    targetOrigin,
    type: msg.type,
    meta: msg.meta,
  });

  let sent = false;

  // 1) opener가 있으면 postMessage
  try {
    if (window.opener) {
      window.opener.postMessage(msg, targetOrigin);
      console.log("[PORTAL] ✅ postMessage sent");
      sent = true;
    }
  } catch (e) {
    console.warn("[PORTAL] postMessage error", e);
  }

  // 2) opener 없으면 BroadcastChannel로 백업 전송
  if (!sent) {
    try {
      const ch = new BroadcastChannel(`zkp-${nonce}`);
      ch.postMessage(msg);
      console.log("[PORTAL] ✅ BroadcastChannel sent");
      setTimeout(() => ch.close(), 500);
    } catch (e) {
      console.error("[PORTAL] BroadcastChannel error", e);
    }
  }

  // 디버깅 중이면 자동닫기 OFF(이미 넣어뒀으면 그대로 유지)
  // setTimeout(() => window.close(), 500);
}



  const modePill = fromSdk ? "SDK Session" : "Read-only (Web)";
  const modePillClass = fromSdk ? "pill pill--ok" : "pill";
  const circuitPill = circuit ? circuit.id : "No circuit";

  return (
    <div className="portal-wrap">
      <div className="portal-topbar">
        <div className="brand">
          <Image src="/logo.png" alt="" width={28} height={28} style={{ borderRadius:8 }} />
          <div className="title">zkProofport — Privacy-Preserving Identity Proofs</div>
        </div>
        <div className="portal-status">
          <span className={modePillClass}>{modePill}</span>
          <span className="pill pill--warn">{circuitPill}</span>
          {!fromSdk && <span className="pill">Features disabled</span>}
        </div>
      </div>

      <div className="portal-grid">
        <section className="panel" aria-label="Run panel">
          <div className="eyebrow" style={{ marginBottom: 10 }}>{circuit ? circuit.eyebrow || "Proof Portal" : "Proof Portal"}</div>
          <h2>{circuit ? circuit.title : "Universal Identity Proof Portal"}</h2>
          <p className="sub">
            Prove identity and eligibility without exposing your wallet or personal data. Proofs are generated locally and
            only cryptographic results leave the browser.
          </p>

          <ul className="step-list">
            {(circuit?.steps || []).map((s, i) => {
              const done = completed.includes(i);
              return (
                <li key={i} className={`step${done ? " done" : ""}`}>
                  {done ? <CheckCircle className="icon" /> : <span className="dot" />}
                  <span>{done ? s.done : s.action}</span>
                </li>
              );
            })}
          </ul>

          <div className="portal-actions">
            <button
              onClick={handleProve}
              className="btn btn-primary btn-lg"
              disabled={!fromSdk}
              title={fromSdk ? "Generate proof" : "Open via SDK to enable"}
            >
              {fromSdk ? (isConnected ? "Generate ZK Proof" : "Connect Wallet") : "Proof Generation Disabled"}
            </button>

            {!fromSdk && (
              <Link className="btn btn-ghost btn-lg" href="/" title="Back to Landing">Back</Link>
            )}
          </div>
        </section>

        {fromSdk ? (
          <section className="terminal" aria-label="Terminal">
            <div className="bar">
              <Cpu className="icon" /> <span>UltraHonk Engine</span>
              <span style={{ marginLeft: "auto", display:"flex", alignItems:"center", gap:6 }}>
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

            {logs.some((l) => l.interactive) && proofPayload && (
              <button onClick={sendProofToSdk} className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 14 }}>
                Send Proof to dApp
              </button>
            )}
          </section>
        ) : (
          <section className="panel" aria-label="How to use">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Web Mode</div>
            <h2>Open via SDK to run identity proofs</h2>
            <div className="info" style={{ marginTop: 12 }}>
              <p style={{ marginTop: 0 }}>
                This page is read-only when accessed directly. Use the SDK to launch a secure session that
                activates the requested circuit and returns proof results to the parent dApp.
              </p>
              <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                <li>Proofs are generated in browser memory only.</li>
                <li>Your wallet address and personal data never leave the client.</li>
              </ul>
            </div>
          </section>
        )}
      </div>

      <footer className="footer" role="contentinfo" aria-label="site footer">
        <span>© {new Date().getFullYear()} zkProofport</span>
        <span>•</span>
        <span><strong>Coming soon</strong> — private beta</span>
        <span>•</span>
        <span>X: <a href="https://x.com/zkproofport">@zkproofport</a></span>
    </footer>
    </div>
  );
}

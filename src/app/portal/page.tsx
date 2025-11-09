"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Sparkles, CheckCircle, Cpu, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { resolveCircuit } from "../../lib/circuits/registry";
import type { 
  CircuitModule, 
  Step, 
  PortalContext, 
  Logger, 
  LogType 
} from "../../lib/circuits/types";

const GENERIC_STAGES = [
  'VALIDATING INPUT', 
  'LOADING ARTIFACTS', 
  'EXECUTING CIRCUIT', 
  'GENERATING PROOF',
  'FINALIZING',
];

const GENERIC_ACTIONS = [
  'VERIFYING', 'DERIVING', 'HASHING', 'CHECKING', 'ASSERTING',
  'PARSING', 'EXTRACTING', 'CALCULATING', 'DECODING',
  'BUILDING', 'COMPILING', 'READING',
];

const generateRandomHex = (length: number) => {
  let hex = '0x';
  const chars = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    hex += chars[Math.floor(Math.random() * chars.length)];
  }
  return hex;
};

const ZkCircuitAnimator = () => {
  const [line, setLine] = useState('');
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => {
        const lastIndex = GENERIC_STAGES.length - 1;
        if (prev === lastIndex) {
          return lastIndex; 
        }
        return prev + 1;
      });
    }, 2000); 

    return () => clearInterval(stageInterval);
  }, []);

  useEffect(() => {
    const lineInterval = setInterval(() => {
      const stage = GENERIC_STAGES[stageIndex];
      const action = GENERIC_ACTIONS[Math.floor(Math.random() * GENERIC_ACTIONS.length)];
      const hex = generateRandomHex(8);

      setLine(`>> [${stage}] ${action}... ${hex}`);
    }, 300);

    return () => clearInterval(lineInterval);
  }, [stageIndex]);

  return (
    <div className="log-circuit-effect">
      {line}
    </div>
  );
};

export default function PortalPage() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [logs, setLogs] = useState<{ text: string; type: LogType; interactive?: boolean }[]>([]);
  const [proofResult, setProofResult] = useState<null | { proof: any; publicInputs: string[]; meta: any }>(null);
  
  const [fromSdk, setFromSdk] = useState(false);
  const [isProving, setIsProving] = useState(false);

  const [circuitModule, setCircuitModule] = useState<CircuitModule | null>(null);
  const [steps, setSteps] = useState<Step[]>([]); 

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: walletClient } = useWalletClient();

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const origin = params.get("origin");
  const nonce = params.get("nonce");
  const circuitId = params.get("circuitId"); 

  useEffect(() => {
    if (origin && nonce && circuitId) {
      setFromSdk(true);
      const module = resolveCircuit(circuitId);
      if (module) {
        setCircuitModule(module);
        setSteps(module.steps); 
      } else {
        appendLog(`Error: Unknown circuitId "${circuitId}"`, "error");
      }
    } else {
      setFromSdk(false);
    }
  }, [origin, nonce, circuitId]); 

  useEffect(() => {
    if (isConnected) setCompletedSteps([0]); 
  }, [isConnected]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const appendLog = (text: string, type: LogType = "info", interactive = false) =>
    setLogs((prev) => [...prev, { text, type, interactive }]);

  const updateLastLog = (text: string, type: LogType = "info") =>
    setLogs((prev) => {
      const next = [...prev];
      if (next.length === 0) return prev; 
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
      if (!circuitModule || !origin || !nonce) {
        appendLog("Portal is read-only or session is invalid.", "error");
        return; 
      }

      setLoading(true);
      setCurrentStep(null);
      setLogs([]);
      setCompletedSteps([]);
      setProofResult(null);
      setIsProving(false); 

      const log: Logger = {
        append: (msg, type, interactive) => {
          if (msg.startsWith("Generating ZK proof")) setIsProving(true);
          appendLog(msg, type, interactive);
        },
        updateLast: (msg, type) => {
          if (msg.includes("ZK proof generated")) setIsProving(false);
          updateLastLog(msg, type);
        },
        markStep: markStepComplete,
      };

      const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL as string;
      if (!rpcUrl) {
        throw new Error("NEXT_PUBLIC_BASE_RPC_URL is not defined in .env.local");
      }
      
      const context: PortalContext = {
        address,
        walletClient,
        rpcUrl,
        origin,
        nonce,
      };

      const { proof, publicInputs } = await circuitModule.prove(context, log);

      const meta = {
        origin,
        timestamp: Math.floor(Date.now() / 1000),
        nonce,
        circuitId, 
      };

      setProofResult({
        proof, 
        publicInputs,
        meta
      });

      setCurrentStep(null);
    } catch (err: any) {
      appendLog(`${err?.message || "Unknown error"}`, "error");
      setIsProving(false); 
    } finally {
      setLoading(false);
      setIsProving(false);
    }
  };

  const sendProofToDappAndClose = () => {
    if (!proofResult) {
      console.error("[PORTAL] Proof result is missing. Cannot send.");
      return;
    }

    const msg = {
      type: "zkp-proof", 
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
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              {circuitModule?.eyebrow || "Proof Portal"}
            </div>
            <h2 className="text-xl">
              {circuitModule?.title || "Loading circuit..."}
            </h2>
            <p className="sub text-xs">
              {circuitModule?.description || "Loading description..."}
            </p>
            <ul className="step-list text-xs">
              {steps.map((s, i) => {
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
                disabled={!fromSdk || loading || !circuitModule}
                title={fromSdk && circuitModule ? "Generate proof" : "Open via SDK to enable"}
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
            {isProving && <ZkCircuitAnimator />}
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
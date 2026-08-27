"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const steps = [
  {
    title: "Trusted data",
    lines: ["Trusted", "data"],
    summary: "Private data enters the flow under an explicit trust model.",
    human: "A person selects a trusted credential or private condition in the web or mobile experience.",
    agent: "An agent sends an end-to-end encrypted request; sensitive inputs are handled inside the configured TEE boundary.",
  },
  {
    title: "CIP specification",
    lines: ["CIP", "specification"],
    summary: "A CIP defines the precise private inputs and public predicate.",
    human: "The app requests a defined condition such as KYC passed, country allowed, or organization matched.",
    agent: "MCP or A2A carries the same machine-readable proof request without expanding what the agent learns.",
  },
  {
    title: "Noir circuit",
    lines: ["Noir", "circuit"],
    summary: "The circuit checks the condition without publishing the witness.",
    human: "The selected circuit runs through the browser or mobile proving stack for supported flows.",
    agent: "The same open circuit logic runs through the managed prover inside the enclave trust boundary.",
  },
  {
    title: "ZK proof",
    lines: ["ZK", "proof"],
    summary: "A proof replaces the private source data with a minimal claim.",
    human: "Supported human flows generate the proof locally or on-device, keeping private witness data with the user.",
    agent: "Agent proving uses a distinct AWS Nitro Enclave trust model and returns an encrypted, verifiable result.",
  },
  {
    title: "EVM verifier",
    lines: ["EVM", "verifier"],
    summary: "The verifier checks the predicate, not the underlying private data.",
    human: "An application or protocol verifies the result on an EVM-compatible chain.",
    agent: "An agent can independently verify the same result before continuing a workflow or payment.",
  },
  {
    title: "Composable action",
    lines: ["Composable", "action"],
    summary: "A verified predicate becomes a condition another system can use.",
    human: "The person unlocks access or continues an application flow without resubmitting the raw credential.",
    agent: "The agent can trigger an authorized action through MCP, A2A, or x402 while receiving only the required predicate.",
  },
] as const;

type Route = "both" | "human" | "agent";

const positions = [220, 396, 572, 748, 924, 1100];

export default function ArchitectureFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [route, setRoute] = useState<Route>("both");
  const [isVisible, setIsVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const chooseStep = (index: number) => setActiveStep(index);
  const handleStepKey = (event: KeyboardEvent<SVGGElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chooseStep(index);
    }
  };

  const active = steps[activeStep];
  const humanMuted = route === "agent";
  const agentMuted = route === "human";

  return (
    <div ref={rootRef} className={`architecture-map ${isVisible ? "is-visible" : ""}`}>
      <div className="architecture-toolbar">
        <p>Follow both proving paths, then inspect any stage.</p>
        <div className="architecture-route-switch" role="group" aria-label="Filter proving paths">
          {(["both", "human", "agent"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={route === item}
              onClick={() => setRoute(item)}
            >
              {item === "both" ? "Both paths" : item === "human" ? "Human" : "AI agent"}
            </button>
          ))}
        </div>
      </div>

      <div className="architecture-canvas">
        <svg
          className="architecture-svg"
          viewBox="0 0 1180 410"
          role="img"
          aria-labelledby="architecture-map-title architecture-map-description"
        >
          <title id="architecture-map-title">Human and AI agent paths through ZKProofport</title>
          <desc id="architecture-map-description">
            Two proving paths move through trusted data, a CIP specification, a Noir circuit, a zero-knowledge proof, an EVM verifier, and a composable action.
          </desc>

          <defs>
            <filter id="architecture-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <g className="architecture-phase-labels" aria-hidden="true">
            <text x="220" y="28">PRIVATE DATA</text>
            <path d="M 318 23 H 720" />
            <text x="750" y="28">VERIFIED PREDICATE</text>
            <path d="M 900 23 H 1020" />
            <text x="1045" y="28">COMPOSABLE ACTION</text>
          </g>

          <g className={`architecture-lane architecture-lane--human ${humanMuted ? "is-muted" : ""}`}>
            <text className="architecture-lane-title" x="26" y="154">HUMAN</text>
            <text className="architecture-lane-meta" x="26" y="176">WEB / MOBILE</text>
            <path className="architecture-route-line" pathLength="1" d="M 145 165 H 1132" />
          </g>
          <g className={`architecture-lane architecture-lane--agent ${agentMuted ? "is-muted" : ""}`}>
            <text className="architecture-lane-title" x="26" y="278">AI AGENT</text>
            <text className="architecture-lane-meta" x="26" y="300">MCP / A2A · TEE</text>
            <path className="architecture-route-line" pathLength="1" d="M 145 289 H 1132" />
          </g>

          {steps.map((step, index) => {
            const x = positions[index];
            const isActive = index === activeStep;
            return (
              <g
                key={step.title}
                className={`architecture-step ${isActive ? "is-active" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`Step ${index + 1}: ${step.title}`}
                aria-pressed={isActive}
                onMouseEnter={() => chooseStep(index)}
                onFocus={() => chooseStep(index)}
                onClick={() => chooseStep(index)}
                onKeyDown={(event) => handleStepKey(event, index)}
              >
                <rect className="architecture-step-card" x={x - 70} y="66" width="140" height="274" />
                <text className="architecture-step-number" x={x - 50} y="95">0{index + 1}</text>
                <text className="architecture-step-title" x={x} y="119" textAnchor="middle">
                  {step.lines.map((line, lineIndex) => (
                    <tspan key={line} x={x} dy={lineIndex === 0 ? 0 : 19}>{line}</tspan>
                  ))}
                </text>
                <g className={`architecture-node architecture-node--human ${humanMuted ? "is-muted" : ""}`}>
                  <circle className="architecture-node-ring" cx={x} cy="165" r="15" />
                  <circle className="architecture-node-core" cx={x} cy="165" r="5" />
                </g>
                <g className={`architecture-node architecture-node--agent ${agentMuted ? "is-muted" : ""}`}>
                  <circle className="architecture-node-ring" cx={x} cy="289" r="15" />
                  <circle className="architecture-node-core" cx={x} cy="289" r="5" />
                </g>
                <text className="architecture-step-hint" x={x} y="325" textAnchor="middle">
                  {isActive ? "INSPECTING" : "HOVER / FOCUS"}
                </text>
              </g>
            );
          })}
        </svg>

        <ol className="architecture-mobile-steps" aria-label="ZKProofport architecture stages">
          {steps.map((step, index) => (
            <li key={step.title}>
              <button
                type="button"
                aria-pressed={index === activeStep}
                onClick={() => chooseStep(index)}
              >
                <span>0{index + 1}</span>
                <strong>{step.title}</strong>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="architecture-detail" aria-live="polite">
        <div className="architecture-detail-intro">
          <span>STEP 0{activeStep + 1}</span>
          <h3>{active.title}</h3>
          <p>{active.summary}</p>
        </div>
        <div className={`architecture-detail-route architecture-detail-route--human ${humanMuted ? "is-muted" : ""}`}>
          <span>Human path · local</span>
          <p>{active.human}</p>
        </div>
        <div className={`architecture-detail-route architecture-detail-route--agent ${agentMuted ? "is-muted" : ""}`}>
          <span>AI agent path · TEE</span>
          <p>{active.agent}</p>
        </div>
      </div>

      <div className="architecture-outcome" aria-label="Architecture outcome">
        <span>private data</span><i aria-hidden="true">→</i><span>verified predicate</span><i aria-hidden="true">→</i><strong>composable action</strong>
      </div>
    </div>
  );
}

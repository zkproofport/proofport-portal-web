import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import styles from "../product.module.css";
import { socialImage } from "../social-image";

export const metadata: Metadata = {
  title: "Build with ZKProofport | Developer Guide",
  description: "Integration entry points, proving environments, trust assumptions, circuits and open specifications for ZKProofport.",
  alternates: { canonical: "https://zkproofport.com/developers" },
  openGraph: { title: "Build with ZKProofport", description: "Developer integration guide and trust models for private eligibility.", url: "https://zkproofport.com/developers", images: [socialImage] },
  twitter: { card: "summary_large_image", title: "Build with ZKProofport", description: "Developer integration guide and trust models for private eligibility.", images: [socialImage] },
};

function Resource({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export default function Developers() {
  return (
    <div className={styles.site}>
      <a href="#main" className={styles.skipLink}>Skip to content</a><Header />
      <main id="main" className={`${styles.container} ${styles.docsMain}`}>
        <div className={styles.docsHeading}><p className={styles.eyebrow}>Developer guide</p><h1>Build with ZKProofport.</h1><p>Choose a proving environment, inspect its trust assumptions, and integrate the proof into your application.</p></div>
        <nav className={styles.docsNav} aria-label="Developer guide sections"><a href="#integrate">Integration paths</a><a href="#trust-models">Trust models</a><a href="#circuits">Circuits &amp; standards</a><a href="#deployments">Deployment records</a></nav>

        <section id="integrate" className={styles.docsSection} aria-labelledby="integrate-heading">
          <h2 id="integrate-heading">Choose your integration path.</h2>
          <div className={styles.docsRow}><h3>Mobile / on-device</h3><div><p>The TypeScript app SDK creates proof requests, opens the mobile app through a QR code or deep link, and receives a proof and public outputs. Supported mobile flows generate proofs on the user’s device. Current SDK support includes Coinbase KYC, country policy, and Google Workspace / Microsoft 365 OIDC domain proofs.</p><div className={styles.resourceLinks}><Resource href="https://github.com/zkproofport/proofport-app-sdk#readme">App SDK guide</Resource><Resource href="https://github.com/zkproofport/proofport-app">Mobile source</Resource><Resource href="https://www.npmjs.com/package/@zkproofport-app/sdk">npm package</Resource></div></div></div>
          <div className={styles.docsRow}><h3>Agents / hosted proving</h3><div><p>Use the agent SDK or local MCP package for programmatic proof requests. The agent infrastructure includes an AWS Nitro Enclave implementation. Endpoint configuration and attestation determine whether a request uses that protected environment or a standard server.</p><div className={styles.resourceLinks}><Resource href="https://github.com/zkproofport/proofport-ai#readme">Agent integration guide</Resource><Resource href="https://www.npmjs.com/package/@zkproofport-ai/sdk">Agent SDK</Resource><Resource href="https://www.npmjs.com/package/@zkproofport-ai/mcp">MCP package</Resource></div></div></div>
          <div className={styles.docsRow}><h3>Browser proof runner</h3><div><p>The web SDK opens the portal for supported browser-based proving and verification flows. The portal is intended to be launched by an application with its request context.</p><div className={styles.resourceLinks}><Resource href="https://github.com/zkproofport/proofport-sdk#readme">Web SDK guide</Resource><Resource href="https://github.com/zkproofport/proofport-portal-web#readme">Portal integration</Resource><Resource href="https://www.npmjs.com/package/@zkproofport/sdk">Web SDK package</Resource></div></div></div>
        </section>

        <section id="trust-models" className={styles.docsSection} aria-labelledby="trust-heading">
          <h2 id="trust-heading">Understand what each path protects.</h2>
          <p>Different proving environments have different trust assumptions. A valid zero-knowledge proof does not establish where the proof was generated.</p>
          <details open><summary>On-device proving</summary><p>Supported mobile flows compute proofs on the user’s device. The verifier receives the proof and its public outputs. Credential retrieval, relay metadata, and public inputs have their own disclosure boundaries; inspect the selected circuit and integration before choosing a policy.</p></details>
          <details open><summary>TEE and standard-server endpoints</summary><p>In the supported Nitro deployment, clients validate hardware attestation and encrypt inputs to the enclave key. Standard-server endpoints can receive readable proof inputs over HTTPS. Verify the endpoint’s mode and returned evidence; neither proof validity nor the presence of a TEE-capable SDK implies enclave execution.</p></details>
          <details open><summary>Public outputs and policy design</summary><p>Applications must verify both the proof and that its public outputs match the requested policy and scope. A result can reveal information by inference: for example, a country policy containing one country may reveal that country. These proofs do not guarantee complete unlinkability or eliminate privacy and compliance obligations.</p></details>
          <div className={styles.resourceLinks}><Resource href="https://github.com/zkproofport/CIPs/blob/main/docs/design-principles.md">Design principles</Resource><Resource href="https://github.com/zkproofport/proofport-ai#tee-integration-aws-nitro-enclave">Agent trust model</Resource></div>
        </section>

        <section id="circuits" className={styles.docsSection} aria-labelledby="circuits-heading">
          <h2 id="circuits-heading">Circuits and open specifications.</h2>
          <p>CIPs define proof semantics, public inputs, assumptions, and limitations. The circuit repository contains Noir implementations and Solidity verifiers. Consult each specification and SDK for its current support status.</p>
          <p>The GIWA Sepolia privacy prototype uses a test attester. Production Dojang issuer and schema parameters remain unresolved. Balance conditions and combined eligibility policies shown on the homepage are future directions.</p>
          <div className={styles.resourceLinks}><Resource href="https://github.com/zkproofport/CIPs">Explore CIPs</Resource><Resource href="https://github.com/zkproofport/circuits">Circuit source</Resource><Resource href="https://github.com/zkproofport/CIPs/blob/main/CIPS/cip-4.md">GIWA prototype specification</Resource></div>
        </section>

        <section id="deployments" className={styles.docsSection} aria-labelledby="deployments-heading">
          <h2 id="deployments-heading">Inspect the implementation.</h2>
          <p>Review deployment records and circuit source for the network and verifier you plan to use. Open-source availability and deployed contracts are not evidence of an independent security audit.</p>
          <div className={styles.resourceLinks}><Resource href="https://github.com/zkproofport/circuits/tree/main/deployments">Verifier deployment records</Resource><Resource href="https://github.com/zkproofport/circuits#readme">Supported networks</Resource><Resource href="https://github.com/zkproofport">All repositories</Resource></div>
        </section>
      </main>
      <footer className={`${styles.footer} ${styles.docsFooter}`}><div className={`${styles.container} ${styles.footerBottom}`}><Link href="/">ZKProofport home</Link><Resource href="https://masselabs.com">Built by Masse Labs</Resource></div></footer>
    </div>
  );
}

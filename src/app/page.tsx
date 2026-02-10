import Image from "next/image";
import Header from "./components/Header";
import Link from "next/link";

export default function Landing() {
  return (
    <>
      <Header />
      <div className="app-wrap">
        <main className="card" role="main" aria-label="ZKProofport landing">
          <div className="logo-box" aria-hidden="true">
            <Image src="/logo.png" alt="ZKProofport logo" width={140} height={140} className="logo" />
          </div>
          <section>
            <div className="eyebrow">ZKProofport</div>
            <h1>Privacy-preserving identity proofs, for any app.</h1>
            <p className="tagline">
              ZKProofport is a general-purpose proof portal and SDK that lets apps verify a user's identity and
              eligibility without ever learning the user's wallet address or personal data. It provides a single,
              unified flow for privacy-preserving identity proofs—designed to plug into any category you need.
              <br /><br />
              Start with identity. Extend to eligibility. Keep users private by default.
            </p>

            <div className="badges">
              <span className="badge"><span className="dot" />Private Identity</span>
              <span className="badge"><span className="dot" />Zero-Knowledge SDK</span>
              <span className="badge"><span className="dot" />Unified Portal</span>
              <span className="badge"><span className="dot" />Onchain Ready</span>
            </div>

            {/* Three Portal Types */}
            <div className="portal-section">
              <div className="portal-hero">
                <div className="portal-stat">
                  <span className="portal-stat-num">3</span>
                  <span className="portal-stat-label">Portals</span>
                </div>
                <span className="portal-hero-divider">×</span>
                <a className="portal-stat portal-stat--link" href="https://www.npmjs.com/package/@zkproofport/sdk" target="_blank" rel="noopener noreferrer">
                  <span className="portal-stat-num">1</span>
                  <span className="portal-stat-label">SDK&nbsp;↗</span>
                </a>
                <span className="portal-hero-divider">=</span>
                <div className="portal-stat portal-stat--accent">
                  <span className="portal-stat-num">∞</span>
                  <span className="portal-stat-label">DApps</span>
                </div>
              </div>
              <p className="portal-section-sub">
                One SDK powers all three portals. Integrate once, your DApp gets web, mobile, and agent-based proof generation out of the box.
              </p>
              <div className="portal-types">
                <div className="portal-type-card">
                  <div className="pt-label">Web Portal</div>
                  <div className="pt-desc">Browser-based proof generation & verification</div>
                  <div className="pt-actions">
                    <a className="btn btn-primary btn-sm" href="https://proofport-demo.netlify.app/" target="_blank" rel="noopener noreferrer">Live Demo</a>
                  </div>
                </div>
                <div className="portal-type-card">
                  <div className="pt-label">Mobile App</div>
                  <div className="pt-desc">Native iOS app with biometric authentication</div>
                  <a className="btn btn-primary btn-sm" href="https://stg-demo.zkproofport.app/" target="_blank" rel="noopener noreferrer">Live Demo</a>
                </div>
                <div className="portal-type-card">
                  <div className="pt-label">Prover Agent</div>
                  <div className="pt-desc">Autonomous ZK proof generation via AI agent</div>
                  <a className="btn btn-primary btn-sm" href="https://proveragent.eth.limo" target="_blank" rel="noopener noreferrer">Visit</a>
                </div>
              </div>
            </div>

          </section>
          <span className="shine" />
        </main>

        <footer className="footer" role="contentinfo" aria-label="site footer">
          <span>© {new Date().getFullYear()} ZKProofport</span>
          <span>•</span>
          <span>Coming soon — private beta</span>
          <span>•</span>
          <span>X: <a href="https://x.com/zkproofport">@zkproofport</a></span>
        </footer>
      </div>
    </>
  );
}

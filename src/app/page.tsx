import Image from "next/image";
import Header from "./components/Header";
import Link from "next/link";

export default function Landing() {
  return (
    <>
      <Header />
      <div className="app-wrap">
        <main className="card" role="main" aria-label="zkProofport landing">
          <div className="logo-box" aria-hidden="true">
            <Image src="/logo.png" alt="zkProofport logo" width={140} height={140} className="logo" />
          </div>
          <section>
            <div className="eyebrow">zkProofport</div>
            <h1>Privacy-preserving identity proofs, for any app.</h1>
            <p className="tagline">
              zkProofport is a general-purpose proof portal and SDK that lets apps verify a user’s identity and
              eligibility without ever learning the user’s wallet address or personal data. It provides a single,
              unified flow for privacy-preserving identity proofs—designed to plug into any category you need.
              <br /><br />
              Start with identity. Extend to eligibility. Keep users private by default.
            </p>

            <div className="badges">
              <span className="badge"><span className="dot" />Private Identity</span>
              <span className="badge"><span className="dot" />Zero-Knowledge SDK</span>
              <span className="badge"><span className="dot" />Unified Portal</span>
              <span className="badge"><span className="dot" />On-chain Ready</span>
            </div>

            <div className="cta-row">
              <Link className="btn btn-primary" href="/portal">Open Proof Portal</Link>
              <Link 
                className="btn btn-primary" 
                href="https://proofport-demo.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Live Demo
              </Link>
            </div>
          </section>
          <span className="shine" />
        </main>

        <footer className="footer" role="contentinfo" aria-label="site footer">
          <span>© {new Date().getFullYear()} zkProofport</span>
          <span>•</span>
          <span><strong>Coming soon</strong> — private beta</span>
          <span>•</span>
          <span>X: <a href="https://x.com/zkproofport">@zkproofport</a></span>
        </footer>
      </div>
    </>
  );
}

import Image from "next/image";
import Header from "./components/Header";

export default function Landing() {
  return (
    <>
      <Header />
      <div className="noise" aria-hidden="true" />
      <div className="dot-matrix" aria-hidden="true" />

      <div className="relative z-1 min-h-screen w-full">

        {/* ── HERO — full viewport, centered ── */}
        <section
          className="animate-fade-slide min-h-screen flex flex-col justify-center items-center relative px-6 sm:px-8 lg:px-10 text-center"
          role="main"
          aria-labelledby="hero-heading"
        >
          <div className="font-mono text-[1.2rem] sm:text-[1.4rem] font-semibold tracking-[0.15em] uppercase text-gold mb-8 sm:mb-10">
            <span className="text-muted font-light" aria-hidden="true">// </span>
            ZKProofport
          </div>

          <h1
            id="hero-heading"
            className="font-serif font-normal text-[clamp(4rem,9vw,8.5rem)] leading-[1.02] tracking-tight text-cream mb-8"
          >
            Privacy-first<br />
            trust infrastructure<br />
            <em className="italic text-gold-2">for Web3.</em>
          </h1>

          <p className="text-[clamp(1.7rem,2.5vw,2.2rem)] leading-[1.65] text-muted max-w-[58ch] mx-auto mb-10">
            To prove trust, you must sacrifice privacy.{" "}
            <span className="text-cream font-medium">ZKProofport breaks this paradox</span>{" "}
            with zero-knowledge proofs.
          </p>

          <p className="font-serif italic text-[clamp(2.4rem,4vw,3.6rem)] text-gold-2/80 tracking-wide mb-0">
            privacy is normal.
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 font-mono text-[1.1rem] text-muted tracking-[0.15em] animate-pulse">
            ↓ SCROLL
          </div>
        </section>

        {/* ── SEPARATOR ── */}
        <div className="h-px max-w-[700px] mx-auto bg-gradient-to-r from-transparent via-gold-line to-transparent" />

        {/* ── WHAT WE BUILD ── */}
        <section className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32 text-center">
          <div className="font-mono text-[1.2rem] sm:text-[1.4rem] font-semibold tracking-[0.15em] uppercase text-gold mb-4">
            What We Build
          </div>
          <h2 className="font-serif text-[clamp(3.2rem,5vw,5rem)] font-normal text-cream mb-6 leading-[1.1]">
            Zero-knowledge proofs for everyone.
          </h2>
          <p className="font-mono text-[1.4rem] sm:text-[1.5rem] text-muted max-w-[60ch] mx-auto mb-14 leading-[1.7]">
            A general-purpose ZK proof portal &amp; SDK — apps, DApps, and AI agents generate privacy-preserving proofs client-side. 0 bytes exposed.
          </p>

          {/* Tags */}
          <ul className="flex flex-wrap justify-center gap-3 sm:gap-3.5 list-none p-0 m-0" aria-label="Circuit use cases">
            {["KYC", "Country", "Credit Score", "Age Gating", "RWA", "AI Economy"].map((tag) => (
              <li key={tag} className="font-mono text-[1.05rem] sm:text-[1.2rem] font-semibold tracking-[0.08em] uppercase text-cream/80 px-4 sm:px-5 py-2.5 sm:py-3 border-[1.5px] border-gold-line bg-gold/[0.03] hover:bg-gold/[0.08] hover:border-gold/30 transition-all duration-300">
                {tag}
              </li>
            ))}
          </ul>
        </section>

        {/* ── SEPARATOR ── */}
        <div className="h-px max-w-[700px] mx-auto bg-gradient-to-r from-transparent via-gold-line to-transparent" />

        {/* ── PROOF PORTALS ── */}
        <section className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32" aria-label="Proof Portals">
          <div className="font-mono text-[1.2rem] sm:text-[1.4rem] font-semibold tracking-[0.15em] uppercase text-gold mb-4">
            Proof Portals
          </div>
          <h2 className="font-serif text-[clamp(3.2rem,5vw,5rem)] font-normal text-cream mb-5 leading-[1.1]">
            Three portals. One infrastructure.
          </h2>
          <p className="font-mono text-[1.4rem] sm:text-[1.5rem] text-muted max-w-[60ch] mb-14 sm:mb-16 leading-[1.7]">
            Web, mobile, and autonomous agent — pick your interface, same privacy guarantees.
          </p>

          <nav className="flex flex-col gap-[1.5px] bg-gold-line overflow-hidden" aria-label="Portal types">
            {/* Web Portal */}
            <article
              className="relative bg-[#0e1219] p-7 sm:p-9 flex flex-col gap-4 transition-all duration-300 hover:bg-[#131a24] overflow-hidden"
              itemScope itemType="https://schema.org/SoftwareApplication"
            >
              <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 -rotate-12 w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] rounded-full border-[3px] border-gold/25 flex items-center justify-center pointer-events-none">
                <div className="w-[6.4rem] h-[6.4rem] sm:w-[8rem] sm:h-[8rem] rounded-full border-[1.5px] border-gold/20 flex items-center justify-center">
                  <span className="font-mono text-[1.4rem] sm:text-[1.7rem] font-black tracking-[0.15em] text-gold/20 uppercase">WEB</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <h3 className="font-serif text-[2.4rem] sm:text-[2.8rem] text-cream m-0 tracking-tight" itemProp="name">Web Portal</h3>
              </div>
              <p className="font-mono text-[1.5rem] sm:text-[1.6rem] text-muted leading-[1.7] m-0 max-w-[50ch]" itemProp="description">
                Browser-based proof generation &amp; on-chain verification. Zero backend, zero data exposure.
              </p>
              <div className="flex items-center gap-6 mt-3">
                <div className="flex gap-4 flex-wrap">
                <a
                  className="font-mono text-[1.2rem] sm:text-[1.3rem] font-bold tracking-wider text-gold no-underline border-b-[1.5px] border-gold pb-0.5 transition-all duration-200 hover:text-gold-2 hover:border-gold-2 hover:pb-1"
                  href="https://proofport-demo.netlify.app/" target="_blank" rel="noopener noreferrer" itemProp="url"
                >
                  [ Live Demo ]
                </a>
                <a
                  className="font-mono text-[1.2rem] sm:text-[1.3rem] font-bold tracking-wider text-gold no-underline border-b-[1.5px] border-gold pb-0.5 transition-all duration-200 hover:text-gold-2 hover:border-gold-2 hover:pb-1"
                  href="https://www.npmjs.com/package/@zkproofport/sdk" target="_blank" rel="noopener noreferrer"
                >
                  [ SDK ]
                </a>
              </div>
              </div>
            </article>

            {/* Mobile App */}
            <article
              className="relative bg-[#0e1219] p-7 sm:p-9 flex flex-col gap-4 transition-all duration-300 hover:bg-[#131a24] overflow-hidden"
              itemScope itemType="https://schema.org/MobileApplication"
            >
              <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 rotate-6 w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] rounded-full border-[3px] border-[#60a5fa]/25 flex items-center justify-center pointer-events-none">
                <div className="w-[6.4rem] h-[6.4rem] sm:w-[8rem] sm:h-[8rem] rounded-full border-[1.5px] border-[#60a5fa]/20 flex items-center justify-center">
                  <span className="font-mono text-[1.2rem] sm:text-[1.5rem] font-black tracking-[0.12em] text-[#60a5fa]/20 uppercase">MOBILE</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <h3 className="font-serif text-[2.4rem] sm:text-[2.8rem] text-cream m-0 tracking-tight" itemProp="name">Mobile App</h3>
              </div>
              <p className="font-mono text-[1.5rem] sm:text-[1.6rem] text-muted leading-[1.7] m-0 max-w-[50ch]" itemProp="description">
                Native iOS &amp; Android with biometric auth &amp; client-side proving. Proof on the go, anywhere.
              </p>
              <div className="flex gap-4 flex-wrap self-start mt-3">
                <a
                  className="font-mono text-[1.2rem] sm:text-[1.3rem] font-bold tracking-wider text-gold no-underline border-b-[1.5px] border-gold pb-0.5 transition-all duration-200 hover:text-gold-2 hover:border-gold-2 hover:pb-1"
                  href="https://stg-demo.zkproofport.app/" target="_blank" rel="noopener noreferrer" itemProp="url"
                >
                  [ Live Demo ]
                </a>
                <a
                  className="font-mono text-[1.2rem] sm:text-[1.3rem] font-bold tracking-wider text-gold no-underline border-b-[1.5px] border-gold pb-0.5 transition-all duration-200 hover:text-gold-2 hover:border-gold-2 hover:pb-1"
                  href="https://www.npmjs.com/package/@zkproofport-app/sdk" target="_blank" rel="noopener noreferrer"
                >
                  [ SDK ]
                </a>
              </div>
            </article>

            {/* Prover Agent */}
            <article
              className="relative bg-[#0e1219] p-7 sm:p-9 flex flex-col gap-4 transition-all duration-300 hover:bg-[#131a24] overflow-hidden"
              itemScope itemType="https://schema.org/SoftwareApplication"
            >
              <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 -rotate-6 w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] rounded-full border-[3px] border-[#a78bfa]/25 flex items-center justify-center pointer-events-none">
                <div className="w-[6.4rem] h-[6.4rem] sm:w-[8rem] sm:h-[8rem] rounded-full border-[1.5px] border-[#a78bfa]/20 flex items-center justify-center">
                  <span className="font-mono text-[1.2rem] sm:text-[1.5rem] font-black tracking-[0.12em] text-[#a78bfa]/20 uppercase">AGENT</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <h3 className="font-serif text-[2.4rem] sm:text-[2.8rem] text-cream m-0 tracking-tight" itemProp="name">Prover Agent</h3>
              </div>
              <p className="font-mono text-[1.5rem] sm:text-[1.6rem] text-muted leading-[1.7] m-0 max-w-[50ch]" itemProp="description">
                Agent-to-agent proof delegation via ERC-8004, X402 micropayments &amp; TEE-secured proving.
              </p>
              <a
                className="font-mono text-[1.2rem] sm:text-[1.3rem] font-bold tracking-wider text-gold no-underline border-b-[1.5px] border-gold pb-0.5 self-start mt-3 transition-all duration-200 hover:text-gold-2 hover:border-gold-2 hover:pb-1"
                href="https://proveragent.eth.limo" target="_blank" rel="noopener noreferrer" itemProp="url"
              >
                [ Visit ]
              </a>
            </article>
          </nav>
        </section>

        {/* ── SEPARATOR ── */}
        <div className="h-px max-w-[700px] mx-auto bg-gradient-to-r from-transparent via-gold-line to-transparent" />

        {/* ── GRANTED BY ── */}
        <section className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32 text-center" aria-label="Grants and incubation">
          <div className="font-mono text-[1.2rem] sm:text-[1.4rem] font-semibold tracking-[0.15em] uppercase text-gold mb-4">
            Granted By
          </div>
          <h2 className="font-serif text-[clamp(3.2rem,5vw,5rem)] font-normal text-cream mb-14 sm:mb-16 leading-[1.1]">
            Backed by the ecosystem.
          </h2>
          <div className="inline-flex flex-wrap items-center justify-center gap-14 sm:gap-24">
            <div className="flex items-center gap-5">
              <Image src="/base-logo.png" alt="Base" width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl" />
              <div className="text-left">
                <div className="font-mono text-[1.5rem] sm:text-[1.7rem] font-bold text-cream tracking-wide leading-tight">Base Batches 002</div>
                <div className="font-mono text-[1.15rem] sm:text-[1.3rem] text-gold-2 tracking-wide mt-1.5">Currently Incubating</div>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <Image src="/aztec-logo.svg" alt="Aztec" width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl" />
              <div className="text-left">
                <div className="font-mono text-[1.5rem] sm:text-[1.7rem] font-bold text-cream tracking-wide leading-tight">Aztec Noir Grant</div>
                <div className="font-mono text-[1.15rem] sm:text-[1.3rem] text-muted tracking-wider uppercase mt-1.5">ZK DSL Pioneer</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEPARATOR ── */}
        <div className="h-px max-w-[700px] mx-auto bg-gradient-to-r from-transparent via-gold-line to-transparent" />

        {/* ── FOOTER ── */}
        <footer
          className="py-10 sm:py-12 px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 text-center font-mono text-[1.15rem] sm:text-[1.3rem] text-muted"
          role="contentinfo"
        >
          <span>© {new Date().getFullYear()} ZKProofport</span>
          <span className="hidden sm:inline text-gold/20" aria-hidden="true">·</span>
          <span>Coming soon — private beta</span>
          <span className="hidden sm:inline text-gold/20" aria-hidden="true">·</span>
          <span>X: <a href="https://x.com/zkproofport" rel="noopener noreferrer" className="text-gold-2 no-underline border-b border-gold-2/30 hover:border-gold-2 transition-colors">@zkproofport</a></span>
        </footer>
      </div>
    </>
  );
}

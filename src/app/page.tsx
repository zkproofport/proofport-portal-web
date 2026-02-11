import Image from "next/image";
import Header from "./components/Header";

export default function Landing() {
  return (
    <>
      <Header />
      <div className="noise" aria-hidden="true" />
      <div className="dot-matrix" aria-hidden="true" />

      <div className="relative z-1 min-h-screen w-full pt-24 sm:pt-28 pb-16">

        {/* ── 2-COLUMN: Hero (left) + Portals (right) — tops & bottoms aligned ── */}
        <div
          className="
            animate-fade-slide mx-auto px-4 sm:px-6 lg:px-10 max-w-[1400px]
            grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-stretch gap-10 lg:gap-12
            py-6 sm:py-10
          "
          role="main"
          aria-label="ZKProofport — Privacy-first trust infrastructure for Web3"
        >

          {/* LEFT COLUMN — stretch to match right */}
          <div className="flex flex-col justify-between">
            <section aria-labelledby="hero-heading">
              <div className="flex items-center gap-3 mb-5 font-mono text-[1.4rem] sm:text-[1.6rem] font-medium tracking-[0.12em] uppercase text-gold">
                <span className="text-muted font-light" aria-hidden="true">//</span>
                ZKProofport
              </div>

              <h1
                id="hero-heading"
                className="font-serif font-normal text-[clamp(3.2rem,7.5vw,6.5rem)] leading-[1.05] tracking-tight text-cream mb-6"
              >
                Privacy-first<br />
                trust infrastructure<br />
                <em className="italic text-gold-2">for Web3.</em>
              </h1>

              <p className="text-[clamp(1.6rem,2.5vw,2.2rem)] leading-[1.6] text-muted max-w-[56ch] mb-5">
                To prove trust, you must sacrifice privacy.{" "}
                <span className="text-cream font-medium">ZKProofport breaks this paradox</span>{" "}
                with zero-knowledge proofs.
              </p>

              <p className="font-mono text-[clamp(1.3rem,1.9vw,1.6rem)] tracking-wide text-gold border-l-[3px] border-gold pl-4 sm:pl-5 leading-relaxed max-w-[56ch]">
                A general-purpose ZK proof portal &amp; SDK — apps, DApps, and AI agents generate privacy-preserving proofs client-side. 0 bytes exposed.
              </p>
            </section>

            {/* Tags — pushed to bottom of left column */}
            <ul className="flex flex-wrap gap-2.5 sm:gap-3 mt-8 sm:mt-0 list-none p-0 m-0" aria-label="Circuit use cases">
              {["KYC", "Country", "Credit Score", "Age Gating", "RWA", "AI Economy"].map((tag) => (
                <li key={tag} className="font-mono text-[1.1rem] sm:text-[1.25rem] font-semibold tracking-[0.06em] uppercase text-cream px-3.5 sm:px-5 py-2.5 sm:py-3 border-[1.5px] border-gold-line bg-gold/[0.04] hover:bg-gold/[0.08] transition-colors">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT COLUMN — portals, tops & bottoms match left */}
          <div className="flex flex-col">
            <h2 className="font-mono text-[1.5rem] sm:text-[1.7rem] font-bold tracking-[0.12em] uppercase text-cream mb-5">
              Proof Portals
            </h2>

            <nav className="flex flex-col gap-4 sm:gap-5 flex-1" aria-label="Portal types">
              {/* Web Portal */}
              <article
                className="border-[1.5px] border-white/[0.08] border-l-[3px] border-l-emerald-500/60 bg-white/[0.02] p-5 sm:p-7 flex flex-col gap-3 flex-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:border-l-gold hover:shadow-[0_1rem_3rem_rgba(214,177,92,0.08)]"
                itemScope itemType="https://schema.org/SoftwareApplication"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-[2.1rem] sm:text-[2.4rem] text-cream m-0 tracking-tight" itemProp="name">Web Portal</h3>
                  <span className="font-mono text-[1rem] font-light text-gold tracking-[0.15em]" aria-hidden="true">01</span>
                </div>
                <p className="font-mono text-[1.25rem] sm:text-[1.35rem] text-muted leading-relaxed m-0" itemProp="description">
                  Browser-based proof generation &amp; on-chain verification. Zero backend, zero data exposure.
                </p>
                <div className="flex items-center gap-5 mt-auto">
                  <a
                    className="font-mono text-[1.2rem] sm:text-[1.3rem] font-bold tracking-wider text-gold no-underline border-b-[1.5px] border-gold pb-0.5 transition-all duration-200 hover:text-gold-2 hover:border-gold-2 hover:pb-1"
                    href="https://proofport-demo.netlify.app/" target="_blank" rel="noopener noreferrer" itemProp="url"
                  >
                    [ Live Demo ]
                  </a>
                  <a
                    className="font-mono text-[1.2rem] sm:text-[1.3rem] font-bold tracking-wider text-gold-2 no-underline border-b-[1.5px] border-gold-2/40 pb-0.5 transition-all duration-200 hover:text-gold hover:border-gold hover:pb-1"
                    href="https://www.npmjs.com/package/@zkproofport/sdk" target="_blank" rel="noopener noreferrer"
                  >
                    [ SDK ]
                  </a>
                </div>
              </article>

              {/* Mobile App */}
              <article
                className="border-[1.5px] border-white/[0.08] border-l-[3px] border-l-blue-500/60 bg-white/[0.02] p-5 sm:p-7 flex flex-col gap-3 flex-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:border-l-gold hover:shadow-[0_1rem_3rem_rgba(214,177,92,0.08)]"
                itemScope itemType="https://schema.org/MobileApplication"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-[2.1rem] sm:text-[2.4rem] text-cream m-0 tracking-tight" itemProp="name">Mobile App</h3>
                  <span className="font-mono text-[1rem] font-light text-gold tracking-[0.15em]" aria-hidden="true">02</span>
                </div>
                <p className="font-mono text-[1.25rem] sm:text-[1.35rem] text-muted leading-relaxed m-0" itemProp="description">
                  Native iOS &amp; Android with biometric auth &amp; client-side proving. Proof on the go, anywhere.
                </p>
                <a
                  className="font-mono text-[1.2rem] sm:text-[1.3rem] font-bold tracking-wider text-gold no-underline border-b-[1.5px] border-gold pb-0.5 self-start mt-auto transition-all duration-200 hover:text-gold-2 hover:border-gold-2 hover:pb-1"
                  href="https://stg-demo.zkproofport.app/" target="_blank" rel="noopener noreferrer" itemProp="url"
                >
                  [ Live Demo ]
                </a>
              </article>

              {/* Prover Agent */}
              <article
                className="border-[1.5px] border-white/[0.08] border-l-[3px] border-l-purple-500/60 bg-white/[0.02] p-5 sm:p-7 flex flex-col gap-3 flex-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:border-l-gold hover:shadow-[0_1rem_3rem_rgba(214,177,92,0.08)]"
                itemScope itemType="https://schema.org/SoftwareApplication"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-[2.1rem] sm:text-[2.4rem] text-cream m-0 tracking-tight" itemProp="name">Prover Agent</h3>
                  <span className="font-mono text-[1rem] font-light text-gold tracking-[0.15em]" aria-hidden="true">03</span>
                </div>
                <p className="font-mono text-[1.25rem] sm:text-[1.35rem] text-muted leading-relaxed m-0" itemProp="description">
                  Agent-to-agent proof delegation via ERC-8004, X402 micropayments &amp; TEE-secured proving.
                </p>
                <a
                  className="font-mono text-[1.2rem] sm:text-[1.3rem] font-bold tracking-wider text-gold no-underline border-b-[1.5px] border-gold pb-0.5 self-start mt-auto transition-all duration-200 hover:text-gold-2 hover:border-gold-2 hover:pb-1"
                  href="https://proveragent.eth.limo" target="_blank" rel="noopener noreferrer" itemProp="url"
                >
                  [ Visit ]
                </a>
              </article>
            </nav>
          </div>
        </div>

        {/* ── GRANTED BY — full-width centered, more spacing ── */}
        <section className="mx-auto px-4 sm:px-6 lg:px-10 max-w-[1400px] mt-16 sm:mt-20 mb-12 sm:mb-16 text-center border-t border-b border-gold-line py-10 sm:py-14" aria-label="Grants and incubation">
          <h2 className="font-mono text-[1.5rem] sm:text-[1.7rem] font-bold tracking-[0.12em] uppercase text-cream mb-8 sm:mb-10">
            Granted By
          </h2>
          <div className="inline-flex flex-wrap items-center justify-center gap-12 sm:gap-20">
            <div className="flex items-center gap-4 sm:gap-5">
              <Image src="/base-logo.png" alt="Base" width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl" />
              <div className="text-left">
                <div className="font-mono text-[1.5rem] sm:text-[1.7rem] font-bold text-cream tracking-wide leading-tight">Base Batches 002</div>
                <div className="font-mono text-[1.15rem] sm:text-[1.3rem] text-gold-2 tracking-wide mt-1">Currently Incubating</div>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-5">
              <Image src="/aztec-logo.svg" alt="Aztec" width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl" />
              <div className="text-left">
                <div className="font-mono text-[1.5rem] sm:text-[1.7rem] font-bold text-cream tracking-wide leading-tight">Aztec Noir Grant</div>
                <div className="font-mono text-[1.15rem] sm:text-[1.3rem] text-muted tracking-wider uppercase mt-1">ZK DSL Pioneer</div>
              </div>
            </div>
          </div>
        </section>

        {/* footer */}
        <footer
          className="py-4 px-5 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-center font-mono text-[1.15rem] sm:text-[1.3rem] text-muted"
          role="contentinfo"
        >
          <span>© {new Date().getFullYear()} ZKProofport</span>
          <span className="hidden sm:inline" aria-hidden="true">•</span>
          <span>Coming soon — private beta</span>
          <span className="hidden sm:inline" aria-hidden="true">•</span>
          <span>X: <a href="https://x.com/zkproofport" rel="noopener noreferrer" className="text-gold-2 no-underline border-b border-gold-2/30 hover:border-gold-2">@zkproofport</a></span>
        </footer>
      </div>
    </>
  );
}

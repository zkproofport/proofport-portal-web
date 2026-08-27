import Image from "next/image";
import Header from "./components/Header";
import DisclosureDemo from "./components/DisclosureDemo";
import ArchitectureFlow from "./components/ArchitectureFlow";

const sectionLabel = "font-mono text-[1.4rem] sm:text-[1.6rem] font-semibold tracking-[0.14em] uppercase text-gold";
const sectionTitle = "font-serif text-[clamp(4rem,6vw,6.4rem)] font-normal text-cream leading-[1.08] tracking-tight";
const bodyCopy = "text-[1.7rem] sm:text-[1.9rem] leading-[1.7] text-[#9aa4b4]";
const linkStyle = "font-mono text-[1.4rem] sm:text-[1.6rem] font-bold tracking-wide text-gold no-underline border-b-[1.5px] border-gold pb-1 transition-colors hover:text-gold-2 hover:border-gold-2";

const currentProofs = [
  {
    cip: "CIP-1",
    title: "Coinbase KYC",
    copy: "Prove the relevant KYC condition while keeping the source wallet and raw attestation information private.",
  },
  {
    cip: "CIP-2",
    title: "Coinbase Country",
    copy: "Prove that a private country satisfies an allowed or restricted-country policy without revealing the actual country.",
  },
  {
    cip: "CIP-3",
    title: "OIDC Domain",
    copy: "Prove Google Workspace or Microsoft 365 organization membership without revealing the user’s email or JWT.",
  },
] as const;

function ExternalLink({ href, children, className = linkStyle }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function Separator() {
  return <div className="h-px max-w-[760px] mx-auto bg-gradient-to-r from-transparent via-gold-line to-transparent" />;
}

export default function Landing() {
  return (
    <>
      <Header />
      <div className="noise" aria-hidden="true" />
      <div className="dot-matrix" aria-hidden="true" />

      <main className="relative z-1 min-h-screen w-full">
        <section
          className="animate-fade-slide min-h-screen flex flex-col justify-center items-center relative px-6 sm:px-8 lg:px-10 pt-24 pb-20 text-center"
          aria-labelledby="hero-heading"
        >
          <div className={`${sectionLabel} mb-8`}>
            <span className="text-[#7e8999] font-light" aria-hidden="true">{"// "}</span>
            ZKProofport
          </div>

          <h1
            id="hero-heading"
            className="font-serif font-normal text-[clamp(5.2rem,10vw,10rem)] leading-[0.98] tracking-tight text-cream mb-10"
          >
            Privacy-preserving proofs,<br />
            <em className="italic text-gold-2">for any app.</em>
          </h1>

          <p className="text-[clamp(1.9rem,2.4vw,2.5rem)] leading-[1.6] text-[#9aa4b4] max-w-[68ch] mx-auto mb-12">
            Applications and agents can verify user conditions without collecting the underlying private data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
            <a className="min-w-[19rem] bg-gold text-[#11161d] px-7 py-4 text-[1.6rem] font-bold no-underline transition-colors hover:bg-gold-2" href="#proofs">
              Explore proofs
            </a>
            <ExternalLink href="https://github.com/zkproofport">View source ↗</ExternalLink>
          </div>

          <div className="absolute bottom-8 font-mono text-[1.3rem] text-[#7e8999] tracking-[0.15em] animate-pulse" aria-hidden="true">
            ↓ SCROLL
          </div>
        </section>

        <Separator />

        <section className="max-w-[1180px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32" aria-labelledby="what-heading">
          <div className="text-center max-w-[900px] mx-auto">
            <div className={`${sectionLabel} mb-5`}>What We Build</div>
            <h2 id="what-heading" className={`${sectionTitle} mb-8`}>Composable privacy infrastructure.</h2>
            <p className={`${bodyCopy} max-w-[62ch] mx-auto`}>
              Turn trusted credentials and private conditions into minimal, EVM-verifiable statements for people, applications, and autonomous agents.
            </p>
          </div>

          <DisclosureDemo />

          <div className="grid sm:grid-cols-2 gap-px bg-gold-line mt-12">
            <article className="bg-[#0e1219] p-8 sm:p-10">
              <h3 className="font-serif text-[3rem] sm:text-[3.6rem] text-cream font-normal mb-4">For users</h3>
              <p className={bodyCopy}>Reveal less, retain more privacy, and avoid repeatedly sharing raw credentials.</p>
            </article>
            <article className="bg-[#0e1219] p-8 sm:p-10">
              <h3 className="font-serif text-[3rem] sm:text-[3.6rem] text-cream font-normal mb-4">For services</h3>
              <p className={bodyCopy}>Collect and store less sensitive data while still verifying the condition an action requires.</p>
            </article>
          </div>

          <blockquote className="font-serif text-[2.4rem] sm:text-[3.2rem] leading-[1.4] text-gold-2/90 max-w-[32ch] mt-14 sm:mt-18 ml-auto border-l-2 border-gold pl-7">
            Don’t store sensitive data better. Avoid receiving what you never needed.
          </blockquote>
        </section>

        <Separator />

        <section className="max-w-[1180px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32" aria-labelledby="portals-heading">
          <div className={`${sectionLabel} mb-5`}>Proof Portals</div>
          <h2 id="portals-heading" className={`${sectionTitle} mb-7`}>One infrastructure. Distinct proving paths.</h2>
          <p className={`${bodyCopy} max-w-[76ch] mb-14 sm:mb-16`}>
            Browser, mobile, and managed agent proving use the same open proof core. Agent proving remains a distinct TEE-based trust model.
          </p>

          <div className="flex flex-col gap-px bg-gold-line">
            <article className="relative bg-[#0e1219] p-8 sm:p-10 overflow-hidden">
              <div className="absolute right-7 top-7 font-mono text-[1.3rem] font-bold tracking-[0.12em] text-gold uppercase">Human / Browser</div>
              <h3 className="font-serif text-[3.2rem] sm:text-[4rem] text-cream font-normal mb-4">Web proof runner</h3>
              <p className={`${bodyCopy} max-w-[64ch] mb-7`}>
                A browser-based interface for supported proof generation and EVM verification flows, designed to be invoked by applications through the SDK.
              </p>
              <div className="flex flex-wrap gap-6">
                <ExternalLink href="https://proofport-demo.netlify.app/">[ Live Demo ]</ExternalLink>
                <ExternalLink href="https://www.npmjs.com/package/@zkproofport/sdk">[ SDK ]</ExternalLink>
              </div>
            </article>

            <article className="relative bg-[#0e1219] p-8 sm:p-10 overflow-hidden">
              <div className="absolute right-7 top-7 font-mono text-[1.3rem] font-bold tracking-[0.12em] text-[#7ea6d8] uppercase">Human / Local</div>
              <h3 className="font-serif text-[3.2rem] sm:text-[4rem] text-cream font-normal mb-4">Mobile proving</h3>
              <p className={`${bodyCopy} max-w-[64ch] mb-6`}>
                Supported flows generate proofs on the user’s device with React Native, mopro, and Noir / UltraHonk. Private witness data can remain on device for these flows.
              </p>
              <p className="text-[1.5rem] sm:text-[1.7rem] text-[#7e8999] leading-[1.6] mb-7">
                Built on mopro from Ethereum’s Privacy &amp; Scaling Explorations ecosystem.
              </p>
              <div className="flex flex-wrap gap-6">
                <ExternalLink href="https://demo.zkproofport.app/">[ Live Demo ]</ExternalLink>
                <ExternalLink href="https://github.com/zkproofport/proofport-app">[ Mobile App ]</ExternalLink>
                <ExternalLink href="https://www.npmjs.com/package/@zkproofport-app/sdk">[ SDK ]</ExternalLink>
              </div>
            </article>

            <article className="relative bg-[#0e1219] p-8 sm:p-10 overflow-hidden">
              <div className="absolute right-7 top-7 font-mono text-[1.3rem] font-bold tracking-[0.12em] text-[#b99ce5] uppercase">Agent / TEE</div>
              <h3 className="font-serif text-[3.2rem] sm:text-[4rem] text-cream font-normal mb-4">Programmatic agent proving</h3>
              <p className={`${bodyCopy} max-w-[64ch] mb-5`}>
                An agent should not need your full identity. It may only need to know whether KYC passed, a country is allowed, an organization matches, or an asset threshold is satisfied.
              </p>
              <p className="text-[1.5rem] sm:text-[1.7rem] text-[#7e8999] leading-[1.6] mb-7">
                ERC-8004 discovery · MCP / A2A · x402 + USDC · end-to-end encrypted requests · AWS Nitro Enclave · EVM-verifiable result
              </p>
              <div className="flex flex-wrap gap-6">
                <ExternalLink href="https://proveragent.eth.limo">[ Try Agent ]</ExternalLink>
                <ExternalLink href="https://www.npmjs.com/package/@zkproofport-ai/mcp">[ MCP ]</ExternalLink>
                <ExternalLink href="https://www.npmjs.com/package/@zkproofport-ai/sdk">[ SDK ]</ExternalLink>
                <ExternalLink href="https://github.com/zkproofport/proofport-ai">[ Source ]</ExternalLink>
              </div>
            </article>
          </div>
        </section>

        <Separator />

        <section id="proofs" className="max-w-[1180px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32" aria-labelledby="proofs-heading">
          <div className={`${sectionLabel} mb-5`}>Current Proof Catalog</div>
          <h2 id="proofs-heading" className={`${sectionTitle} mb-7`}>Implemented proof profiles.</h2>
          <p className={`${bodyCopy} max-w-[76ch] mb-14`}>
            Current reference implementations are clearly separated from draft, experimental, and next-stage predicates.
          </p>

          <div className="flex flex-col gap-px bg-gold-line">
            {currentProofs.map((proof) => (
              <article key={proof.cip} className="group bg-[#0e1219] p-8 sm:p-10 grid md:grid-cols-[12rem_1fr_auto] gap-5 md:gap-8 items-center transition-colors hover:bg-[#131a24]">
                <span className="font-mono text-[1.5rem] font-black text-gold tracking-wide">{proof.cip}</span>
                <div>
                  <h3 className="font-serif text-[2.8rem] sm:text-[3.4rem] text-cream font-normal mb-3">{proof.title}</h3>
                  <p className={`${bodyCopy} max-w-[66ch]`}>{proof.copy}</p>
                </div>
                <span className="justify-self-start font-mono text-[1.3rem] sm:text-[1.4rem] font-bold tracking-[0.08em] uppercase px-4 py-2 border border-[#6fb98f]/40 text-[#8bd3a8] bg-[#6fb98f]/10">Review / Reference</span>
              </article>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-px bg-gold-line mt-8">
            <article className="bg-[#11151d] p-8 sm:p-10">
              <div className="font-mono text-[1.3rem] font-bold tracking-[0.1em] uppercase text-[#9aa4b4] mb-5">Draft / Experimental</div>
              <p className="text-[1.7rem] sm:text-[1.9rem] text-cream leading-[1.7]">CIP-4 GIWA Dojang <span className="text-[#9aa4b4]">— Draft / PoC</span></p>
              <p className="text-[1.7rem] sm:text-[1.9rem] text-cream leading-[1.7]">CIP-5 Korean Mobile ID <span className="text-[#9aa4b4]">— Draft / Experimental</span></p>
            </article>
            <article className="bg-[#11151d] p-8 sm:p-10 border-l-2 border-gold">
              <div className="font-mono text-[1.3rem] font-bold tracking-[0.1em] uppercase text-gold mb-5">Next · Not shipped</div>
              <h3 className="font-serif text-[2.8rem] sm:text-[3.4rem] text-cream font-normal mb-4">Balance / Asset Threshold</h3>
              <p className={bodyCopy}>Prove that a wallet or account satisfies an asset threshold without exposing the exact balance or source wallet.</p>
            </article>
          </div>

          <div className="mt-10">
            <ExternalLink href="https://github.com/zkproofport/CIPs">[ View All CIPs on GitHub ]</ExternalLink>
          </div>
        </section>

        <Separator />

        <section className="max-w-[1180px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32" aria-labelledby="architecture-heading">
          <div className="text-center">
            <div className={`${sectionLabel} mb-5`}>Architecture</div>
            <h2 id="architecture-heading" className={`${sectionTitle} mb-7`}>From trusted data to usable proof.</h2>
            <p className={`${bodyCopy} max-w-[72ch] mx-auto mb-14`}>CIPs define proof semantics, circuits implement them, and EVM verifiers make the result composable inside applications and agent actions.</p>
          </div>

          <ArchitectureFlow />

          <div className="grid lg:grid-cols-2 gap-px bg-gold-line mt-8">
            <article className="bg-[#0e1219] p-8 sm:p-10">
              <div className={`${sectionLabel} mb-5`}>Coinbase EAS + Base</div>
              <p className="font-mono text-[1.5rem] sm:text-[1.7rem] text-gold-2 leading-[1.8] mb-5">Coinbase / EAS → ZKProofport private proof → application / agent</p>
              <p className={bodyCopy}>Existing Coinbase EAS credentials become privacy-preserving predicates that applications and agents can verify and act on.</p>
            </article>
            <article className="bg-[#0e1219] p-8 sm:p-10">
              <div className={`${sectionLabel} mb-5`}>Composable Conditions</div>
              <p className="font-mono text-[1.5rem] sm:text-[1.7rem] text-gold-2 leading-[1.8] mb-5">KYC ✓ + Country ✓ + Balance ≥ X <span className="text-[#9aa4b4]">(future)</span> → eligible action</p>
              <p className={bodyCopy}>Proofs can become conditions for access, agent actions, payments, and possible future trade, RWA, or financing flows.</p>
            </article>
          </div>
        </section>

        <Separator />

        <section className="max-w-[1180px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32" aria-labelledby="open-heading">
          <div className={`${sectionLabel} mb-5`}>Open Source + Security</div>
          <h2 id="open-heading" className={`${sectionTitle} mb-7`}>Inspect the proof. Not the promise.</h2>
          <p className={`${bodyCopy} max-w-[76ch] mb-8`}>The open-source privacy stack is live today. Broader consumer distribution is intentionally controlled while privacy-critical components are hardened and prepared for independent review.</p>
          <p className="font-mono text-[1.5rem] sm:text-[1.7rem] leading-[1.7] text-gold-2 border-l-2 border-gold pl-6 mb-14 max-w-[86ch]">
            Live today: open-source Noir circuits, Base Mainnet and Ethereum Sepolia verifiers, published SDK and MCP packages, and independently inspectable deployment records.
          </p>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
            <nav className="grid sm:grid-cols-2 gap-px bg-gold-line" aria-label="Open-source repositories">
              {[
                { name: "CIPs", description: "Open specifications / project-level RFCs", href: "https://github.com/zkproofport/CIPs", meta: "Public repository" },
                { name: "Circuits", description: "Noir reference circuits + Solidity / EVM verifiers", href: "https://github.com/zkproofport/circuits", meta: "Public repository" },
                { name: "Mobile App", description: "On-device proof generation", href: "https://github.com/zkproofport/proofport-app", meta: "Public repository" },
                {
                  name: "SDK",
                  description: "Application integration",
                  href: "https://github.com/zkproofport/proofport-app-sdk",
                  meta: "License: MIT",
                  links: [
                    ["App SDK · npm", "https://www.npmjs.com/package/@zkproofport-app/sdk"],
                    ["Web SDK · npm", "https://www.npmjs.com/package/@zkproofport/sdk"],
                  ],
                },
                {
                  name: "Agent",
                  description: "MCP / A2A / x402 / TEE proving",
                  href: "https://www.npmjs.com/package/@zkproofport-ai/sdk",
                  meta: "npm package license: MIT",
                  links: [
                    ["Agent SDK · npm", "https://www.npmjs.com/package/@zkproofport-ai/sdk"],
                    ["Agent MCP · npm", "https://www.npmjs.com/package/@zkproofport-ai/mcp"],
                  ],
                },
                {
                  name: "Deployments",
                  description: "Base Mainnet + Ethereum Sepolia verifier records",
                  href: "https://github.com/zkproofport/circuits/tree/main/deployments",
                  meta: "Independently inspectable",
                  links: [
                    ["Base Mainnet", "https://github.com/zkproofport/circuits/tree/main/deployments/8453"],
                    ["Ethereum Sepolia", "https://github.com/zkproofport/circuits/tree/main/deployments/11155111"],
                  ],
                },
              ].map((resource) => (
                <article key={resource.name} className="bg-[#0e1219] p-7 transition-colors hover:bg-[#131a24]">
                  <a className="block font-serif text-[2.5rem] sm:text-[2.9rem] font-normal text-cream no-underline mb-3" href={resource.href} target="_blank" rel="noopener noreferrer">{resource.name} ↗</a>
                  <p className="text-[1.4rem] sm:text-[1.6rem] text-[#9aa4b4] leading-[1.5] m-0">{resource.description}</p>
                  <span className="block font-mono text-[1.3rem] sm:text-[1.4rem] text-[#7e8999] mt-4">{resource.meta}</span>
                  {resource.links && (
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
                      {resource.links.map(([label, href]) => (
                        <a key={href} className="font-mono text-[1.3rem] sm:text-[1.4rem] font-bold text-gold-2 no-underline border-b border-gold/30 hover:border-gold-2" href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </nav>

            <aside className="bg-[#142019] border-l-4 border-[#6fb98f] p-8 sm:p-10">
              <div className="font-mono text-[1.4rem] font-bold tracking-[0.1em] uppercase text-[#8bd3a8] mb-5">Security before scale</div>
              <p className="text-[1.7rem] sm:text-[1.9rem] text-cream leading-[1.65] mb-8">The stack is live; consumer distribution is expanding deliberately while privacy-critical components are hardened and independently reviewed.</p>
              <dl className="m-0">
                <div className="flex justify-between gap-5 py-4 border-b border-white/10 text-[1.5rem] sm:text-[1.7rem]"><dt className="text-[#9aa4b4]">Open-source stack</dt><dd className="m-0 text-[#8bd3a8] font-semibold">Live</dd></div>
                <div className="flex justify-between gap-5 py-4 border-b border-white/10 text-[1.5rem] sm:text-[1.7rem]"><dt className="text-[#9aa4b4]">Internal review</dt><dd className="m-0 text-[#8bd3a8] font-semibold">In progress</dd></div>
                <div className="flex justify-between gap-5 py-4 border-b border-white/10 text-[1.5rem] sm:text-[1.7rem]"><dt className="text-[#9aa4b4]">External audit</dt><dd className="m-0 text-[#8bd3a8] font-semibold">Planned</dd></div>
                <div className="flex justify-between gap-5 py-4 border-b border-white/10 text-[1.5rem] sm:text-[1.7rem]"><dt className="text-[#9aa4b4]">Consumer rollout</dt><dd className="m-0 text-[#8bd3a8] font-semibold">Controlled</dd></div>
              </dl>
              <p className="text-[1.5rem] sm:text-[1.7rem] text-[#9aa4b4] leading-[1.65] mt-7 mb-0">CIPs document trust assumptions and limitations; circuit source and deployment records remain open for review.</p>
            </aside>
          </div>
        </section>

        <Separator />

        <section className="max-w-[1180px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32 text-center" aria-labelledby="recognition-heading">
          <div className={`${sectionLabel} mb-5`}>Ecosystem Recognition</div>
          <h2 id="recognition-heading" className={`${sectionTitle} mb-14 sm:mb-16`}>Selected &amp; supported.</h2>

          <div className="grid sm:grid-cols-2 gap-px bg-gold-line max-w-[980px] mx-auto text-left">
            <article className="bg-[#0e1219] p-8 sm:p-10 flex gap-6 items-start">
              <Image src="/base-logo.png" alt="Base" width={64} height={64} className="w-16 h-16 rounded-xl shrink-0" />
              <div><h3 className="font-serif text-[2.7rem] sm:text-[3.2rem] text-cream font-normal mb-3">Base Batches 002</h3><p className="text-[1.5rem] sm:text-[1.7rem] text-[#9aa4b4] leading-[1.6]">Top 50 out of 900+ teams</p></div>
            </article>
            <article className="bg-[#0e1219] p-8 sm:p-10 flex gap-6 items-start">
              <Image src="/aztec.png" alt="Aztec" width={64} height={64} className="w-16 h-16 rounded-xl shrink-0" />
              <div><h3 className="font-serif text-[2.7rem] sm:text-[3.2rem] text-cream font-normal mb-3">Aztec / Noir</h3><p className="text-[1.5rem] sm:text-[1.7rem] text-[#9aa4b4] leading-[1.6]">Coinbase KYC Noir PoC implementation support</p></div>
            </article>
            <article className="bg-[#0e1219] p-8 sm:p-10 flex gap-6 items-start">
              <Image src="/synthesis-logo.png" alt="The Synthesis Hackathon" width={64} height={64} className="w-16 h-16 object-cover shrink-0" />
              <div><h3 className="font-serif text-[2.7rem] sm:text-[3.2rem] text-cream font-normal mb-3">The Synthesis Hackathon</h3><p className="text-[1.5rem] sm:text-[1.7rem] text-[#9aa4b4] leading-[1.6]">OpenStoa · 1st Place in Agents That Keep Secrets</p></div>
            </article>
            <article className="bg-[#0e1219] p-8 sm:p-10 flex gap-6 items-start">
              <Image src="/giwa-logo.svg" alt="GIWA" width={64} height={64} className="w-16 h-16 shrink-0" />
              <div><h3 className="font-serif text-[2.7rem] sm:text-[3.2rem] text-cream font-normal mb-3">GIWA GASOK</h3><p className="text-[1.5rem] sm:text-[1.7rem] text-[#9aa4b4] leading-[1.6]">Selected for Phase 3 productization</p></div>
            </article>
          </div>

          <p className={`${bodyCopy} max-w-[72ch] mx-auto mt-12`}>
            <strong className="text-cream">OpenStoa</strong> is a reference application built with ZKProofport to explore a privacy-preserving shared space for humans and AI agents. <ExternalLink href="https://github.com/zkproofport/openstoa">Inspect OpenStoa ↗</ExternalLink>
          </p>
        </section>

        <Separator />

        <section className="max-w-[1180px] mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-32 text-center" aria-labelledby="team-heading">
          <div className={`${sectionLabel} mb-5`}>Team</div>
          <h2 id="team-heading" className={`${sectionTitle} mb-14 sm:mb-16`}>The builders behind ZKProofport.</h2>

          <div className="grid sm:grid-cols-2 gap-px bg-gold-line max-w-[900px] mx-auto">
            <article className="bg-[#0e1219] p-8 sm:p-10 flex flex-col items-center gap-6">
              <Image src="/team-1.png" alt="SY Hyun" width={190} height={190} className="w-[14rem] h-[14rem] rounded-full object-cover border-2 border-gold/20 grayscale transition-all hover:grayscale-0" />
              <div><h3 className="font-serif text-[3rem] sm:text-[3.6rem] text-cream font-normal">SY Hyun</h3><p className="font-mono text-[1.4rem] sm:text-[1.6rem] text-gold-2 mt-3">Co-founder · Product &amp; Protocol</p></div>
              <ul className="list-none p-0 m-0 flex flex-col gap-2 text-[1.5rem] sm:text-[1.7rem] text-[#9aa4b4] leading-[1.5]">
                <li>Ethereum Remix IDE Engineer</li><li>Former DSRV Lead Engineer</li><li>Ethereum solo home staker</li><li>Aztec Genesis Sequencer</li>
              </ul>
            </article>
            <article className="bg-[#0e1219] p-8 sm:p-10 flex flex-col items-center gap-6">
              <Image src="/team-2.png" alt="JH Hyun" width={190} height={190} className="w-[14rem] h-[14rem] rounded-full object-cover border-2 border-gold/20 grayscale transition-all hover:grayscale-0" />
              <div><h3 className="font-serif text-[3rem] sm:text-[3.6rem] text-cream font-normal">JH Hyun</h3><p className="font-mono text-[1.4rem] sm:text-[1.6rem] text-gold-2 mt-3">Co-founder · Engineering &amp; Infrastructure</p></div>
              <ul className="list-none p-0 m-0 flex flex-col gap-2 text-[1.5rem] sm:text-[1.7rem] text-[#9aa4b4] leading-[1.5]">
                <li>KAIST graduate</li><li>NHN Cloud distributed systems</li><li>Former TmaxSoft Engineer</li>
              </ul>
            </article>
          </div>
        </section>

        <Separator />

        <footer className="py-12 sm:py-14 px-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-7 text-center font-mono text-[1.4rem] sm:text-[1.6rem] text-[#9aa4b4]" role="contentinfo">
          <span>© {new Date().getFullYear()} ZKProofport</span>
          <span className="hidden sm:inline text-gold/30" aria-hidden="true">·</span>
          <ExternalLink href="https://github.com/zkproofport">GitHub</ExternalLink>
          <ExternalLink href="https://github.com/zkproofport/CIPs">CIPs</ExternalLink>
          <ExternalLink href="https://x.com/zkproofport">@zkproofport</ExternalLink>
        </footer>
      </main>
    </>
  );
}

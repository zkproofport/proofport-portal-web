import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import AppDownloads from "./components/AppDownloads";
import { BrandMark, HeroProof, PolicyComposition, ProductFlow, ProvingEnvironments } from "./components/ProductVisuals";
import styles from "./product.module.css";

const DEMO_URL = "https://demo.zkproofport.app";

function DemoLink() {
  return <a className={styles.primaryButton} href={DEMO_URL} target="_blank" rel="noopener noreferrer">Try the Demo</a>;
}

export default function Landing() {
  return (
    <div className={styles.site}>
      <a href="#main" className={styles.skipLink}>Skip to content</a>
      <Header />
      <main id="main">
        <section id="product" className={`${styles.hero} ${styles.container}`} aria-labelledby="hero-heading">
          <div className={styles.heroCopy}>
            <h1 id="hero-heading">Private eligibility<br />for humans<br />and <span>AI agents.</span></h1>
            <p className={styles.heroDescription}>Prove what is required without directly sharing the underlying credential.</p>
            <div className={styles.actions}><DemoLink /><Link className={styles.secondaryButton} href="/developers">Build with ZKProofport</Link></div>
            <AppDownloads />
            <p className={styles.heroAttribution}>A product by <a href="https://masselabs.com" target="_blank" rel="noopener noreferrer">Masse Labs</a></p>
          </div>
          <HeroProof />
        </section>

        <section id="how-it-works" className={`${styles.section} ${styles.coreSection}`} aria-labelledby="flow-heading">
          <div className={styles.container}>
            <div className={styles.coreHeading}><h2 id="flow-heading">Reveal the result,<br /><span>not the credential.</span></h2></div>
            <ProductFlow />
            <div className={styles.valueStatement}><h3>Users reveal less.<br />Applications collect less.</h3><p>A privacy layer for existing credentials.<br />Your application receives the proof.</p></div>
          </div>
        </section>

        <section id="demo" className={`${styles.section} ${styles.demoSection}`} aria-labelledby="demo-heading">
          <div className={`${styles.container} ${styles.demoLayout}`}>
            <div className={styles.sectionHeading}><p className={styles.sectionLabel}>Interactive demo</p><h2 id="demo-heading">See private eligibility<br /><span>in action.</span></h2><p>Try the end-to-end ZKProofport flow.</p><div className={styles.actions}><DemoLink /></div></div>
            <figure className={styles.demoJourney}>
              <figcaption className={styles.sectionLabel}>Request. Prove. Verify.</figcaption>
              <ol>
                <li><span>01</span><div><h3>Request a proof</h3></div></li>
                <li><span>02</span><div><h3>Generate the proof</h3></div></li>
                <li><span>03</span><div><h3>Verify the result</h3></div></li>
              </ol>
              <p className={styles.smallNote}>Illustrative flow. Explore the available examples in the demo.</p>
            </figure>
          </div>
        </section>

        <section id="proving" className={styles.section} aria-labelledby="proving-heading">
          <div className={styles.container}>
            <div className={styles.environmentsHeading}><h2 id="proving-heading">Two proving environments.<br /><span>One application interface.</span></h2></div>
            <ProvingEnvironments />
            <p className={styles.trustNote}>TEE protections depend on the deployment and validated hardware attestation. <Link href="/developers#trust-models">Understand the trust models</Link></p>
          </div>
        </section>

        <section id="policies" className={`${styles.section} ${styles.policySection}`} aria-labelledby="policies-heading">
          <div className={styles.container}>
            <div className={styles.policyHeading}><p className={styles.sectionLabel}>Composable eligibility</p><h2 id="policies-heading">One trusted layer.<br /><span>Many policies.</span></h2></div>
            <PolicyComposition />
          </div>
        </section>

        <section id="build" className={styles.section} aria-labelledby="build-heading">
          <div className={styles.container}>
            <div className={styles.buildLayout}>
              <div className={styles.buildIntro}>
                <h2 id="build-heading">Built.<br /><span>Open to inspect.</span></h2>
                <p>From circuits to application integration.</p>
                <nav className={styles.resourceLinks} aria-label="Developer resources">
                  <Link href="/developers">Docs</Link>
                  <a href="https://github.com/zkproofport" target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href="https://github.com/zkproofport/CIPs" target="_blank" rel="noopener noreferrer">CIPs</a>
                </nav>
              </div>
              <dl className={styles.implementationLedger}>
                <div><dt>Circuits</dt><dd>Noir</dd></div>
                <div><dt>Proving</dt><dd>Mobile prover <span className={styles.ledgerSeparator}>/</span> TEE prover</dd></div>
                <div><dt>Verification</dt><dd>EVM verifier</dd></div>
                <div><dt>Integration</dt><dd>TypeScript SDK</dd></div>
                <div className={styles.sourcesRow}><dt>Trust sources</dt><dd><ul><li>Coinbase KYC / EAS</li><li>OIDC</li><li>UPbit KYC <span>prototype</span></li></ul></dd></div>
              </dl>
            </div>
            <div className={styles.recognition}>
              <p>Programs &amp; ecosystem</p>
              <ul aria-label="Program selections and ecosystem Grant">
                <li><div className={styles.recognitionLogo}><Image src="/recognition/base.svg" alt="" width={128} height={32} /></div><div className={styles.recognitionCopy}><span>Base Batches 002</span><p>Builder Track Top 50</p></div></li>
                <li><div className={styles.recognitionLogo}><Image src="/recognition/aztec.svg" alt="" width={125} height={32} /></div><div className={styles.recognitionCopy}><span>Aztec / Noir</span><p>Ecosystem Grant</p></div></li>
                <li><div className={styles.recognitionLogo}><Image src="/recognition/giwa.webp" alt="" width={110} height={32} /></div><div className={styles.recognitionCopy}><span>GIWA GASOK</span><p>Phase 3 selection</p></div></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.closing}><div><h2>Build private eligibility<br />into your application.</h2><p>For wallets, financial applications, and autonomous agents.</p></div><Link className={styles.primaryButton} href="/developers">Build with ZKProofport</Link></div>
          <div className={styles.footerBottom}><Link className={styles.brand} href="/"><BrandMark size={32} /><span>ZKProofport</span></Link><a href="https://masselabs.com" target="_blank" rel="noopener noreferrer">Built by Masse Labs</a><nav aria-label="Footer navigation"><a href="https://masselabs.com/#team" target="_blank" rel="noopener noreferrer">Team</a><Link href="/developers">Docs</Link><a href="https://github.com/zkproofport" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://x.com/zkproofport" target="_blank" rel="noopener noreferrer">X</a></nav><span className={styles.copyright}>© {new Date().getFullYear()} ZKProofport</span></div>
        </div>
      </footer>
    </div>
  );
}

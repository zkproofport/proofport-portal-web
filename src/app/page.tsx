import Link from "next/link";
import Header from "./components/Header";
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
            <div className={styles.heroResources}><Link href="/developers">Docs</Link><a href="https://github.com/zkproofport" target="_blank" rel="noopener noreferrer">GitHub</a></div>
          </div>
          <HeroProof />
          <div className={styles.heroBaseline}>
            <span>People <b>On-device proving</b></span>
            <span>Agents <b>TEE-capable workflows</b></span>
            <a href="https://masselabs.com" target="_blank" rel="noopener noreferrer">Built by Masse Labs</a>
          </div>
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
            <div className={styles.sectionHeading}><p className={styles.sectionLabel}>Interactive demo</p><h2 id="demo-heading">See private eligibility<br /><span>in action.</span></h2><p>Try the end-to-end ZKProofport flow.</p><div className={styles.actions}><DemoLink /></div><p className={styles.smallNote}>demo.zkproofport.app</p></div>
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
            <div className={styles.buildHeading}><h2 id="build-heading">Built.<br /><span>Open to inspect.</span></h2><div><p>From circuits to application integration.</p><div className={styles.resourceLinks}><Link href="/developers">Docs</Link><a href="https://github.com/zkproofport" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://github.com/zkproofport/CIPs" target="_blank" rel="noopener noreferrer">CIPs</a></div></div></div>
            <ul className={styles.infrastructureStrip} aria-label="Implemented infrastructure"><li>Noir</li><li>Mobile prover</li><li>EVM verifier</li><li>TypeScript SDK</li><li>TEE prover</li></ul>
            <div className={styles.sourceStrip}><span>Trust sources</span><p>Coinbase KYC / EAS <i>·</i> OIDC <i>·</i> GIWA Sepolia prototype</p></div>
            <ul className={styles.credibility} aria-label="Program selections and ecosystem support"><li>Base Batches 002<span>Builder Track Top 50</span></li><li>Aztec / Noir<span>Ecosystem support</span></li><li>GIWA GASOK<span>Phase 3 selection</span></li></ul>
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

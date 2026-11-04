import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import AppDownloads from "./components/AppDownloads";
import BrandWordmark from "./components/BrandWordmark";
import ResourceLink from "./components/ResourceLink";
import { BrandMark, HeroProof } from "./components/ProductVisuals";
import { resources } from "./resources";
import styles from "./product.module.css";

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
            <div className={styles.actions}>
              <ResourceLink className={styles.primaryButton} href={resources.demo}>Try the Demo</ResourceLink>
              <Link className={styles.secondaryButton} href="/developers">Build with ZKProofport</Link>
            </div>
            <p className={styles.heroAttribution}>A product by <a href="https://masselabs.com" target="_blank" rel="noopener noreferrer">Masse Labs</a></p>
          </div>
          <HeroProof />
        </section>

        <section id="giwa" className={`${styles.section} ${styles.featureSection}`} aria-labelledby="giwa-heading">
          <div className={styles.container}>
            <div className={styles.featureHeading}>
              <div className={styles.sectionHeading}>
                <p className={styles.sectionLabel}>01 / Featured implementation</p>
                <h2 id="giwa-heading">Built with<br /><span className={styles.goldText}>GIWA Dojang.</span></h2>
              </div>
              <p className={styles.featureStatement}>From trusted attestations<br />to private eligibility.</p>
            </div>
            <div>
              <article className={styles.featureStory} aria-labelledby="kyc-heading">
                <div className={styles.storyTitle}><span className={styles.storyIndex} aria-hidden="true">01</span><h3 id="kyc-heading">Private KYC</h3></div>
                <div className={styles.storyBody}>
                  <p className={styles.contextLabel}>GIWA Sepolia demo · Test attester</p>
                  <p>Prove control of a credential-linked wallet without exposing the underlying address to the application.</p>
                  <div className={styles.resourceLinks}><ResourceLink href={resources.gotgan}>Gotgan KYC Vault</ResourceLink><ResourceLink href={resources.dojangscan}>Dojangscan</ResourceLink></div>
                </div>
              </article>
              <article className={styles.featureStory} aria-labelledby="balance-heading">
                <div className={styles.storyTitle}><span className={styles.storyIndex} aria-hidden="true">02</span><h3 id="balance-heading">Private Balance</h3></div>
                <div className={styles.storyBody}>
                  <p className={styles.contextLabel}>Local research · Synthetic balances</p>
                  <p>Prove balance eligibility while keeping the source wallet and exact balance private.</p>
                  <div className={styles.resourceLinks}><ResourceLink href={resources.balance}>Private Balance Research</ResourceLink></div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="platform" className={styles.section} aria-labelledby="platform-heading">
          <div className={styles.container}>
            <div className={styles.platformLayout}>
              <div className={styles.sectionHeading}>
                <p className={styles.sectionLabel}>02 / The platform</p>
                <h2 id="platform-heading">One proving layer.<br /><span>Multiple trusted sources.</span></h2>
              </div>
              <div className={styles.sourceList}>
                <p className={styles.contextLabel}>Credential sources</p>
                <ul><li>GIWA Dojang</li><li>Human Passport</li><li>Google / Microsoft <span>OIDC</span></li><li>Coinbase KYC</li></ul>
                <p className={styles.smallNote}>Support varies by integration. <Link href="/developers#circuits">Explore the specifications</Link></p>
              </div>
            </div>
            <ul className={styles.platformTools} aria-label="Platform capabilities"><li>Mobile proving</li><li>Agent proving</li><li>Noir circuits</li><li>EVM verification</li><li>TypeScript SDK</li></ul>
          </div>
        </section>

        <section id="build" className={`${styles.section} ${styles.buildSection}`} aria-labelledby="build-heading">
          <div className={styles.container}>
            <div className={styles.buildLayout}>
              <div className={styles.sectionHeading}><p className={styles.sectionLabel}>03 / Build with ZKProofport</p><h2 id="build-heading">Built to integrate.<br /><span>Open to inspect.</span></h2></div>
              <nav className={styles.startLinks} aria-label="Start with ZKProofport">
                <ResourceLink href={resources.demo}>Try the Demo</ResourceLink>
                <Link href="/developers">Developer Resources</Link>
                <ResourceLink href={resources.github}>Explore GitHub</ResourceLink>
              </nav>
            </div>
            <div className={styles.openResources}>
              <div><p className={styles.sectionLabel}>Open-source foundations</p><nav className={styles.resourceLinks} aria-label="Open-source repositories"><ResourceLink href={resources.circuits}>Noir circuits</ResourceLink><ResourceLink href={resources.mobile}>Mobile SDK</ResourceLink><ResourceLink href={resources.agent}>Agent SDK</ResourceLink></nav></div>
              <AppDownloads />
            </div>
            <div className={styles.recognition}>
              <p>Programs &amp; ecosystem</p>
              <ul aria-label="Program recognition and ecosystem support">
                <li><div className={styles.recognitionLogo}><Image src="/recognition/base.svg" alt="" width={128} height={32} /></div><div className={styles.recognitionCopy}><span>Base Batches 002</span><p>Builder Track Top 50</p></div></li>
                <li><div className={styles.recognitionLogo}><Image src="/recognition/aztec.svg" alt="" width={125} height={32} /></div><div className={styles.recognitionCopy}><span>Aztec / Noir</span><p>Ecosystem Grant</p></div></li>
                <li><div className={styles.recognitionLogo}><Image src="/recognition/giwa.webp" alt="" width={110} height={32} /></div><div className={styles.recognitionCopy}><span>GIWA GASOK</span><p>KBW 2026 Showcase</p></div></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerBottom}`}>
          <Link className={styles.brand} href="/" aria-label="ZKProofport home"><BrandMark size={32} /><BrandWordmark /></Link>
          <a href="https://masselabs.com" target="_blank" rel="noopener noreferrer">Built by Masse Labs</a>
          <nav aria-label="Footer navigation"><a href="https://masselabs.com/#team" target="_blank" rel="noopener noreferrer">Team</a><Link href="/brand">Brand kit</Link><a href="https://x.com/zkproofport" target="_blank" rel="noopener noreferrer">X</a></nav>
          <span className={styles.copyright}>© {new Date().getFullYear()} ZKProofport</span>
        </div>
      </footer>
    </div>
  );
}

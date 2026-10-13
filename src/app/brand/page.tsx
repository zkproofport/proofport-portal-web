import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import styles from "../product.module.css";
import brand from "./brand.module.css";

const description = "Official ZKProofport logos, pixel wordmarks, brand colors, and cover images. Download individual SVG and PNG files or the complete brand kit.";
const cover = { url: "https://zkproofport.com/brand/zkproofport-cover.png", width: 1600, height: 900, alt: "ZKProofport — Private eligibility" };

export const metadata: Metadata = {
  title: "Brand Kit | ZKProofport",
  description,
  alternates: { canonical: "https://zkproofport.com/brand" },
  openGraph: { title: "ZKProofport Brand Kit", description, url: "https://zkproofport.com/brand", images: [cover] },
  twitter: { card: "summary_large_image", title: "ZKProofport Brand Kit", description, images: [cover] },
};

type Asset = { name: string; title: string; description: string; dark?: boolean };
const logos: Asset[] = [
  { name: "logo-light", title: "Primary logo", description: "Gold and midnight, for light backgrounds." },
  { name: "logo-dark", title: "Reverse logo", description: "Gold and paper, for dark backgrounds.", dark: true },
  { name: "stacked-light", title: "Stacked / light", description: "A centered lockup for vertical layouts." },
  { name: "stacked-dark", title: "Stacked / dark", description: "A centered lockup on dark backgrounds.", dark: true },
];
const wordmarks: Asset[] = [
  { name: "wordmark-light", title: "Wordmark / light", description: "The pixel signature without the shield." },
  { name: "wordmark-dark", title: "Wordmark / dark", description: "The signature on dark backgrounds.", dark: true },
  { name: "wordmark-mono-light", title: "Monochrome / midnight", description: "A single-color wordmark." },
  { name: "wordmark-mono-dark", title: "Monochrome / paper", description: "A single-color reverse wordmark.", dark: true },
];

function Downloads({ name, title }: { name: string; title: string }) {
  return <div className={brand.downloads}>{["svg", "png"].map(format => <a key={format} href={`/brand/zkproofport-${name}.${format}`} download aria-label={`Download ${title} as ${format.toUpperCase()}`}>{format.toUpperCase()} <span aria-hidden="true">↓</span></a>)}</div>;
}

function AssetCard({ asset }: { asset: Asset }) {
  return <article className={brand.card}>
    <div className={`${brand.preview} ${asset.dark ? brand.darkPreview : ""}`}><Image src={`/brand/zkproofport-${asset.name}.svg`} alt={`ZKProofport ${asset.title.toLowerCase()}`} fill sizes="(max-width: 760px) 90vw, 45vw" /></div>
    <div className={brand.details}><div><h3>{asset.title}</h3><p>{asset.description}</p></div><Downloads name={asset.name} title={asset.title} /></div>
  </article>;
}

function SectionHeading({ index, title, description, id }: { index: string; title: string; description: string; id: string }) {
  return <div className={brand.sectionHeading}><div><p className={brand.index}>{index}</p><h2 id={id}>{title}</h2></div><p>{description}</p></div>;
}

export default function BrandKit() {
  return <div className={styles.site}>
    <a href="#main" className={styles.skipLink}>Skip to content</a><Header />
    <main id="main" className={`${styles.container} ${brand.main}`}>
      <section className={brand.hero} aria-labelledby="brand-heading">
        <div className={brand.heroHeading}><div><p className={brand.index}>ZKProofport / Brand resources</p><h1 id="brand-heading">Brand kit.</h1><p className={brand.lede}>Our identity, ready to share.<br />Logos and assets for your next integration, story, or presentation.</p></div><div className={brand.downloadKit}><a className={styles.primaryButton} href="/brand/zkproofport-brand-kit.zip" download>Download brand kit <span aria-hidden="true">↓</span></a><p>SVG + PNG · Includes usage guide</p></div></div>
        <div className={brand.heroSignature}><Image src="/brand/zkproofport-logo-dark.svg" alt="ZKProofport, with a gold pixel ZKP wordmark and the original shield and anchor" width={1022} height={240} priority /></div>
        <div className={brand.signatureNotes}><span>The original shield.</span><span>A distinct pixel signature.</span><span>One ZKProofport.</span></div>
      </section>

      <section className={brand.section} aria-labelledby="logos-heading"><SectionHeading index="01 / Logos" id="logos-heading" title="The complete signature." description="Choose a horizontal or stacked logo for your layout. PNG logos have transparent backgrounds." /><div className={brand.grid}>{logos.map(asset => <AssetCard key={asset.name} asset={asset} />)}</div></section>

      <section className={brand.section} aria-labelledby="wordmarks-heading"><SectionHeading index="02 / Wordmarks" id="wordmarks-heading" title="A little less, still distinct." description="Color and monochrome wordmarks. The ZKP pixel pattern stays consistent in every version." /><div className={brand.grid}>{wordmarks.map(asset => <AssetCard key={asset.name} asset={asset} />)}</div></section>

      <section className={brand.section} aria-labelledby="symbol-heading"><SectionHeading index="03 / Symbol" id="symbol-heading" title="The original shield." description="Our existing shield and anchor, unchanged. Use it for avatars and compact placements." /><div className={brand.symbolLayout}><AssetCard asset={{ name: "symbol", title: "Shield & anchor", description: "Original artwork · 600 × 600 px", dark: true }} /><div className={brand.symbolCopy}><h3>Keep the symbol intact.</h3><p>The pixel treatment belongs to the wordmark. The shield retains its original colors, proportions, and faceted artwork.</p><p>For small placements, use the shield on its own.</p></div></div></section>

      <section className={brand.section} aria-labelledby="cover-heading"><SectionHeading index="04 / Cover" id="cover-heading" title="Ready for a wider canvas." description="A 16:9 cover for presentations and social sharing." /><article className={brand.card}><Image className={brand.cover} src="/brand/zkproofport-cover.svg" alt="ZKProofport — Private eligibility, on midnight with a gold square pattern" width={1600} height={900} /><div className={brand.details}><div><h3>Brand cover</h3><p>1600 × 900 px · Midnight background</p></div><Downloads name="cover" title="Brand cover" /></div></article></section>

      <section className={brand.section} aria-labelledby="colors-heading"><SectionHeading index="05 / Colors & type" id="colors-heading" title="Midnight. Gold. Clarity." description="A familiar palette, with Inter letterforms and a custom pixel treatment." /><div className={brand.palette}>{[{ name: "Midnight", hex: "#071827", light: false }, { name: "Gold", hex: "#CBA65E", light: true }, { name: "Light gold", hex: "#DFC18A", light: true }, { name: "Paper", hex: "#F2F3EE", light: true }].map(color => <div key={color.name} className={brand.swatch} style={{ background: color.hex, color: color.light ? "#071827" : "#F2F3EE" }}><strong>{color.name}</strong><code>{color.hex}</code></div>)}</div><div className={brand.typography}><strong>Aa <span>Inter</span></strong><p>Pixel-built ZKP. Smooth roofport.<br />One continuous name, with a shared baseline.</p></div></section>

      <section className={`${brand.section} ${brand.usage}`} aria-labelledby="usage-heading"><div><p className={brand.index}>06 / Usage</p><h2 id="usage-heading">Make room for the mark.</h2><p>These assets represent ZKProofport, a product by Masse Labs.</p><a className={brand.textLink} href="/brand/brand-guidelines.txt" download>Download usage guide ↓</a></div><ul><li><strong>Leave clear space.</strong> Keep at least half a capital-letter height of space around the logo.</li><li><strong>Keep it readable.</strong> Use horizontal logos at least 240 px wide and wordmarks at least 160 px wide. Use the shield alone for smaller placements, at least 32 px tall.</li><li><strong>Preserve the artwork.</strong> Keep the tile pattern and shield intact. Do not stretch, rotate, recolor, or add effects.</li><li><strong>Choose the right contrast.</strong> Use the light-background or dark-background version that fits your design.</li></ul></section>
      <p className={brand.contact}>Need another format? <a className={brand.textLink} href="mailto:sooyoung.hyun@masselabs.com">Get in touch ↗</a><span>Looking for the company identity? <a className={brand.textLink} href="https://masselabs.com/brand.html" target="_blank" rel="noopener noreferrer">Masse Labs brand kit ↗</a></span></p>
    </main>
    <footer className={`${styles.footer} ${styles.docsFooter}`}><div className={`${styles.container} ${styles.footerBottom}`}><Link href="/">ZKProofport home</Link><a href="https://masselabs.com" target="_blank" rel="noopener noreferrer">Built by Masse Labs</a><nav aria-label="Footer navigation"><Link href="/developers">Docs</Link><Link href="/brand" aria-current="page">Brand kit</Link><a href="https://github.com/zkproofport" target="_blank" rel="noopener noreferrer">GitHub</a></nav></div></footer>
  </div>;
}

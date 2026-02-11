import "buffer";

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-next",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif-next",
  display: "swap",
});

/* ── Viewport (responsive) ── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0e14",
};

/* ── SEO + AI Agent Discoverability ── */
export const metadata: Metadata = {
  title: "ZKProofport",
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "To prove trust, you must sacrifice privacy. ZKProofport breaks this paradox with zero-knowledge proofs. A general-purpose ZK proof portal & SDK — apps, DApps, and AI agents generate privacy-preserving proofs client-side, 0 bytes exposed.",
  keywords: [
    "zero knowledge proof",
    "ZK proof",
    "privacy infrastructure",
    "KYC",
    "ZK SDK",
    "proof portal",
    "onchain verification",
    "Noir circuit",
    "decentralized identity",
    "Web3 privacy",
    "ERC-8004",
    "agent-to-agent",
    "TEE",
    "circuit registry",
    "Base Batches",
    "Aztec Noir",
  ],
  applicationName: "ZKProofport",
  authors: [{ name: "ZKProofport" }],
  creator: "ZKProofport",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ZKProofport",
    title: "ZKProofport — Privacy-First Trust Infrastructure for Web3",
    description:
      "Privacy-preserving ZK proof portal & SDK. KYC, age gating, credit score, RWA — client-side only, 0 bytes exposed. Backed by Base & Aztec.",
    url: "https://zkproofport.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@zkproofport",
    creator: "@zkproofport",
    title: "ZKProofport — Privacy-First Trust Infrastructure for Web3",
    description:
      "Privacy-preserving ZK proof portal & SDK. KYC, age gating, credit score, RWA — client-side only, 0 bytes exposed. Backed by Base & Aztec.",
  },
  alternates: {
    canonical: "https://zkproofport.com",
  },
};

/* ── JSON-LD Structured Data — AI agent / LLM crawler friendly ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ZKProofport",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web, iOS",
  description:
    "Privacy-first trust infrastructure for Web3. ZK proof portal & SDK — apps, DApps, and AI agents generate privacy-preserving proofs client-side, 0 bytes exposed.",
  url: "https://zkproofport.com",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/ComingSoon",
  },
  featureList: [
    "Web Portal — browser-based proof generation & on-chain verification",
    "Mobile App — native iOS with biometric auth & client-side proving",
    "Prover Agent — agent-to-agent proof delegation via ERC-8004, X402, TEE",
    "Circuit categories: KYC, Country, Credit Score, Age Gating, RWA, AI Economy",
    "Client-side only proving — 0 bytes exposed to any server",
    "Backed by Base Batches 002 & Aztec Noir Grant",
  ],
  sameAs: ["https://x.com/zkproofport", "https://www.npmjs.com/package/@zkproofport/sdk"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${dmSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-GZP163T5YY"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-GZP163T5YY');
        `}
      </Script>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

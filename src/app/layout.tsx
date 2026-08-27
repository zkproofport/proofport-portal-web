import "buffer";

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";

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
  title: "ZKProofport | Composable Privacy Infrastructure",
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "Turn trusted credentials into composable zero-knowledge proofs for Ethereum applications and AI agents.",
  keywords: [
    "zero knowledge proof",
    "ZK proof",
    "privacy infrastructure",
    "KYC",
    "ZK SDK",
    "selective disclosure",
    "onchain verification",
    "Noir circuit",
    "credential privacy",
    "Ethereum privacy",
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
    title: "ZKProofport | Composable Privacy Infrastructure",
    description:
      "Turn trusted credentials into composable zero-knowledge proofs for Ethereum applications and AI agents.",
    url: "https://zkproofport.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@zkproofport",
    creator: "@zkproofport",
    title: "ZKProofport | Composable Privacy Infrastructure",
    description:
      "Turn trusted credentials into composable zero-knowledge proofs for Ethereum applications and AI agents.",
  },
  alternates: {
    canonical: "https://zkproofport.com",
  },
};

/* ── JSON-LD Structured Data — AI agent / LLM crawler friendly ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "ZKProofport",
  codeRepository: "https://github.com/zkproofport",
  programmingLanguage: ["Noir", "TypeScript", "Solidity", "Rust"],
  description:
    "Composable privacy infrastructure for credentials, applications, and AI agents.",
  url: "https://zkproofport.com",
  featureList: [
    "Coinbase KYC credential proof",
    "Coinbase country predicate",
    "Google Workspace and Microsoft 365 OIDC domain proof",
    "Noir reference circuits and EVM verifier contracts",
    "On-device mobile proving built with mopro",
    "Encrypted agent proving through AWS Nitro Enclave",
  ],
  sameAs: ["https://github.com/zkproofport", "https://x.com/zkproofport", "https://www.npmjs.com/package/@zkproofport-app/sdk"],
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
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "zkProofport — Privacy-Preserving Proof Portal (Coming Soon)",
  description:
    "A single portal for privacy-preserving proofs. General-purpose ZK proof portal & SDK for KYC, assets, and social.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

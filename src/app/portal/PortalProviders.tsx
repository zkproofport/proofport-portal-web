"use client";

import dynamic from "next/dynamic";

const Providers = dynamic(
  () => import("../providers").then((module) => module.Providers),
  { ssr: false },
);

export default function PortalProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}

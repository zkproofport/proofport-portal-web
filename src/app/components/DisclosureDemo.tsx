"use client";

import { useState } from "react";

const examples = [
  { id: "kyc", label: "KYC", private: ["wallet address", "raw attestation"], public: "KYC = TRUE" },
  { id: "country", label: "Country", private: ["actual country", "wallet address"], public: "COUNTRY ∈ ALLOWED" },
  { id: "domain", label: "OIDC Domain", private: ["email address", "OIDC JWT"], public: "ORG = EXAMPLE.COM" },
  { id: "balance", label: "Balance", private: ["exact balance", "source wallet"], public: "BALANCE ≥ THRESHOLD", next: true },
] as const;

export default function DisclosureDemo() {
  const [activeId, setActiveId] = useState<(typeof examples)[number]["id"]>(examples[0].id);
  const active = examples.find((example) => example.id === activeId) ?? examples[0];

  return (
    <div className="mt-14 sm:mt-18 border border-gold-line bg-[#0e1219]" aria-label="Private data to verified predicate example">
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gold-line" role="group" aria-label="Choose proof example">
        {examples.map((example) => (
          <button
            type="button"
            key={example.id}
            aria-pressed={example.id === activeId}
            onClick={() => setActiveId(example.id)}
            className={`min-h-[5.8rem] px-4 py-3 border-r last:border-r-0 border-gold-line font-mono text-[1.3rem] sm:text-[1.5rem] font-semibold transition-colors ${example.id === activeId ? "bg-gold/10 text-gold-2" : "bg-transparent text-[#9aa4b4] hover:text-cream"}`}
          >
            {example.label}{"next" in example && example.next && <small className="block text-[1.3rem] mt-1 text-gold">Next</small>}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_8rem_1fr] items-stretch min-h-[25rem]">
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="font-mono text-[1.3rem] sm:text-[1.4rem] font-bold tracking-[0.1em] uppercase text-[#7e8999] mb-6">Private input</div>
          {active.private.map((item) => <span key={item} className="font-serif text-[2.5rem] sm:text-[3.2rem] text-[#8d96a4] leading-[1.35] line-through decoration-gold/40">{item}</span>)}
        </div>
        <div className="relative flex items-center justify-center border-y md:border-y-0 md:border-x border-gold-line min-h-[7rem]">
          <span className="absolute inset-y-0 left-1/2 w-px bg-gold/50" aria-hidden="true" />
          <span className="relative bg-[#0e1219] px-3 py-2 font-mono text-[1.3rem] font-bold tracking-[0.1em] text-gold">ZK</span>
        </div>
        <div key={active.id} className="p-8 sm:p-10 flex flex-col justify-center animate-fade-slide">
          <div className="font-mono text-[1.3rem] sm:text-[1.4rem] font-bold tracking-[0.1em] uppercase text-[#7e8999] mb-6">Verified predicate</div>
          <strong className="font-mono text-[1.8rem] sm:text-[2.3rem] leading-[1.35] text-cream">{active.public}</strong>
          <span className="font-mono text-[1.3rem] sm:text-[1.4rem] text-[#8bd3a8] mt-5">● EVM verifiable</span>
        </div>
      </div>
    </div>
  );
}

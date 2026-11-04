# Website content review — November 4, 2026

## Audit and decisions

| Existing content | Decision | Result |
| --- | --- | --- |
| Hero positioning, typography, brand mark, HeroProof | Keep | One visual explanation of private input becoming an eligibility proof |
| Separate four-stage ProductFlow | Remove | Repeats the hero; delete its component and styles |
| Demo section and Request / Prove / Verify journey | Merge | Demo entry points in hero and final build section |
| People / AI Agents flow | Remove / relocate | Compact mobile and agent labels; SDK docs own deployment and trust assumptions |
| PolicyComposition | Replace | Two evidence-backed GIWA stories, without another diagram or combined-policy claim |
| Long implementation ledger | Merge | Platform capability line and direct circuit / SDK links |
| Repeated developer CTAs and footer pitch | Merge | One final build section with three clear starting points |
| App download links | Relocate | Secondary resources in the build section, freeing the hero for two primary paths |
| Recognition | Keep / correct | Restrained strip; GIWA GASOK is “KBW 2026 Showcase” per brief |
| Long developer guide, open accordions, section TOC | Replace | Four integration rows linking to maintained source documentation |
| Browser SDK | Relocate | Secondary developer-hub link preserves discovery without a fifth primary path |
| Header anchors | Update | Product, Featured Work, Developers, Demo; company links remain in the footer |

## Final architecture

Homepage has exactly four content sections: Hero, GIWA Dojang, Platform, Build. The footer contains only identity and utility navigation. HeroProof is the only proof-flow illustration.

The developer hub contains Mobile SDK, Agent SDK / MCP, Circuits & Verifiers, and GIWA Examples. It gives each path one short description and working-code/documentation links. Technical setup, support matrices, trust assumptions, and deployment details remain in the linked repositories.

Shared destinations live in `src/app/resources.ts`. `ResourceLink` supplies consistent external-link behavior. Per review feedback, all marketing link arrows (including brand-kit and app-download links) were removed. Text links use fine gold underlines with a small brand-inspired pixel detail on hover/focus; large CTA rows rely on typography and rules. Retired visual components and their CSS were removed rather than hidden.

## Evidence and claim boundaries

- [Gotgan KYC Vault](https://github.com/zkproofport/proofport-app-demo/blob/main/GIWA-VAULT-DEMO.md): inspected the current implementation notes. The example runs on GIWA Sepolia with a test attestation profile. The KYC address is not submitted to the vault; operational-wallet transactions and public inputs remain public. The homepage labels the example “GIWA Sepolia demo · Test attester”.
- [Private Balance Research](https://zkmopro.org/blog/private-balance-proofs-eas-noir-mopro/): the Mopro article was accessible through its [EAS tag page](https://zkmopro.org/blog/tags/eas/). It describes synthetic balances, a local chain, real proving and Solidity verification. The website labels it “Local research · Synthetic balances” and makes no phone-execution or public-deployment claim.
- [Dojangscan](https://dojangscan.com): linked as requested; HTTP 200 verified. No additional capability claims were inferred from the site.
- SDK destinations use the existing App SDK README and the Agent SDK / MCP package READMEs. Circuits, CIPs, and deployment records remain separately discoverable.
- Credential sources communicate breadth, not a shared release status. A support note links to the developer hub's circuit resources.
- Recognition wording follows the supplied brief: Base Batches 002 — Builder Track Top 50; Aztec / Noir — Ecosystem Grant; GIWA GASOK — KBW 2026 Showcase.
- No production Upbit KYC verification, official GIWA endorsement, GASOK finalist selection, composite proof deployment, or universal integration availability is claimed.

## Scope

The portal runner, circuit modules, providers, global styles, and proof-generation behavior are unchanged. The brand page updates its developer-navigation label and removes link arrows. No dependencies were added. Changes were reviewed locally before committing and pushing at the user’s request. No hosting deployment was performed as part of the implementation.

## Validation

- Production build passed. Existing optional MetaMask async-storage and WalletConnect pino-pretty dependency warnings remain in the unchanged portal dependency tree.
- Explicit TypeScript check passed: `tsc --noEmit --incremental false --types node,react,react-dom`. This avoids pre-existing duplicate implicit type directories in the local installation. Type checking runs after Next finishes generating `.next/types`.
- ESLint passed for changed TypeScript/TSX files; `git diff --check` passed.
- Generated HTML checks passed for home, developer hub, and brand: one H1 per page, unique IDs, valid ARIA heading references, valid internal fragment targets, and safe new-tab attributes. Home has four sections and one proof visual.
- All 12 shared public resource destinations returned HTTP 200, including demo, SDK READMEs, circuits, CIPs, deployment records, Dojangscan, Gotgan, and Mopro research.
- Desktop home, GIWA section, and developer hub were visually inspected in Chrome. The hub and GIWA section were also inspected at 390 × 844. Mobile menu opening, navigation to Featured Work, and automatic closing were verified.
- No marketing link arrow glyphs remain. CSS class references were checked and unused references removed.
- The proof runner and circuit files have no diff. Real-wallet proof generation was not rerun because this change is presentation-only.
- Local preview remains on `http://127.0.0.1:3000` for review.

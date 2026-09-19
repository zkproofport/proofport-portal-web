# ZKProofport website refinement

## Content classification before editing

| Existing content | Decision | Destination |
| --- | --- | --- |
| Product positioning and reduced disclosure | Keep / rewrite | Homepage hero and core flow |
| Interactive predicate catalog and individual CIPs | Move deeper | Developer guide links to CIPs and circuit documentation |
| Browser, mobile and agent portal details | Move deeper | Developer guide; two compact proving paths on homepage |
| Six-stage architecture explorer | Remove / rewrite | Four-stage product flow; source and integration documentation linked from developer guide |
| Protocol names, package list, deployment records | Move deeper | Developer guide |
| Financial and combined conditions | Rewrite | Explicitly marked future policies, separate from supported proofs |
| Open-source and security matrix | Rewrite / move deeper | Compact implementation evidence; trust-model notes in developer guide |
| Large recognition cards | Rewrite | Restrained program-selection / ecosystem-support strip |
| Founder biographies and OpenStoa company narrative | Remove from product homepage | Link to Masse Labs |
| Existing demos with inconsistent labels | Rewrite | Exactly two “Try the Demo” links to https://demo.zkproofport.app |

## Evidence and claim boundaries

- Brand reference: existing `public/logo.png` and local KBW deck (`giwa-showcase/exports/png-1920x1080/slide-03.png`). No separate business-card image was included in the attachment.
- Demo: https://demo.zkproofport.app returned HTTP 200 during this review. Homepage copy describes the demo generically and does not promise specific circuits or completion without prerequisites.
- Mobile SDK: `proofport-app-sdk/README.md` lists Coinbase KYC, country and OIDC domain support. The homepage uses only high-level examples; full circuit details stay in the SDK docs.
- Agent path: `proofport-ai/README.md` distinguishes attested Nitro deployments from standard-server endpoints. Hardware guarantees require endpoint configuration and validated attestation; proof validity alone is insufficient.
- GIWA: `circuits/README.md` and `CIPs/CIPS/cip-4.md` describe a GIWA Sepolia test-attester PoC. No production Dojang integration or official partnership is claimed.
- Balance predicates and combined policies remain future directions.
- Public outputs may reveal information. Neither the homepage nor the developer guide claims complete unlinkability, zero disclosure, an independent security audit, or identical trust assumptions for local and hosted proving.

## Final structure

1. Hero — product position, demo and developer entry points.
2. Core flow — trusted fact, proving, eligibility proof, application action.
3. See it in action — dedicated demo link and an explicitly illustrative journey.
4. People and agents — parallel local and TEE-capable paths.
5. Composable eligibility — supported, prototype and future conditions separated.
6. Built for real applications — implementation evidence, open standards and recognition.

Closing developer CTA and “Built by Masse Labs” reference live in the footer. The portal's proof-generation logic is outside this change.

## Files changed

- `src/app/page.tsx`: replaces the long landing page with six product sections; two demo CTAs.
- `src/app/product.module.css`: scoped navy / warm-gold design system; vertical mobile flows; reduced-motion support.
- `src/app/components/Header.tsx`: product navigation and developer entry point.
- `src/app/components/ProductVisuals.tsx`: shared logo, SVG connectors, proof illustration and reusable responsive flows.
- `src/app/developers/page.tsx`: integration routes, trust models and links to existing technical documentation.
- `src/app/layout.tsx`: Inter typography, product metadata, company attribution and qualified agent-proving structured data.
- `src/app/globals.css`: removes retired homepage styles; portal-specific CSS remains byte-for-byte unchanged.
- Removed `ArchitectureFlow.tsx` and `DisclosureDemo.tsx`: obsolete homepage explorers replaced by the simpler flow and developer guide.
- `README.md` and this review: route guide, content classification and validation notes.

## Validation

- Production build passed. Homepage and developer guide are statically generated (114 kB first-load JS each).
- ESLint passed for all changed TSX files.
- Full TypeScript check passed with `--types node,react,react-dom --noEmit --incremental false`. The default implicit type scan hits pre-existing duplicate directories (`json-schema 2`, `json5 2`, `ms 2`, `trusted-types 2`) in local `node_modules/@types`.
- Build retains existing portal dependency warnings for optional MetaMask async-storage and WalletConnect pino-pretty modules; no portal dependency changes were made.
- Generated HTML checks passed: six homepage sections; exactly two demo links; `_blank` and `noopener noreferrer`; all internal paths and anchors; image assets; one H1 per page; unique IDs; ARIA heading references; valid JSON-LD; no demo iframe.
- Homepage rendered copy is approximately 320 words after the revision. Founder résumés, detailed CIPs and prohibited absolute privacy claims are absent.
- Native Chrome screenshots were inspected with responsive viewport settings of 1440×900, 1920×1080 and 390×844. Desktop inspection covered the hero, core flow and converging diagrams; mobile inspection covered hero wrapping, the vertical core flow, parallel proving lanes and stacked policy branches. Screenshots were reviewed in the tool rather than exported as image artifacts.
- Mobile navigation was tested: open, Escape-to-close with focus returned to Menu, and section navigation with automatic close. Device emulation was disabled and the browser's original 90% zoom restored after verification.

## Revision: editorial composition and larger typography

The first redesign still used undersized navigation, explanatory copy and diagram labels. Repeated numbered eyebrows, a framed hero illustration, two horizontal proving rows and a status table made the product feel too much like a generic landing-page template.

This revision keeps the existing pages, brand palette, links and technical-content boundaries while changing the composition:

- Removes the hero input/output panels, core credential container, policy table, composition box and repeated small numbered eyebrows.
- Makes the original ZKProofport mark the center of an open, vertical hero transformation.
- Retains the four-stage core flow as a full-width protocol diagram, with a larger result and value statement.
- Replaces the two proving rows with equal People / AI agents lanes that converge at one Application output.
- Replaces the policy table with a two-branch composition diagram. Address-control semantics stay precise; GIWA remains a test-attester prototype and balance/composite proofs remain future work.
- Compresses implementation detail into a typographic infrastructure strip with Docs, GitHub and CIPs links.
- Adds Product, How it works, Demo, Developers and Team navigation. Team points to `https://masselabs.com/#team`, verified against the public HTML (HTTP 200, existing `id="team"`). The same Team destination and Built by Masse Labs are available in the footer.
- Preserves exactly two external “Try the Demo” CTAs: hero and dedicated demo section. Header Demo navigates to the local demo section.
- Adds a keyboard-accessible mobile navigation menu with Escape-to-close and close-on-navigation behavior.

### Type and spacing changes

| Role | First redesign | Revision |
| --- | --- | --- |
| Desktop hero | 55–82 px | 80–110 px |
| Major desktop headings | 40–60 px | 56–72 px |
| Primary body | 16.5–18.5 px | 22–24 px |
| Secondary text | 12–15 px | 18–21 px |
| Desktop navigation | 14 px | 17 px |
| Buttons | 13 px | 18 px |
| Mobile hero | 43.5–53 px | 48–58 px |
| Mobile major headings | 36 px | 38–46 px |
| Mobile body | 15–16.5 px | 18–21 px |
| Desktop section padding | 108 px | 140–200 px |

The core architecture stacks vertically below 1100 px; mobile People and Agents use two readable vertical lanes. The composition branches stack below 680 px, with an explicit combined expression instead of a shrunken desktop merge. Both desktop merge connectors use exact 25% / 75% branch centers and a 50% output, one 1.5 px stroke, and matching 6 px arrowheads.

Revision validation: production build, changed-file ESLint and explicit-standard-types TypeScript check passed. Rendered HTML checks passed for sections, demo counts, external link attributes, Team destinations, all internal routes / anchors and ARIA references. Native Chrome capture recovered, so desktop/mobile visual inspection and mobile menu checks were completed without alternate browser automation. No repeated card grid, decorative gradients, floating effects or pill system remains on the homepage.

### Follow-up: fewer directional symbols

Removed arrows from all homepage and developer-guide links and buttons. Text links use a restrained underline; the company destination is labeled “Team · Masse Labs.” Replaced repeated People / Agents arrows and the hero input arrow with quiet stems, and removed arrows between policy labels and their conditions. Six directional arrowheads remain on desktop: three in the core architecture, one at the hero proof output, and one at each converging diagram. Production build, changed-file ESLint and rendered-HTML checks passed; the updated People / Agents composition was visually inspected in Chrome.

### Final revision: connected diagram geometry

The subsequent revision replaces the isolated stems with continuous connections and explicit processing nodes. People and Agents now converge into one shared Eligibility proof, followed by Application. Both branches have equal-width columns, matching stage heights, and identical paths from 25% / 75% to the 50% junction. The central divider and duplicated proof outputs are removed.

The hero uses the same processing-node and connector language. Core-flow stages use identical 32px / 112px / 32px rows with 16px gaps, placing each connector on the middle row's center. Policy composition uses an explicit AND gate rather than addition; both conditions and their merge remain visible on mobile. Lines use a 1.5px stroke and directional heads use 5px arms. Buttons and resource links retain their simpler text treatment.

Build, changed-file lint, explicit-standard-types TypeScript, style-reference and rendered-HTML checks passed. Algebraic checks confirmed equal branch runs for diagram widths of 272, 342, 584 and 1120px. This final geometry revision has not been visually verified: native browser control was repeatedly interrupted, and the separate browser connection timed out. Earlier screenshot checks above refer to the preceding revisions.

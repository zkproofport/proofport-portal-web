// Run from the project root: node scripts/generate-social-image.mjs
import sharp from "sharp";

const artwork = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#071827"/>
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="72" y="104" fill="#f2f3ee" font-size="32" font-weight="600">ZKProofport</text>
    <text x="72" y="246" fill="#f2f3ee" font-size="72" letter-spacing="-2">Private eligibility</text>
    <text x="72" y="330" fill="#f2f3ee" font-size="72" letter-spacing="-2">for humans</text>
    <text x="72" y="414" fill="#cba65e" font-size="72" letter-spacing="-2">and AI agents.</text>
    <path d="M72 518H1128" stroke="#2a4051"/>
    <text x="72" y="568" fill="#9bafc1" font-size="22">zkproofport.com</text>
    <text x="1128" y="568" fill="#9bafc1" font-size="22" text-anchor="end">Built by Masse Labs</text>
  </g>
</svg>`);

const logo = await sharp("public/logo.png")
  .resize(256, 256, { fit: "contain" })
  .png()
  .toBuffer();

await sharp(artwork)
  .composite([{ input: logo, left: 840, top: 198 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og-image.png");

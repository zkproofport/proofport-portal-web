# ZKProofport Portal

This is the **Proof Portal** web application for the ZKProofport protocol. It provides the user interface where users securely generate ZK proofs within their browser.

## Overview

This application is designed to be launched within an **iFrame modal** when invoked by a dApp using the ZKProofport SDK. Inside the Portal, users connect their wallet, fetch the necessary on-chain data (like Coinbase KYC attestations via EAS), generate a Zero-Knowledge proof locally, and securely return the result to the originating dApp via `postMessage`.

When accessed directly via its URL, the Portal displays an informational page with features disabled.

## How it Works

1.  **Initialization:** The Portal loads inside an iFrame, receiving the dApp's `origin` and a unique `nonce` via URL parameters.
2.  **Wallet Connection:** The user connects their wallet (e.g., MetaMask) using standard libraries like RainbowKit/wagmi.
3.  **Data Fetching:** The Portal queries relevant sources (like EASscan or an RPC endpoint) to find the required on-chain attestation data linked to the connected wallet address.
4.  **Proof Generation:** Using the fetched data and user signature (obtained via the connected wallet), the Portal executes the appropriate Noir ZK circuit (compiled to WASM) locally in the browser via `@noir-lang/noir_js` and `@aztec/bb.js`.
5.  **Result Transmission:** Upon successful proof generation, the Portal sends the `proof`, `publicInputs`, and `meta` back to the parent window (the dApp) using `window.parent.postMessage`, targeting the specific `origin` provided during initialization. It also handles requests from the user to close the portal via a dedicated `postMessage` type.

## Technology Stack

* **Framework:** Next.js (App Router)
* **UI:** React, Tailwind CSS
* **Web3:** wagmi, RainbowKit, ethers.js
* **ZK Proving:** @aztec/bb.js (UltraHonk Backend), @noir-lang/noir_js

## Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/zkproofport/proofport-portal-web.git](https://github.com/zkproofport/proofport-portal-web.git)
    cd proofport-portal-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure environment variables:**
    Create a `.env.local` file in the project root and add the necessary variables. An RPC URL for the relevant network (e.g., Base) is required.
    ```env
    NEXT_PUBLIC_BASE_RPC_URL=https://your_base_rpc_url_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The Portal will be accessible at `http://localhost:3000` (or your configured port). You can test the UI directly or configure a local demo dApp to point its SDK's `PROOF_PORTAL_URL` to this local address for integration testing.

## Contributing

Bug reports and feature suggestions are welcome via GitHub Issues.

## License

[MIT](LICENSE)
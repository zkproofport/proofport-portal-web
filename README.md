# ZKProofport Portal

This is the **Proof Portal** web application for the ZKProofport protocol. It provides a **generalized** user interface where users can securely generate ZK proofs for various circuits within their browser.

## Overview

This application is designed to be launched within an **iFrame modal** when invoked by a dApp using the ZKProofport SDK. It functions as a modular **"Proof Runner."**

Based on a `circuitId` passed by the SDK, the Portal loads the corresponding circuit module. This module defines all the steps: fetching necessary on-chain data (e.g., Coinbase KYC attestations via EAS, World ID proofs, etc.), executing the correct ZK circuit locally, and securely returning the result to the originating dApp via `postMessage`.

When accessed directly via its URL, the Portal displays an informational page with features disabled.

## How it Works

<img width="4736" height="1618" alt="Untitled diagram-2025-10-18-081413" src="https://github.com/user-attachments/assets/84cfbdeb-1c4c-48ea-94ae-e06bf769b90b" />

1.  **Initialization:** The Portal loads inside an iFrame, receiving the dApp's `origin`, a unique `nonce`, and the required **`circuitId`** via URL parameters.
2.  **Module Resolution:** The Portal uses the `circuitId` to resolve and load the corresponding circuit module from its internal library (`/lib/circuits`).
3.  **Wallet Connection:** The user connects their wallet (e.g., MetaMask) using standard libraries like RainbowKit/wagmi.
4.  **Data Fetching:** The loaded **circuit module** executes its specific logic, querying relevant sources (like EASscan or an RPC endpoint) to find the required on-chain data linked to the connected wallet address.
5.  **Proof Generation:** Using the fetched data and user signature (obtained via the connected wallet), the Portal executes the specific Noir ZK circuit (compiled to WASM) defined by the module locally in the browser via `@noir-lang/noir_js` and `@aztec/bb.js`.
6.  **Result Transmission:** Upon successful proof generation, the Portal sends the `proof`, `publicInputs`, and `meta` (which now includes the `circuitId` for verification) back to the parent window (the dApp) using `window.parent.postMessage`, targeting the specific `origin`. It also handles requests from the user to close the portal via a dedicated `zkp-close-request` message.

## Technology Stack

  * **Framework:** Next.js
  * **UI:** React, Tailwind CSS
  * **Web3:** wagmi, RainbowKit, ethers.js
  * **ZK Proving:** @aztec/bb.js (UltraHonk Backend), @noir-lang/noir\_js
  * **Architecture:** Modular (per-circuit) proof generation.

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
    Create a `.env.local` file in the project root. Different circuits may require different RPC endpoints. For the included `coinbase_kyc` circuit, an RPC URL for Base is required.

    ```env
    NEXT_PUBLIC_BASE_RPC_URL=https://your_base_rpc_url_here
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The Portal will be accessible at `http://localhost:3000` (or your configured port). You must configure a local demo dApp (or the main SDK) to point its `PROOF_PORTAL_URL` to this local address for integration testing, as the Portal requires URL parameters (`origin`, `nonce`, `circuitId`) to function.

## Contributing

Bug reports and feature suggestions are welcome via GitHub Issues.

## License

[MIT](https://www.google.com/search?q=LICENSE)
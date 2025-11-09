import type { UseWalletClientReturnType } from "wagmi";

export type Step = { action: string; done: string };
export type LogType = "info" | "success" | "error" | "highlight" | "note";

export type Logger = {
  append: (msg: string, type?: LogType, interactive?: boolean) => void;
  updateLast: (msg: string, type?: LogType) => void;
  markStep: (i: number) => void;
};

export type PortalContext = {
  address: `0x${string}` | null | undefined;
  walletClient: UseWalletClientReturnType['data'];
  rpcUrl: string;
  origin: string;
  nonce: string;
};

export type CircuitModule = {
  id: string;
  title: string;
  eyebrow?: string;
  description: string;
  steps: Step[];
  prove: (
    ctx: PortalContext,
    log: Logger
  ) => Promise<{ proof: string; publicInputs: string[] }>;
};
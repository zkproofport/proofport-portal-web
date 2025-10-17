export type LogType = "info" | "success" | "error" | "highlight" | "note";

export type PortalContext = {
  rpcUrl: string;
  address?: `0x${string}` | null;
};

export type Step = { action: string; done: string };

export type Logger = {
  append: (msg: string, type?: LogType, interactive?: boolean) => void;
  updateLast: (msg: string, type?: LogType) => void;
  markStep: (i: number) => void;
};

export type CircuitModule = {
  id: string;
  title: string;
  eyebrow?: string;
  description: string;
  steps: Step[];
  prove: (ctx: PortalContext, log: Logger) => Promise<{ proof: any; publicInputs: any }>;
};

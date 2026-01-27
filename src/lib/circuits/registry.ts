
import type { CircuitModule } from "./types";
import { coinbaseKycModule } from "./coinbaseKycModule";
import { coinbaseKycSolanaModule } from "./coinbaseKycSolanaModule";

const REGISTRY: Record<string, CircuitModule> = {
  [coinbaseKycModule.id]: coinbaseKycModule,
  [coinbaseKycSolanaModule.id]: coinbaseKycSolanaModule,
};

export const resolveCircuit = (id?: string | null): CircuitModule | null => {
  return id ? REGISTRY[id] || null : null;
};
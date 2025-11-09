
import type { CircuitModule } from "./types";
import { coinbaseKycModule } from "./coinbaseKycModule";

const REGISTRY: Record<string, CircuitModule> = {
  [coinbaseKycModule.id]: coinbaseKycModule,
};

export const resolveCircuit = (id?: string | null): CircuitModule | null => {
  return id ? REGISTRY[id] || null : null;
};
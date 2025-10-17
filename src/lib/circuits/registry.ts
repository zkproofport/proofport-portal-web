import { coinbaseKyc } from "./coinbaseKyc";
import type { CircuitModule } from "./types";

const REGISTRY: Record<string, CircuitModule> = {
  [coinbaseKyc.id]: coinbaseKyc,
};

export const resolveCircuit = (id?: string | null) => (id ? REGISTRY[id] || null : null);
export const availableCircuits = () => Object.values(REGISTRY);

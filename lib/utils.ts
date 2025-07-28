import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCost = (cost: number) => `$${cost.toFixed(6)}`;
export const formatLatency = (latency: number) => `${latency}ms`;

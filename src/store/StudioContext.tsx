import { createContext, useContext, type ReactNode } from "react";
import { useStudioState, type StudioState } from "./useStudio";

const StudioContext = createContext<StudioState | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const state = useStudioState();
  return <StudioContext.Provider value={state}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioState {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be inside StudioProvider");
  return ctx;
}

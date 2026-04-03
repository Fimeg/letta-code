// src/cli/hooks/useLaceMode.ts
// Manage intimate/professional border mode preference

import { useCallback, useEffect, useState } from "react";

export type LaceMode = "professional" | "intimate";

const STORAGE_KEY = "letta-code-lace-mode";

export function useLaceMode() {
  const [mode, setModeState] = useState<LaceMode>(() => {
    // Initialize from localStorage or default to professional
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "intimate" || saved === "professional") {
        return saved;
      }
    }
    return "professional";
  });

  // Persist changes to localStorage
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  const setMode = useCallback((newMode: LaceMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === "professional" ? "intimate" : "professional"));
  }, []);

  const setModeFromString = useCallback((value: string): boolean => {
    if (value === "professional" || value === "intimate") {
      setModeState(value);
      return true;
    }
    return false;
  }, []);

  return {
    mode,
    setMode,
    toggleMode,
    setModeFromString,
    isIntimate: mode === "intimate",
    isProfessional: mode === "professional",
  };
}

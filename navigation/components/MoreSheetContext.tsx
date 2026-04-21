import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type MoreSheetMode = "menu" | "search";

type MoreSheetContextValue = {
  isMoreSheetOpen: boolean;
  mode: MoreSheetMode;
  openMoreSheet: () => void;
  openSearchSheet: () => void;
  closeMoreSheet: () => void;
  toggleMoreSheet: () => void;
};

const MoreSheetContext = createContext<MoreSheetContextValue | null>(null);

export function MoreSheetProvider({ children }: { children: React.ReactNode }) {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [mode, setMode] = useState<MoreSheetMode>("menu");

  const openMoreSheet = useCallback(() => {
    setMode("menu");
    setIsMoreSheetOpen(true);
  }, []);
  const openSearchSheet = useCallback(() => {
    setMode("search");
    setIsMoreSheetOpen(true);
  }, []);
  const closeMoreSheet = useCallback(() => {
    setIsMoreSheetOpen(false);
    setMode("menu");
  }, []);
  const toggleMoreSheet = useCallback(
    () => {
      setMode("menu");
      setIsMoreSheetOpen((current) => !current);
    },
    [],
  );

  const value = useMemo(
    () => ({
      isMoreSheetOpen,
      mode,
      openMoreSheet,
      openSearchSheet,
      closeMoreSheet,
      toggleMoreSheet,
    }),
    [
      closeMoreSheet,
      isMoreSheetOpen,
      mode,
      openMoreSheet,
      openSearchSheet,
      toggleMoreSheet,
    ],
  );

  return (
    <MoreSheetContext.Provider value={value}>{children}</MoreSheetContext.Provider>
  );
}

export function useMoreSheet() {
  const context = useContext(MoreSheetContext);
  if (!context) {
    throw new Error("useMoreSheet must be used within a MoreSheetProvider");
  }

  return context;
}

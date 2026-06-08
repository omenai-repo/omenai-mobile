import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type MoreSheetContextValue = {
  isMoreSheetOpen: boolean;
  openMoreSheet: () => void;
  closeMoreSheet: () => void;
  toggleMoreSheet: () => void;
};

const MoreSheetContext = createContext<MoreSheetContextValue | null>(null);

export function MoreSheetProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const openMoreSheet = useCallback(() => {
    setIsMoreSheetOpen(true);
  }, []);
  const closeMoreSheet = useCallback(() => {
    setIsMoreSheetOpen(false);
  }, []);
  const toggleMoreSheet = useCallback(
    () => {
      setIsMoreSheetOpen((current) => !current);
    },
    [],
  );

  const value = useMemo(
    () => ({
      isMoreSheetOpen,
      openMoreSheet,
      closeMoreSheet,
      toggleMoreSheet,
    }),
    [
      closeMoreSheet,
      isMoreSheetOpen,
      openMoreSheet,
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

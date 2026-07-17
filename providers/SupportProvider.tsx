import React, { createContext, useContext, useState, useMemo } from "react";

interface SupportContextType {
  isOpen: boolean;
  openSupport: () => void;
  closeSupport: () => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export function SupportProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState(false);

  const openSupport = () => setIsOpen(true);
  const closeSupport = () => setIsOpen(false);

  const contextValue = useMemo(
    () => ({ isOpen, openSupport, closeSupport }),
    [isOpen],
  );

  return (
    <SupportContext.Provider value={contextValue}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error("useSupport must be used within a SupportProvider");
  }
  return context;
}

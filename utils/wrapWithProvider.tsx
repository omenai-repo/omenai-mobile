import React from "react";
import { HighRiskProvider, LowRiskProvider } from "providers/ConfigCatProvider";

export const wrapWithHighRisk = (Component: React.ComponentType<any>) => {
  const WrappedComponent = (props: any) => (
    <HighRiskProvider>
      <Component {...props} />
    </HighRiskProvider>
  );
  WrappedComponent.displayName = `wrapWithHighRisk(${
    Component.displayName || Component.name || "Component"
  })`;
  return WrappedComponent;
};

export const wrapWithLowRisk = (Component: React.ComponentType<any>) => {
  const WrappedComponent = (props: any) => (
    <LowRiskProvider>
      <Component {...props} />
    </LowRiskProvider>
  );
  WrappedComponent.displayName = `wrapWithLowRisk(${
    Component.displayName || Component.name || "Component"
  })`;
  return WrappedComponent;
};

import { ConfigCatProvider } from "configcat-react";
import React from "react";

const HIGH_RISK_SDK_KEY =
  process.env.NODE_ENV === "production"
    ? (process.env.EXPO_PUBLIC_CONFIGCAT_HIGH_RISK_SDK_KEY as string)
    : (process.env.EXPO_PUBLIC_CONFIGCAT_STAGING_HIGH_RISK_SDK_KEY as string);

const LOW_RISK_SDK_KEY =
  process.env.NODE_ENV === "production"
    ? (process.env.EXPO_PUBLIC_CONFIGCAT_LOW_RISK_SDK_KEY as string)
    : (process.env.EXPO_PUBLIC_CONFIGCAT_STAGING_LOW_RISK_SDK_KEY as string);

export function HighRiskProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigCatProvider sdkKey={HIGH_RISK_SDK_KEY} options={{ pollIntervalSeconds: 60 }}>
      {children}
    </ConfigCatProvider>
  );
}

export function LowRiskProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigCatProvider sdkKey={LOW_RISK_SDK_KEY} options={{ pollIntervalSeconds: 60 }}>
      {children}
    </ConfigCatProvider>
  );
}

import { useFeatureFlag as useConfigCatFlag } from "configcat-react";

export function useHighRiskFeatureFlag(flagName: string, defaultValue = false) {
  return useConfigCatFlag(flagName, defaultValue);
}

export function useLowRiskFeatureFlag(flagName: string, defaultValue = false) {
  return useConfigCatFlag(flagName, defaultValue);
}

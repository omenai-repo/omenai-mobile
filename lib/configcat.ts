import { highRiskconfigCatClient, lowRiskConfigCatClient } from "../config/configcat.config";

export async function fetchConfigCatValue(
  featureKeyword: string,
  riskType: "high" | "low"
): Promise<boolean> {
  const isFeatureEnabled = await (riskType === "high"
    ? highRiskconfigCatClient
    : lowRiskConfigCatClient
  ).getValueAsync(featureKeyword, false);
  return isFeatureEnabled;
}

import { vexo, customEvent, identifyDevice } from "vexo-analytics";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Device from "expo-device";

/**
 * Get common event metadata
 */
const getEventMetadata = () => ({
  app_version: Constants.expoConfig?.version || "unknown",
  platform: Platform.OS,
  device_model: Device.modelName || "unknown",
  timestamp: new Date().toISOString(),
});

export const Analytics = {
  /**
   * Initialize Vexo Analytics
   * @param apiKey Vexo API Key
   */
  init: (apiKey: string) => {
    if (apiKey) {
      vexo(apiKey);
    }
  },

  /**
   * Identify the current user device
   * @param userId Unique user ID
   */
  identify: (userId: string) => {
    identifyDevice(userId);
  },

  /**
   * Track a custom event with automatic metadata enrichment
   * @param eventName Name of the event
   * @param params Additional parameters
   */
  track: (eventName: string, params: object = {}) => {
    const enrichedParams = {
      ...getEventMetadata(),
      ...params,
    };
    customEvent(eventName, enrichedParams);
  },
};

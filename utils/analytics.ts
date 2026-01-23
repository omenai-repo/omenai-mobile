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

  /**
   * Track an API request with full context
   * @param endpoint API endpoint
   * @param method HTTP method
   * @param payload Request payload
   * @param additionalContext Any additional context
   */
  trackRequest: (
    endpoint: string,
    method: string,
    payload?: object,
    additionalContext: object = {},
  ) => {
    customEvent("api_request", {
      ...getEventMetadata(),
      endpoint,
      method,
      request_payload: payload,
      ...additionalContext,
    });
  },

  /**
   * Track an API response with full context
   * @param endpoint API endpoint
   * @param method HTTP method
   * @param statusCode Response status code
   * @param response Response payload
   * @param additionalContext Any additional context
   */
  trackResponse: (
    endpoint: string,
    method: string,
    statusCode: number,
    response?: object,
    additionalContext: object = {},
  ) => {
    const eventName = statusCode >= 400 ? "api_error" : "api_success";
    customEvent(eventName, {
      ...getEventMetadata(),
      endpoint,
      method,
      status_code: statusCode,
      response_payload: response,
      ...additionalContext,
    });
  },

  /**
   * Track an error event
   * @param message Error message
   * @param context Additional context about where the error occurred
   */
  trackError: (message: string, context: object = {}) => {
    customEvent("error", {
      ...getEventMetadata(),
      message,
      ...context,
    });
  },
};

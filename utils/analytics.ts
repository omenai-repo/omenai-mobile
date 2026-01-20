import { vexo, customEvent, identifyDevice } from "vexo-analytics";

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
   * Track a custom event
   * @param eventName Name of the event
   * @param params Additional parameters
   */
  track: (eventName: string, params: object = {}) => {
    customEvent(eventName, params);
  },

  /**
   * Track an error event
   * @param message Error message
   * @param context Additional context about where the error occurred
   */
  trackError: (message: string, context: object = {}) => {
    customEvent("error", { message, ...context });
  },
};

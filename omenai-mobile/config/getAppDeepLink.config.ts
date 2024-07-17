export const getAppDeepLink = () => {
    if (process.env.NODE_ENV === "development") {
      return process.env.DEEPLINK_DEVELOPMENT!;
    } else {
      return process.env.DEEPLINK_PRODUCTION!;
    }
};
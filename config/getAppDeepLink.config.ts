export const getAppDeepLink = () => {
  if (process.env.EXPO_PUBLIC_ENV === "development") {
    return process.env.EXPO_PUBLIC_DEEPLINK_DEVELOPMENT!;
  } else {
    return process.env.EXPO_PUBLIC_DEEPLINK_PRODUCTION!;
  }
};

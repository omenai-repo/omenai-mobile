import { utils_getAsyncData } from "#utils/app/utils_asyncStorage";

export const utils_hasCompletedWelcomeOnboarding = async (): Promise<boolean> => {
  const { value } = await utils_getAsyncData("isOnboarded");
  return value === "true";
};

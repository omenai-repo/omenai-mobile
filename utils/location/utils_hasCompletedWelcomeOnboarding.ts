import { storage } from "#store/mmkv";

export const utils_hasCompletedWelcomeOnboarding =
  async (): Promise<boolean> => {
    return storage.getBoolean("isOnboarded") ?? false;
  };

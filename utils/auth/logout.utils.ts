import { useAppStore } from "#store/app/appStore";
import { utils_clearLocalStorage } from "#utils/app/utils_asyncStorage";
import { deleteSecureItem } from "./secureStore";
import { resetAllLoginFormLoading } from "#hooks/auth/login/resetLoginFormLoading";
import { clearPendingDeepLinks } from "#features/deeplink/deepLinkPending";

export const logout = async () => {
  utils_clearLocalStorage();
  await deleteSecureItem("session_token");

  resetAllLoginFormLoading();
  clearPendingDeepLinks();
  useAppStore.setState({ isLoggedIn: false, userSession: null });
};

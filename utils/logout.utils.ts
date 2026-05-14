import { useAppStore } from "../store/app/appStore";
import { utils_clearLocalStorage } from "./utils_asyncStorage";
import { deleteSecureItem } from "./secureStore";
import { resetAllLoginFormLoading } from "../hooks/login/resetLoginFormLoading";

export const logout = async () => {
  utils_clearLocalStorage();
  await deleteSecureItem("session_token");

  resetAllLoginFormLoading();
  useAppStore.setState({ isLoggedIn: false, userSession: null });
};

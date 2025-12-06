import { useAppStore } from "../store/app/appStore";
import { utils_clearLocalStorage } from "./utils_asyncStorage";

export const logout = async () => {
  utils_clearLocalStorage();

  useAppStore.setState({ isLoggedIn: false, userSession: null });
};

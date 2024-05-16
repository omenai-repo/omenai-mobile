import { useAppStore } from "../store/app/appStore"
import { clearLocalStorage, getAsyncData } from "./asyncStorage.utils"

export const logout = async () => {
    clearLocalStorage()

    useAppStore.setState({isLoggedIn: false, userSession: null})
}
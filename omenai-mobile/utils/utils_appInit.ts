import { useAppStore } from "../store/app/appStore"
import { utils_getAsyncData } from "./utils_asyncStorage"

export const utils_appInit = async () => {
    const userData = await utils_getAsyncData('userSession')

    if(userData.isOk === false) return false

    if(userData.value){
        const value = JSON.parse(userData.value)
        useAppStore.setState({isLoggedIn: true, userSession: value, userType: value.role})
    }
}
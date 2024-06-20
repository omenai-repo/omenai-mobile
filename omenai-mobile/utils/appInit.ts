import { useAppStore } from "../store/app/appStore"
import { getAsyncData } from "./asyncStorage.utils"

export const appInit = async () => {
    const userData = await getAsyncData('userSession')

    if(userData.isOk === false) return false

    if(userData.value){
        const value = JSON.parse(userData.value)
        useAppStore.setState({isLoggedIn: true, userSession: value, userType: value.role})
    }
}
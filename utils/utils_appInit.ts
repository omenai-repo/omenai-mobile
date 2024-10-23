import { useAppStore } from "../store/app/appStore"
import { logout } from "./logout.utils";
import { utils_getAsyncData } from "./utils_asyncStorage"

export const utils_appInit = async () => {
    const userData = await utils_getAsyncData('userSession');
    const loginDate = await utils_getAsyncData('loginTimeStamp');

    const isSessionValid = sessionValidator(JSON.parse(loginDate?.value));

    if(isSessionValid){
        if(userData.value){
            const value = JSON.parse(userData.value)
            useAppStore.setState({isLoggedIn: true, userSession: value, userType: value.role})
        }
    }else{
        logout()
    }
}

const sessionValidator = (loginDate: string) => {
    const currentDate = new Date();
    const parsedLoginData = new Date(loginDate); //parse login date

    const timeDifference = Math.abs(currentDate - parsedLoginData); // Difference in milliseconds
    const oneHour = 60 * 60 * 1000; // we convert one hour to millisecond

    return oneHour >= timeDifference;
}
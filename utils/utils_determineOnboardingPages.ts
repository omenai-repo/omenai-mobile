import { utils_getAsyncData } from "./utils_asyncStorage"

export const utils_determineOnboardingPages = async () => {
    const { value } = await utils_getAsyncData('isOnboarded');

    if(value){
        const isOnboarded = JSON.parse(value);
        if(isOnboarded === true) return true
    }
    return false
}
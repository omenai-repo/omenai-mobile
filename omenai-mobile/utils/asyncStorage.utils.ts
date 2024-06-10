import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAsyncData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
        return true
    } catch (e) {
        console.error('Failed to save data');
    }

    return false
};

export const getAsyncData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return {isOk: true, value:value};
        } else {
            console.log('No data found for key:', key);
    }
    } catch (e) {
        console.error('Failed to fetch the data');
    }

    return {
        isOk: false
    }
};

export const clearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Local storage cleared successfully');
    } catch (e) {
      console.error('Failed to clear local storage');
    }
};

export const handleFetchUserID = async () => {
    const userdata = await getAsyncData('userSession');
    if(userdata.value){
        const userId = JSON.parse(userdata.value).id
        return(userId)
    }

    return
}
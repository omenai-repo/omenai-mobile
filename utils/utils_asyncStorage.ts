import * as SecureStore from "expo-secure-store";

export const utils_storeAsyncData = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch {
    console.error("Failed to save data");
  }

  return false;
};

export const utils_getAsyncData = async (key: string) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value !== null) {
      return { isOk: true, value: value };
    } else {
      console.log("No data found for key:", key);
    }
  } catch {
    console.error("Failed to fetch the data");
  }

  return {
    isOk: false,
  };
};

export const utils_clearLocalStorage = async () => {
  try {
    const keys = ["userSession", "loginTimeStamp"];
    await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
  } catch {
    console.error("Failed to clear secure storage");
  }
};

export const utils_handleFetchUserID = async () => {
  const userdata = await utils_getAsyncData("userSession");
  if (userdata.value) {
    const userId = JSON.parse(userdata.value).id;
    return userId;
  }

  return;
};
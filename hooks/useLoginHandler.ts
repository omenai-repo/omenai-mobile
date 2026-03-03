import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { loginAccount } from "#services/login/loginAccount";
import { utils_storeAsyncData } from "#utils/utils_asyncStorage";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/modal/modalStore";
import { screenName } from "#constants/screenNames.constants";
import { useBiometrics } from "#hooks/useBiometrics";
import { Analytics } from "#utils/analytics";
import { saveSecureItem } from "#utils/secureStore";

type UserType = "individual" | "gallery" | "artist";

type LoginData = {
  email: string;
  password: string;
};

const USER_ID_MAP = {
  individual: "user_id",
  gallery: "gallery_id",
  artist: "artist_id",
} as const;

export function useLoginHandler(userType: UserType) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { setUserSession, setUserType, setIsLoggedIn, expoPushToken } =
    useAppStore();
  const { updateModal } = useModalStore();
  const {
    isBiometricSupported,
    isBiometricEnabled,
    saveCredentials,
    getCredentials,
    authenticate,
    getStoredEmail,
    deleteCredentials,
  } = useBiometrics();

  const finalizeLogin = (data: any, clearInputs: () => void) => {
    setUserSession(data);
    setUserType(data.role === "individual" ? "user" : data.role);
    setIsLoggedIn(true);
    clearInputs();
  };

  const handleBiometricAuth = async (
    data: any,
    loginData: LoginData,
    clearInputs: () => void,
  ) => {
    const bioResult = await authenticate();
    if (bioResult.success) {
      await saveCredentials(userType, loginData.email, loginData.password);
      Alert.alert("Success", "Biometric login enabled");
      finalizeLogin(data, clearInputs);
    } else {
      Alert.alert(
        "Authentication Failed",
        "Could not verify biometric identity. You can enable biometrics later in settings.",
      );
      finalizeLogin(data, clearInputs);
    }
  };

  const processBiometricFlow = async (
    data: any,
    loginData: LoginData,
    clearInputs: () => void,
  ) => {
    const biometricEnabled = await isBiometricEnabled(userType);

    if (isBiometricSupported && !biometricEnabled) {
      Alert.alert(
        "Enable Biometric Login",
        "Would you like to enable biometric login for faster access next time?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: () => finalizeLogin(data, clearInputs),
          },
          {
            text: "Yes",
            onPress: () => handleBiometricAuth(data, loginData, clearInputs),
          },
        ],
      );
      return;
    }

    if (isBiometricSupported && biometricEnabled) {
      const storedEmail = await getStoredEmail(userType);
      const isDifferentAccount =
        storedEmail &&
        storedEmail.toLowerCase() !== loginData.email.toLowerCase();

      if (isDifferentAccount) {
        Alert.alert(
          "Enable Biometric Login",
          "Would you like to enable biometric login for your account?",
          [
            {
              text: "No",
              style: "cancel",
              onPress: async () => {
                await deleteCredentials(userType);
                finalizeLogin(data, clearInputs);
              },
            },
            {
              text: "Yes",
              onPress: () => handleBiometricAuth(data, loginData, clearInputs),
            },
          ],
        );
      } else {
        finalizeLogin(data, clearInputs);
      }
      return;
    }

    finalizeLogin(data, clearInputs);
  };

  const handleLogin = async (
    loginData: LoginData,
    setIsLoading: (loading: boolean) => void,
    clearInputs: () => void,
  ) => {
    setIsLoading(true);

    const results = await loginAccount(
      { ...loginData, device_push_token: expoPushToken ?? "" },
      userType,
    );

    if (!results?.isOk) {
      if (results?.status && results.status >= 500) {
        Analytics.track("login_failed", {
          user_type: userType,
          login_data: loginData,
          status: results.status,
          message: results?.body.message,
          response: results?.body,
          error: (results as any).error,
        });
      }
      updateModal({
        message: results?.body.message,
        showModal: true,
        modalType: "error",
      });
      setIsLoading(false);
      return;
    }

    const resultsBody = results?.body?.data;
    if (!resultsBody) {
      setIsLoading(false);
      return;
    }

    if (!resultsBody.verified) {
      setIsLoading(false);
      const idKey = USER_ID_MAP[userType];
      navigation.navigate(screenName.verifyEmail, {
        account: { id: resultsBody[idKey], type: userType },
      });
      return;
    }

    Analytics.track("login_success", {
      user_type: userType,
      user_data: resultsBody,
      login_data: loginData,
    });

    const data = mapUserData(resultsBody, userType);

    // Identify user in Analytics on success
    if ((data as any).id) {
      Analytics.identify((data as any).id);
    }

    const isStored = await utils_storeAsyncData(
      "userSession",
      JSON.stringify(data),
    );

    if (resultsBody?.access_token) {
      await saveSecureItem("session_token", resultsBody.access_token);
    }

    const loginTimeStamp = new Date();
    await utils_storeAsyncData(
      "loginTimeStamp",
      JSON.stringify(loginTimeStamp),
    );

    if (!isStored) {
      setIsLoading(false);
      return;
    }

    await processBiometricFlow(data, loginData, clearInputs);
    setIsLoading(false);
  };

  const handleBiometricOnlyLogin = async (
    setIsLoading: (loading: boolean) => void,
  ) => {
    setIsLoading(true);
    try {
      const { success } = await authenticate();
      if (!success) return false;

      const credentials = await getCredentials(userType);
      if (!credentials) return false;

      const { email, token: password } = credentials;

      await handleLogin(
        { email, password },
        setIsLoading,
        () => {}, // No need to clear inputs for biometric login
      );
      return true;
    } catch (e) {
      console.error("Biometric only login failed:", e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, handleBiometricOnlyLogin };
}

function mapUserData(resultsBody: any, userType: UserType) {
  const baseData = {
    email: resultsBody.email,
    name: resultsBody.name,
    role: resultsBody.role,
    verified: resultsBody.verified,
    address: resultsBody.address,
    phone: resultsBody.phone,
    logo: resultsBody.logo,
  };

  switch (userType) {
    case "individual":
      return {
        ...baseData,
        id: resultsBody.user_id,
        preferences: resultsBody.preferences,
      };
    case "gallery":
      return {
        ...baseData,
        id: resultsBody.gallery_id,
        gallery_verified: resultsBody.gallery_verified,
        description: resultsBody.description,
        admin: resultsBody.admin,
        subscription_active: resultsBody.subscription_active,
      };
    case "artist":
      return {
        ...baseData,
        id: resultsBody.artist_id,
        artist_verified: resultsBody.artist_verified,
        isOnboardingCompleted: resultsBody.isOnboardingCompleted,
        base_currency: resultsBody.base_currency,
        walletId: resultsBody.wallet_id,
        categorization: resultsBody.categorization,
      };
  }
}

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { loginAccount } from "services/login/loginAccount";
import { utils_storeAsyncData } from "utils/utils_asyncStorage";
import { useAppStore } from "store/app/appStore";
import { useModalStore } from "store/modal/modalStore";
import { screenName } from "constants/screenNames.constants";

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
  const { setUserSession, setIsLoggedIn, expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();

  const handleLogin = async (
    loginData: LoginData,
    setIsLoading: (loading: boolean) => void,
    clearInputs: () => void
  ) => {
    setIsLoading(true);

    const results = await loginAccount(
      { ...loginData, device_push_token: expoPushToken ?? "" },
      userType
    );

    if (results?.isOk) {
      const resultsBody = results?.body?.data;

      if (!resultsBody) {
        setIsLoading(false);
        return;
      }

      const isVerified = Boolean(resultsBody.verified);

      if (!isVerified) {
        setIsLoading(false);
        const idKey = USER_ID_MAP[userType];
        navigation.navigate(screenName.verifyEmail, {
          account: { id: resultsBody[idKey], type: userType },
        });
        return;
      }

      const data = mapUserData(resultsBody, userType);

      const isStored = await utils_storeAsyncData("userSession", JSON.stringify(data));

      const loginTimeStamp = new Date();
      const isLoginTimeStampStored = await utils_storeAsyncData(
        "loginTimeStamp",
        JSON.stringify(loginTimeStamp)
      );

      if (isStored && isLoginTimeStampStored) {
        setUserSession(data);
        setIsLoggedIn(true);
        clearInputs();
      }
    } else {
      updateModal({
        message: results?.body.message,
        showModal: true,
        modalType: "error",
      });
    }

    setIsLoading(false);
  };

  return { handleLogin };
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

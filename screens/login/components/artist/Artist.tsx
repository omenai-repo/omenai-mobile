import { Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import LongBlackButton from "../../../../components/buttons/LongBlackButton";
import Input from "../../../../components/inputs/Input";
import PasswordInput from "components/inputs/PasswordInput";
import WithModal from "components/modal/WithModal";
import { useAppStore } from "store/app/appStore";
import { useModalStore } from "store/modal/modalStore";
import { loginAccount } from "services/login/loginAccount";
import { utils_storeAsyncData } from "utils/utils_asyncStorage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { screenName } from "constants/screenNames.constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useArtistAuthLoginStore } from "store/auth/login/ArtistAuthLoginStore";

export default function Artist() {
  const { artistLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useArtistAuthLoginStore();
  const { setUserSession, setIsLoggedIn, expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = async () => {
    setIsLoading(true);

    const results = await loginAccount(
      { ...artistLoginData, device_push_token: expoPushToken ?? "" },
      "artist"
    );
    console.log(results);
    if (results?.isOk) {
      const resultsBody = results?.body?.data;

      if (!resultsBody) {
        setIsLoading(false);
        return;
      }

      const isVerified = Boolean(resultsBody.verified);

      if (!isVerified) {
        setIsLoading(false);
        navigation.navigate(screenName.verifyEmail, {
          account: { id: resultsBody.artist_id, type: "artist" },
        });
        return;
      }

      const data = {
        id: resultsBody.artist_id,
        email: resultsBody.email,
        name: resultsBody.name,
        role: resultsBody.role,
        artist_verified: resultsBody.artist_verified,
        verified: resultsBody.verified,
        isOnboardingCompleted: resultsBody.isOnboardingCompleted,
        address: resultsBody.address,
        base_currency: resultsBody.base_currency,
        walletId: resultsBody.wallet_id,
        categorization: resultsBody.categorization,
        logo: resultsBody.logo,
        phone: resultsBody.phone,
      };

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
      // Alert.alert(results?.body.message)
      updateModal({
        message: results?.body.message,
        showModal: true,
        modalType: "error",
      });
    }

    setIsLoading(false);
  };

  return (
    <WithModal>
      <View style={tw`mt-7 gap-10`}>
        <View style={tw`gap-5`}>
          <Input
            label="Artist Email address"
            keyboardType="email-address"
            onInputChange={setEmail}
            placeHolder="Enter your email address"
            value={artistLoginData.email}
          />
          <PasswordInput
            label="Password"
            onInputChange={setPassword}
            placeHolder="Enter password"
            value={artistLoginData.password}
          />
        </View>
        <View style={tw`gap-5`}>
          <LongBlackButton
            value={isLoading ? "Loading ..." : "Sign In Artist"}
            isDisabled={artistLoginData.email && artistLoginData.password ? false : true}
            isLoading={isLoading}
            onClick={handleSubmit}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate(screenName.forgotPassword, { type: "artist" })}
          >
            <Text style={tw`text-sm text-center`}>Forgot password? Click here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </WithModal>
  );
}

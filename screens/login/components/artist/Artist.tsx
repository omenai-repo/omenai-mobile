import { Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import LongBlackButton from "../../../../components/buttons/LongBlackButton";
import Input from "../../../../components/inputs/Input";
import PasswordInput from "components/inputs/PasswordInput";
import WithModal from "components/modal/WithModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { screenName } from "constants/screenNames.constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useArtistAuthLoginStore } from "store/auth/login/ArtistAuthLoginStore";
import { useLoginHandler } from "hooks/useLoginHandler";

export default function Artist() {
  const { artistLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useArtistAuthLoginStore();
  const { handleLogin } = useLoginHandler("artist");
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = () => handleLogin(artistLoginData, setIsLoading, clearInputs);

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

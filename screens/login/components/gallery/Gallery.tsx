import { Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import LongBlackButton from "../../../../components/buttons/LongBlackButton";
import Input from "../../../../components/inputs/Input";
import { useGalleryAuthLoginStore } from "store/auth/login/GalleryAuthLoginStore";
import PasswordInput from "components/inputs/PasswordInput";
import WithModal from "components/modal/WithModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { screenName } from "constants/screenNames.constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useLoginHandler } from "hooks/useLoginHandler";

export default function Gallery() {
  const { galleryLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useGalleryAuthLoginStore();
  const { handleLogin } = useLoginHandler("gallery");
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleSubmit = () => handleLogin(galleryLoginData, setIsLoading, clearInputs);

  return (
    <WithModal>
      <View style={tw`mt-7 gap-10`}>
        <View style={tw`gap-5`}>
          <Input
            label="Gallery Email address"
            keyboardType="email-address"
            onInputChange={setEmail}
            placeHolder="Enter your gallery email address"
            value={galleryLoginData.email}
          />
          <PasswordInput
            label="Password"
            onInputChange={setPassword}
            placeHolder="Enter password"
            value={galleryLoginData.password}
          />
        </View>
        <View style={tw`gap-5`}>
          <LongBlackButton
            value={isLoading ? "Loading ..." : "Sign In Gallery"}
            isDisabled={galleryLoginData.email && galleryLoginData.password ? false : true}
            isLoading={isLoading}
            onClick={handleSubmit}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(screenName.forgotPassword, {
                type: "gallery",
              })
            }
          >
            <Text style={tw`text-sm text-center`}>Forgot password? Click here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </WithModal>
  );
}

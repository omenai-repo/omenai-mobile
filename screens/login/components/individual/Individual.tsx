import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import tw from "twrnc";
import { useIndividualAuthLoginStore } from "../../../../store/auth/login/IndividualAuthLoginStore";
import PasswordInput from "../../../../components/inputs/PasswordInput";
import Input from "../../../../components/inputs/Input";
import LongBlackButton from "../../../../components/buttons/LongBlackButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "../../../../constants/screenNames.constants";
import { useLoginHandler } from "hooks/useLoginHandler";

export default function Individual() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { individualLoginData, setEmail, setPassword, clearInputs, isLoading, setIsLoading } =
    useIndividualAuthLoginStore();
  const { handleLogin } = useLoginHandler("individual");

  const handleSubmit = () => handleLogin(individualLoginData, setIsLoading, clearInputs);

  return (
    <View style={tw`mt-7 gap-10`}>
      <View style={tw`gap-5`}>
        <Input
          label="Email address"
          keyboardType="email-address"
          onInputChange={setEmail}
          placeHolder="Enter your email address"
          value={individualLoginData.email}
        />
        <PasswordInput
          label="Password"
          onInputChange={setPassword}
          placeHolder="Enter password"
          value={individualLoginData.password}
        />
      </View>
      <View style={tw`gap-5`}>
        <LongBlackButton
          value={isLoading ? "Loading..." : "Log In"}
          isDisabled={individualLoginData.email && individualLoginData.password ? false : true}
          onClick={handleSubmit}
          isLoading={isLoading}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(screenName.forgotPassword, {
              type: "individual",
            })
          }
        >
          <Text style={tw`text-sm text-center`}>Forgot password? Click here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

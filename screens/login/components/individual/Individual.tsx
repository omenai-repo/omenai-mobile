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
import { useLoginHandler } from "#hooks/useLoginHandler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../../../config/colors.config";
import { SvgXml } from "react-native-svg";
import { faceIdIcon } from "#utils/SvgImages";

type IndividualProps = Readonly<{
  biometricProps: {
    canUseBiometrics: boolean;
    handleBiometricLogin: () => void | Promise<void>;
    isBiometricLoading: boolean;
    biometricName: string;
  };
}>;

export default function Individual({ biometricProps }: IndividualProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {
    individualLoginData,
    setEmail,
    setPassword,
    clearInputs,
    isLoading,
    setIsLoading,
  } = useIndividualAuthLoginStore();
  const { handleLogin } = useLoginHandler("individual");

  const handleSubmit = () =>
    handleLogin(individualLoginData, setIsLoading, clearInputs);

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
        <View style={tw`flex-row gap-3`}>
          <LongBlackButton
            value={isLoading ? "Loading..." : "Log In"}
            isDisabled={
              !(individualLoginData.email && individualLoginData.password)
            }
            onClick={handleSubmit}
            isLoading={isLoading}
            style={[
              biometricProps.canUseBiometrics ? tw`flex-1` : tw`w-full`,
              { height: 52 },
            ]}
          />
          {biometricProps.canUseBiometrics && (
            <TouchableOpacity
              onPress={biometricProps.handleBiometricLogin}
              disabled={biometricProps.isBiometricLoading}
              style={[
                tw`items-center justify-center rounded-lg h-[52px] w-[52px]`,
                { backgroundColor: colors.black },
              ]}
            >
              {biometricProps.biometricName === "Face ID" ? (
                <SvgXml xml={faceIdIcon} width={42} height={42} />
              ) : (
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={42}
                  color={colors.white}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(screenName.forgotPassword, {
              type: "individual",
            })
          }
        >
          <Text style={tw`text-sm text-center`}>
            Forgot password? Click here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

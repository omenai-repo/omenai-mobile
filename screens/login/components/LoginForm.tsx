import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import tw from "twrnc";
import LongBlackButton from "#components/buttons/LongBlackButton";
import Input from "#components/inputs/Input";
import PasswordInput from "#components/inputs/PasswordInput";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import { SvgXml } from "react-native-svg";
import { faceIdIcon } from "#utils/SvgImages";

type LoginFormProps = Readonly<{
  loginData: { email: string; password?: string };
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  isLoading: boolean;
  handleSubmit: () => void;
  biometricProps: {
    canUseBiometrics: boolean;
    handleBiometricLogin: () => void | Promise<void>;
    isBiometricLoading: boolean;
    biometricName: string;
  };
  emailLabel: string;
  emailPlaceholder: string;
  loginButtonLabel: string;
  forgotPasswordType: string;
}>;

export default function LoginForm({
  loginData,
  setEmail,
  setPassword,
  isLoading,
  handleSubmit,
  biometricProps,
  emailLabel,
  emailPlaceholder,
  loginButtonLabel,
  forgotPasswordType,
}: LoginFormProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={tw`mt-7 gap-10`}>
      <View style={tw`gap-5`}>
        <Input
          label={emailLabel}
          keyboardType="email-address"
          onInputChange={setEmail}
          placeHolder={emailPlaceholder}
          value={loginData.email}
        />
        <PasswordInput
          label="Password"
          onInputChange={setPassword}
          placeHolder="Enter password"
          value={loginData.password || ""}
        />
      </View>
      <View style={tw`gap-5`}>
        <View style={tw`flex-row gap-3`}>
          <LongBlackButton
            value={isLoading ? "Loading ..." : loginButtonLabel}
            isDisabled={!(loginData.email && loginData.password)}
            isLoading={isLoading}
            onClick={handleSubmit}
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
              type: forgotPasswordType,
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

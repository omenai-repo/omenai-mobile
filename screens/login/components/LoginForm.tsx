import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import React, { useRef } from "react";
import tw from "twrnc";
import { useDevice } from "#hooks/useDevice";
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
  forgotPasswordType: UserType;
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
  const { isTablet } = useDevice();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const biometricIcon = (() => {
    if (biometricProps.isBiometricLoading)
      return <ActivityIndicator size="large" color={colors.white} />;

    if (biometricProps.biometricName === "Face ID")
      return <SvgXml xml={faceIdIcon} width={42} height={42} />;

    return (
      <MaterialCommunityIcons
        name="fingerprint"
        size={42}
        color={colors.white}
      />
    );
  })();

  let biometricAccessibilityLabel = "Sign in with biometrics";
  if (biometricProps.biometricName === "Face ID") {
    biometricAccessibilityLabel = "Sign in with Face ID";
  } else if (biometricProps.biometricName === "Fingerprint") {
    biometricAccessibilityLabel = "Sign in with fingerprint";
  }

  return (
    <View
      style={[
        tw`mt-7 gap-10`,
        isTablet && {
          alignSelf: "center",
          width: "100%",
          maxWidth: 500,
        },
      ]}
    >
      <View style={tw`gap-5`}>
        <Input
          ref={emailRef}
          testID="login-email-input"
          label={emailLabel}
          keyboardType="email-address"
          onInputChange={setEmail}
          placeHolder={emailPlaceholder}
          value={loginData.email}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          textContentType="username"
          autoComplete="email"
        />
        <PasswordInput
          ref={passwordRef}
          testID="login-password-input"
          label="Password"
          onInputChange={setPassword}
          placeHolder="Enter password"
          value={loginData.password || ""}
          textContentType="password"
          autoComplete="password"
          returnKeyType="go"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (
              loginData.email &&
              loginData.password &&
              !isLoading &&
              !biometricProps.isBiometricLoading
            ) {
              handleSubmit();
            }
          }}
        />
      </View>
      <View style={tw`gap-5`}>
        <View style={tw`flex-row gap-3`}>
          <LongBlackButton
            value={isLoading ? "Loading ..." : loginButtonLabel}
            isDisabled={
              !(loginData.email && loginData.password) ||
              biometricProps.isBiometricLoading
            }
            isLoading={isLoading}
            onClick={handleSubmit}
            style={[
              biometricProps.canUseBiometrics ? tw`flex-1` : tw`w-full`,
              { height: 52 },
            ]}
            testID="login-submit-button"
          />
          {biometricProps.canUseBiometrics && (
            <Pressable
              onPress={biometricProps.handleBiometricLogin}
              disabled={biometricProps.isBiometricLoading || isLoading}
              accessibilityRole="button"
              accessibilityLabel={biometricAccessibilityLabel}
              accessibilityHint="Uses saved email and password after device authentication"
              accessibilityState={{
                busy: biometricProps.isBiometricLoading,
                disabled:
                  biometricProps.isBiometricLoading || isLoading,
              }}
              style={[
                tw`items-center justify-center rounded-sm h-[52px] w-[52px]`,
                {
                  backgroundColor: colors.black,
                  opacity:
                    biometricProps.isBiometricLoading || isLoading ? 0.5 : 1,
                },
              ]}
            >
              {biometricIcon}
            </Pressable>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(screenName.forgotPassword, {
              type: forgotPasswordType,
            })
          }
        >
          <Text style={tw`text-sm font-sans-regular text-center`}>
            Forgot password? Click here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

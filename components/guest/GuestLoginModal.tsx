import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useAnimatedKeyboard,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { useGuestLoginModalStore } from "#store/account/guest/guestLoginModalStore";
import { screenName } from "#constants/screenNames.constants";
import LongBlackButton from "#components/buttons/LongBlackButton";
import LongWhiteButton from "#components/buttons/LongWhiteButton";
import Input from "#components/inputs/Input";
import PasswordInput from "#components/inputs/PasswordInput";
import { colors } from "#config/colors.config";
import { useLoginHandler } from "#hooks/auth/useLoginHandler";
import { useModalStore } from "#store/account/modal/modalStore";
import { useBiometrics } from "#hooks/auth/useBiometrics";
import { faceIdIcon } from "#utils/assets/SvgImages";

export default function GuestLoginModal() {
  const {
    isOpen,
    closeGuestLoginModal,
    redirectContext,
    clearRedirectContext,
  } = useGuestLoginModalStore();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get("window");
  const { updateModal } = useModalStore();
  const keyboard = useAnimatedKeyboard();

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Biometric state
  const { isBiometricEnabled, biometricType } = useBiometrics();
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const { handleLogin, handleBiometricOnlyLogin } =
    useLoginHandler("individual");

  const biometricName = (() => {
    switch (biometricType) {
      case 1:
        return "Fingerprint";
      case 2:
        return "Face ID";
      default:
        return "Biometrics";
    }
  })();

  // Check biometric status when modal opens
  const checkBiometricStatus = useCallback(async () => {
    const enabled = await isBiometricEnabled("individual");
    setCanUseBiometrics(enabled);
  }, [isBiometricEnabled]);

  useEffect(() => {
    if (isOpen) {
      checkBiometricStatus();
    }
  }, [checkBiometricStatus, isOpen]);

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  // Handle navigation after successful login
  const handlePostLoginNavigation = () => {
    closeGuestLoginModal();
    if (redirectContext) {
      navigation.navigate(redirectContext.screen, redirectContext.params);
      clearRedirectContext();
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      updateModal({
        message: "Please enter email and password",
        showModal: true,
        modalType: "error",
      });
      return;
    }
    await handleLogin({ email, password }, setIsLoading, clearInputs);
    handlePostLoginNavigation();
  };

  const handleBiometricLogin = async () => {
    const success = await handleBiometricOnlyLogin(setIsBiometricLoading);
    if (success) {
      handlePostLoginNavigation();
    }
  };

  const handleCreateAccount = () => {
    closeGuestLoginModal();
    navigation.navigate("AuthNavigation", { screen: screenName.register });
  };

  const otherLogin = (accountType: "artist" | "gallery") => {
    closeGuestLoginModal();
    navigation.navigate("AuthNavigation", {
      screen: screenName.login,
      params: { account_type: accountType },
    });
  };

  const handleClose = () => {
    clearInputs();
    closeGuestLoginModal();
  };

  const biometricIcon = (() => {
    if (isBiometricLoading)
      return <ActivityIndicator size="large" color={colors.white} />;

    if (biometricName === "Face ID")
      return <SvgXml xml={faceIdIcon} width={42} height={42} />;

    return (
      <MaterialCommunityIcons
        name="fingerprint"
        size={42}
        color={colors.white}
      />
    );
  })();

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={handleClose}
      onSwipeComplete={handleClose}
      swipeDirection="down"
      style={tw`m-0 justify-end`}
      propagateSwipe={true}
    >
      <View
        style={[
          tw`bg-white rounded-t-3xl overflow-hidden`,
          { height: height * 0.8, paddingBottom: insets.bottom },
        ]}
      >
        {/* Swipe indicator */}
        <View style={tw`items-center py-4 bg-white w-full`}>
          <View style={tw`w-12 h-1.5 bg-gray-300 rounded-full`} />
        </View>

        <Animated.View style={[animatedStyle, { flex: 1 }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={tw`px-6 pb-6`}
          >
            {/* Header */}
            <Text
              style={[
                tw`text-2xl font-bold text-center mb-2`,
                { color: colors.primary_black },
              ]}
            >
              Welcome to Omenai
            </Text>
            <Text style={tw`text-sm text-gray-500 text-center mb-6`}>
              Log in to continue
            </Text>

            {/* Login Form */}
            <View style={tw`gap-4 mb-6`}>
              <Input
                label="Email address"
                keyboardType="email-address"
                onInputChange={setEmail}
                placeHolder="Enter your email address"
                value={email}
              />
              <PasswordInput
                label="Password"
                onInputChange={setPassword}
                placeHolder="Enter password"
                value={password}
              />
            </View>

            {/* Login Button with Biometric */}
            <View style={tw`flex-row gap-3`}>
              <LongBlackButton
                value={isLoading ? "Loading ..." : "Log In"}
                onClick={handleSubmit}
                isDisabled={!(email && password) || isBiometricLoading}
                isLoading={isLoading}
                style={[
                  canUseBiometrics ? tw`flex-1` : tw`w-full`,
                  { height: 52 },
                ]}
                textStyle={{
                  fontSize: 16,
                  fontWeight: "600",
                }}
              />
              {canUseBiometrics && (
                <TouchableOpacity
                  onPress={handleBiometricLogin}
                  disabled={isBiometricLoading || isLoading}
                  style={[
                    tw`items-center justify-center rounded-lg h-[52px] w-[52px]`,
                    {
                      backgroundColor: colors.black,
                      opacity: isBiometricLoading || isLoading ? 0.5 : 1,
                    },
                  ]}
                >
                  {biometricIcon}
                </TouchableOpacity>
              )}
            </View>

            {/* Create Account Link */}
            <View style={tw`flex-row justify-center items-center mt-5`}>
              <Text style={tw`text-sm text-gray-500`}>
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleCreateAccount}>
                <Text
                  style={[
                    tw`text-sm font-semibold underline`,
                    { color: colors.primary_black },
                  ]}
                >
                  Create one
                </Text>
              </TouchableOpacity>
            </View>

            {/* Artist/Gallery Login Section */}
            <View
              style={[
                tw`mt-8 pt-6 border-t`,
                { borderTopColor: colors.inputBorder },
              ]}
            >
              <Text style={tw`text-sm text-gray-500 text-center mb-4`}>
                Are you a gallery or artist?
              </Text>

              <View style={tw`gap-3`}>
                <LongWhiteButton
                  value="Sign in as Artist"
                  onClick={() => otherLogin("artist")}
                  style={{ height: 48 }}
                  borderColor={colors.inputBorder}
                />

                <LongWhiteButton
                  value="Sign in as Gallery"
                  onClick={() => otherLogin("gallery")}
                  style={{ height: 48 }}
                  borderColor={colors.inputBorder}
                />
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

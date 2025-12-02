import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import { colors } from "config/colors.config";
import BackHeaderTitle from "components/header/BackHeaderTitle";
import WithModal from "components/modal/WithModal";
import { useAppStore } from "store/app/appStore";
import { useBiometrics, UserType } from "hooks/useBiometrics";
import PasswordInput from "components/inputs/PasswordInput";
import LongBlackButton from "components/buttons/LongBlackButton";
import { loginAccount } from "services/login/loginAccount";
import { useModalStore } from "store/modal/modalStore";
import { Feather } from "@expo/vector-icons";

export default function BiometricSettings() {
  const insets = useSafeAreaInsets();
  const { userSession, userType, expoPushToken } = useAppStore();
  const {
    isBiometricSupported,
    biometricType,
    isBiometricEnabled,
    saveCredentials,
    deleteCredentials,
  } = useBiometrics();
  const { updateModal } = useModalStore();

  const [isEnabled, setIsEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const enabled = await isBiometricEnabled(userType as UserType);
    setIsEnabled(enabled);
  };

  const handleToggle = async (value: boolean) => {
    if (value) {
      setShowPasswordModal(true);
    } else {
      await deleteCredentials(userType as UserType);
      setIsEnabled(false);
      updateModal({
        message: "Biometric authentication disabled",
        modalType: "success",
        showModal: true,
      });
    }
  };

  const handleEnableBiometrics = async () => {
    if (!password) {
      updateModal({
        message: "Please enter your password",
        modalType: "error",
        showModal: true,
      });
      return;
    }

    setIsLoading(true);
    // Verify password by attempting to login
    const response = await loginAccount(
      {
        email: userSession.email,
        password,
        device_push_token: expoPushToken || "",
      },
      userType as "individual" | "gallery" | "artist"
    );

    setIsLoading(false);

    if (response.isOk) {
      const saved = await saveCredentials(
        userType as UserType,
        userSession.email,
        password
      );
      if (saved) {
        setIsEnabled(true);
        setShowPasswordModal(false);
        setPassword("");
        updateModal({
          message: "Biometric authentication enabled successfully",
          modalType: "success",
          showModal: true,
        });
      } else {
        updateModal({
          message: "Failed to save biometric credentials",
          modalType: "error",
          showModal: true,
        });
      }
    } else {
      updateModal({
        message: "Incorrect password",
        modalType: "error",
        showModal: true,
      });
    }
  };

  if (!isBiometricSupported) {
    return (
      <WithModal>
        <View style={[tw`flex-1 bg-white`]}>
          <BackHeaderTitle title="Biometric Login" />
          <View style={tw`flex-1 items-center justify-center px-5`}>
            <Text style={tw`text-center text-gray-500 text-base`}>
              Biometric authentication is not supported or not enrolled on this
              device.
            </Text>
          </View>
        </View>
      </WithModal>
    );
  }

  return (
    <WithModal>
      <View style={[tw`flex-1 bg-white`]}>
        <BackHeaderTitle title="Biometric Login" />

        <View style={tw`px-5 mt-8`}>
          <View
            style={tw`flex-row items-center justify-between py-4 border-b border-gray-100`}
          >
            <View style={tw`flex-1 pr-4`}>
              <Text style={tw`text-base font-semibold text-black mb-1`}>
                Enable {biometricType === 1 ? "Face ID" : "Touch ID"}
              </Text>
              <Text style={tw`text-sm text-gray-500`}>
                Use biometric authentication to log in securely.
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary_black }}
              thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggle}
              value={isEnabled}
            />
          </View>
        </View>

        <Modal
          visible={showPasswordModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPasswordModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={tw`flex-1 justify-end bg-black/50`}
          >
            <View style={tw`bg-white rounded-t-[20px] p-5 pb-10`}>
              <View style={tw`flex-row justify-between items-center mb-6`}>
                <Text style={tw`text-lg font-bold text-black`}>
                  Verify Password
                </Text>
                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                  <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <Text style={tw`text-gray-500 mb-6`}>
                Please enter your password to enable biometric authentication.
              </Text>

              <PasswordInput
                label="Password"
                placeHolder="Enter your password"
                value={password}
                onInputChange={setPassword}
                errorMessage=""
              />

              <View style={tw`mt-6`}>
                <LongBlackButton
                  value="Verify & Enable"
                  onClick={handleEnableBiometrics}
                  isLoading={isLoading}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </WithModal>
  );
}

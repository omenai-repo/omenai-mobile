import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState } from "react";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthTabs from "../../components/auth/AuthTabs";
import Individual from "./components/individual/Individual";
import Gallery from "./components/gallery/Gallery";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../config/colors.config";
import { screenName } from "../../constants/screenNames.constants";
import WithModal from "components/modal/WithModal";
import ScrollWrapper from "components/general/ScrollWrapper";
import { StatusBar } from "expo-status-bar";
import Artist from "./components/artist/Artist";
import { useIndividualAuthLoginStore } from "store/auth/login/IndividualAuthLoginStore";
import { useArtistAuthLoginStore } from "store/auth/login/ArtistAuthLoginStore";
import { useGalleryAuthLoginStore } from "store/auth/login/GalleryAuthLoginStore";

import { useBiometrics, UserType } from "hooks/useBiometrics";
import { SvgXml } from "react-native-svg";
import { lockIcon } from "utils/SvgImages";
import tw from "twrnc";
import { useLoginHandler } from "hooks/useLoginHandler";

export default function Login() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const clearIndividual = useIndividualAuthLoginStore((s) => s.clearInputs);
  const clearArtist = useArtistAuthLoginStore((s) => s.clearInputs);
  const clearGallery = useGalleryAuthLoginStore((s) => s.clearInputs);

  const { authenticate, getCredentials, isBiometricEnabled, biometricType } =
    useBiometrics();
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const userTypes: UserType[] = ["individual", "artist", "gallery"];
  const currentUserType = userTypes[selectedIndex];

  const { handleLogin } = useLoginHandler(currentUserType);

  React.useEffect(() => {
    checkBiometricStatus();
  }, [selectedIndex]);

  const checkBiometricStatus = async () => {
    const enabled = await isBiometricEnabled(currentUserType);
    setCanUseBiometrics(enabled);
  };

  const handleBiometricLogin = async () => {
    const result = await authenticate();
    if (result.success) {
      const credentials = await getCredentials(currentUserType);
      if (credentials) {
        const { email, token: password } = credentials;

        await handleLogin(
          { email, password },
          setIsBiometricLoading,
          () => {} // No need to clear inputs for biometric login
        );
      }
    }
  };

  // Reset all forms
  const resetAll = () => {
    clearIndividual();
    clearArtist();
    clearGallery();
  };

  // Reset on tab switch
  const handleTabSwitch = (e: number) => {
    resetAll();
    setSelectedIndex(e);
  };

  // Reset on back
  const handleBack = () => {
    resetAll();
    navigation.navigate(screenName.welcome);
  };

  return (
    <WithModal>
      <StatusBar style="light" />
      <AuthHeader
        title="Welcome Back"
        subTitle="Access your account so you can start purchasing artwork"
        handleBackClick={handleBack}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollWrapper
          style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}
        >
          <AuthTabs
            tabs={["Collector", "Artist", "Gallery"]}
            stateIndex={selectedIndex}
            handleSelect={handleTabSwitch}
          />
          {/* route depending on state */}
          {selectedIndex === 0 && <Individual />}
          {selectedIndex === 1 && <Artist />}
          {selectedIndex === 2 && <Gallery />}

          {canUseBiometrics &&
            (() => {
              const biometricName =
                biometricType === 1 ? "Face ID" : "Touch ID";
              const buttonText = isBiometricLoading
                ? "Logging in..."
                : `Log in with ${biometricName}`;

              return (
                <View style={tw`mt-5 items-center pb-10`}>
                  <TouchableOpacity
                    onPress={handleBiometricLogin}
                    disabled={isBiometricLoading}
                    style={tw`flex-row items-center justify-center bg-gray-100 py-3 px-6 rounded-full w-full`}
                  >
                    <SvgXml
                      xml={lockIcon}
                      width={20}
                      height={20}
                      style={tw`mr-2`}
                    />
                    <Text style={tw`text-black font-medium`}>{buttonText}</Text>
                  </TouchableOpacity>
                </View>
              );
            })()}
        </ScrollWrapper>
      </KeyboardAvoidingView>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});

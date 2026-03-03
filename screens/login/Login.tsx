import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthTabs from "../../components/auth/AuthTabs";
import Individual from "./components/individual/Individual";
import Gallery from "./components/gallery/Gallery";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../../config/colors.config";
import { screenName } from "../../constants/screenNames.constants";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { StatusBar } from "expo-status-bar";
import Artist from "./components/artist/Artist";
import { useIndividualAuthLoginStore } from "#store/auth/login/IndividualAuthLoginStore";
import { useArtistAuthLoginStore } from "#store/auth/login/ArtistAuthLoginStore";
import { useGalleryAuthLoginStore } from "#store/auth/login/GalleryAuthLoginStore";
import { useBiometrics, UserType } from "#hooks/useBiometrics";
import { useLoginHandler } from "#hooks/useLoginHandler";

export default function Login() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();

  // initialize selectedIndex based on route params if provided
  const initialIndex = (() => {
    const accountType = route.params?.account_type;
    if (accountType === "artist") return 1;
    if (accountType === "gallery") return 2;
    return 0; // default to collector
  })();

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
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

  React.useEffect(() => {
    checkBiometricStatus();
  }, [selectedIndex]);

  const checkBiometricStatus = async () => {
    const enabled = await isBiometricEnabled(currentUserType);
    setCanUseBiometrics(enabled);
  };

  const handleBiometricLogin = async () => {
    setIsBiometricLoading(true);
    try {
      const { success } = await authenticate();
      if (!success) return;

      const credentials = await getCredentials(currentUserType);
      if (!credentials) return;

      const { email, token: password } = credentials;

      await handleLogin(
        { email, password },
        setIsBiometricLoading,
        () => {}, // No need to clear inputs for biometric login
      );
    } catch {
      // Error handled by finally
    } finally {
      setIsBiometricLoading(false);
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
    <>
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
          {selectedIndex === 0 && (
            <Individual
              biometricProps={{
                canUseBiometrics,
                handleBiometricLogin,
                isBiometricLoading,
                biometricName,
              }}
            />
          )}
          {selectedIndex === 1 && (
            <Artist
              biometricProps={{
                canUseBiometrics,
                handleBiometricLogin,
                isBiometricLoading,
                biometricName,
              }}
            />
          )}
          {selectedIndex === 2 && (
            <Gallery
              biometricProps={{
                canUseBiometrics,
                handleBiometricLogin,
                isBiometricLoading,
                biometricName,
              }}
            />
          )}
        </ScrollWrapper>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});

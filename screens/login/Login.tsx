import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AuthHeader from "#components/auth/AuthHeader";
import ScrollWrapper from "#components/general/ScrollWrapper";
import AuthTabs from "#components/auth/AuthTabs";
import Individual from "./components/individual/Individual";
import Gallery from "./components/gallery/Gallery";
import { colors } from "#config/colors.config";
import { screenName } from "#constants/screenNames.constants";
import { StatusBar } from "expo-status-bar";
import Artist from "./components/artist/Artist";
import { useIndividualAuthLoginStore } from "#store/auth/login/IndividualAuthLoginStore";
import { useArtistAuthLoginStore } from "#store/auth/login/ArtistAuthLoginStore";
import { useGalleryAuthLoginStore } from "#store/auth/login/GalleryAuthLoginStore";
import { useBiometrics, UserType } from "#hooks/useBiometrics";
import { useLoginHandler } from "#hooks/useLoginHandler";
import { getLoginSubtitle } from "./loginSubtitles";
import { useModalStore } from "#store/modal/modalStore";
import type { HandleLoginFn } from "#hooks/loginSubmitOptions";
import { tabIndexFromAccountType } from "#utils/auth/tabIndexFromAccountType";

const userTypes: UserType[] = ["individual", "artist", "gallery"];

export default function Login() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();
  const { updateModal } = useModalStore();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const initialIndex = (() => {
    const idx = tabIndexFromAccountType(route.params?.account_type);
    return idx ?? 0;
  })();

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const clearIndividual = useIndividualAuthLoginStore((s) => s.clearInputs);
  const clearArtist = useArtistAuthLoginStore((s) => s.clearInputs);
  const clearGallery = useGalleryAuthLoginStore((s) => s.clearInputs);

  const { authenticate, getCredentials, isBiometricEnabled, biometricType } =
    useBiometrics();
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const biometricCheckGen = useRef(0);

  const currentUserType = userTypes[selectedIndex];

  const { handleLogin } = useLoginHandler(currentUserType);

  const setSubmitLoading = useCallback((loading: boolean) => {
    setIsBiometricLoading(loading);
    useIndividualAuthLoginStore.getState().setIsLoading(loading);
    useArtistAuthLoginStore.getState().setIsLoading(loading);
    useGalleryAuthLoginStore.getState().setIsLoading(loading);
  }, []);

  const showBiometricError = useCallback(
    (message: string) => {
      updateModal({
        message,
        showModal: true,
        modalType: "error",
      });
    },
    [updateModal],
  );

  useFocusEffect(
    useCallback(() => {
      const idx = tabIndexFromAccountType(route.params?.account_type);
      if (idx !== null) setSelectedIndex(idx);
    }, [route.params?.account_type]),
  );

  useEffect(() => {
    const myGen = ++biometricCheckGen.current;
    (async () => {
      const enabled = await isBiometricEnabled(currentUserType);
      if (myGen !== biometricCheckGen.current) return;
      setCanUseBiometrics(enabled);
    })();
  }, [selectedIndex, currentUserType, isBiometricEnabled]);

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

  /**
   * Device auth before reading stored credentials from SecureStore.
   * Server login uses `postLoginFlow: finalize_only` so we do not run the
   * post-login “enable biometrics” prompts again (avoids a second device prompt).
   */
  const handleBiometricLogin = async () => {
    setSubmitLoading(true);
    try {
      const { success } = await authenticate("Sign in with your saved login");
      if (!success) {
        showBiometricError(
          "Biometric sign-in was cancelled or did not succeed. Try email and password, or try again.",
        );
        return;
      }

      const credentials = await getCredentials(currentUserType);
      if (!credentials) {
        showBiometricError(
          "No saved login for this account type. Sign in with email and password once, then enable biometric login from the prompt after you log in.",
        );
        return;
      }

      const { email, token: password } = credentials;

      await handleLogin({ email, password }, setSubmitLoading, () => {}, {
        postLoginFlow: "finalize_only",
      });
    } catch {
      showBiometricError(
        "Something went wrong during biometric sign-in. Please try again.",
      );
    } finally {
      if (isMountedRef.current) {
        setSubmitLoading(false);
      }
    }
  };

  const resetAll = () => {
    clearIndividual();
    clearArtist();
    clearGallery();
  };

  const handleTabSwitch = (e: number) => {
    resetAll();
    setSelectedIndex(e);
  };

  const handleBack = () => {
    resetAll();
    navigation.navigate(screenName.welcome);
  };

  const biometricProps = {
    canUseBiometrics,
    handleBiometricLogin,
    isBiometricLoading,
    biometricName,
  };

  const sharedLogin: HandleLoginFn = handleLogin;

  return (
    <>
      <StatusBar style="light" />
      <AuthHeader
        title="Welcome Back"
        subTitle={getLoginSubtitle(selectedIndex)}
        handleBackClick={handleBack}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
        keyboardVerticalOffset={0}
      >
        <ScrollWrapper
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            width: "100%",
            alignSelf: "stretch",
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          contentInsetAdjustmentBehavior="never"
        >
          <AuthTabs
            tabs={["Collector", "Artist", "Gallery"]}
            stateIndex={selectedIndex}
            handleSelect={handleTabSwitch}
          />
          {selectedIndex === 0 && (
            <Individual
              biometricProps={biometricProps}
              handleLogin={sharedLogin}
              setSubmitLoading={setSubmitLoading}
            />
          )}
          {selectedIndex === 1 && (
            <Artist
              biometricProps={biometricProps}
              handleLogin={sharedLogin}
              setSubmitLoading={setSubmitLoading}
            />
          )}
          {selectedIndex === 2 && (
            <Gallery
              biometricProps={biometricProps}
              handleLogin={sharedLogin}
              setSubmitLoading={setSubmitLoading}
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

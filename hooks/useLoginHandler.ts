import { useEffect, useRef, useCallback, useMemo } from "react";
import { InteractionManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  loginAccount,
  type LoginApiJsonBody,
} from "#services/login/loginAccount";
import { utils_storeAsyncData } from "#utils/utils_asyncStorage";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/modal/modalStore";
import { screenName } from "#constants/screenNames.constants";
import { useBiometrics } from "#hooks/useBiometrics";
import { Analytics } from "#utils/analytics";
import { saveSecureItem } from "#utils/secureStore";
import type { LoginSubmitOptions } from "#hooks/loginSubmitOptions";
import { mapUserDataFromLoginBody } from "#hooks/login/mapUserDataFromLoginBody";
import { createPostLoginBiometricHandlers } from "#hooks/login/postLoginBiometricPrompts";
import { resetAllLoginFormLoading } from "#hooks/login/resetLoginFormLoading";
import { flushPendingDeepLinks } from "#features/deeplink/deepLinkApply";

type UserType = "individual" | "gallery" | "artist";

type LoginData = {
  email: string;
  password: string;
};

const USER_ID_MAP = {
  individual: "user_id",
  gallery: "gallery_id",
  artist: "artist_id",
} as const;

const normalizeLoginEmail = (email: string) => email.trim().toLowerCase();

export function useLoginHandler(userType: UserType) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const { setUserSession, setUserType, setIsLoggedIn, expoPushToken } =
    useAppStore();
  const { updateModal } = useModalStore();
  const {
    isBiometricSupported,
    isBiometricEnabled,
    saveCredentials,
    getCredentials,
    authenticate,
    getStoredEmail,
    deleteCredentials,
  } = useBiometrics();

  /** When `false`, always clears Zustand loading (survives Login unmount after success). */
  const safeSetLoading = useCallback(
    (setIsLoading: (loading: boolean) => void, value: boolean) => {
      if (!value) {
        resetAllLoginFormLoading();
      }
      if (isMountedRef.current) {
        setIsLoading(value);
      }
    },
    [],
  );

  const safeUpdateModal = useCallback(
    (args: Parameters<typeof updateModal>[0]) => {
      if (isMountedRef.current) updateModal(args);
    },
    [updateModal],
  );

  const sanitizeErrorMessage = (message: unknown) => {
    if (typeof message !== "string")
      return "Something went wrong. Please try again.";

    if (message.toLowerCase().includes("unable to resolve data for blob")) {
      return "A temporary device data error occurred. Please restart the app and try again.";
    }

    return message;
  };

  const finalizeLogin = useCallback(
    (data: any, clearInputs: () => void) => {
      if (!isMountedRef.current) return;
      setUserSession(data);
      const sessionUserType = data.role === "individual" ? "user" : data.role;
      setUserType(sessionUserType);
      setIsLoggedIn(true);
      clearInputs();

      InteractionManager.runAfterInteractions(() => {
        flushPendingDeepLinks({ isLoggedIn: true, userType: sessionUserType });
      });
    },
    [setUserSession, setUserType, setIsLoggedIn],
  );

  const { processBiometricFlow } = useMemo(
    () =>
      createPostLoginBiometricHandlers({
        userType,
        isBiometricSupported,
        isBiometricEnabled,
        authenticate,
        saveCredentials,
        getStoredEmail,
        deleteCredentials,
        finalizeLogin,
      }),
    [
      userType,
      isBiometricSupported,
      isBiometricEnabled,
      authenticate,
      saveCredentials,
      getStoredEmail,
      deleteCredentials,
      finalizeLogin,
    ],
  );

  const handleLogin = async (
    loginData: LoginData,
    setIsLoading: (loading: boolean) => void,
    clearInputs: () => void,
    options?: LoginSubmitOptions,
  ) => {
    const postLoginFlow = options?.postLoginFlow ?? "full";
    const normalizedEmail = normalizeLoginEmail(loginData.email);
    const payload: LoginData = {
      email: normalizedEmail,
      password: loginData.password,
    };

    safeSetLoading(setIsLoading, true);

    const results = await loginAccount(
      { ...payload, device_push_token: expoPushToken ?? "" },
      userType,
    );

    if (!results?.isOk) {
      if (results?.status && results.status >= 500) {
        Analytics.track("login_failed", {
          user_type: userType,
          login_data: payload.email,
          status: results.status,
          message: results?.body?.message,
          response: results?.body,
          error: (results as any).error,
        });
      }
      safeUpdateModal({
        message: sanitizeErrorMessage(results?.body?.message),
        showModal: true,
        modalType: "error",
      });
      safeSetLoading(setIsLoading, false);
      return;
    }

    const resultsBody = (results.body as LoginApiJsonBody)?.data as
      | Record<string, unknown>
      | undefined;
    if (!resultsBody) {
      safeUpdateModal({
        message:
          "We could not read your login response. Please try again or contact support.",
        showModal: true,
        modalType: "error",
      });
      safeSetLoading(setIsLoading, false);
      return;
    }

    const sessionPayload = resultsBody as any;

    if (!sessionPayload.verified) {
      safeSetLoading(setIsLoading, false);
      if (!isMountedRef.current) return;
      const idKey = USER_ID_MAP[userType];
      navigation.navigate(screenName.verifyEmail, {
        account: { id: sessionPayload[idKey], type: userType },
      });
      return;
    }

    Analytics.track("login_success", {
      user_type: userType,
      user_data: {
        id: sessionPayload[USER_ID_MAP[userType]],
        email: sessionPayload.email,
        verified: Boolean(sessionPayload.verified),
      },
      login_data: payload.email,
    });

    const data = mapUserDataFromLoginBody(sessionPayload, userType);

    if ((data as any).id) {
      Analytics.identify((data as any).id);
    }

    const isStored = await utils_storeAsyncData(
      "userSession",
      JSON.stringify(data),
    );

    if (sessionPayload?.access_token) {
      await saveSecureItem("session_token", sessionPayload.access_token);
    }

    const loginTimeStamp = new Date();
    await utils_storeAsyncData(
      "loginTimeStamp",
      JSON.stringify(loginTimeStamp),
    );

    if (!isStored) {
      safeUpdateModal({
        message:
          "Could not save your session on this device. Please try again.",
        showModal: true,
        modalType: "error",
      });
      safeSetLoading(setIsLoading, false);
      return;
    }

    if (postLoginFlow === "finalize_only") {
      finalizeLogin(data, clearInputs);
    } else {
      await processBiometricFlow(data, payload, clearInputs);
    }

    safeSetLoading(setIsLoading, false);
  };

  const handleBiometricOnlyLogin = async (
    setIsLoading: (loading: boolean) => void,
  ) => {
    safeSetLoading(setIsLoading, true);
    try {
      const { success } = await authenticate();
      if (!success) return false;

      const credentials = await getCredentials(userType);
      if (!credentials) return false;

      const { email, token: password } = credentials;

      await handleLogin({ email, password }, setIsLoading, () => {}, {
        postLoginFlow: "finalize_only",
      });
      return true;
    } catch (e) {
      console.error("Biometric only login failed:", e);
      return false;
    } finally {
      safeSetLoading(setIsLoading, false);
    }
  };

  return { handleLogin, handleBiometricOnlyLogin };
}

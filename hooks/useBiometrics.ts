import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect, useCallback } from "react";

const BIOMETRIC_KEY_PREFIX = "biometric_auth_";

export type UserType = "individual" | "artist" | "gallery";

export const useBiometrics = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] =
    useState<LocalAuthentication.AuthenticationType | null>(null);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);

      if (compatible) {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          setBiometricType(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          );
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          setBiometricType(LocalAuthentication.AuthenticationType.FINGERPRINT);
        }
      }
    })();
  }, []);

  const authenticate = useCallback(
    async (promptMessage: string = "Authenticate") => {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage,
          fallbackLabel: "Use Passcode",
          cancelLabel: "Cancel",
          disableDeviceFallback: false,
        });
        return result;
      } catch (error) {
        console.error("Biometric authentication error:", error);
        return { success: false, error: "Authentication failed" };
      }
    },
    []
  );

  const saveCredentials = useCallback(
    async (userType: UserType, email: string, token: string) => {
      try {
        await SecureStore.setItemAsync(
          `${BIOMETRIC_KEY_PREFIX}${userType}`,
          JSON.stringify({ email, token })
        );
        return true;
      } catch (error) {
        console.error("Error saving credentials:", error);
        return false;
      }
    },
    []
  );

  const getCredentials = useCallback(async (userType: UserType) => {
    try {
      const credentials = await SecureStore.getItemAsync(
        `${BIOMETRIC_KEY_PREFIX}${userType}`
      );
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error("Error getting credentials:", error);
      return null;
    }
  }, []);

  const deleteCredentials = useCallback(async (userType: UserType) => {
    try {
      await SecureStore.deleteItemAsync(`${BIOMETRIC_KEY_PREFIX}${userType}`);
      return true;
    } catch (error) {
      console.error("Error deleting credentials:", error);
      return false;
    }
  }, []);

  const isBiometricEnabled = useCallback(
    async (userType: UserType) => {
      const credentials = await getCredentials(userType);
      return !!credentials;
    },
    [getCredentials]
  );

  return {
    isBiometricSupported,
    biometricType,
    authenticate,
    saveCredentials,
    getCredentials,
    deleteCredentials,
    isBiometricEnabled,
  };
};

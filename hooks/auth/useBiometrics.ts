import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import {
  utils_getAsyncData,
  utils_storeAsyncData,
} from "#utils/app/utils_asyncStorage";

const BIOMETRIC_KEY_PREFIX = "biometric_auth_";
const INSTALL_CHECK_KEY = "app_installed_flag";

export type UserType = "individual" | "artist" | "gallery";

export const clearStaleCredentials = async (): Promise<void> => {
  try {
    const result = await utils_getAsyncData(INSTALL_CHECK_KEY);
    if (!result.isOk) {
      const userTypes: UserType[] = ["individual", "artist", "gallery"];
      for (const userType of userTypes) {
        try {
          await SecureStore.deleteItemAsync(
            `${BIOMETRIC_KEY_PREFIX}${userType}`,
          );
        } catch {}
      }
      await utils_storeAsyncData(INSTALL_CHECK_KEY, "true");
    }
  } catch {}
};

export const useBiometrics = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] =
    useState<LocalAuthentication.AuthenticationType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let compatible = false;
        let enrolled = false;

        try {
          compatible = await LocalAuthentication.hasHardwareAsync();
        } catch {
          compatible = false;
        }

        try {
          enrolled = await LocalAuthentication.isEnrolledAsync();
        } catch {
          enrolled = false;
        }

        setIsBiometricSupported(compatible && enrolled);

        if (compatible) {
          try {
            const types =
              await LocalAuthentication.supportedAuthenticationTypesAsync();
            if (
              types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
            ) {
              setBiometricType(
                LocalAuthentication.AuthenticationType.FINGERPRINT,
              );
            } else if (
              types.includes(
                LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
              )
            ) {
              setBiometricType(
                LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
              );
            }
          } catch {}
        }
      } catch (error) {
        console.error("Biometric initialization error:", error);
        setIsBiometricSupported(false);
        setBiometricType(null);
      }
    })();
  }, []);

  const authenticate = useCallback(
    async (promptMessage: string = "Authenticate") => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware) {
          return {
            success: false,
            error: "Biometrics not supported on this device",
          };
        }

        if (!isEnrolled) {
          Alert.alert(
            "Biometrics Not Set Up",
            "Your device supports biometrics but you haven't set them up. Would you like to go to settings?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Go to Settings", onPress: () => Linking.openSettings() },
            ],
          );
          return { success: false, error: "Biometrics not enrolled" };
        }

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
    [],
  );

  const saveCredentials = useCallback(
    async (userType: UserType, email: string, token: string) => {
      try {
        await SecureStore.setItemAsync(
          `${BIOMETRIC_KEY_PREFIX}${userType}`,
          JSON.stringify({ email, token }),
        );
        return true;
      } catch (error) {
        console.error("Error saving credentials:", error);
        return false;
      }
    },
    [],
  );

  const getCredentials = useCallback(async (userType: UserType) => {
    try {
      const raw = await SecureStore.getItemAsync(
        `${BIOMETRIC_KEY_PREFIX}${userType}`,
      );
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed?.token || !parsed?.email) return null;

      return { email: parsed.email, token: parsed.token };
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
    [getCredentials],
  );

  const getStoredEmail = useCallback(
    async (userType: UserType): Promise<string | null> => {
      try {
        const credentials = await getCredentials(userType);
        return credentials?.email || null;
      } catch (error) {
        console.error("Error getting stored email:", error);
        return null;
      }
    },
    [getCredentials],
  );

  const isCredentialOwner = useCallback(
    async (userType: UserType, currentEmail: string): Promise<boolean> => {
      const storedEmail = await getStoredEmail(userType);
      if (!storedEmail) return false;
      return storedEmail.toLowerCase() === currentEmail.toLowerCase();
    },
    [getStoredEmail],
  );

  return {
    isBiometricSupported,
    biometricType,
    authenticate,
    saveCredentials,
    getCredentials,
    deleteCredentials,
    isBiometricEnabled,
    getStoredEmail,
    isCredentialOwner,
  };
};

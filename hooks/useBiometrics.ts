import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";

const BIOMETRIC_KEY_PREFIX = "biometric_auth_";

export type UserType = "individual" | "artist" | "gallery";

export const useBiometrics = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] =
    useState<LocalAuthentication.AuthenticationType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Wrap each call individually for maximum fault tolerance
        let compatible = false;
        let enrolled = false;

        try {
          compatible = await LocalAuthentication.hasHardwareAsync();
        } catch (e) {
          console.warn("Failed to check biometric hardware:", e);
          compatible = false;
        }

        try {
          enrolled = await LocalAuthentication.isEnrolledAsync();
        } catch (e) {
          console.warn("Failed to check biometric enrollment:", e);
          enrolled = false;
        }

        setIsBiometricSupported(compatible && enrolled);

        if (compatible) {
          try {
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
              setBiometricType(
                LocalAuthentication.AuthenticationType.FINGERPRINT
              );
            }
          } catch (e) {
            console.warn("Failed to get supported biometric types:", e);
            // Leave biometricType as null
          }
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
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Go to Settings",
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]
          );
          return {
            success: false,
            error: "Biometrics not enrolled",
          };
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

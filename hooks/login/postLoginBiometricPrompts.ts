import { Alert } from "react-native";

type LoginData = {
  email: string;
  password: string;
};

export type PostLoginBiometricDeps = Readonly<{
  userType: UserType;
  isBiometricSupported: boolean;
  isBiometricEnabled: (userType: UserType) => Promise<boolean>;
  authenticate: (
    promptMessage?: string,
  ) => Promise<{ success: boolean; error?: string }>;
  saveCredentials: (
    userType: UserType,
    email: string,
    token: string,
  ) => Promise<boolean>;
  getStoredEmail: (userType: UserType) => Promise<string | null>;
  deleteCredentials: (userType: UserType) => Promise<boolean>;
  finalizeLogin: (data: unknown, clearInputs: () => void) => void;
}>;

export function createPostLoginBiometricHandlers({
  userType,
  isBiometricSupported,
  isBiometricEnabled,
  authenticate,
  saveCredentials,
  getStoredEmail,
  deleteCredentials,
  finalizeLogin,
}: PostLoginBiometricDeps) {
  const handleBiometricAuth = async (
    data: unknown,
    loginData: LoginData,
    clearInputs: () => void,
  ) => {
    const bioResult = await authenticate();
    if (bioResult.success) {
      await saveCredentials(userType, loginData.email, loginData.password);
      Alert.alert("Success", "Biometric login enabled");
      finalizeLogin(data, clearInputs);
    } else {
      Alert.alert(
        "Authentication Failed",
        "Could not verify biometric identity. You can enable biometrics later in settings.",
      );
      finalizeLogin(data, clearInputs);
    }
  };

  const processBiometricFlow = async (
    data: unknown,
    loginData: LoginData,
    clearInputs: () => void,
  ) => {
    const biometricEnabled = await isBiometricEnabled(userType);

    if (isBiometricSupported && !biometricEnabled) {
      Alert.alert(
        "Enable Biometric Login",
        "Would you like to enable biometric login for faster access next time?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: () => finalizeLogin(data, clearInputs),
          },
          {
            text: "Yes",
            onPress: () => handleBiometricAuth(data, loginData, clearInputs),
          },
        ],
      );
      return;
    }

    if (isBiometricSupported && biometricEnabled) {
      const storedEmail = await getStoredEmail(userType);
      const isDifferentAccount =
        storedEmail &&
        storedEmail.toLowerCase() !== loginData.email.toLowerCase();

      if (isDifferentAccount) {
        Alert.alert(
          "Enable Biometric Login",
          "Would you like to enable biometric login for your account?",
          [
            {
              text: "No",
              style: "cancel",
              onPress: async () => {
                await deleteCredentials(userType);
                finalizeLogin(data, clearInputs);
              },
            },
            {
              text: "Yes",
              onPress: () => handleBiometricAuth(data, loginData, clearInputs),
            },
          ],
        );
      } else {
        finalizeLogin(data, clearInputs);
      }
      return;
    }

    finalizeLogin(data, clearInputs);
  };

  return { processBiometricFlow };
}

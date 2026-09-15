import { useEffect, useRef, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { registerAccount } from "#services/auth/registerAccount";
import { useModalStore } from "#store/account/modal/modalStore";
import { useAppStore } from "#store/app/appStore";
import { screenName } from "#constants/screenNames.constants";
import { storage } from "#config/appwrite.client";
import uploadLogo from "#services/auth/uploadLogo";
import { Analytics } from "#utils/core/analytics";
import {
  registrationResponseForAnalytics,
  extractVerifyEmailIdFromRegisterBody,
} from "#hooks/auth/register/registerResponseUtils";

type AccountType = "individual" | "gallery" | "artist";

/** Non-PII shape for analytics only (no name, phone, email, preferences values). */
function registrationFingerprintForAnalytics(data: Record<string, unknown>) {
  return {
    has_phone:
      typeof data.phone === "string" && data.phone.trim().length > 0,
    has_preferences:
      Array.isArray(data.preferences) && data.preferences.length > 0,
    preferences_count: Array.isArray(data.preferences)
      ? data.preferences.length
      : 0,
  };
}

function sanitizeErrorMessage(message: unknown) {
  if (typeof message !== "string")
    return "Something went wrong. Please try again.";

  if (message.toLowerCase().includes("unable to resolve data for blob")) {
    return "A temporary device data error occurred. Please restart the app and try again.";
  }

  return message;
}

function normalizeEmailInPayload<T extends Record<string, unknown>>(rest: T) {
  if (typeof rest.email !== "string") return rest;
  return { ...rest, email: rest.email.trim().toLowerCase() } as T;
}

const cleanLogoFile = async (uploadedFileId: string | null) => {
  if (!uploadedFileId) return;
  try {
    await storage.deleteFile({
      bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
      fileId: uploadedFileId,
    });
  } catch {
    // best-effort cleanup
  }
};

const uploadLogoAsset = async (logoData: any): Promise<string> => {
  const logoAsset = logoData?.assets?.[0];
  if (!logoAsset?.uri) {
    throw new Error("Please select a valid image before creating account.");
  }

  const files = {
    uri: logoAsset.uri,
    name: logoAsset.fileName || `logo-${Date.now()}.jpg`,
    type: logoAsset.mimeType || "image/jpeg",
    size: logoAsset.fileSize ?? 0,
  };

  const fileUploaded = await uploadLogo(files);
  if (!fileUploaded) {
    throw new Error("Failed to upload logo");
  }

  return fileUploaded.$id;
};

export function useRegistrationHandler(accountType: AccountType) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const isMountedRef = useRef(true);
  const { updateModal } = useModalStore();
  const { expoPushToken } = useAppStore();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeUpdateModal = useCallback(
    (args: Parameters<typeof updateModal>[0]) => {
      if (isMountedRef.current) updateModal(args);
    },
    [updateModal],
  );

  const onRegistrationSuccess = useCallback(
    (verifyId: string, resultsBody: any, data: any, clearState: () => void) => {
      Analytics.track("registration_success", {
        account_type: accountType,
        registration_data: registrationFingerprintForAnalytics(
          data as Record<string, unknown>,
        ),
        user_id: verifyId,
        response: registrationResponseForAnalytics(resultsBody, accountType),
      });

      clearState();
      if (isMountedRef.current) {
        navigation.navigate(screenName.verifyEmail, {
          account: { id: verifyId, type: accountType },
        });
      }
    },
    [accountType, navigation],
  );

  const handleRegister = async (
    data: any,
    clearState: () => void,
    setIsLoading: (loading: boolean) => void,
  ) => {
    let uploadedFileId: string | null = null;
    try {
      setIsLoading(true);

      const { confirmPassword, ...restRaw } = data;
      const rest = normalizeEmailInPayload(restRaw as Record<string, unknown>);
      const payload: Record<string, unknown> = {
        ...rest,
        device_push_token: expoPushToken ?? "",
      };

      if ((accountType === "gallery" || accountType === "artist") && data.logo) {
        uploadedFileId = await uploadLogoAsset(data.logo);
        payload.logo = uploadedFileId;
      }

      const results = await registerAccount(
        payload as Parameters<typeof registerAccount>[0],
        accountType,
      );

      if (!results?.isOk) {
        const statusCode = (results as { status?: number })?.status;
        if (statusCode && statusCode >= 500) {
          Analytics.track("registration_failed", {
            account_type: accountType,
            registration_data: registrationFingerprintForAnalytics(
              data as Record<string, unknown>,
            ),
            status_code: statusCode,
            message: results?.body?.message,
            response: registrationResponseForAnalytics(
              results?.body,
              accountType,
            ),
          });
        }

        await cleanLogoFile(uploadedFileId);

        safeUpdateModal({
          message: sanitizeErrorMessage(results?.body?.message),
          modalType: "error",
          showModal: true,
        });
        return;
      }

      const verifyId = extractVerifyEmailIdFromRegisterBody(
        results.body,
        accountType,
      );

      if (!verifyId) {
        Analytics.track("registration_failed", {
          account_type: accountType,
          registration_data: registrationFingerprintForAnalytics(
            data as Record<string, unknown>,
          ),
          error_type: "invalid_success_payload",
          message: "Missing or invalid verify id in register response",
        });

        await cleanLogoFile(uploadedFileId);

        safeUpdateModal({
          message:
            "We could not finish signup from the server response. Please try again or contact support.",
          modalType: "error",
          showModal: true,
        });
        return;
      }

      onRegistrationSuccess(verifyId, results.body, data, clearState);
    } catch (error: unknown) {
      await cleanLogoFile(uploadedFileId);

      const err = error as {
        message?: string;
        name?: string;
        body?: { message?: string };
      };
      const rawMessage =
        typeof err?.message === "string" ? err.message : "Registration failed";

      Analytics.track("registration_failed", {
        account_type: accountType,
        registration_data: registrationFingerprintForAnalytics(
          data as Record<string, unknown>,
        ),
        message: rawMessage.slice(0, 200),
        error_code: error instanceof Error ? error.name : "unknown",
        error_type: "exception",
      });

      safeUpdateModal({
        message: sanitizeErrorMessage(
          err.message || err?.body?.message || "Registration failed",
        ),
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister };
}

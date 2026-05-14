import { useEffect, useRef, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { registerAccount } from "#services/register/registerAccount";
import { useModalStore } from "#store/modal/modalStore";
import { useAppStore } from "#store/app/appStore";
import { screenName } from "../constants/screenNames.constants";
import { storage } from "#appWrite_config";
import uploadLogo from "../screens/galleryProfileScreens/uploadNewLogo/uploadLogo";
import { Analytics } from "#utils/analytics";
import {
  registrationResponseForAnalytics,
  extractVerifyEmailIdFromRegisterBody,
} from "#hooks/register/registerResponseUtils";

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
      let payload: Record<string, unknown> = {
        ...rest,
        device_push_token: expoPushToken ?? "",
      };

      if (
        (accountType === "gallery" || accountType === "artist") &&
        data.logo
      ) {
        const logoAsset = data.logo?.assets?.[0];
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

        uploadedFileId = fileUploaded.$id;
        payload.logo = uploadedFileId;
      }

      const results = await registerAccount(
        payload as Parameters<typeof registerAccount>[0],
        accountType,
      );

      if (results?.isOk) {
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

          if (uploadedFileId) {
            await storage.deleteFile({
              bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
              fileId: uploadedFileId,
            });
          }

          safeUpdateModal({
            message:
              "We could not finish signup from the server response. Please try again or contact support.",
            modalType: "error",
            showModal: true,
          });
          return;
        }

        Analytics.track("registration_success", {
          account_type: accountType,
          registration_data: registrationFingerprintForAnalytics(
            data as Record<string, unknown>,
          ),
          user_id: verifyId,
          response: registrationResponseForAnalytics(
            results.body,
            accountType,
          ),
        });

        clearState();
        if (isMountedRef.current) {
          navigation.navigate(screenName.verifyEmail, {
            account: { id: verifyId, type: accountType },
          });
        }
      } else {
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

        if (uploadedFileId) {
          await storage.deleteFile({
            bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
            fileId: uploadedFileId,
          });
        }

        safeUpdateModal({
          message: sanitizeErrorMessage(results?.body?.message),
          modalType: "error",
          showModal: true,
        });
      }
    } catch (error: unknown) {
      if (uploadedFileId) {
        try {
          await storage.deleteFile({
            bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
            fileId: uploadedFileId,
          });
        } catch {
          // best-effort cleanup
        }
      }

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
        message:
          sanitizeErrorMessage(
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

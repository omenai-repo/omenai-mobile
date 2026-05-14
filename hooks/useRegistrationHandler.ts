import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { registerAccount } from "#services/register/registerAccount";
import { useModalStore } from "#store/modal/modalStore";
import { useAppStore } from "#store/app/appStore";
import { screenName } from "../constants/screenNames.constants";
import { storage } from "#appWrite_config";
import uploadLogo from "../screens/galleryProfileScreens/uploadNewLogo/uploadLogo";
import { Analytics } from "#utils/analytics";

type AccountType = "individual" | "gallery" | "artist";

const REGISTRATION_ACCOUNT_ID_KEY = {
  individual: "user_id",
  gallery: "gallery_id",
  artist: "artist_id",
} as const;

type RegistrationAnalyticsResponse = {
  id?: string;
  email?: string;
  verified?: boolean;
};

/** API `body` (parsed JSON) → only id, email, verified for analytics. */
function registrationResponseForAnalytics(
  body: unknown,
  accountType: AccountType,
): RegistrationAnalyticsResponse {
  if (!body || typeof body !== "object") return {};

  const b = body as Record<string, unknown>;
  const idKey = REGISTRATION_ACCOUNT_ID_KEY[accountType];
  const rawData = b.data;

  if (typeof rawData === "string") {
    return {
      id: rawData,
      ...(typeof b.email === "string" ? { email: b.email } : {}),
      ...(typeof b.verified === "boolean" ? { verified: b.verified } : {}),
    };
  }

  if (rawData && typeof rawData === "object" && !Array.isArray(rawData)) {
    const d = rawData as Record<string, unknown>;
    const id =
      (typeof d[idKey] === "string" && d[idKey]) ||
      (typeof d.user_id === "string" && d.user_id) ||
      (typeof d.gallery_id === "string" && d.gallery_id) ||
      (typeof d.artist_id === "string" && d.artist_id) ||
      (typeof d.id === "string" && d.id) ||
      undefined;
    const email =
      (typeof d.email === "string" && d.email) ||
      (typeof b.email === "string" && b.email) ||
      undefined;
    const verified =
      typeof d.verified === "boolean"
        ? d.verified
        : typeof b.verified === "boolean"
          ? b.verified
          : undefined;

    return {
      ...(id ? { id } : {}),
      ...(email ? { email } : {}),
      ...(typeof verified === "boolean" ? { verified } : {}),
    };
  }

  const topId =
    (typeof b[idKey] === "string" && b[idKey]) ||
    (typeof b.id === "string" && b.id) ||
    undefined;

  return {
    ...(topId ? { id: topId as string } : {}),
    ...(typeof b.email === "string" ? { email: b.email } : {}),
    ...(typeof b.verified === "boolean" ? { verified: b.verified } : {}),
  };
}

/** Strip secrets / heavy PII before sending registration form data to analytics. */
function registrationDataForAnalytics(data: Record<string, unknown>) {
  const { password, confirmPassword, address, ...rest } = data;
  return rest;
}

export function useRegistrationHandler(accountType: AccountType) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal } = useModalStore();
  const { expoPushToken } = useAppStore();

  const handleRegister = async (
    data: any,
    clearState: () => void,
    setIsLoading: (loading: boolean) => void,
  ) => {
    try {
      setIsLoading(true);

      const { confirmPassword, ...rest } = data;
      let payload = { ...rest, device_push_token: expoPushToken ?? "" };

      let uploadedFileId: string | null = null;

      // Handle logo upload for gallery and artist
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

      const results = await registerAccount(payload, accountType);

      if (results?.isOk) {
        // Track successful registration with all context
        Analytics.track("registration_success", {
          account_type: accountType,
          registration_data: registrationDataForAnalytics(data),
          user_id: results.body.data,
          response: registrationResponseForAnalytics(results.body, accountType),
        });

        clearState();
        navigation.navigate(screenName.verifyEmail, {
          account: { id: results.body.data, type: accountType },
        });
      } else {
        // Track registration failure only for server errors (500+)
        const statusCode = (results as any)?.status;
        if (statusCode && statusCode >= 500) {
          Analytics.track("registration_failed", {
            account_type: accountType,
            registration_data: registrationDataForAnalytics(data),
            status_code: statusCode,
            message: results?.body.message,
            response: registrationResponseForAnalytics(
              results?.body,
              accountType,
            ),
          });
        }

        // Clean up uploaded file if registration failed
        if (uploadedFileId) {
          await storage.deleteFile({
            bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
            fileId: uploadedFileId,
          });
        }

        updateModal({
          message: results?.body.message,
          modalType: "error",
          showModal: true,
        });
      }
    } catch (error: any) {
      // Track unexpected registration error
      Analytics.track("registration_failed", {
        account_type: accountType,
        registration_data: registrationDataForAnalytics(data),
        message: error.message || "Registration failed",
        error: error,
        error_type: "exception",
      });

      updateModal({
        message: error.message || error?.body?.message || "Registration failed",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister };
}

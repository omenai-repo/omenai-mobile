import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { registerAccount } from "services/register/registerAccount";
import { useModalStore } from "store/modal/modalStore";
import { useAppStore } from "store/app/appStore";
import { screenName } from "constants/screenNames.constants";
import { storage } from "appWrite_config";
import uploadLogo from "screens/galleryProfileScreens/uploadNewLogo/uploadLogo";

type AccountType = "individual" | "gallery" | "artist";

export function useRegistrationHandler(accountType: AccountType) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal } = useModalStore();
  const { expoPushToken } = useAppStore();

  const handleRegister = async (
    data: any,
    clearState: () => void,
    setIsLoading: (loading: boolean) => void
  ) => {
    try {
      setIsLoading(true);

      let payload = { ...data, device_push_token: expoPushToken ?? "" };
      let uploadedFileId: string | null = null;

      // Handle logo upload for gallery and artist
      if ((accountType === "gallery" || accountType === "artist") && data.logo) {
        const files = {
          uri: data.logo.assets[0].uri,
          name: data.logo.assets[0].fileName,
          type: data.logo.assets[0].mimeType,
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
        clearState();
        navigation.navigate(screenName.verifyEmail, {
          account: { id: results.body.data, type: accountType },
        });
      } else {
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
      updateModal({
        message: error.message || "Registration failed",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister };
}

import * as Sentry from '@sentry/react-native';
import { registerAccount } from 'services/register/registerAccount';
import { StackNavigationProp } from '@react-navigation/stack';
import uploadLogo from 'screens/galleryProfileScreens/uploadNewLogo/uploadLogo';
import { storage } from 'appWrite_config';

interface BaseRegisterProps {
  setIsLoading: (loading: boolean) => void;
  clearState: () => void;
  updateModal: (params: {
    showModal: boolean;
    modalType: 'error' | 'success';
    message: string;
  }) => void;
  navigation: StackNavigationProp<any>;
  logo?: any;
}

type HandleRegisterProps =
  | ({
      accountType: 'individual';
      payload: Omit<IndividualRegisterData, 'confirmPassword'> & { preferences: string[] };
    } & BaseRegisterProps)
  | ({ accountType: 'artist'; payload: ArtistRegisterData; logo: any } & BaseRegisterProps)
  | ({ accountType: 'gallery'; payload: GalleryRegisterData; logo: any } & BaseRegisterProps);

export const handleRegister = async ({
  accountType,
  payload,
  setIsLoading,
  clearState,
  updateModal,
  navigation,
  logo,
}: HandleRegisterProps) => {
  try {
    setIsLoading(true);

    let uploadedFile: { bucketId: string; fileId: string } | null = null;

    // ✅ Upload logo if provided
    if ((accountType === 'artist' || accountType === 'gallery') && logo) {
      const files = {
        uri: logo.assets[0].uri,
        name: logo.assets[0].fileName,
        type: logo.assets[0].mimeType,
      };

      const fileUploaded = await uploadLogo(files);
      if (!fileUploaded) {
        updateModal({
          message: 'Failed to upload logo. Try again.',
          modalType: 'error',
          showModal: true,
        });
        return;
      }

      uploadedFile = { bucketId: fileUploaded.bucketId, fileId: fileUploaded.$id };
      payload.logo = uploadedFile.fileId;
    }

    // Register API
    const result = await registerAccount(payload, accountType);

    if (!result?.isOk) {
      // Cleanup file if upload happened but backend failed
      if (uploadedFile) {
        try {
          await storage.deleteFile({
            bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
            fileId: uploadedFile.fileId,
          });
        } catch {}
      }

      updateModal({
        message: result?.body?.message || 'Registration failed',
        modalType: 'error',
        showModal: true,
      });
      return;
    }

    const body = result.body;
    clearState();

    navigation.navigate('VerifyEmail', {
      account: { id: body.data, type: accountType },
    });
  } catch (error: any) {
    Sentry.captureException(error);
    updateModal({
      message: error.message,
      modalType: 'error',
      showModal: true,
    });
  } finally {
    setIsLoading(false);
  }
};

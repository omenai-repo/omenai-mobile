import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as Sentry from '@sentry/react-native';
import tw from 'twrnc';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import BackFormButton from 'components/buttons/BackFormButton';
import { useGalleryAuthRegisterStore } from '../../../../store/auth/register/GalleryAuthRegisterStore';
import { colors } from '../../../../config/colors.config';
import { registerAccount } from 'services/register/registerAccount';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { useModalStore } from 'store/modal/modalStore';
import { storage } from 'appWrite_config';
import uploadLogo from 'screens/galleryProfileScreens/uploadNewLogo/uploadLogo';
import { useAppStore } from 'store/app/appStore';
import * as WebBrowser from 'expo-web-browser';
import { acceptTermsList } from 'constants/accetTerms.constants';
import TermsAndConditionItem from 'components/general/TermsAndConditionItem';

export default function TermsAndConditions() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {
    selectedTerms,
    setSelectedTerms,
    pageIndex,
    setPageIndex,
    isLoading,
    setIsLoading,
    galleryRegisterData,
    clearState,
  } = useGalleryAuthRegisterStore();

  const { updateModal } = useModalStore();
  const { expoPushToken } = useAppStore();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      Sentry.addBreadcrumb({
        category: 'user.action',
        message: 'Gallery registration initiated (Terms screen)',
        level: 'info',
      });

      const { name, email, password, admin, address, description, logo, phone } =
        galleryRegisterData;

      if (logo === null) {
        Sentry.addBreadcrumb({
          category: 'validation',
          message: 'Gallery registration aborted: missing logo',
          level: 'warning',
        });
        updateModal({
          message: 'Please upload a logo before proceeding',
          modalType: 'error',
          showModal: true,
        });
        setIsLoading(false);
        return;
      }

      const files = {
        uri: logo.assets[0].uri,
        name: logo.assets[0].fileName,
        type: logo.assets[0].mimeType,
      };

      Sentry.addBreadcrumb({
        category: 'network',
        message: 'uploadLogo - start',
        level: 'info',
      });

      const fileUploaded = await uploadLogo(files);

      if (fileUploaded) {
        Sentry.addBreadcrumb({
          category: 'network',
          message: `uploadLogo - success (fileId: ${fileUploaded.$id})`,
          level: 'info',
        });

        let file: { bucketId: string; fileId: string } = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };

        const payload = {
          name,
          email,
          password,
          admin,
          description,
          logo: file.fileId,
          address,
          phone,
          device_push_token: expoPushToken,
        };

        Sentry.addBreadcrumb({
          category: 'network',
          message: 'registerAccount - start (gallery)',
          level: 'info',
        });

        const results = await registerAccount(payload, 'gallery');

        if (results?.isOk) {
          Sentry.addBreadcrumb({
            category: 'network',
            message: 'registerAccount succeeded (gallery)',
            level: 'info',
          });

          const resultsBody = results?.body;
          clearState();
          navigation.navigate(screenName.verifyEmail, {
            account: { id: resultsBody.data, type: 'gallery' },
          });
        } else {
          // cleanup uploaded file on failure and capture context (no PII)
          try {
            await storage.deleteFile({
              bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
              fileId: file.fileId,
            });
            Sentry.addBreadcrumb({
              category: 'network',
              message: `uploadLogo cleaned up (fileId: ${file.fileId})`,
              level: 'info',
            });
          } catch (error) {
            Sentry.addBreadcrumb({
              category: 'exception',
              message: `Failed to cleanup uploaded logo ${file.fileId}`,
              level: 'warning',
            });
            Sentry.captureException(error);
          }

          Sentry.setContext('registerResponse', {
            status: results?.isOk ?? null,
            message: results?.body?.message ?? null,
          });
          Sentry.captureMessage('registerAccount returned non-ok (gallery)', 'error');

          updateModal({
            message: results?.body.message,
            modalType: 'error',
            showModal: true,
          });
        }
      } else {
        Sentry.addBreadcrumb({
          category: 'network',
          message: 'uploadLogo returned falsy result',
          level: 'error',
        });
        updateModal({
          message: 'Failed to upload logo. Please try again.',
          modalType: 'error',
          showModal: true,
        });
      }
    } catch (error: any) {
      Sentry.addBreadcrumb({
        category: 'exception',
        message: 'Gallery registration threw exception',
        level: 'error',
      });
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

  const handleAcceptTerms = (index: number) => {
    Sentry.addBreadcrumb({
      category: 'ui',
      message: `Toggled gallery terms checkbox ${index}`,
      level: 'info',
    });

    if (selectedTerms.includes(index)) {
      setSelectedTerms(selectedTerms.filter((selectedTab) => selectedTab !== index));
    } else {
      setSelectedTerms([...selectedTerms, index]);
    }
  };

  // Open the Terms of Use and Privacy Policy link inside the app
  const openLegalLink = async () => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Opening legal link (gallery)',
      level: 'info',
    });

    try {
      await WebBrowser.openBrowserAsync('https://omenai.app/legal?ent=gallery');
    } catch (error) {
      Sentry.addBreadcrumb({
        category: 'exception',
        message: 'openLegalLink failed (gallery)',
        level: 'error',
      });
      Sentry.captureException(error);

      updateModal({
        showModal: true,
        modalType: 'error',
        message: 'Something went wrong while opening the Terms of Agreement.',
      });
    }
  };

  return (
    <View>
      <Text style={styles.title}>Accept terms and conditions</Text>
      <View style={styles.termsContainer}>
        {acceptTermsList.map((i, idx) => (
          <TermsAndConditionItem
            writeUp={i}
            key={idx}
            isSelected={selectedTerms.includes(idx)}
            handleSelect={() => handleAcceptTerms(idx)}
          />
        ))}
      </View>

      {/* ⬇️ Link to Privacy Policy and Terms of Use */}
      <Pressable onPress={openLegalLink} style={tw`mt-[20px]`}>
        <Text style={tw`text-[14px] text-[#007AFF] text-center underline`}>
          Read our Privacy Policy and Terms of Use
        </Text>
      </Pressable>

      <View style={styles.buttonsContainer}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <FittedBlackButton
          isLoading={isLoading}
          height={50}
          value="Create my account"
          isDisabled={!selectedTerms.includes(0)}
          onClick={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 60,
  },
  termsContainer: {
    marginTop: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 30,
  },
});

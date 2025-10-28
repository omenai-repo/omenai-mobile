import { View, Text, Pressable } from 'react-native';
import React from 'react';
import * as Sentry from '@sentry/react-native';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { checkedBox, uncheckedBox } from 'utils/SvgImages';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import BackFormButton from 'components/buttons/BackFormButton';
import { useArtistAuthRegisterStore } from 'store/auth/register/ArtistAuthRegisterStore';
import { useModalStore } from 'store/modal/modalStore';
import uploadLogo from 'screens/galleryProfileScreens/uploadNewLogo/uploadLogo';
import { registerAccount } from 'services/register/registerAccount';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from 'constants/screenNames.constants';
import { storage } from 'appWrite_config';
import { useAppStore } from 'store/app/appStore';
import * as WebBrowser from 'expo-web-browser';

const TermsAndCondition = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {
    selectedTerms,
    setSelectedTerms,
    pageIndex,
    setPageIndex,
    setIsLoading,
    artistRegisterData,
    clearState,
    isLoading,
  } = useArtistAuthRegisterStore();
  const { expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();

  const checks = [
    {
      id: 0,
      text: 'I have read and agree to the terms stated above.',
    },
    {
      id: 1,
      text: 'By ticking this box, I accept the Terms of use and Privacy Policy of creating an account with Omenai.',
    },
    {
      id: 2,
      text: 'By ticking this box, I agree to subscribing to Omenai’s mailing list and receiving promotional emails.',
    },
  ];

  const handleCheckPress = (id: number) => {
    Sentry.addBreadcrumb({
      category: 'ui',
      message: `Toggled artist terms checkbox ${id}`,
      level: 'info',
    });

    if (selectedTerms.includes(id)) {
      setSelectedTerms(selectedTerms.filter((checkId: number) => checkId !== id));
    } else {
      setSelectedTerms([...selectedTerms, id]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      Sentry.addBreadcrumb({
        category: 'user.action',
        message: 'Artist registration initiated',
        level: 'info',
      });

      const { name, email, password, address, logo, art_style, phone, base_currency } =
        artistRegisterData;

      if (!logo) {
        Sentry.addBreadcrumb({
          category: 'validation',
          message: 'Artist registration aborted: missing logo',
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

      // prepare file for upload
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

      if (!fileUploaded) {
        Sentry.addBreadcrumb({
          category: 'network',
          message: 'uploadLogo - returned falsy result',
          level: 'error',
        });
        updateModal({
          message: 'Failed to upload logo. Please try again.',
          modalType: 'error',
          showModal: true,
        });
        setIsLoading(false);
        return;
      }

      Sentry.addBreadcrumb({
        category: 'network',
        message: `uploadLogo - success (fileId: ${fileUploaded.$id})`,
        level: 'info',
      });

      const payload = {
        name,
        email,
        password,
        logo: fileUploaded.$id,
        address,
        art_style,
        base_currency,
        phone,
        device_push_token: expoPushToken ?? '',
      };

      Sentry.addBreadcrumb({
        category: 'network',
        message: 'registerAccount - start',
        level: 'info',
      });

      const results = await registerAccount(payload, 'artist');

      if (results?.isOk) {
        Sentry.addBreadcrumb({
          category: 'network',
          message: 'registerAccount succeeded',
          level: 'info',
        });

        clearState();
        navigation.navigate(screenName.verifyEmail, {
          account: { id: results.body.data, type: 'artist' },
        });
      } else {
        try {
          await storage.deleteFile({
            bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
            fileId: fileUploaded.$id,
          });
          Sentry.addBreadcrumb({
            category: 'network',
            message: `uploadLogo cleaned up (fileId: ${fileUploaded.$id})`,
            level: 'info',
          });
        } catch (cleanupErr) {
          Sentry.addBreadcrumb({
            category: 'exception',
            message: `Failed to cleanup uploaded logo ${fileUploaded.$id}`,
            level: 'warning',
          });
          Sentry.captureException(cleanupErr);
        }

        Sentry.setContext('registerResponse', {
          status: results?.isOk ?? null,
          message: results?.body?.message ?? null,
        });
        Sentry.captureMessage('registerAccount returned non-ok (artist)', 'error');

        updateModal({
          message: results?.body.message,
          modalType: 'error',
          showModal: true,
        });
      }
    } catch (error: any) {
      Sentry.addBreadcrumb({
        category: 'exception',
        message: 'Artist registration threw exception',
        level: 'error',
      });
      Sentry.captureException(error);

      updateModal({
        message: error?.message ?? 'Something went wrong during registration',
        modalType: 'error',
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const Conatiner = ({ onPress, text, id }: { onPress: () => void; text: string; id: number }) => (
    <Pressable onPress={onPress} style={tw`flex-row gap-[15px]`}>
      <SvgXml xml={selectedTerms.includes(id) ? checkedBox : uncheckedBox} />
      <Text style={tw`text-[14px] text-[#858585] leading-[20px] mr-[30px]`}>{text}</Text>
    </Pressable>
  );

  const isProceedDisabled =
    !selectedTerms.includes(0) || !selectedTerms.includes(2) || !selectedTerms.includes(1);

  // Open the Terms of Use and Privacy Policy link inside the app
  const openLegalLink = async () => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Opening legal link (artist)',
      level: 'info',
    });

    try {
      await WebBrowser.openBrowserAsync('https://omenai.app/legal?ent=artist');
    } catch (error) {
      Sentry.addBreadcrumb({
        category: 'exception',
        message: 'openLegalLink failed',
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
      <Text style={tw`text-[16px] font-semibold mb-[20px]`}>Accept terms and conditions</Text>

      {/* ⬇️ Informational Section */}
      <View style={tw`mb-[20px]`}>
        <Text style={tw`text-[15px] font-semibold text-black mb-[8px]`}>Please note:</Text>
        <View style={tw`ml-[10px]`}>
          <Text style={tw`text-[13px] text-gray-700 leading-[20px] mb-[5px]`}>
            • The platform takes a 35% commission on each artwork sale which covers marketing,
            platform visibility, payment processing, shipping coordination, and customer service.
          </Text>
          <Text style={tw`text-[13px] text-gray-700 leading-[20px]`}>
            • All potential artists on the platform must undergo a mandatory onboarding and
            verification process before accessing core platform features.
          </Text>
        </View>
      </View>

      {/* ⬇️ Checkboxes */}
      <View
        style={tw`border-[0.96px] border-[#E0E0E0] bg-[#FAFAFA] rounded-[8px] pl-[15px] pr-[25px] pt-[20px] py-[30px] gap-[25px]`}
      >
        {checks.map((item) => (
          <Conatiner
            key={item.id}
            id={item.id}
            text={item.text}
            onPress={() => handleCheckPress(item.id)}
          />
        ))}
      </View>

      {/* ⬇️ Link to Privacy Policy and Terms of Use */}
      <Pressable onPress={openLegalLink} style={tw`mt-[20px]`}>
        <Text style={tw`text-[14px] text-[#007AFF] text-center underline`}>
          Read our Privacy Policy and Terms of Use
        </Text>
      </Pressable>

      {/* ⬇️ Navigation Buttons */}
      <View style={tw`flex-row mt-[40px]`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} disabled={isLoading} />
        <View style={{ flex: 1 }} />
        <FittedBlackButton
          isLoading={isLoading}
          height={50}
          value="Proceed"
          isDisabled={isProceedDisabled}
          onClick={handleSubmit}
        />
      </View>
    </View>
  );
};

export default TermsAndCondition;

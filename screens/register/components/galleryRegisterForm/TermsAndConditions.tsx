import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as Sentry from '@sentry/react-native';
import tw from 'twrnc';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import BackFormButton from 'components/buttons/BackFormButton';
import { useGalleryAuthRegisterStore } from '../../../../store/auth/register/GalleryAuthRegisterStore';
import { colors } from '../../../../config/colors.config';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useModalStore } from 'store/modal/modalStore';
import { useAppStore } from 'store/app/appStore';
import * as WebBrowser from 'expo-web-browser';
import { acceptTermsList } from 'constants/accetTerms.constants';
import TermsAndConditionItem from 'components/general/TermsAndConditionItem';
import { handleRegister } from 'utils/handleRegister';

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
    if (galleryRegisterData.logo === null) {
      updateModal({
        message: 'Please upload a logo before proceeding',
        modalType: 'error',
        showModal: true,
      });
      return;
    }

    const { name, email, password, admin, address, description, logo, phone } = galleryRegisterData;

    const payload = {
      name,
      email,
      password,
      admin,
      description,
      address,
      phone,
      device_push_token: expoPushToken ?? '',
      logo: '',
    };

    await handleRegister({
      payload,
      accountType: 'gallery',
      navigation,
      setIsLoading,
      updateModal,
      clearState,
      logo,
    });
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

import { View, Text, Pressable } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import * as Sentry from '@sentry/react-native';
import * as WebBrowser from 'expo-web-browser';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import BackFormButton from 'components/buttons/BackFormButton';
import { checkedBox, uncheckedBox } from 'utils/SvgImages';
import { useArtistAuthRegisterStore } from 'store/auth/register/ArtistAuthRegisterStore';
import { useModalStore } from 'store/modal/modalStore';
import { useAppStore } from 'store/app/appStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { handleRegister } from 'utils/handleRegister';

const checks = [
  'I have read and agree to the terms stated above.',
  'By ticking this box, I accept the Terms of use and Privacy Policy of creating an account with Omenai.',
  'By ticking this box, I agree to subscribing to Omenai’s mailing list and receiving promotional emails.',
];

export default function ArtistTermsAndCondition() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { expoPushToken } = useAppStore();
  const { updateModal } = useModalStore();

  const {
    selectedTerms,
    setSelectedTerms,
    pageIndex,
    setPageIndex,
    artistRegisterData,
    clearState,
    isLoading,
    setIsLoading,
  } = useArtistAuthRegisterStore();

  const toggleCheck = (i: number) => {
    setSelectedTerms(
      selectedTerms.includes(i) ? selectedTerms.filter((id) => id !== i) : [...selectedTerms, i],
    );
  };

  const isProceedDisabled = checks.some((_, idx) => !selectedTerms.includes(idx));

  const openLegalLink = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://omenai.app/legal?ent=artist');
    } catch (e) {
      Sentry.captureException(e);
      updateModal({
        showModal: true,
        modalType: 'error',
        message: 'Unable to open Terms & Privacy Policy page.',
      });
    }
  };

  const { name, email, password, address, logo, art_style, phone, base_currency } =
    artistRegisterData;

  const handleSubmit = async () => {
    if (!logo) {
      updateModal({
        message: 'Please upload a logo before proceeding',
        modalType: 'error',
        showModal: true,
      });
      return;
    }

    const payload = {
      name,
      email,
      password,
      logo: '',
      address,
      art_style,
      base_currency,
      phone,
      device_push_token: expoPushToken ?? '',
    };

    await handleRegister({
      accountType: 'artist',
      payload,
      navigation,
      setIsLoading,
      clearState,
      updateModal,
      logo,
    });
  };

  return (
    <View>
      <Text style={tw`text-[16px] font-semibold mb-[20px]`}>Accept terms and conditions</Text>

      {/* Info */}
      <View style={tw`mb-[20px]`}>
        <Text style={tw`text-[15px] font-semibold text-black mb-[8px]`}>Please note:</Text>
        <View style={tw`ml-[10px]`}>
          <Text style={tw`text-[13px] text-gray-700 leading-[20px] mb-[5px]`}>
            • Omenai takes a 35% commission on each artwork sale.
          </Text>
          <Text style={tw`text-[13px] text-gray-700 leading-[20px]`}>
            • Artists must undergo onboarding & verification before accessing features.
          </Text>
        </View>
      </View>

      {/* Checks */}
      <View style={tw`border border-[#E0E0E0] bg-[#FAFAFA] rounded-[8px] p-[20px] gap-[25px]`}>
        {checks.map((text, idx) => (
          <Pressable key={idx} onPress={() => toggleCheck(idx)} style={tw`flex-row gap-[15px]`}>
            <SvgXml xml={selectedTerms.includes(idx) ? checkedBox : uncheckedBox} />
            <Text style={tw`text-[14px] text-[#858585] leading-[20px] mr-[30px]`}>{text}</Text>
          </Pressable>
        ))}
      </View>

      {/* Links */}
      <Pressable onPress={openLegalLink} style={tw`mt-[20px]`}>
        <Text style={tw`text-[14px] text-[#007AFF] text-center underline`}>
          Read our Privacy Policy and Terms of Use
        </Text>
      </Pressable>

      {/* Buttons */}
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
}

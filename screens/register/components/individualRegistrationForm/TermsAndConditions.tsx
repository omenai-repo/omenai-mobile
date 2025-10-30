import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import * as Sentry from '@sentry/react-native';
import * as WebBrowser from 'expo-web-browser';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import BackFormButton from 'components/buttons/BackFormButton';
import { colors } from 'config/colors.config';
import { acceptTermsList } from 'constants/accetTerms.constants';
import TermsAndConditionItem from 'components/general/TermsAndConditionItem';
import { useIndividualAuthRegisterStore } from 'store/auth/register/IndividualAuthRegisterStore';
import { useModalStore } from 'store/modal/modalStore';
import { useAppStore } from 'store/app/appStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { handleRegister } from 'utils/handleRegister';
import tw from 'twrnc';

export default function TermsAndConditions() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {
    preferences,
    individualRegisterData,
    pageIndex,
    setPageIndex,
    selectedTerms,
    setSelectedTerms,
    isLoading,
    setIsLoading,
    clearState,
  } = useIndividualAuthRegisterStore();
  const { updateModal } = useModalStore();
  const { expoPushToken } = useAppStore();

  const handleAcceptTerms = (index: number) => {
    if (selectedTerms.includes(index)) {
      setSelectedTerms(selectedTerms.filter((i) => i !== index));
    } else {
      setSelectedTerms([...selectedTerms, index]);
    }
  };

  const openLegalLink = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://omenai.app/legal?ent=collector');
    } catch (error) {
      Sentry.captureException(error);
      updateModal({
        showModal: true,
        modalType: 'error',
        message: 'Something went wrong while opening the Terms of Agreement.',
      });
    }
  };

  const data: Omit<IndividualRegisterData, 'confirmPassword'> & {
    preferences: string[];
    device_push_token: string;
  } = {
    ...individualRegisterData,
    preferences,
    device_push_token: expoPushToken ?? '',
  };

  const handleSubmit = () =>
    handleRegister({
      accountType: 'individual',
      navigation,
      payload: data,
      setIsLoading,
      clearState,
      updateModal,
    });

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.title}>Accept terms and conditions</Text>

      <View style={styles.termsContainer}>
        {acceptTermsList.map((text, idx) => (
          <TermsAndConditionItem
            key={idx}
            writeUp={text}
            isSelected={selectedTerms.includes(idx)}
            handleSelect={() => handleAcceptTerms(idx)}
          />
        ))}
      </View>

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

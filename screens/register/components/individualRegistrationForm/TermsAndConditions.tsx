import { StyleSheet, Text, TouchableOpacity, View, Linking, Pressable } from 'react-native';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import FittedBlackButton from '../../../../components/buttons/FittedBlackButton';
import BackFormButton from '../../../../components/buttons/BackFormButton';
import { colors } from '../../../../config/colors.config';
import { acceptTermsList } from '../../../../constants/accetTerms.constants';
import { useIndividualAuthRegisterStore } from '../../../../store/auth/register/IndividualAuthRegisterStore';
import { registerAccount } from '../../../../services/register/registerAccount';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import TermsAndConditionItem from '../../../../components/general/TermsAndConditionItem';
import { screenName } from '../../../../constants/screenNames.constants';
import { useModalStore } from 'store/modal/modalStore';
import { useAppStore } from 'store/app/appStore';
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

  const handleSubmit = async () => {
    setIsLoading(true);

    const data: Omit<IndividualRegisterData, 'confirmPassword'> & {
      preferences: string[];
      device_push_token: string;
    } = {
      ...individualRegisterData,
      preferences,
      device_push_token: expoPushToken ?? '',
    };

    const results = await registerAccount(data, 'individual');
    console.log(data);
    if (results?.isOk) {
      const resultsBody = results?.body;
      clearState();
      navigation.navigate(screenName.verifyEmail, {
        account: { id: resultsBody.data, type: 'individual' },
      });
    } else {
      updateModal({
        message: results?.body.message,
        modalType: 'error',
        showModal: true,
      });
    }

    setIsLoading(false);
  };

  const handleAcceptTerms = (index: number) => {
    if (selectedTerms.includes(index)) {
      setSelectedTerms(selectedTerms.filter((selectedTab) => selectedTab !== index));
    } else {
      setSelectedTerms([...selectedTerms, index]);
    }
  };

  const openLegalLink = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://omenai.app/legal?ent=collector');
    } catch (error) {
      updateModal({
        showModal: true,
        modalType: 'error',
        message: 'Something went wrong while opening the Terms of Agreement.',
      });
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
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

      {/* Added privacy & terms links */}
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

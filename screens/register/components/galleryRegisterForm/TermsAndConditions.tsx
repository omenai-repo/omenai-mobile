import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { acceptTermsList } from '../../../../constants/accetTerms.constants';
import TermsAndConditionItem from '../../../../components/general/TermsAndConditionItem';
import FittedBlackButton from '../../../../components/buttons/FittedBlackButton';
import BackFormButton from '../../../../components/buttons/BackFormButton';
import { useGalleryAuthRegisterStore } from '../../../../store/auth/register/GalleryAuthRegisterStore';
import { colors } from '../../../../config/colors.config';
import { registerAccount } from 'services/register/registerAccount';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { useModalStore } from 'store/modal/modalStore';
import uploadGalleryLogoContent from './uploadGalleryLogo';
import { storage } from 'appWrite_config';
import tw from 'twrnc';
import Loader from 'components/general/Loader';
import uploadLogo from 'screens/galleryProfileScreens/uploadNewLogo/uploadLogo';
import { useAppStore } from 'store/app/appStore';

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

      const { name, email, password, admin, address, description, logo, phone } =
        galleryRegisterData;

      if (logo === null) return;

      const files = {
        uri: logo.assets[0].uri,
        name: logo.assets[0].fileName,
        type: logo.assets[0].mimeType,
      };

      const fileUploaded = await uploadLogo(files);

      if (fileUploaded) {
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

        const results = await registerAccount(payload, 'gallery');
        if (results?.isOk) {
          const resultsBody = results?.body;
          clearState();
          navigation.navigate(screenName.verifyEmail, {
            account: { id: resultsBody.data, type: 'gallery' },
          });
        } else {
          await storage.deleteFile({
            bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
            fileId: file.fileId,
          });
          updateModal({
            message: results?.body.message,
            modalType: 'error',
            showModal: true,
          });
        }
      }
    } catch (error: any) {
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
    if (selectedTerms.includes(index)) {
      setSelectedTerms(selectedTerms.filter((selectedTab) => selectedTab !== index));
    } else {
      setSelectedTerms([...selectedTerms, index]);
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

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { colors } from 'config/colors.config';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useGalleryAuthRegisterStore } from 'store/auth/register/GalleryAuthRegisterStore';
import BackFormButton from 'components/buttons/BackFormButton';
import NextButton from 'components/buttons/NextButton';
import { useModalStore } from 'store/modal/modalStore';

export default function UploadLogo() {
  const { galleryRegisterData, setGalleryLogo, setPageIndex, pageIndex } =
    useGalleryAuthRegisterStore();

  const { updateModal } = useModalStore();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Updated syntax, no deprecation
      quality: 1,
    });

    if (!result.canceled) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      // Check if the selected image type is allowed
      if (result.assets[0].mimeType && allowedTypes.includes(result.assets[0].mimeType)) {
        setGalleryLogo(result);
      } else {
        updateModal({
          message: 'Please select a PNG, JPEG, or JPG image.',
          modalType: 'error',
          showModal: true,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          pickImage();
        }}
      >
        {galleryRegisterData.logo?.assets[0]?.uri ? (
          <Image source={{ uri: galleryRegisterData?.logo?.assets[0]?.uri }} style={styles.logo} />
        ) : (
          <View style={styles.mainContainer}>
            <Feather name="image" size={30} color={colors.primary_black} style={{ opacity: 0.6 }} />
            <Text style={styles.textStyling}>Upload gallery logo</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <NextButton
          isDisabled={!galleryRegisterData.logo}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 40,
  },
  mainContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 10,
  },
  textStyling: {
    fontSize: 14,
    color: colors.primary_black,
  },
  logo: {
    height: 300,
    width: '100%',
    objectFit: 'contain',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});

import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import UploadImageInput from 'components/inputs/UploadImageInput';
import LongBlackButton from 'components/buttons/LongBlackButton';
import * as ImagePicker from 'expo-image-picker';
import LongWhiteButton from 'components/buttons/LongWhiteButton';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import { useAppStore } from 'store/app/appStore';
import { useModalStore } from 'store/modal/modalStore';

export default function UploadImage({ handleUpload }: { handleUpload: () => void }) {
  const { image, setImage } = uploadArtworkStore();
  const { userType } = useAppStore();
  const { updateModal } = useModalStore();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      // Check if the selected image type is allowed
      if (result.assets[0].mimeType && allowedTypes.includes(result.assets[0].mimeType)) {
        setImage(result);
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
      <View style={{ marginBottom: 40 }}>
        {!image && <UploadImageInput label="Upload image" handlePress={pickImage} />}
        {image && <Image source={{ uri: image.assets[0].uri }} style={styles.image} />}
      </View>

      <View style={styles.buttonsContainer}>
        {image && <LongWhiteButton value="Change image" onClick={pickImage} />}
        <LongBlackButton
          value={userType === 'gallery' ? 'Proceed' : 'Get price quote'}
          onClick={handleUpload}
          isLoading={false}
          isDisabled={image === null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 340,
    width: '100%',
    objectFit: 'contain',
  },
  buttonsContainer: {
    gap: 20,
  },
});

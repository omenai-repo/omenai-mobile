import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackScreenButton from 'components/buttons/BackScreenButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { colors } from 'config/colors.config';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { updateLogo } from 'services/update/updateLogo';
import { useAppStore } from 'store/app/appStore';
import { useModalStore } from 'store/modal/modalStore';
import { logout } from 'utils/logout.utils';
import uploadLogo from './uploadLogo';

export default function UploadNewLogo() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { userSession, userType } = useAppStore();
  const { updateModal } = useModalStore();

  const [logo, setLogo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setLogo(result);
    }
  };

  const handleUpload = async () => {
    const logoParams = {
      name: logo.assets[0].fileName,
      uri: logo.assets[0].uri,
      type: logo.assets[0].mimeType,
    };

    try {
      setLoading(true);
      const logoUpdated = await uploadLogo(logoParams);
      if (logoUpdated) {
        let file: { bucketId: string; fileId: string } = {
          bucketId: logoUpdated.bucketId,
          fileId: logoUpdated.$id,
        };
        const { isOk, body } = await updateLogo(
          {
            id: userSession.id,
            url: file.fileId,
          },
          userType === 'artist' ? 'artist' : userType === 'gallery' ? 'gallery' : 'individual',
        );

        if (!isOk) {
          updateModal({
            message: body.message,
            modalType: 'error',
            showModal: true,
          });
        } else {
          updateModal({
            message: `${body.message}... Please log back in`,
            modalType: 'success',
            showModal: true,
          });
          handleLogout();
        }
      }
    } catch (error) {
      console.log(error);
      updateModal({
        message: 'An error occured, please try again',
        modalType: 'error',
        showModal: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setTimeout(() => {
      logout();
    }, 3500);
  };

  return (
    <View style={styles.container}>
      <BackScreenButton cancle handleClick={() => navigation.goBack()} />
      <View style={{ flex: 1, marginTop: 20 }}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
          {logo === null ? (
            <View style={styles.imageContainer}>
              <Feather name="image" size={30} color={colors.grey} />
              <Text style={{ color: colors.primary_black }}>Select from gallery</Text>
            </View>
          ) : (
            <Image source={{ uri: logo.assets[0].uri }} style={styles.logo} />
          )}
        </TouchableOpacity>
      </View>
      <LongBlackButton
        value="Upload logo"
        onClick={handleUpload}
        isDisabled={!logo}
        isLoading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 7,

    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderStyle: 'dashed',
  },
  logo: {
    width: '100%',
    objectFit: 'contain',
    height: 400,
  },
});

import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { plusIcon, userProfileIcon } from 'utils/SvgImages';
import NextButton from 'components/buttons/NextButton';
import { useArtistAuthRegisterStore } from 'store/auth/register/ArtistAuthRegisterStore';
import BackFormButton from 'components/buttons/BackFormButton';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { useModalStore } from 'store/modal/modalStore';

const UploadPhoto = () => {
  const { width, height } = useWindowDimensions();
  const { pageIndex, setPageIndex, setArtistPhoto, artistRegisterData } =
    useArtistAuthRegisterStore();
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
        setArtistPhoto(result);
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
    <View style={tw``}>
      <TouchableOpacity onPress={pickImage}>
        {artistRegisterData.logo?.assets[0]?.uri ? (
          <Image
            source={{ uri: artistRegisterData?.logo?.assets[0]?.uri }}
            style={tw`h-[300px] w-[100%]`}
            resizeMode="contain"
          />
        ) : (
          <>
            <View style={tw`self-center mt-[20px]`}>
              <View
                style={tw.style(`rounded-full bg-[#D9D9D9] justify-center items-center`, {
                  width: width / 2,
                  height: height / 4.5,
                })}
              >
                <SvgXml xml={userProfileIcon} />
              </View>
              <View
                style={tw.style(
                  `h-[45px] bg-[#000000] w-[45px] bottom-[10px] right-[5px] absolute rounded-full justify-center items-center`,
                )}
              >
                <SvgXml xml={plusIcon} />
              </View>
            </View>
            <Text
              style={tw.style(`text-[18px] text-[#1A1A1A]00099] self-center text-center`, {
                width: width / 1.5,
                marginTop: height / 20,
              })}
            >
              Photo must be 1040 x 1040 Pixel, proffesionaly looking & clear.
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={tw`flex-row mt-[60px]`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <NextButton
          isDisabled={!artistRegisterData.logo?.assets[0]?.uri}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
};

export default UploadPhoto;

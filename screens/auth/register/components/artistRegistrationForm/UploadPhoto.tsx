import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { Feather } from "@expo/vector-icons";
import NextButton from "#components/buttons/NextButton";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";
import BackFormButton from "#components/buttons/BackFormButton";
import * as ImagePicker from "expo-image-picker";
import { useModalStore } from "#store/account/modal/modalStore";

const UploadPhoto = () => {
  const { pageIndex, setPageIndex, setArtistPhoto, artistRegisterData } =
    useArtistAuthRegisterStore();
  const { updateModal } = useModalStore();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

      // Check if the selected image type is allowed
      if (
        result.assets[0].mimeType &&
        allowedTypes.includes(result.assets[0].mimeType)
      ) {
        setArtistPhoto(result);
      } else {
        updateModal({
          message: "Please select a PNG, JPEG, or JPG image.",
          modalType: "error",
          showModal: true,
        });
      }
    }
  };

  return (
    <View style={tw`flex-col gap-6`}>
      <Text style={[tw`text-lg`, { color: colors.primary_black }]}>
        Upload a logo or a picture of yourself
      </Text>

      <Pressable
        onPress={() => pickImage()}
        style={[
          tw`h-[250px] w-full rounded-sm border items-center justify-center overflow-hidden`,
          { borderColor: colors.inputBorder },
        ]}
      >
        {artistRegisterData.logo?.assets[0]?.uri ? (
          <Image
            source={{ uri: artistRegisterData?.logo?.assets[0]?.uri }}
            style={tw`h-full w-full object-contain`}
          />
        ) : (
          <Feather
            name="image"
            size={40}
            color={colors.primary_black}
            style={{ opacity: 0.6 }}
          />
        )}
      </Pressable>

      <View style={tw`flex-row mt-4 justify-between items-center`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <NextButton
          isDisabled={!artistRegisterData.logo?.assets[0]?.uri}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
};

export default UploadPhoto;

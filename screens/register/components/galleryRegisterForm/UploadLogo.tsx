import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useGalleryAuthRegisterStore } from "#store/auth/register/GalleryAuthRegisterStore";
import BackFormButton from "#components/buttons/BackFormButton";
import NextButton from "#components/buttons/NextButton";
import { useModalStore } from "#store/modal/modalStore";
import tw from "twrnc";

export default function UploadLogo() {
  const { galleryRegisterData, setGalleryLogo, setPageIndex, pageIndex } =
    useGalleryAuthRegisterStore();

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
        setGalleryLogo(result);
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
      <Text style={[tw`text-[16px]`, { color: colors.primary_black }]}>
        Upload a logo of your gallery
      </Text>

      <TouchableOpacity
        onPress={() => pickImage()}
        style={[
          tw`h-[250px] w-full rounded-sm border items-center justify-center overflow-hidden`,
          { borderColor: colors.inputBorder },
        ]}
      >
        {galleryRegisterData.logo?.assets[0]?.uri ? (
          <Image
            source={{ uri: galleryRegisterData?.logo?.assets[0]?.uri }}
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
      </TouchableOpacity>

      <View style={tw`flex-row mt-4 justify-between items-center`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <NextButton
          isDisabled={!galleryRegisterData.logo?.assets?.[0]?.uri}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
}

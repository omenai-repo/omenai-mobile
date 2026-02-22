import { Image, Text, View } from "react-native";
import React from "react";
import tw from "twrnc";

import successCheck from "../../../assets/icons/success_check.png";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { uploadArtworkStore } from "#store/gallery/uploadArtworkStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

export default function SuccessScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { clearData, artworkUploadData } = uploadArtworkStore();

  const handleClose = () => {
    clearData();
    navigation.goBack();
  };

  return (
    <View>
      <Text style={tw`text-center text-lg`}>Upload successful</Text>
      <View
        style={tw`bg-[#FAFAFA] px-5 py-5 border border-[#E0E0E0] mt-5 items-center`}
      >
        <Text style={tw`text-center`}>
          The Painting Of {artworkUploadData.title} has been successfully
          uploaded
        </Text>
        <Image source={successCheck} style={tw`w-[100px] h-[100px] my-8`} />
        <LongBlackButton value="Return to overview" onClick={handleClose} />
      </View>
    </View>
  );
}

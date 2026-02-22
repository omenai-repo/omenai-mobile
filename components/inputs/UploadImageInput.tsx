import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

type UploadImageInputProps = {
  label: string;
  handlePress: () => void;
};

export default function UploadImageInput({
  label,
  handlePress,
}: UploadImageInputProps) {
  return (
    <View style={{ zIndex: 100 }}>
      <Text style={tw`text-sm text-[#858585]`}>{label}</Text>
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <View
          style={tw`h-[150px] w-full border border-[#E0E0E0] bg-[#FAFAFA] px-5 rounded mt-2 items-center justify-center`}
        >
          <View
            style={tw`w-[50px] h-[50px] rounded-full bg-[#EBEBEB] items-center justify-center`}
          >
            <Ionicons name="image-outline" size={30} color="#858585" />
          </View>
          <Text style={tw`text-sm mt-2`}>Click to upload image of artwork</Text>
          <Text style={tw`text-xs text-center opacity-50 mt-1`}>
            (PNG, JPG, WEBP formats acceptable. Max file size of 10MB)
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

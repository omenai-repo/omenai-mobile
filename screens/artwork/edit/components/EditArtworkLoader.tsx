import { View } from "react-native";
import React from "react";
import Loader from "#components/general/Loader";
import tw from "twrnc";

export default function EditArtworkLoader() {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Loader size={120} height={200} />
    </View>
  );
}

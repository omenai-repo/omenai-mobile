import { View, type ViewStyle } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import tw from "twrnc";

type SingleArtworkCardLoaderProps = {
  style?: ViewStyle;
};

export function SingleArtworkCardLoader({
  style,
}: Readonly<SingleArtworkCardLoaderProps>) {
  return (
    <View style={[tw`w-[270px]`, style]}>
      <View style={tw`w-full h-[250px] bg-[#eee]`} />
      <View style={tw`mt-2.5 flex-row gap-2.5`}>
        <View style={tw`flex-1`}>
          <View style={tw`h-2.5 w-full bg-[#eee]`} />
          <View style={tw`h-2.5 mt-2.5 w-1/2 bg-[#eee]`} />
        </View>
      </View>
    </View>
  );
}

export default function ArtworkCardLoader() {
  return (
    <FlatList
      data={[0, 1]}
      renderItem={() => <SingleArtworkCardLoader />}
      keyExtractor={(_, index) => JSON.stringify(index)}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={tw`mt-5 pl-5`}
      contentContainerStyle={tw`gap-5 pr-5`}
    />
  );
}

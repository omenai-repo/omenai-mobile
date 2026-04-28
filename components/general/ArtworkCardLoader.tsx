import { View, type ViewStyle } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import { useDevice } from "#hooks/useDevice";
import { ARTWORK_CARD_IMAGE_HEIGHT, ARTWORK_CARD_MAX_WIDTH } from "#components/artwork/artworkCard.constants";

type SingleArtworkCardLoaderProps = {
  style?: ViewStyle;
};

export function SingleArtworkCardLoader({
  style,
}: Readonly<SingleArtworkCardLoaderProps>) {
  const { isTablet } = useDevice();
  const cardWidth = isTablet ? ARTWORK_CARD_MAX_WIDTH.tablet : ARTWORK_CARD_MAX_WIDTH.phone;
  const fixedImageHeight = isTablet
    ? ARTWORK_CARD_IMAGE_HEIGHT.tablet
    : ARTWORK_CARD_IMAGE_HEIGHT.phone;

  return (
    <View style={[{ width: cardWidth }, style]}>
      <View style={[tw`w-full bg-[#eee]`, { height: fixedImageHeight }]} />
      <View style={tw`mt-2.5 flex-row gap-2.5`}>
        <View style={tw`flex-1`}>
          <View style={tw`h-2.5 w-full bg-[#eee]`} />
          <View style={tw`h-2.5 mt-2.5 w-1/2 bg-[#eee]`} />
        </View>
      </View>
    </View>
  );
}

export default function ArtworkCardLoader({ containerStyle }: Readonly<{ containerStyle?: ViewStyle }>) {
  const placeholderData = [0, 1];

  return (
    <View style={[tw`mt-5`, containerStyle]}>
      <FlashList
        data={placeholderData}
        renderItem={() => <SingleArtworkCardLoader />}
        keyExtractor={(_, index) => JSON.stringify(index)}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View style={tw`w-5`} />}
      />
    </View>
  );
}

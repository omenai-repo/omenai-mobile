import { Image, Text, TouchableOpacity, View, PixelRatio } from "react-native";
import tw from "twrnc";
import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { resizeImageDimensions } from "#utils/utils_resizeImageDimensions.utils";

import { fontNames } from "#constants/fontNames.constants";

export default function ViewHistoryCard({
  url,
  art_id,
  artist,
  artwork,
}: {
  url: string;
  art_id: string;
  artwork: string;
  artist: string;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const dpr = PixelRatio.get();
  const displayWidth = 300;
  const fetchWidth = Math.round(displayWidth * dpr);
  const image_href = getImageFileView(url, fetchWidth);

  const [imageDimensions, setImageDimensions] = useState({
    width: 200,
    height: 200,
  });

  useEffect(() => {
    let isMounted = true;

    Image.getSize(
      image_href,
      (defaultWidth, defaultHeight) => {
        if (!isMounted) return;
        const { width, height } = resizeImageDimensions(
          { width: defaultWidth, height: defaultHeight },
          displayWidth,
          300, // Optional maxHeight
        );
        setImageDimensions({ height, width });
      },
      (error) => {
        console.warn(
          "Failed to get image size for history card:",
          error?.message || error,
        );
      },
    );

    return () => {
      isMounted = false;
    };
  }, [image_href]);

  return (
    <View>
      <View style={tw`flex-1`} />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate(screenName.artwork, { art_id, url });
        }}
      >
        <Image
          source={{ uri: image_href }}
          style={[
            tw`rounded-md`,
            {
              width: imageDimensions.width,
              height: imageDimensions.height,
            },
          ]}
          resizeMode="cover"
        />
        <View style={tw`mt-2.5 w-[200px]`}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={tw`text-base font-serif leading-snug text-dark font-medium`}
          >
            {artwork}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={tw`text-xs text-slate-500 mt-0.5`}
          >
            {artist}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

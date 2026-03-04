import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import React, { useCallback, useState } from "react";
import { Image, ImageLoadEventData } from "expo-image";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { getImageFileView } from "#lib/storage/getImageFileView";

function ViewHistoryCard({
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

  const displayWidth = 300;
  const image_href = getImageFileView(url, 300);

  const [imageDimensions, setImageDimensions] = useState({
    width: displayWidth,
    height: 200,
  });

  const handleImageLoad = useCallback(
    (e: ImageLoadEventData) => {
      const { source } = e;
      const aspectRatio = source.height / source.width;
      setImageDimensions({
        width: displayWidth,
        height: displayWidth * aspectRatio,
      });
    },
    [displayWidth],
  );

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
              width: displayWidth,
              height: imageDimensions.height,
            },
          ]}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          recyclingKey={art_id}
          onLoad={handleImageLoad}
        />
        <View style={tw`mt-2.5 w-[200px]`}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={tw`text-base capitalize font-serif leading-snug text-dark`}
          >
            {artwork}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={tw`text-xs capitalize text-slate-500 mt-0.5 font-sans-regular`}
          >
            {artist}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(ViewHistoryCard);

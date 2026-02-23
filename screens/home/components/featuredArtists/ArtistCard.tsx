import React from "react";
import { Text, View, PixelRatio } from "react-native";
import ProgressiveImage from "#components/general/ProgressiveImage";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { AntDesign } from "@expo/vector-icons";

const ArtistCard = ({
  image,
  name,
  details,
  totalLikes,
}: {
  image: string;
  name: string;
  details: { birthyear: string; country: string };
  totalLikes?: number;
}) => {
  const dpr = PixelRatio.get();
  const displayWidth = 300;
  const fetchWidth = Math.round(displayWidth * dpr);
  const highResUri = getImageFileView(image, fetchWidth);
  const lowResUri = getImageFileView(image, 20, undefined, undefined, 20);

  return (
    <View style={tw`w-[300px]`}>
      <ProgressiveImage
        thumbnailSource={{ uri: lowResUri }}
        source={{ uri: highResUri }}
        containerStyle={tw`w-full h-[200px] rounded-md`}
        imageStyle={tw`w-full h-[200px]`}
        resizeMode="cover"
      />
      <View style={tw`flex-row items-center justify-between mt-[10px]`}>
        <View>
          <Text style={tw`font-serif text-base text-dark leading-tight`}>
            {name}
          </Text>
          <Text style={tw`text-xs font-medium text-neutral-500 mt-1`}>
            {details.country}
          </Text>
        </View>
        <View
          style={tw`flex-row items-center justify-center bg-neutral-200 rounded-full px-2 py-1 gap-1.5 mt-1`}
        >
          <AntDesign name="heart" size={9} color={colors.primary_black} />
          <Text style={tw`text-[10px] font-bold text-dark`}>
            {totalLikes || 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ArtistCard;

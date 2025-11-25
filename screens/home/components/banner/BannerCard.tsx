import { Dimensions, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "config/colors.config";
import { getPromotionalFileView } from "lib/storage/getPromotionalsFileView";
import { fontNames } from "constants/fontNames.constants";

type BannerItemProps = {
  image: string;
  headline: string;
  subheadline: string;
  cta: string;
  handleClick: (url: string) => void;
};

const { width: windowWidth } = Dimensions.get("window");
const SIDE_PADDING = 15;
const CARD_WIDTH = windowWidth - SIDE_PADDING * 2;

const BannerCard = memo(({ image, headline, subheadline, cta, handleClick }: BannerItemProps) => {
  const image_href = getPromotionalFileView(image, 800);

  return (
    <View
      style={{
        width: CARD_WIDTH, // ensures one card per screen
      }}
    >
      <ImageBackground
        source={{ uri: image_href }}
        style={tw`h-[200px]`}
        imageStyle={tw`rounded-[12px]`}
        resizeMode="cover"
      >
        <View
          style={[
            tw`flex-1 rounded-[12px] pt-[30px] pl-[20px]`,
            { backgroundColor: `${colors.black}80` },
          ]}
        >
          <Text
            style={[
              tw`text-white text-[18px] font-bold`,
              { fontFamily: fontNames.dmSans + "Bold" },
            ]}
          >
            {headline}
          </Text>
          <Text
            style={[
              tw`text-white text-[13px] mt-1 pr-[100px]`,
              { fontFamily: fontNames.dmSans + "Regular" },
            ]}
          >
            {subheadline}
          </Text>

          <TouchableOpacity
            onPress={() => handleClick(image_href)}
            style={[
              tw`mt-4 flex-row items-center gap-2 px-4 py-2 rounded-full w-[110px]`,
              { backgroundColor: `${colors.black}33` },
            ]}
          >
            <Text style={tw`text-white text-[13px] font-semibold`}>Explore</Text>
            <AntDesign name="arrow-right" color="#fff" size={15} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
});

BannerCard.displayName = "BannerCard";

export default BannerCard;

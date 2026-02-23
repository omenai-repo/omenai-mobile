import { Image, Pressable, Text, View } from "react-native";
import React, { memo, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import { fontNames } from "#constants/fontNames.constants";
import { MotiView } from "moti";

type BannerItemProps = {
  image: string;
  headline: string;
  subheadline: string;
  cta: string;
  handleClick: (url: string) => void;
  cardWidth: number;
};

const BannerCard = memo(
  ({
    image,
    headline,
    subheadline,
    cta,
    handleClick,
    cardWidth,
  }: BannerItemProps) => {
    const [highResLoaded, setHighResLoaded] = useState(false);

    const lowResUri = getPromotionalFileView(
      image,
      50,
      undefined,
      undefined,
      20,
    );
    const highResUri = getPromotionalFileView(image, 800);

    return (
      <View
        style={{
          width: cardWidth,
          height: 200,
          backgroundColor: colors.primary_black,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Low-res Placeholder (instantly visible) */}
        <Image
          source={{ uri: lowResUri }}
          style={[tw`absolute inset-0 w-full h-full`, { opacity: 0.5 }]}
          resizeMode="cover"
          blurRadius={10}
        />

        {/* High-res Image (loads in background) */}
        <Image
          source={{ uri: highResUri }}
          style={tw`absolute inset-0 w-0 h-0 opacity-0`}
          onLoad={() => setHighResLoaded(true)}
        />

        {/* Synchronized Content Layer */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: highResLoaded ? 1 : 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={tw`flex-1`}
        >
          {/* Real Background Image once loaded */}
          <Image
            source={{ uri: highResUri }}
            style={tw`absolute inset-0 w-full h-full`}
            resizeMode="cover"
          />

          <View
            style={[
              tw`flex-1 pt-[30px] pl-[20px]`,
              { backgroundColor: `${colors.black}80` },
            ]}
          >
            <Text
              style={tw`text-white text-[18px] font-bold font-sans font-bold`}
            >
              {headline}
            </Text>
            <Text style={tw`text-white text-[13px] mt-1 pr-[100px] font-sans`}>
              {subheadline}
            </Text>

            <Pressable
              onPress={() => handleClick(highResUri)}
              style={[
                tw`mt-4 flex-row items-center gap-2 px-4 py-2 rounded-md w-[110px]`,
                { backgroundColor: `${colors.black}55` },
              ]}
            >
              <Text style={tw`text-white text-[13px] font-semibold`}>
                Explore
              </Text>
              <AntDesign name="arrow-right" color="#fff" size={15} />
            </Pressable>
          </View>
        </MotiView>
      </View>
    );
  },
);

BannerCard.displayName = "BannerCard";

export default BannerCard;

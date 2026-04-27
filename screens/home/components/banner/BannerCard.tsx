import { Image, Pressable, Text, View } from "react-native";
import React, { memo, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
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
        style={[
          tw`flex-row`,
          {
            width: cardWidth,
            minHeight: 200,
            backgroundColor: colors.black,
            overflow: "hidden",
          },
        ]}
      >
        <View style={tw`w-[34%]`}>
          <View style={tw`flex-1 overflow-hidden`}>
            <Image
              source={{ uri: lowResUri }}
              style={[
                tw`absolute inset-0 w-full h-full`,
                { opacity: 0.5 },
              ]}
              resizeMode="cover"
              blurRadius={10}
            />
            <Image
              source={{ uri: highResUri }}
              style={tw`absolute w-0 h-0 opacity-0`}
              onLoad={() => setHighResLoaded(true)}
            />
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: highResLoaded ? 1 : 0 }}
              transition={{ type: "timing", duration: 500 }}
              style={tw`flex-1`}
            >
              <Image
                source={{ uri: highResUri }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </MotiView>
          </View>
        </View>

        <View
          style={[
            tw`flex-1 justify-center px-5 py-4`,
            { backgroundColor: colors.black },
          ]}
        >
          <Text style={tw`text-white text-3xl font-sans-medium`}>
            {headline}
          </Text>
          <Text
            style={tw`text-white text-sm mt-1 pr-[50px] font-sans-light tracking-wide`}
          >
            {subheadline}
          </Text>

          <Pressable
            onPress={() => handleClick(cta)}
            style={tw`mt-4 flex-row items-center gap-2 px-4 py-2 rounded-sm border border-white self-start`}
          >
            <Text style={tw`text-white text-sm font-semibold`}>Explore</Text>
            <AntDesign name="arrow-right" color="#fff" size={15} />
          </Pressable>
        </View>
      </View>
    );
  },
);

BannerCard.displayName = "BannerCard";

export default BannerCard;

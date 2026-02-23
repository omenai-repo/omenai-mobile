import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import LikeComponent from "./LikeComponent";
import tw from "twrnc";
import { resizeImageDimensions } from "#utils/utils_resizeImageDimensions.utils";
import { fontNames } from "#constants/fontNames.constants";
import { useDevice } from "#hooks/useDevice";
import ProgressiveImage from "#components/general/ProgressiveImage";

type ArtworkCardType = {
  title: string;
  url: string;
  price: number;
  artist: string;
  showPrice?: boolean;
  availiablity?: boolean;
  lightText?: boolean;
  width?: number;
  art_id?: string;
  impressions?: number;
  like_IDs?: string[];
  galleryView?: boolean;
};

export default function ArtworkCard({
  title,
  url,
  artist,
  showPrice,
  price,
  lightText,
  width = 0,
  impressions,
  art_id,
  like_IDs,
  galleryView = false,
  availiablity,
}: ArtworkCardType) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isTablet } = useDevice();
  const dpr = PixelRatio.get();
  const screenWidth = Dimensions.get("window").width;
  const defaultWidth = isTablet ? screenWidth * 0.4 : screenWidth * 0.7;
  const displayWidth = width > 0 ? width : defaultWidth;
  const fetchWidth = Math.round(displayWidth * dpr);

  const [imageDimensions, setImageDimensions] = useState({
    width: 250,
    height: 250,
  });

  const highResUri = getImageFileView(url, fetchWidth);
  const lowResUri = getImageFileView(url, 20, undefined, undefined, 20);

  useEffect(() => {
    Image.getSize(highResUri, (defaultWidth, defaultHeight) => {
      const maxHeight = 300;

      const { width: resizedWidth, height: resizedHeight } =
        resizeImageDimensions(
          { width: defaultWidth, height: defaultHeight },
          displayWidth,
          maxHeight,
        );

      setImageDimensions({ height: resizedHeight, width: resizedWidth });
    });
  }, [highResUri, displayWidth]);

  return (
    <View>
      <View style={tw`flex-1`} />
      <TouchableOpacity
        activeOpacity={1}
        style={[tw`rounded-md`, { width: imageDimensions.width }]}
        onPress={() => {
          navigation.push(screenName.artwork, { art_id, url });
        }}
      >
        <View style={tw`rounded-md overflow-hidden relative`}>
          <ProgressiveImage
            thumbnailSource={{ uri: lowResUri }}
            source={{ uri: highResUri }}
            containerStyle={{
              width: imageDimensions.width,
              height: imageDimensions.height,
            }}
            imageStyle={{
              width: imageDimensions.width,
              height: imageDimensions.height,
            }}
            resizeMode="contain"
          />
          <View
            style={tw`absolute top-0 left-0 h-full w-full flex items-end justify-end p-3`}
          >
            {!galleryView && (
              <View
                style={tw`bg-white/20 h-[30px] w-[30px] rounded-md flex items-center justify-center`}
              >
                <LikeComponent
                  art_id={art_id || ""}
                  impressions={impressions || 0}
                  likeIds={like_IDs || []}
                  lightText={true}
                />
              </View>
            )}
          </View>
        </View>
        <View style={[tw`mt-3`, { width: imageDimensions.width }]}>
          <View style={tw`flex-wrap w-[${imageDimensions.width}px]`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                tw`text-base font-serif leading-snug ${
                  lightText ? "text-white/90" : "text-dark"
                } w-full`,
              ]}
            >
              {title}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                tw`text-xs ${
                  lightText ? "text-white/80" : "text-slate-500"
                } w-full mt-0.5 font-sans`,
              ]}
            >
              {artist}
            </Text>
          </View>
          <View style={tw`flex flex-row items-center gap-2`}>
            {availiablity && (
              <Text
                style={tw`text-sm ${showPrice ? "font-bold" : "font-medium"} ${
                  lightText ? "text-white/90" : "text-[#1A1A1A]/90"
                } flex-1 font-sans ${showPrice ? "font-bold" : "font-medium"}`}
              >
                {showPrice ? utils_formatPrice(price) : "Price on Request"}
              </Text>
            )}

            <View style={tw`flex-wrap`}>
              {!availiablity && (
                <Text
                  style={tw`text-sm font-bold ${
                    lightText ? "text-white/90" : "text-[#1A1A1A]/90"
                  } flex-1 font-sans font-bold`}
                >
                  SOLD
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

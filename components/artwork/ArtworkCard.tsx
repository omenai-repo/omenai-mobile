import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import { Image, ImageLoadEventData } from "expo-image";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import LikeComponent from "./LikeComponent";
import tw from "twrnc";
import { resizeImageDimensions } from "#utils/utils_resizeImageDimensions.utils";
import { useDevice } from "#hooks/useDevice";
import { useAppStore } from "#store/app/appStore";

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

function ArtworkCard({
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
}: Readonly<ArtworkCardType>) {
  const userSession = useAppStore((s) => s.userSession);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isTablet } = useDevice();
  const screenWidth = Dimensions.get("window").width;
  const defaultWidth = isTablet ? screenWidth * 0.4 : screenWidth * 0.7;
  const displayWidth = width > 0 ? width : defaultWidth;

  const [imageHeight, setImageHeight] = useState<number>(200);

  const imageUri = getImageFileView(url, 300);

  const handleImageLoad = useCallback(
    (e: ImageLoadEventData) => {
      const { source } = e;
      const maxHeight = 300;
      const { height: resizedHeight } = resizeImageDimensions(
        { width: source.width, height: source.height },
        displayWidth,
        maxHeight
      );
      setImageHeight(resizedHeight);
    },
    [displayWidth]
  );

  return (
    <View>
      <View style={tw`flex-1`} />
      <TouchableOpacity
        activeOpacity={1}
        style={[tw`rounded-md`, { width: displayWidth }]}
        onPress={() => {
          navigation.push(screenName.artwork, { art_id, url });
        }}
      >
        <View style={tw`rounded-md overflow-hidden relative`}>
          {imageHeight ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: displayWidth,
                height: imageHeight,
              }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
              recyclingKey={art_id}
              onLoad={handleImageLoad}
            />
          ) : (
            <View
              style={{
                width: displayWidth,
                height: 200,
                backgroundColor: "#f5f5f5",
                borderRadius: 6,
              }}
            />
          )}
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
        <View style={[tw`mt-3`, { width: displayWidth }]}>
          <View style={tw`flex-wrap w-[${displayWidth}px]`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                tw`text-base capitalize font-serif leading-snug ${
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
                tw`text-xs capitalize ${
                  lightText ? "text-white/80" : "text-slate-500"
                } w-full mt-0.5 font-sans-regular`,
              ]}
            >
              {artist}
            </Text>
          </View>
          <View style={tw`flex flex-row items-center gap-2`}>
            {availiablity !== false && userSession?.id && (
              <Text
                style={tw`text-sm ${
                  lightText ? "text-white/90" : "text-[#1A1A1A]/90"
                } flex-1 ${showPrice ? "font-sans-bold" : "font-sans-medium"}`}
              >
                {showPrice ? utils_formatPrice(price) : "Price on Request"}
              </Text>
            )}

            <View style={tw`flex-wrap`}>
              {availiablity === false && (
                <Text
                  style={tw`text-sm ${
                    lightText ? "text-white/90" : "text-[#1A1A1A]/90"
                  } flex-1 font-sans-semibold`}
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

export default React.memo(ArtworkCard);

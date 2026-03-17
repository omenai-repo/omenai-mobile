import { Text, View, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { Image, useImage } from "expo-image";
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
  disableLikeButton?: boolean;
  hideBackground?: boolean;
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
  disableLikeButton = false,
  availiablity,
  hideBackground = false,
}: Readonly<ArtworkCardType>) {
  const userSession = useAppStore((s) => s.userSession);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isTablet, width: screenWidth } = useDevice();
  const defaultWidth = isTablet ? screenWidth * 0.4 : screenWidth * 0.7;
  const displayWidth = width > 0 ? width : defaultWidth;

  const imageHeight = 250;
  // Request a higher resolution for high-density screens
  const imageUri = getImageFileView(
    url,
    Math.max(400, Math.round(displayWidth * 2)),
  );

  const image = useImage(imageUri);

  const imageAspectRatio = useMemo(() => {
    if (!image?.width || !image?.height) {
      return 1;
    }
    return image.width / image.height;
  }, [image?.height, image?.width]);

  // Artsy logic: In a horizontal rail, the dynamic width depends on the aspect ratio.
  // We clamp it between a reasonable min (140) and max (400) to keep the UI consistent.
  const dynamicWidth = useMemo(() => {
    if (width > 0) return width; // Fixed width for Grid mode
    const calculatedWidth = imageHeight * imageAspectRatio;
    return Math.max(140, Math.min(400, calculatedWidth));
  }, [width, imageAspectRatio, imageHeight]);

  const calculatedImageSize = useMemo(() => {
    return resizeImageDimensions(
      {
        width: image?.width || displayWidth,
        height: image?.height || imageHeight,
      },
      dynamicWidth,
      imageHeight,
    );
  }, [dynamicWidth, imageHeight, image?.width, image?.height, displayWidth]);

  // If the image is extremely tall/portrait, we might prefer "cover" if it gets too narrow,
  // but for rails, "contain" within the calculated width is usually better to avoid cropping.
  // Actually, if we perfectly calculate the container width, "cover" and "contain" become almost identical.
  const usePortraitCover = imageAspectRatio < 0.8;

  const hasLetterbox = useMemo(() => {
    if (usePortraitCover) return false;
    return (
      Math.abs(calculatedImageSize.width - dynamicWidth) > 2 ||
      Math.abs(calculatedImageSize.height - imageHeight) > 2
    );
  }, [calculatedImageSize, dynamicWidth, imageHeight, usePortraitCover]);

  return (
    <View>
      <View style={tw`flex-1`} />
      <TouchableOpacity
        activeOpacity={1}
        style={[tw`rounded-md`, { width: dynamicWidth }]}
        onPress={() => {
          navigation.push(screenName.artwork, { art_id, url });
        }}
      >
        <View style={tw`rounded-md overflow-hidden relative`}>
          <View
            style={{
              width: dynamicWidth,
              height: imageHeight,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: hideBackground ? "transparent" : "#f0f0f0", // Subtle placeholder background
            }}
          >
            <Image
              source={{ uri: imageUri }}
              style={{
                width: calculatedImageSize.width,
                height: calculatedImageSize.height,
              }}
              contentFit={usePortraitCover ? "cover" : "contain"}
              transition={200}
              cachePolicy="memory-disk"
              recyclingKey={art_id}
            />
          </View>
          <View
            style={[
              tw`absolute top-0 left-0 flex items-end justify-end p-3`,
              { width: dynamicWidth, height: imageHeight },
            ]}
          >
            {!galleryView && !disableLikeButton && (
              <View
                style={[
                  tw`h-[32px] w-[32px] rounded-md flex items-center justify-center`,
                  {
                    backgroundColor: "rgba(0,0,0,0.35)", // Darker overlay for better white icon legibility
                  },
                ]}
              >
                <LikeComponent
                  art_id={art_id || ""}
                  impressions={impressions || 0}
                  likeIds={like_IDs || []}
                  lightText={true} // Force light text since background is dark
                />
              </View>
            )}
          </View>
        </View>
        <View style={[tw`mt-3`, { width: dynamicWidth }]}>
          <View style={tw`flex-wrap w-full`}>
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

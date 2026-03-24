import { Text, View, TouchableOpacity, Platform } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Image, ImageLoadEventData } from "expo-image";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import LikeComponent from "./LikeComponent";
import tw from "twrnc";
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
  image_format?: { ratio: string; orientation?: string };
  useImageLoadAspectRatio?: boolean;
};

// Artsy pattern: fixed constants, height derived from aspect ratio
const MAX_IMAGE_HEIGHT = 380;
const MIN_IMAGE_HEIGHT = 180;
const DEFAULT_ASPECT_RATIO = 1;

const parseAspectRatio = (ratio?: string) => {
  if (!ratio) return null;
  const [w, h] = ratio.split(":");
  const parsed = Number(w) / Number(h);
  if (!isNaN(parsed) && parsed > 0) return parsed;
  return null;
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
  image_format,
  useImageLoadAspectRatio = false,
}: Readonly<ArtworkCardType>) {
  const userSession = useAppStore((s) => s.userSession);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isTablet, width: screenWidth } = useDevice();

  const metadataAspectRatio = useMemo(
    () => parseAspectRatio(image_format?.ratio),
    [image_format?.ratio],
  );
  const [loadedAspectRatio, setLoadedAspectRatio] = useState<number | null>(
    null,
  );

  const imageAspectRatio =
    loadedAspectRatio ?? metadataAspectRatio ?? DEFAULT_ASPECT_RATIO;

  const handleImageLoad = useCallback(
    (event: ImageLoadEventData) => {
      if (!useImageLoadAspectRatio) return;
      const { width: loadedWidth, height: loadedHeight } = event.source;
      if (!loadedWidth || !loadedHeight) return;

      const nextRatio = loadedWidth / loadedHeight;
      if (!isNaN(nextRatio) && nextRatio > 0) {
        setLoadedAspectRatio((current) => {
          if (current && Math.abs(current - nextRatio) < 0.01) {
            return current;
          }
          return nextRatio;
        });
      }
    },
    [useImageLoadAspectRatio],
  );

  // Calculate card dimensions — all synchronous, no layout shifts
  const { cardWidth, imageDisplayWidth, imageDisplayHeight } = useMemo(() => {
    if (width > 0) {
      // Grid mode: width is fixed by parent, height varies by aspect ratio
      const h = Math.round(
        Math.min(
          MAX_IMAGE_HEIGHT,
          Math.max(MIN_IMAGE_HEIGHT, width / imageAspectRatio),
        ),
      );
      return {
        cardWidth: width,
        imageDisplayWidth: width,
        imageDisplayHeight: h,
      };
    }

    // Horizontal rail mode: FIXED width, VARIABLE height (Artsy pattern)
    // Fixed width lets FlashList predict layout → no scroll jumps
    const fixedWidth = Math.round(
      isTablet ? screenWidth * 0.35 : screenWidth * 0.65,
    );
    const h = Math.round(
      Math.min(
        MAX_IMAGE_HEIGHT,
        Math.max(MIN_IMAGE_HEIGHT, fixedWidth / imageAspectRatio),
      ),
    );

    return {
      cardWidth: fixedWidth,
      imageDisplayWidth: fixedWidth,
      imageDisplayHeight: h,
    };
  }, [width, imageAspectRatio, isTablet, screenWidth]);

  // Request optimized image size — smaller on Android to reduce decode time
  const imageUri = useMemo(
    () =>
      getImageFileView(
        url,
        Math.round(cardWidth * (Platform.OS === "ios" ? 2 : 1.5)),
        undefined,
        undefined,
        Platform.OS === "ios" ? 90 : 70,
      ),
    [url, cardWidth],
  );

  // Stable navigation callback (Artsy pattern: prevents child re-renders)
  const handlePress = useCallback(() => {
    navigation.push(screenName.artwork, { art_id, url });
  }, [navigation, art_id, url]);

  // Memoize style objects to prevent re-creation per render
  const touchableStyle = useMemo(
    () => [tw`rounded-md`, { width: cardWidth }],
    [cardWidth],
  );

  const imageContainerStyle = useMemo(
    () => ({
      width: cardWidth,
      height: imageDisplayHeight,
      backgroundColor: hideBackground ? "transparent" : "#f0f0f0",
      borderRadius: 6,
      overflow: "hidden" as const,
    }),
    [cardWidth, imageDisplayHeight, hideBackground],
  );

  const imageStyle = useMemo(
    () => ({
      width: imageDisplayWidth,
      height: imageDisplayHeight,
    }),
    [imageDisplayWidth, imageDisplayHeight],
  );

  const overlayStyle = useMemo(() => [tw`absolute bottom-3 right-3`], []);

  const metaStyle = useMemo(
    () => [tw`mt-3`, { width: cardWidth }],
    [cardWidth],
  );

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={touchableStyle}
        onPress={handlePress}
      >
        <View style={imageContainerStyle}>
          <Image
            source={{ uri: imageUri }}
            style={imageStyle}
            contentFit="cover"
            transition={Platform.OS === "ios" ? 200 : 0}
            cachePolicy="memory-disk"
            placeholder={null}
            priority="low"
            onLoad={handleImageLoad}
          />
          {!galleryView && !disableLikeButton && (
            <View style={overlayStyle}>
              <View
                style={[
                  tw`h-[32px] w-[32px] rounded-md flex items-center justify-center`,
                  {
                    backgroundColor: "rgba(0,0,0,0.35)",
                  },
                ]}
              >
                <LikeComponent
                  art_id={art_id || ""}
                  impressions={impressions || 0}
                  likeIds={like_IDs || []}
                  lightText={true}
                />
              </View>
            </View>
          )}
        </View>
        <View style={metaStyle}>
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

const areLikeIdsEqual = (prevLikeIds?: string[], nextLikeIds?: string[]) => {
  if (prevLikeIds === nextLikeIds) return true;
  if (!prevLikeIds && !nextLikeIds) return true;
  if (!prevLikeIds || !nextLikeIds) return false;
  if (prevLikeIds.length !== nextLikeIds.length) return false;
  for (let i = 0; i < prevLikeIds.length; i += 1) {
    if (prevLikeIds[i] !== nextLikeIds[i]) return false;
  }
  return true;
};

const arePropsEqual = (
  prev: Readonly<ArtworkCardType>,
  next: Readonly<ArtworkCardType>,
) =>
  prev.title === next.title &&
  prev.url === next.url &&
  prev.price === next.price &&
  prev.artist === next.artist &&
  prev.showPrice === next.showPrice &&
  prev.availiablity === next.availiablity &&
  prev.lightText === next.lightText &&
  prev.width === next.width &&
  prev.art_id === next.art_id &&
  prev.impressions === next.impressions &&
  prev.galleryView === next.galleryView &&
  prev.disableLikeButton === next.disableLikeButton &&
  prev.hideBackground === next.hideBackground &&
  prev.useImageLoadAspectRatio === next.useImageLoadAspectRatio &&
  prev.image_format?.ratio === next.image_format?.ratio &&
  areLikeIdsEqual(prev.like_IDs, next.like_IDs);

export default React.memo(ArtworkCard, arePropsEqual);

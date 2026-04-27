import React, { useCallback, useMemo, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
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
  hidePriceLabel?: boolean;
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
  metadataMode?: "default" | "trending";
};

const MAX_IMAGE_HEIGHT = 380; // px
const MIN_IMAGE_HEIGHT = 100; // px

const DEFAULT_ASPECT_RATIO = 1;

const DPR_MULTIPLIER = Platform.OS === "ios" ? 2 : 1.5;
const IMAGE_TRANSITION_MS = Platform.OS === "ios" ? 200 : 0;
const S = StyleSheet.create({
  likeButton: {
    height: 32,
    width: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleWrap: {
    flexWrap: "wrap",
    width: "100%",
  },
});
const TW_OVERLAY = tw`absolute bottom-3 right-3`;
const parseAspectRatio = (ratio?: string): number | null => {
  if (!ratio) return null;
  const parts = ratio.split(":");
  if (parts.length !== 2) return null;
  const w = Number(parts[0]);
  const h = Number(parts[1]);
  if (!isFinite(w) || !isFinite(h) || h === 0 || w <= 0 || h <= 0) return null;
  return w / h;
};

const computeDimensions = (
  width: number,
  imageAspectRatio: number,
  isTablet: boolean,
  screenWidth: number,
): { cardWidth: number; imageDisplayHeight: number } => {
  if (width > 0) {
    const rawHeight = width / imageAspectRatio;
    return {
      cardWidth: width,
      imageDisplayHeight: Math.round(
        Math.min(MAX_IMAGE_HEIGHT, Math.max(MIN_IMAGE_HEIGHT, rawHeight)),
      ),
    };
  }

  const fixedWidth = Math.round(
    isTablet ? screenWidth * 0.35 : screenWidth * 0.65,
  );
  const rawHeight = fixedWidth / imageAspectRatio;

  return {
    cardWidth: fixedWidth,
    imageDisplayHeight: Math.round(
      Math.min(MAX_IMAGE_HEIGHT, Math.max(MIN_IMAGE_HEIGHT, rawHeight)),
    ),
  };
};

function ArtworkCard({
  title,
  url,
  artist,
  showPrice,
  hidePriceLabel = false,
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
  metadataMode = "default",
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
      const { width: w, height: h } = event.source;
      if (!w || !h || h === 0) return;

      const nextRatio = w / h;
      if (!isFinite(nextRatio) || nextRatio <= 0) return;

      setLoadedAspectRatio((prev) => {
        if (prev !== null && Math.abs(prev - nextRatio) < 0.005) return prev;
        return nextRatio;
      });
    },
    [useImageLoadAspectRatio],
  );

  const { cardWidth, imageDisplayHeight } = useMemo(
    () => computeDimensions(width, imageAspectRatio, isTablet, screenWidth),
    [width, imageAspectRatio, isTablet, screenWidth],
  );

  const imageUri = useMemo(
    () =>
      getImageFileView(
        url,
        Math.round(cardWidth * DPR_MULTIPLIER),
        undefined,
        undefined,
        Platform.OS === "ios" ? 90 : 70,
      ),
    [url, cardWidth],
  );

  const handlePress = useCallback(() => {
    navigation.push(screenName.artwork, { art_id, url });
  }, [navigation, art_id, url]);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[tw`rounded-sm`, { width: cardWidth }]}
        onPress={handlePress}
      >
        <View
          style={{
            width: cardWidth,
            height: imageDisplayHeight,
            backgroundColor: hideBackground ? "transparent" : "#f0f0f0",
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: cardWidth, height: imageDisplayHeight }}
            contentFit="cover"
            transition={IMAGE_TRANSITION_MS}
            cachePolicy="memory-disk"
            placeholder={null}
            priority="normal"
            onLoad={handleImageLoad}
          />
          {!galleryView && !disableLikeButton && (
            <View style={TW_OVERLAY}>
              <View style={S.likeButton}>
                <LikeComponent
                  art_id={art_id ?? ""}
                  impressions={impressions ?? 0}
                  likeIds={like_IDs ?? []}
                  lightText={true}
                />
              </View>
            </View>
          )}
        </View>
        <View style={[tw`mt-3`, { width: cardWidth }]}>
          {metadataMode === "trending" ? (
            <>
              <View style={S.titleWrap}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    tw`text-base capitalize font-serif leading-snug w-full`,
                    lightText ? tw`text-white/90` : tw`text-neutral-900`,
                  ]}
                >
                  {title}
                </Text>
              </View>
              <View
                style={[
                  tw`mt-2 pt-2 flex-row items-center justify-between border-neutral-200`,
                  { borderTopWidth: 1 },
                ]}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    tw`text-xs font-sans-regular flex-1 mr-2`,
                    lightText ? tw`text-white/80` : tw`text-slate-500`,
                  ]}
                >
                  {artist}
                </Text>
                <View style={tw`flex-row items-center`}>
                  <Text
                    style={[
                      tw`text-[10px] font-sans-medium`,
                      lightText ? tw`text-white/80` : tw`text-neutral-800`,
                    ]}
                  >
                    {impressions ?? 0}
                  </Text>
                  <Text
                    style={[
                      tw`text-[9px] uppercase tracking-wide ml-1`,
                      lightText ? tw`text-white/70` : tw`text-neutral-400`,
                    ]}
                  >
                    like(s)
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={S.titleWrap}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    tw`text-base capitalize font-serif leading-snug w-full`,
                    lightText ? tw`text-white/90` : tw`text-neutral-900`,
                  ]}
                >
                  {title}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    tw`text-xs capitalize w-full mt-0.5 font-sans-regular`,
                    lightText ? tw`text-white/80` : tw`text-slate-500`,
                  ]}
                >
                  {artist}
                </Text>
              </View>
              <View style={S.metaRow}>
                {availiablity !== false && (galleryView || userSession?.id) && !hidePriceLabel && (
                  <Text
                    style={[
                      tw`text-sm flex-1`,
                      lightText ? tw`text-white/90` : tw`text-[#1A1A1A]/90`,
                      showPrice ? tw`font-sans-bold` : tw`font-sans-medium`,
                    ]}
                  >
                    {showPrice ? utils_formatPrice(price) : "Price on Request"}
                  </Text>
                )}

                {availiablity === false && (
                  <Text
                    style={[
                      tw`text-sm flex-1 font-sans-semibold`,
                      lightText ? tw`text-white/90` : tw`text-[#1A1A1A]/90`,
                    ]}
                  >
                    SOLD
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const areLikeIdsEqual = (prev?: string[], next?: string[]): boolean => {
  if (prev === next) return true;
  if (!prev || !next) return false;
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i += 1) {
    if (prev[i] !== next[i]) return false;
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
  prev.hidePriceLabel === next.hidePriceLabel &&
  prev.availiablity === next.availiablity &&
  prev.lightText === next.lightText &&
  prev.width === next.width &&
  prev.art_id === next.art_id &&
  prev.impressions === next.impressions &&
  prev.galleryView === next.galleryView &&
  prev.disableLikeButton === next.disableLikeButton &&
  prev.hideBackground === next.hideBackground &&
  prev.metadataMode === next.metadataMode &&
  prev.useImageLoadAspectRatio === next.useImageLoadAspectRatio &&
  prev.image_format?.ratio === next.image_format?.ratio &&
  prev.image_format?.orientation === next.image_format?.orientation &&
  areLikeIdsEqual(prev.like_IDs, next.like_IDs);

export default React.memo(ArtworkCard, arePropsEqual);

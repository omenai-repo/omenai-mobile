import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  ARTWORK_CARD_IMAGE_HEIGHT,
  ARTWORK_CARD_MAX_WIDTH,
  ARTWORK_CARD_MIN_WIDTH,
  ARTWORK_CARD_MIN_IMAGE_HEIGHT,
} from "./artworkCard.constants";

type ArtworkCardArtwork = Partial<
  Omit<ArtworkDataType, "pricing" | "year" | "medium">
> &
  Partial<Omit<ArtworkFlatlistItem, "pricing" | "year" | "image_format" | "medium">> &
  Partial<Omit<ArtworkSchemaTypes, "pricing" | "year" | "image_format" | "medium">> & {
  image_url?: string;
  medium?: string;
  image_format?: {
    ratio?: string;
    orientation?: string;
  };
  pricing?: Partial<ArtworkPricing> & {
    shouldShowPrice?: "Yes" | "No";
  };
  year?: string | number;
};

type ArtworkCardType = {
  artwork: ArtworkCardArtwork;
  width?: number;
  rootHidePrice?: boolean;
  lightText?: boolean;
  galleryView?: boolean;
  disableLikeButton?: boolean;
  hideBackground?: boolean;
  useImageLoadAspectRatio?: boolean;
  metadataMode?: "default" | "trending";
  fixedImageHeight?: number;
  frameBackgroundColor?: string;
  useFixedImageFrame?: boolean;
};

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
  if (!Number.isFinite(w) || !Number.isFinite(h) || h === 0 || w <= 0 || h <= 0) return null;
  return w / h;
};

const computeDimensions = (
  width: number,
  imageAspectRatio: number,
  fixedImageHeight: number,
  isTablet: boolean,
  useFixedImageFrame: boolean,
): { cardWidth: number; imageFrameHeight: number } => {
  if (width > 0) {
    const variableHeight = Math.max(
      ARTWORK_CARD_MIN_IMAGE_HEIGHT,
      Math.round(width / Math.max(imageAspectRatio, 0.01)),
    );
    return {
      cardWidth: width,
      imageFrameHeight: useFixedImageFrame
        ? Math.max(ARTWORK_CARD_MIN_IMAGE_HEIGHT, fixedImageHeight)
        : variableHeight,
    };
  }

  const rawWidth = fixedImageHeight * imageAspectRatio;
  const minWidth = isTablet ? ARTWORK_CARD_MIN_WIDTH.tablet : ARTWORK_CARD_MIN_WIDTH.phone;
  const maxWidth = isTablet ? ARTWORK_CARD_MAX_WIDTH.tablet : ARTWORK_CARD_MAX_WIDTH.phone;
  const ratioDrivenWidth = Math.round(Math.max(minWidth, Math.min(maxWidth, rawWidth)));

  return {
    cardWidth: ratioDrivenWidth,
    imageFrameHeight: useFixedImageFrame
      ? Math.max(ARTWORK_CARD_MIN_IMAGE_HEIGHT, fixedImageHeight)
      : Math.max(
          ARTWORK_CARD_MIN_IMAGE_HEIGHT,
          Math.round(ratioDrivenWidth / Math.max(imageAspectRatio, 0.01)),
        ),
  };
};

function ArtworkCard({
  artwork,
  width = 0,
  rootHidePrice = false,
  lightText = false,
  galleryView = false,
  disableLikeButton = false,
  hideBackground = false,
  useImageLoadAspectRatio = false,
  metadataMode = "default",
  fixedImageHeight,
  frameBackgroundColor,
  useFixedImageFrame = true,
}: Readonly<ArtworkCardType>) {
  const userSession = useAppStore((s) => s.userSession);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isTablet } = useDevice();
  const title = artwork.title ?? "";
  const artist = artwork.artist ?? "";
  const url = artwork.url ?? artwork?.image_url ?? "";
  const art_id = artwork.art_id ?? "";
  const impressions = artwork.impressions ?? 0;
  const like_IDs = artwork.like_IDs ?? [];
  const availability = artwork.availability ?? true;
  const imageFormat = artwork.image_format;
  const price = artwork.pricing?.usd_price ?? 0;
  const canShowPriceLabel = galleryView || !!userSession?.id;
  const showPrice = canShowPriceLabel && artwork.pricing?.shouldShowPrice === "Yes";

  const metadataAspectRatio = useMemo(
    () => parseAspectRatio(imageFormat?.ratio),
    [imageFormat?.ratio],
  );
  const [loadedAspectRatio, setLoadedAspectRatio] = useState<number | null>(
    null,
  );

  useEffect(() => {
    // FlashList reuses cells; reset per-item load ratio so prior item state
    // doesn't briefly affect the next card during fast horizontal scroll.
    setLoadedAspectRatio(null);
  }, [url, art_id]);

  const imageAspectRatio =
    metadataAspectRatio ??
    loadedAspectRatio ??
    DEFAULT_ASPECT_RATIO;

  const resolvedFixedImageHeight = useMemo(
    () => fixedImageHeight ?? (isTablet ? ARTWORK_CARD_IMAGE_HEIGHT.tablet : ARTWORK_CARD_IMAGE_HEIGHT.phone),
    [fixedImageHeight, isTablet],
  );

  const handleImageLoad = useCallback(
    (event: ImageLoadEventData) => {
      if (!useImageLoadAspectRatio) return;
      const { width: w, height: h } = event.source;
      if (!w || !h || h === 0) return;

      const nextRatio = w / h;
      if (!Number.isFinite(nextRatio) || nextRatio <= 0) return;

      setLoadedAspectRatio((prev) => {
        if (prev !== null && Math.abs(prev - nextRatio) < 0.005) return prev;
        return nextRatio;
      });
    },
    [useImageLoadAspectRatio],
  );

  const { cardWidth, imageFrameHeight } = useMemo(
    () =>
      computeDimensions(
        width,
        imageAspectRatio,
        resolvedFixedImageHeight,
        isTablet,
        useFixedImageFrame,
      ),
    [width, imageAspectRatio, resolvedFixedImageHeight, isTablet, useFixedImageFrame],
  );

  const imageUri = useMemo(
    () =>
      getImageFileView(
        url,
        Math.round(cardWidth * DPR_MULTIPLIER),
        undefined,
        undefined,
        90,
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
            height: imageFrameHeight,
            backgroundColor: hideBackground
              ? "transparent"
              : frameBackgroundColor ?? "#f0f0f0",
            overflow: "hidden",
            alignItems: useFixedImageFrame ? "center" : undefined,
            justifyContent: useFixedImageFrame ? "center" : undefined,
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: cardWidth, height: imageFrameHeight }}
            contentFit="contain"
            transition={IMAGE_TRANSITION_MS}
            recyclingKey={art_id ?? url}
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
                {!rootHidePrice && availability !== false && canShowPriceLabel && (
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

                {!rootHidePrice && availability === false && (
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
  prev.artwork.title === next.artwork.title &&
  prev.artwork.url === next.artwork.url &&
  prev.artwork.image_url === next.artwork.image_url &&
  prev.artwork.artist === next.artwork.artist &&
  prev.artwork.pricing?.usd_price === next.artwork.pricing?.usd_price &&
  prev.artwork.pricing?.shouldShowPrice === next.artwork.pricing?.shouldShowPrice &&
  prev.artwork.availability === next.artwork.availability &&
  prev.artwork.art_id === next.artwork.art_id &&
  prev.artwork.impressions === next.artwork.impressions &&
  prev.width === next.width &&
  prev.rootHidePrice === next.rootHidePrice &&
  prev.lightText === next.lightText &&
  prev.galleryView === next.galleryView &&
  prev.disableLikeButton === next.disableLikeButton &&
  prev.hideBackground === next.hideBackground &&
  prev.useFixedImageFrame === next.useFixedImageFrame &&
  prev.metadataMode === next.metadataMode &&
  prev.useImageLoadAspectRatio === next.useImageLoadAspectRatio &&
  prev.artwork.image_format?.ratio === next.artwork.image_format?.ratio &&
  prev.artwork.image_format?.orientation === next.artwork.image_format?.orientation &&
  areLikeIdsEqual(prev.artwork.like_IDs, next.artwork.like_IDs);

export default React.memo(ArtworkCard, arePropsEqual);

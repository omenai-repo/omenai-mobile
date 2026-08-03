import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Pressable,
} from "react-native";
import { Image, ImageLoadEventData } from "expo-image";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import LikeComponent from "./LikeComponent";
import tw from "twrnc";
import { useDevice } from "#hooks/useDevice";
import { useAppStore } from "#store/app/appStore";
import ArtworkCardMetadata from "./ArtworkCardMetadata";
import type { ArtworkCardType } from "./artworkCard.types";
import {
  areArtworkCardPropsEqual,
  computeDimensions,
  DEFAULT_ASPECT_RATIO,
  parseAspectRatio,
  resolveFixedImageHeight,
} from "./artworkCard.utils";

const DPR_MULTIPLIER = Platform.OS === "ios" ? 2 : 1.5;
const IMAGE_TRANSITION_MS = Platform.OS === "ios" ? 200 : 0;

const styles = StyleSheet.create({
  likeButton: {
    height: 32,
    width: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
});

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
  const showPrice =
    canShowPriceLabel && artwork.pricing?.shouldShowPrice === "Yes";

  const metadataAspectRatio = useMemo(
    () => parseAspectRatio(imageFormat?.ratio),
    [imageFormat?.ratio],
  );
  const [loadedAspectRatio, setLoadedAspectRatio] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setLoadedAspectRatio(null);
  }, [url, art_id]);

  const imageAspectRatio =
    metadataAspectRatio ?? loadedAspectRatio ?? DEFAULT_ASPECT_RATIO;

  const resolvedFixedImageHeight = useMemo(
    () => resolveFixedImageHeight(fixedImageHeight, isTablet),
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
    [
      width,
      imageAspectRatio,
      resolvedFixedImageHeight,
      isTablet,
      useFixedImageFrame,
    ],
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
    <Pressable
      style={({ pressed }) => [
        tw`rounded-sm`,
        { width: cardWidth },
        pressed && tw`scale-99 opacity-90`,
      ]}
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
          <View style={tw`absolute bottom-3 right-3`}>
            <View style={styles.likeButton}>
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
        <ArtworkCardMetadata
          metadataMode={metadataMode}
          title={title}
          artist={artist}
          impressions={impressions}
          lightText={lightText}
          rootHidePrice={rootHidePrice}
          availability={availability}
          canShowPriceLabel={canShowPriceLabel}
          showPrice={showPrice}
          price={price}
        />
      </View>
    </Pressable>
  );
}

export default React.memo(ArtworkCard, areArtworkCardPropsEqual);

import {
  ARTWORK_CARD_IMAGE_HEIGHT,
  ARTWORK_CARD_MAX_WIDTH,
  ARTWORK_CARD_MIN_IMAGE_HEIGHT,
  ARTWORK_CARD_MIN_WIDTH,
} from "./artworkCard.constants";
import type { ArtworkCardType } from "./artworkCard.types";

export const DEFAULT_ASPECT_RATIO = 1;

export const parseAspectRatio = (ratio?: string): number | null => {
  if (!ratio) return null;
  const parts = ratio.split(":");
  if (parts.length !== 2) return null;
  const w = Number(parts[0]);
  const h = Number(parts[1]);
  if (!Number.isFinite(w) || !Number.isFinite(h) || h === 0 || w <= 0 || h <= 0)
    return null;
  return w / h;
};

export const computeDimensions = (
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
  const minWidth = isTablet
    ? ARTWORK_CARD_MIN_WIDTH.tablet
    : ARTWORK_CARD_MIN_WIDTH.phone;
  const maxWidth = isTablet
    ? ARTWORK_CARD_MAX_WIDTH.tablet
    : ARTWORK_CARD_MAX_WIDTH.phone;
  const ratioDrivenWidth = Math.round(
    Math.max(minWidth, Math.min(maxWidth, rawWidth)),
  );

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

export const resolveFixedImageHeight = (
  fixedImageHeight: number | undefined,
  isTablet: boolean,
): number =>
  fixedImageHeight ??
  (isTablet
    ? ARTWORK_CARD_IMAGE_HEIGHT.tablet
    : ARTWORK_CARD_IMAGE_HEIGHT.phone);

const areLikeIdsEqual = (prev?: string[], next?: string[]): boolean => {
  if (prev === next) return true;
  if (!prev || !next) return false;
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i += 1) {
    if (prev[i] !== next[i]) return false;
  }
  return true;
};

export const areArtworkCardPropsEqual = (
  prev: Readonly<ArtworkCardType>,
  next: Readonly<ArtworkCardType>,
) =>
  prev.artwork.title === next.artwork.title &&
  prev.artwork.url === next.artwork.url &&
  prev.artwork.image_url === next.artwork.image_url &&
  prev.artwork.artist === next.artwork.artist &&
  prev.artwork.pricing?.usd_price === next.artwork.pricing?.usd_price &&
  prev.artwork.pricing?.shouldShowPrice ===
    next.artwork.pricing?.shouldShowPrice &&
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
  prev.artwork.image_format?.orientation ===
    next.artwork.image_format?.orientation &&
  areLikeIdsEqual(prev.artwork.like_IDs, next.artwork.like_IDs);

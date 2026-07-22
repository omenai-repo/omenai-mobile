export type ArtworkCardArtwork = Partial<
  Omit<ArtworkDataType, "pricing" | "year" | "medium">
> &
  Partial<
    Omit<ArtworkFlatlistItem, "pricing" | "year" | "image_format" | "medium">
  > &
  Partial<
    Omit<ArtworkSchemaTypes, "pricing" | "year" | "image_format" | "medium">
  > & {
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

export type ArtworkCardType = {
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

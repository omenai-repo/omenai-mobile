import React, { useMemo } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

import ArRoomPreview from "./components/ArRoomPreview";
import type { FrameStyle } from "#types/ar";
import { parseArtworkDimensions } from "#lib/ar/parseArtworkDimensions";

type ArPreviewRouteParams = {
  artworkUri: string;
  artworkTitle: string;
  artworkWidth?: number;
  artworkHeight?: number;
  frameStyle?: FrameStyle;
  dimensions?: {
    height?: string;
    width?: string;
    length?: string;
  };
};

export default function ArPreview() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const params = route.params as ArPreviewRouteParams;

  const artworkDimensions = useMemo(() => {
    if (
      typeof params.artworkWidth === "number" &&
      typeof params.artworkHeight === "number" &&
      params.artworkWidth > 0 &&
      params.artworkHeight > 0
    ) {
      return {
        width: params.artworkWidth,
        height: params.artworkHeight,
      };
    }

    return parseArtworkDimensions(params.dimensions);
  }, [params.artworkHeight, params.artworkWidth, params.dimensions]);

  return (
    <ArRoomPreview
      artworkUri={params.artworkUri}
      artworkTitle={params.artworkTitle ?? "Artwork"}
      artworkDimensions={artworkDimensions}
      frameStyle={params.frameStyle ?? "dark"}
      onClose={() => navigation.goBack()}
    />
  );
}

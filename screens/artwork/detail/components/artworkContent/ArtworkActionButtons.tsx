import React from "react";
import { View } from "react-native";
import tw from "twrnc";
import SaveArtworkButton from "#screens/artwork/detail/components/SaveArtworkButton";
import ViewInSpaceButton from "#artwork/ar/components/ViewInSpaceButton";

interface ArtworkActionButtonsProps {
  primaryButton: React.ReactNode;
  userType: string;
  artwork: ArtworkDataType;
}

export default function ArtworkActionButtons({
  primaryButton,
  userType,
  artwork,
}: Readonly<ArtworkActionButtonsProps>) {
  return (
    <View style={tw`gap-4 mt-6 w-full`}>
      <View style={tw`w-full`}>{primaryButton}</View>

      {!["gallery", "artist"].includes(userType) && (
        <View style={tw`w-full flex-row gap-5`}>
          {/* <ViewInSpaceButton
            artworkTitle={artwork.title}
            artworkUri={artwork.url}
            dimensions={artwork.dimensions}
          /> */}
          <SaveArtworkButton
            likeIds={artwork.like_IDs || []}
            art_id={artwork.art_id || ""}
            impressions={artwork.impressions || 0}
            // minimized
          />
        </View>
      )}
    </View>
  );
}

import React from "react";
import { View } from "react-native";
import tw from "twrnc";
import SaveArtworkButton from "../SaveArtworkButton";

interface ArtworkActionButtonsProps {
  primaryButton: React.ReactNode;
  userType: string;
  likeIds: string[];
  art_id: string;
  impressions: number;
}

export default function ArtworkActionButtons({
  primaryButton,
  userType,
  likeIds,
  art_id,
  impressions,
}: ArtworkActionButtonsProps) {
  return (
    <View style={tw`gap-4 mt-6 w-full`}>
      <View style={tw`w-full`}>{primaryButton}</View>

      <View style={tw`w-full`}>
        {!["gallery", "artist"].includes(userType) && (
          <SaveArtworkButton
            likeIds={likeIds}
            art_id={art_id}
            impressions={impressions}
          />
        )}
      </View>
    </View>
  );
}

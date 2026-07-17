import React from "react";
import { View } from "react-native";
import tw from "twrnc";
import ShippingAndTaxes from "./extraDetails/ShippingAndTaxes";
import Coverage from "./extraDetails/Coverage";
import ArtworkHeader from "./artworkContent/ArtworkHeader";
import PhysicalSpecifications from "./artworkContent/PhysicalSpecifications";
import ArtworkPriceSection from "./artworkContent/ArtworkPriceSection";
import ArtworkActionButtons from "./artworkContent/ArtworkActionButtons";

export default function ArtworkContentSection({
  artwork,
  userType,
  isTabletLandscape,
  isTabletSize,
  primaryButton,
}: Readonly<{
  artwork: ArtworkDataType;
  userType: string;
  isTabletLandscape: boolean;
  isTabletSize: boolean;
  primaryButton: React.ReactNode;
}>) {
  return (
    <View style={isTabletLandscape ? [tw`pl-5`, { flex: 0.5 }] : tw``}>
      <ArtworkHeader
        title={artwork.title}
        artist={artwork.artist}
        medium={artwork.medium}
        year={artwork.year}
        rarity={artwork.rarity}
      />

      <PhysicalSpecifications dimensions={artwork.dimensions} />

      <ArtworkPriceSection
        availability={artwork.availability}
        shouldShowPrice={artwork.pricing.shouldShowPrice}
        usd_price={artwork.pricing.usd_price}
        userType={userType}
      />

      <ArtworkActionButtons
        primaryButton={primaryButton}
        userType={userType}
        likeIds={artwork.like_IDs || []}
        art_id={artwork.art_id || ""}
        impressions={artwork.impressions || 0}
      />

      <View style={[tw`mt-8 gap-4`, isTabletSize && tw`flex-row`]}>
        <View style={isTabletSize ? { flex: 1 } : undefined}>
          <ShippingAndTaxes />
        </View>
        <View style={isTabletSize ? { flex: 1 } : undefined}>
          <Coverage />
        </View>
      </View>
    </View>
  );
}

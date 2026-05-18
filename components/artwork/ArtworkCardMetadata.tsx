import React from "react";
import { StyleSheet, Text, View } from "react-native";
import tw from "twrnc";
import { utils_formatPrice } from "#utils/utils_priceFormatter";

const styles = StyleSheet.create({
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

type ArtworkCardMetadataProps = {
  metadataMode: "default" | "trending";
  title: string;
  artist: string;
  impressions: number;
  lightText: boolean;
  rootHidePrice: boolean;
  availability: boolean;
  canShowPriceLabel: boolean;
  showPrice: boolean;
  price: number;
};

export default function ArtworkCardMetadata({
  metadataMode,
  title,
  artist,
  impressions,
  lightText,
  rootHidePrice,
  availability,
  canShowPriceLabel,
  showPrice,
  price,
}: Readonly<ArtworkCardMetadataProps>) {
  if (metadataMode === "trending") {
    return (
      <>
        <View style={styles.titleWrap}>
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
              {impressions}
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
    );
  }

  return (
    <>
      <View style={styles.titleWrap}>
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
      <View style={styles.metaRow}>
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
  );
}

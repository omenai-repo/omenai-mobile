import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import { fontNames } from "#constants/fontNames.constants";
import { utils_formatPrice } from "#utils/utils_priceFormatter";

interface ArtworkDetailsProps {
  readonly title: string;
  readonly artist: string;
  readonly availability: boolean;
  readonly showPrice: boolean;
  readonly price: number;
}

export default function ArtworkDetails({
  title,
  artist,
  availability,
  showPrice,
  price,
}: Readonly<ArtworkDetailsProps>) {
  return (
    <View style={tw`mt-3 w-full`}>
      <Text style={tw`text-base font-serif leading-snug font-medium text-dark`}>
        {title}
      </Text>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={tw`text-xs text-slate-500 mt-0.5 font-sans`}
      >
        {artist}
      </Text>
      {availability ? (
        <Text
          style={tw`text-sm ${
            showPrice ? "font-bold" : "font-medium"
          } text-dark flex-1 text-[#1A1A1A]/90 font-sans ${
            showPrice ? "font-bold" : "font-medium"
          }`}
        >
          {showPrice ? utils_formatPrice(price) : "Price on request"}
        </Text>
      ) : (
        <Text
          style={tw`text-sm font-bold text-[#1A1A1A]/90 font-sans font-bold`}
        >
          SOLD
        </Text>
      )}
    </View>
  );
}

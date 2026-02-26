import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface ArtworkHeaderProps {
  title: string;
  artist: string;
  medium: string;
  year: string | number;
  rarity: string;
}

export default function ArtworkHeader({
  title,
  artist,
  medium,
  year,
  rarity,
}: ArtworkHeaderProps) {
  return (
    <View style={tw`my-6`}>
      {/* Artwork Title */}
      <Text
        style={tw`text-slate-900 text-3xl text-balance hyphens-auto tracking-tight font-serif`}
      >
        {title}
      </Text>

      {/* Artist Name */}
      <Text
        style={tw`font-sans-regular text-base text-slate-600 mt-3 capitalize`}
      >
        {artist}
      </Text>

      {/* Artwork Details */}
      <View
        style={tw`flex-row w-full flex-wrap items-center gap-3s border-t border-b border-slate-100 py-4 mt-6`}
      >
        <Text
          style={tw`font-sans text-xs uppercase tracking-widest text-slate-500`}
        >
          {medium}
        </Text>
        <View style={tw`h-3 w-[1px] bg-slate-200`} />
        <Text
          style={tw`font-sans text-xs uppercase tracking-widest text-slate-500`}
        >
          {year}
        </Text>
        <View style={tw`h-3 w-[1px] bg-slate-200`} />
        <Text
          style={tw`font-sans text-xs uppercase tracking-widest text-slate-500`}
        >
          {rarity}
        </Text>
      </View>
    </View>
  );
}

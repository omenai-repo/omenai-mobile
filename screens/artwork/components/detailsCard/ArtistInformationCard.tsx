import { Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";

type ArtistInformationCardProps = {
  artistName: string;
  birthYear: string;
  country: string;
};

export default function ArtistInformationCard({
  artistName,
  birthYear,
  country,
}: ArtistInformationCardProps) {
  return (
    <View
      style={[
        tw`px-[24px] py-[32px] rounded-md`,
        { backgroundColor: colors.black },
      ]}
    >
      <Text
        style={tw`text-neutral-400 text-[11px] tracking-wider font-sans uppercase mb-[24px]`}
      >
        About the Artist
      </Text>

      <Text style={tw`text-white text-[32px] font-serif mb-[32px]`}>
        {artistName}
      </Text>

      <View style={tw`h-[1px] w-full bg-white/20 mb-[32px]`} />

      <View style={tw`flex-row justify-between w-full pr-[20%]`}>
        <View style={tw`flex-col gap-[8px]`}>
          <Text
            style={tw`text-neutral-400 text-[11px] tracking-wider uppercase`}
          >
            Born
          </Text>
          <Text style={tw`text-white text-[15px]`}>{birthYear || "N/A"}</Text>
        </View>

        <View style={tw`flex-col gap-[8px]`}>
          <Text
            style={tw`text-neutral-400 text-[11px] tracking-wider uppercase`}
          >
            Origin
          </Text>
          <Text style={tw`text-white text-[15px]`}>{country || "N/A"}</Text>
        </View>
      </View>
    </View>
  );
}

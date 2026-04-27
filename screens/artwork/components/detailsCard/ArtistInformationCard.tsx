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
}: Readonly<ArtistInformationCardProps>) {
  return (
    <View style={[tw`px-6 py-8 rounded-sm`, { backgroundColor: colors.black }]}>
      <Text
        style={tw`text-neutral-400 text-sm tracking-wider font-sans-regular uppercase mb-2`}
      >
        About the Artist
      </Text>

      <Text style={tw`text-white text-3xl font-serif capitalize`}>
        {artistName}
      </Text>

      <View style={tw`h-[1px] w-full bg-white/20 my-8`} />

      <View style={tw`flex-row justify-between w-full pr-[20%]`}>
        <View style={tw`flex-col gap-2`}>
          <Text
            style={tw`text-neutral-400 text-sm tracking-wider font-sans-regular uppercase`}
          >
            Born
          </Text>
          <Text style={tw`text-white text-base`}>{birthYear || "N/A"}</Text>
        </View>

        <View style={tw`flex-col gap-2`}>
          <Text
            style={tw`text-neutral-400 text-sm tracking-wider font-sans-regular uppercase`}
          >
            Origin
          </Text>
          <Text style={tw`text-white text-base`}>{country || "N/A"}</Text>
        </View>
      </View>
    </View>
  );
}

import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import tw from "twrnc";

import LongBlackButton from "#components/buttons/LongBlackButton";
import { colors } from "#config/colors.config";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";

type AddArtistSuccessViewProps = {
  displayName: string;
  successLogo: string | null;
  onDone: () => void;
  isDoneLoading?: boolean;
};

export function AddArtistSuccessView({
  displayName,
  successLogo,
  onDone,
  isDoneLoading = false,
}: AddArtistSuccessViewProps) {
  return (
    <ScrollView
      contentContainerStyle={tw`px-5 pt-10 pb-10 items-center`}
      showsVerticalScrollIndicator={false}
    >
      <View style={tw`w-12 h-12 bg-neutral-900 rounded-sm items-center justify-center mb-8`}>
        <Text style={tw`text-white text-xl`}>✓</Text>
      </View>

      <View style={tw`h-20 w-20 rounded-sm bg-neutral-100 border border-neutral-200 overflow-hidden items-center justify-center mb-5`}>
        {successLogo ? (
          <Image
            source={{ uri: getGalleryLogoFileView(successLogo, 160, 160) }}
            style={tw`h-20 w-20`}
          />
        ) : (
          <Text style={tw`text-xl font-medium text-neutral-500 tracking-wider`}>
            {displayName.substring(0, 2).toUpperCase()}
          </Text>
        )}
      </View>

      <Text style={[tw`text-2xl font-normal text-center mb-2`, { color: colors.black }]}>
        {displayName}
      </Text>
      <Text style={tw`text-sm text-neutral-500 text-center mb-10 tracking-wide px-2`}>
        has been successfully added to your roster of represented artists.
      </Text>

      <LongBlackButton
        value={isDoneLoading ? "Finishing…" : "Done"}
        onClick={onDone}
        outline
        isLoading={isDoneLoading}
        isDisabled={isDoneLoading}
      />
    </ScrollView>
  );
}

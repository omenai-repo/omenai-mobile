import React from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import tw from "twrnc";
import type { GalleryOverviewArtist } from "#services/partners/fetchGalleryOverviewData";
import { RosterBlock } from "#screens/individual/galleries/galleryDetails/GalleryDetailsOverviewContent";

type Props = {
  isActive: boolean;
  isLoading: boolean;
  represented: GalleryOverviewArtist[];
  available: GalleryOverviewArtist[];
  onArtistNamePress: (name: string) => void;
};

export default function GalleryArtistsTabContent({
  isActive,
  isLoading,
  represented,
  available,
  onArtistNamePress,
}: Props) {
  const { width: screenW } = useWindowDimensions();
  const contentWidth = screenW - 32;

  if (!isActive) return null;

  if (isLoading) {
    return (
      <View style={tw`py-20 items-center`}>
        <Text style={tw`text-xs uppercase tracking-widest text-neutral-400`}>Loading artists...</Text>
      </View>
    );
  }

  if (represented.length === 0 && available.length === 0) {
    return (
      <View style={tw`py-20 px-4`}>
        <Text style={tw`text-center text-xs uppercase text-neutral-400`}>
          No artist listing for this gallery yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-4 pb-16 pt-4`} nestedScrollEnabled>
      <View style={tw`bg-neutral-50 border border-neutral-100 rounded-sm p-4 mb-6`}>
        <Text style={tw`text-sm text-neutral-600 font-sans-regular leading-5`}>
          Tap a name to search the app for works. On the web you can filter the gallery&apos;s works by artist.
        </Text>
      </View>
      <RosterBlock
        title="Represented Artists"
        artists={represented}
        onArtistPress={onArtistNamePress}
        contentWidth={contentWidth}
      />
      <RosterBlock
        title="Works Available By"
        artists={available}
        onArtistPress={onArtistNamePress}
        contentWidth={contentWidth}
      />
    </ScrollView>
  );
}

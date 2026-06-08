import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import tw from "twrnc";
import { useAppStore } from "#store/app/appStore";
import ArtistCard from "./ArtistCard";
import LongWhiteButton from "#components/buttons/LongWhiteButton";
import SectionHeader from "#components/general/SectionHeader";
import { colors } from "#config/colors.config";
import { getArtists } from "#services/overview/fetchArtist";
import { HOME_QK } from "#utils/queryKeys";
import { FlashList } from "@shopify/flash-list";
import { useArtistFollow } from "#hooks/useArtistFollow";
import { screenName } from "#constants/screenNames.constants";

const SKELETON_ITEMS = ["skeleton-1", "skeleton-2", "skeleton-3"];

export default function FeaturedArtists() {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();
  const { isFollowingFor, toggleFollow, isLoadingFollowed, hasUser } =
    useArtistFollow();

  const {
    data: featuredArtists = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: HOME_QK.featuredArtists(userSession?.id),
    queryFn: async () => {
      const res = await getArtists();

      if (!res?.isOk) {
        throw new Error(
          res?.message || res?.body?.message || "Failed to load artists.",
        );
      }

      return res.data?.featured_artists ?? [];
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Failed to load artists.";
    return (
      <View style={tw`p-[30px]`}>
        <Text style={tw`text-[#858585] text-center`}>{message}</Text>
      </View>
    );
  }

  const listData = isLoading ? SKELETON_ITEMS : featuredArtists;

  const renderArtistItem = ({ item }: { item: any }) => {
    if (isLoading) {
      return (
        <View style={tw`w-[250px]`}>
          <View style={tw`w-full h-[170px] rounded-sm bg-neutral-200`} />
          <View style={tw`mt-3`}>
            <View style={tw`h-5 w-36 bg-neutral-200 rounded-sm`} />
            <View style={tw`h-3 w-28 bg-neutral-200 rounded-sm mt-2`} />
            <View style={tw`h-7 w-24 bg-neutral-200 rounded-sm mt-3`} />
          </View>
        </View>
      );
    }

    return (
      <ArtistCard
        artist={item}
        isFollowing={isFollowingFor(item.author_id)}
        onToggleFollow={toggleFollow}
        onPressArtist={() =>
          navigation.navigate(screenName.individual.artistDetails, {
            artistId: item.author_id,
            name: item.artist,
            logo: item.logo,
            coverUrl: item.mostLikedArtwork?.url,
            birthyear: item.birthyear,
            country: item.artistCountry,
          })
        }
        disabled={!hasUser || isLoadingFollowed}
      />
    );
  };

  return (
    <View style={tw`mt-6`}>
      <SectionHeader subtitle="Featured Artists" title="Artists to watch" />

      <FlashList
        data={listData}
        keyExtractor={(item) => (isLoading ? item : item.author_id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`pt-5 px-5`}
        ItemSeparatorComponent={() => <View style={tw`w-5`} />}
        renderItem={renderArtistItem}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={tw`p-[30px]`}>
              <Text style={tw`text-[#858585] text-center`}>
                No featured artists available
              </Text>
            </View>
          )
        }
      />

      {!isLoading && (
        <View style={tw`px-5 mt-7`}>
          <LongWhiteButton
            value="View all artists"
            onClick={() => navigation.navigate(screenName.individual.allArtists)}
            outline
            borderColor={colors.inputBorder}
            textStyle={tw`text-neutral-700 font-sans-regular`}
            style={{ height: 48 }}
            icon={<Feather name="arrow-right" size={16} color={tw.color("neutral-500")} />}
          />
        </View>
      )}
    </View>
  );
}

import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { screenName } from "#constants/screenNames.constants";
import { useArtistFollow } from "#hooks/useArtistFollow";
import AllArtistCard, {
  type DirectoryArtist,
} from "#screens/marketplace/discovery/artists/components/AllArtistCard";
import GalleriesDirectorySkeleton from "#screens/marketplace/discovery/galleries/components/GalleriesDirectorySkeleton";
import { useAllArtists } from "../hooks/useAllArtists";

const PAGE_SIZE = 12;
const H_PAD = 20;
const GAP = 12;

function ListHeader() {
  return (
    <View style={tw`px-5 border-b border-neutral-100 pb-10 mb-7`}>
      <Text style={tw`font-serif text-3xl text-neutral-900`}>All Artists</Text>
      <Text
        style={tw`mt-2 font-sans-regular text-sm text-neutral-500 uppercase tracking-widest`}
      >
        Browse our verified artists
      </Text>
    </View>
  );
}

export default function AllArtistsScreen() {
  const navigation = useNavigation<any>();
  const { width: screenW } = useWindowDimensions();
  const cardWidth = useMemo(() => (screenW - H_PAD * 2 - GAP) / 2, [screenW]);

  const {
    data: artists = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAllArtists();
  const { isFollowingFor, toggleFollow, isLoadingFollowed, hasUser } =
    useArtistFollow();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleArtists = useMemo(
    () => artists.slice(0, visibleCount),
    [artists, visibleCount],
  );
  const hasMore = visibleCount < artists.length;

  const onOpenDetails = useCallback(
    (item: DirectoryArtist) => {
      navigation.navigate(screenName.individual.artistDetails, {
        artistId: item.artist_id,
        name: item.name,
        logo: item.logo,
        birthyear: item.birthyear,
        country: item.country_of_origin,
      });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<DirectoryArtist> = useCallback(
    ({ item }) => (
      <AllArtistCard
        artist={item}
        cardWidth={cardWidth}
        isFollowing={isFollowingFor(item.artist_id)}
        onToggleFollow={toggleFollow}
        onPressArtist={() => onOpenDetails(item)}
        disabled={!hasUser || isLoadingFollowed}
      />
    ),
    [
      cardWidth,
      isFollowingFor,
      onOpenDetails,
      toggleFollow,
      hasUser,
      isLoadingFollowed,
    ],
  );

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="Artists" />
        <GalleriesDirectorySkeleton horizontalPad={H_PAD} cardGap={GAP} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="Artists" />
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Text
            style={tw`text-center text-xs uppercase tracking-widest text-neutral-400`}
          >
            Failed to load artists.
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={tw`mt-4 border border-neutral-300 rounded-sm px-4 py-2`}
          >
            <Text style={tw`text-sm text-neutral-900`}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Artists" />
      <FlatList
        data={visibleArtists}
        keyExtractor={(item) => item.artist_id}
        numColumns={2}
        extraData={[cardWidth, isLoadingFollowed, hasUser]}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={tw`py-20 px-5 items-center`}>
            <Text
              style={tw`text-xs uppercase tracking-widest text-neutral-400 text-center`}
            >
              No artists available at this time.
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <View
              style={tw`border-t border-neutral-100 pt-8 pb-10 px-5 items-center`}
            >
              <Pressable
                onPress={() => setVisibleCount((count) => count + PAGE_SIZE)}
                disabled={isRefetching}
                style={({ pressed }) => [
                  tw`border border-neutral-200 rounded-sm px-10 py-4`,
                  pressed && tw`bg-neutral-50`,
                ]}
              >
                <Text
                  style={tw`text-xs font-sans-medium text-neutral-900 uppercase tracking-widest`}
                >
                  Load more artists
                </Text>
              </Pressable>
            </View>
          ) : null
        }
        contentContainerStyle={[tw`pb-8`, { flexGrow: 1 }]}
        columnWrapperStyle={{
          paddingHorizontal: H_PAD,
          marginBottom: 24,
          justifyContent: "space-between",
        }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasMore) setVisibleCount((count) => count + PAGE_SIZE);
        }}
        onEndReachedThreshold={0.4}
      />
    </View>
  );
}

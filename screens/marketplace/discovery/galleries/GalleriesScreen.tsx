import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import FollowComponent from "#components/follow/FollowComponent";
import { useGalleryFollow } from "#hooks/useGalleryFollow";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";
import { useGalleriesDirectoryPageSize } from "#screens/marketplace/discovery/hooks/useGalleries";
import type { GalleryListRecord } from "#services/marketplace/overview/fetchGalleries";
import { screenName } from "#constants/screenNames.constants";
import GalleriesDirectorySkeleton from "#screens/marketplace/discovery/galleries/components/GalleriesDirectorySkeleton";

const PAGE_SIZE = 15;
const H_PAD = 20;
const GAP = 12;

function directoryLocation(gallery: GalleryListRecord) {
  const country = gallery.address?.country;
  if (!country) return "";
  return String(country);
}

type NavParams = { galleryId: string; name: string; logo: string };

function ListHeader() {
  return (
    <View style={tw`px-5 border-b border-neutral-100 pb-10 mb-7`}>
      <Text style={tw`font-serif text-3xl text-neutral-900`}>Gallery Directory</Text>
      <Text style={tw`mt-2 font-sans-regular text-sm text-neutral-500 uppercase tracking-widest`}>
        Explore our global Gallery partners
      </Text>
    </View>
  );
}

type CardProps = {
  readonly item: GalleryListRecord;
  readonly cardWidth: number;
  readonly onOpenDetails: () => void;
  readonly isFollowing: boolean;
  readonly onToggleFollow: () => void;
  readonly followDisabled: boolean;
  readonly locationText: string;
};

function GalleryDirectoryCard({
  item,
  cardWidth,
  onOpenDetails,
  isFollowing,
  onToggleFollow,
  followDisabled,
  locationText,
}: Readonly<CardProps>) {
  return (
    <View style={[{ width: cardWidth }]}>
      <Pressable onPress={onOpenDetails} style={({ pressed }) => [pressed && tw`opacity-90`]}>
        <View
          style={[
            tw`w-full bg-neutral-100 rounded-sm overflow-hidden`,
            { width: cardWidth, aspectRatio: 4 / 3 },
          ]}
        >
          {item.logo ? (
            <Image
              source={{ uri: getGalleryLogoFileView(item.logo, 600) }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : (
            <View style={tw`w-full h-full items-center justify-center`}>
              <Text style={tw`font-serif text-4xl text-neutral-300 italic`}>
                {item.name?.charAt(0) ?? "?"}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
      <View style={tw`mt-3 flex-row items-center justify-between`}>
        <Pressable
          onPress={onOpenDetails}
          style={({ pressed }) => [tw`flex-1 pr-1 min-w-0`, pressed && tw`opacity-80`]}
        >
          <Text numberOfLines={1} style={tw`font-serif text-sm text-neutral-900`}>
            {item.name}
          </Text>
          {!!locationText && (
            <Text
              numberOfLines={1}
              style={tw`mt-1.5 font-sans-regular text-[10px] text-neutral-400 uppercase tracking-[0.15em]`}
            >
              {locationText}
            </Text>
          )}
        </Pressable>
        <FollowComponent
          isFollowing={isFollowing}
          onPress={onToggleFollow}
          disabled={followDisabled}
        />
      </View>
    </View>
  );
}

export default function GalleriesScreen() {
  const navigation = useNavigation<any>();
  const { width: screenW } = useWindowDimensions();
  const cardWidth = useMemo(
    () => (screenW - H_PAD * 2 - GAP) / 2,
    [screenW],
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGalleriesDirectoryPageSize(PAGE_SIZE);
  const { isFollowingFor, toggleFollow, isLoadingFollowed, hasUser } = useGalleryFollow();

  const allGalleries = useMemo(
    () => data?.pages.flatMap((p) => p?.data ?? []) ?? [],
    [data],
  );

  const onOpenDetails = useCallback(
    (item: GalleryListRecord) => {
      const params: NavParams = {
        galleryId: item.gallery_id,
        name: item.name,
        logo: item.logo,
      };
      navigation.navigate(screenName.individual.galleryDetails, params);
    },
    [navigation],
  );

  const renderItem: ListRenderItem<GalleryListRecord> = useCallback(
    ({ item }) => (
      <GalleryDirectoryCard
        item={item}
        cardWidth={cardWidth}
        onOpenDetails={() => onOpenDetails(item)}
        isFollowing={isFollowingFor(item.gallery_id)}
        onToggleFollow={() => {
          toggleFollow(item.gallery_id);
        }}
        followDisabled={!hasUser || isLoadingFollowed}
        locationText={directoryLocation(item)}
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
        <BackHeaderTitle title="Galleries" />
        <GalleriesDirectorySkeleton horizontalPad={H_PAD} cardGap={GAP} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="Galleries" />
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Text style={tw`text-center text-xs uppercase tracking-widest text-neutral-400 font-sans`}>
            Failed to load galleries.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Galleries" />
      <FlatList
        data={allGalleries}
        keyExtractor={(item) => item.gallery_id}
        numColumns={2}
        extraData={cardWidth}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={tw`py-20 px-5 items-center`}>
            <Text style={tw`text-xs uppercase tracking-widest text-neutral-400 text-center`}>
              No galleries available at this time.
            </Text>
          </View>
        }
        ListFooterComponent={
          hasNextPage ? (
            <View style={tw`border-t border-neutral-100 pt-8 pb-10 px-5 items-center`}>
              <Pressable
                onPress={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                style={({ pressed }) => [
                  tw`border border-neutral-200 rounded-sm px-10 py-4`,
                  isFetchingNextPage && tw`opacity-50`,
                  pressed && !isFetchingNextPage && tw`bg-neutral-50`,
                ]}
              >
                {isFetchingNextPage ? (
                  <ActivityIndicator size="small" color="#171717" />
                ) : (
                  <Text style={tw`text-xs font-sans font-medium text-neutral-900 uppercase tracking-widest`}>
                    Load More Galleries
                  </Text>
                )}
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
      />
    </View>
  );
}

import React, { useCallback, useMemo, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { screenName } from "#constants/screenNames.constants";
import { useSearchStore } from "#store/search/searchStore";
import { useGalleryOverview, useGalleryProfile } from "#screens/individual/hooks/useGalleries";
import GalleryDetailsSkeleton from "#screens/individual/galleries/components/GalleryDetailsSkeleton";
import GalleryDetailsOverviewContent from "#screens/individual/galleries/galleryDetails/GalleryDetailsOverviewContent";
import GalleryProfileHeader from "#screens/individual/galleries/galleryDetails/GalleryProfileHeader";
import GalleryTabBar, { type GalleryTabId } from "#screens/individual/galleries/galleryDetails/GalleryTabBar";
import GalleryWorksTabContent from "#screens/individual/galleries/galleryDetails/GalleryWorksTabContent";
import GalleryShowsTabContent from "#screens/individual/galleries/galleryDetails/GalleryShowsTabContent";
import GalleryArtistsTabContent from "#screens/individual/galleries/galleryDetails/GalleryArtistsTabContent";
import GalleryContactTabContent from "#screens/individual/galleries/galleryDetails/GalleryContactTabContent";
import { EVENTS_QK } from "#utils/queryKeys";

type RouteParams = RouteProp<
  {
    params: {
      galleryId: string;
      name?: string;
      logo?: string;
    };
  },
  "params"
>;

export default function GalleryDetailsScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { width: screenW } = useWindowDimensions();
  const { galleryId, name } = route.params;
  const { setSearchQuery, setSubmittedQuery } = useSearchStore();
  const [activeTab, setActiveTab] = useState<GalleryTabId>("overview");

  const { data: profile, refetch: refetchProfile } = useGalleryProfile(galleryId);
  const { data, isLoading, isError, refetch, isRefetching } = useGalleryOverview(galleryId);

  const { contentWidth, railCardWidth } = useMemo(() => {
    const cw = screenW - 32;
    return { contentWidth: cw, railCardWidth: Math.min(280, cw * 0.85) };
  }, [screenW]);

  const galleryName = data?.name ?? profile?.name ?? name ?? "Gallery";
  const represented = data?.represented_artists ?? [];
  const available = data?.available_artists ?? [];

  const onViewAllShows = useCallback(() => {
    setActiveTab("shows");
  }, []);

  const onArtistNamePress = useCallback(
    (artistName: string) => {
      setSearchQuery(artistName);
      setSubmittedQuery(artistName);
      navigation.navigate(screenName.searchResults);
    },
    [navigation, setSearchQuery, setSubmittedQuery],
  );

  const onRefreshOverview = useCallback(() => {
    void refetch();
    void refetchProfile();
    void queryClient.invalidateQueries({ queryKey: ["events", "gallery", "works", galleryId] });
    void queryClient.invalidateQueries({ queryKey: EVENTS_QK.galleryShowsTab(galleryId) });
    void queryClient.invalidateQueries({ queryKey: EVENTS_QK.galleryContact(galleryId) });
  }, [refetch, refetchProfile, queryClient, galleryId]);

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title={galleryName} />
      <GalleryProfileHeader galleryId={galleryId} profile={profile} nameFallback={name ?? "Gallery"} />
      <GalleryTabBar active={activeTab} onSelect={setActiveTab} />
      <View style={tw`flex-1`}>
        {activeTab === "overview" &&
          (isLoading && !data ? (
            <GalleryDetailsSkeleton />
          ) : isError || !data ? (
            <View style={tw`flex-1 items-center justify-center px-6`}>
              <Text style={tw`text-center text-xs uppercase tracking-widest text-neutral-400`}>
                Could not load this gallery. Try again, or go back.
              </Text>
              <Pressable onPress={() => refetch()} style={tw`mt-4 border border-neutral-300 rounded-sm px-4 py-2`}>
                <Text style={tw`text-sm text-neutral-900`}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <GalleryDetailsOverviewContent
              data={data}
              contentWidth={contentWidth}
              railCardWidth={railCardWidth}
              navigation={navigation}
              onArtistNamePress={onArtistNamePress}
              onViewAllShows={onViewAllShows}
              isRefetching={isRefetching}
              onRefresh={onRefreshOverview}
            />
          ))}

        {activeTab === "works" && <GalleryWorksTabContent galleryId={galleryId} isActive />}
        {activeTab === "shows" && (
          <GalleryShowsTabContent galleryId={galleryId} isActive galleryName={galleryName} />
        )}
        {activeTab === "artists" && (
          <GalleryArtistsTabContent
            isActive={activeTab === "artists"}
            isLoading={isLoading}
            represented={represented}
            available={available}
            onArtistNamePress={onArtistNamePress}
          />
        )}
        {activeTab === "contact" && <GalleryContactTabContent galleryId={galleryId} isActive />}
      </View>
    </View>
  );
}

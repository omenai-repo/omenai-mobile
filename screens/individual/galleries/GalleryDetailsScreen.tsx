import React, { useCallback, useMemo, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import type { GalleryOverviewArtist } from "#services/partners/fetchGalleryOverviewData";
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
  const [activeTab, setActiveTab] = useState<GalleryTabId>("overview");
  const [selectedArtistId, setSelectedArtistId] = useState<string | undefined>(undefined);

  const { data: profile, refetch: refetchProfile } = useGalleryProfile(galleryId);
  const { data, isLoading, isError, refetch, isRefetching } = useGalleryOverview(galleryId);

  const { contentWidth, railCardWidth } = useMemo(() => {
    const cw = screenW - 32;
    return { contentWidth: cw, railCardWidth: Math.min(280, cw * 0.85) };
  }, [screenW]);

  const galleryName = data?.name ?? profile?.name ?? name ?? "Gallery";
  const represented = useMemo(() => data?.represented_artists ?? [], [data?.represented_artists]);
  const available = useMemo(() => data?.available_artists ?? [], [data?.available_artists]);
  const artistOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    [...represented, ...available].forEach((artist) => {
      const id = String(artist.artist_id || "").trim();
      if (!id) return;
      if (!map.has(id)) {
        map.set(id, { id, name: artist.name });
      }
    });
    return Array.from(map.values());
  }, [represented, available]);

  const onViewAllShows = useCallback(() => {
    setActiveTab("shows");
  }, []);

  const onArtistPress = useCallback((artist: GalleryOverviewArtist) => {
    setSelectedArtistId(artist.artist_id);
    setActiveTab("works");
  }, []);

  const onRefreshOverview = useCallback(() => {
    refetch();
    refetchProfile();
    queryClient.invalidateQueries({ queryKey: ["events", "gallery", "works", galleryId] });
    queryClient.invalidateQueries({ queryKey: EVENTS_QK.galleryShowsTab(galleryId) });
    queryClient.invalidateQueries({ queryKey: EVENTS_QK.galleryContact(galleryId) });
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
              onArtistPress={onArtistPress}
              onViewAllShows={onViewAllShows}
              isRefetching={isRefetching}
              onRefresh={onRefreshOverview}
            />
          ))}

        {activeTab === "works" && (
          <GalleryWorksTabContent
            galleryId={galleryId}
            isActive
            artistOptions={artistOptions}
            selectedArtistId={selectedArtistId}
          />
        )}
        {activeTab === "shows" && (
          <GalleryShowsTabContent galleryId={galleryId} isActive galleryName={galleryName} />
        )}
        {activeTab === "artists" && (
          <GalleryArtistsTabContent
            galleryId={galleryId}
            isActive={activeTab === "artists"}
            isLoading={isLoading}
            represented={represented}
            available={available}
            onArtistPress={onArtistPress}
          />
        )}
        {activeTab === "contact" && <GalleryContactTabContent galleryId={galleryId} isActive />}
      </View>
    </View>
  );
}

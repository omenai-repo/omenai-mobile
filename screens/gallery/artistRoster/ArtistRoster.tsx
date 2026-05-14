import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";

import FittedBlackButton from "#components/buttons/FittedBlackButton";
import { RosterArtistRow } from "#components/gallery/artistRoster/RosterArtistRow";
import { RosterListSearchHeader } from "#components/gallery/artistRoster/RosterListSearchHeader";
import {
  RosterEmptyState,
  RosterLoadingState,
  RosterNoSearchResultsState,
} from "#components/gallery/artistRoster/RosterStateViews";
import { colors } from "#config/colors.config";
import { screenName } from "#constants/screenNames.constants";
import {
  fetchGalleryRoster,
  removeArtistFromRosterService,
} from "#services/roster/galleryRoster";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/modal/modalStore";
import type { RosterArtist } from "#types/roster.types";

const ROSTER_QK = (galleryId: string) => ["gallery-roster", galleryId] as const;

export default function ArtistRoster() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { updateModal, updateConfirmationModal, clear } = useModalStore();
  const galleryId = userSession?.id ?? "";

  const [searchTerm, setSearchTerm] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const rosterQuery = useQuery({
    queryKey: ROSTER_QK(galleryId),
    queryFn: async () => {
      const res = await fetchGalleryRoster(galleryId);
      if (!res.isOk) throw new Error(res.message || "Failed to fetch roster");
      return res.roster;
    },
    enabled: galleryId.length > 0,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });

  const roster = useMemo(() => rosterQuery.data ?? [], [rosterQuery.data]);

  const filteredRoster = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    if (!t) return roster;
    return roster.filter((a) => a.name.toLowerCase().includes(t));
  }, [roster, searchTerm]);

  const onRefresh = useCallback(async () => {
    await rosterQuery.refetch();
  }, [rosterQuery]);

  const confirmRemove = useCallback(
    (artist: RosterArtist) => {
      if (removingId !== null) return;
      updateConfirmationModal({
        child: (
          <View style={tw`p-3`}>
            <Text style={tw`text-base text-neutral-900 mb-2`}>Remove artist</Text>
            <Text style={tw`text-sm text-neutral-600 mb-5 font-sans-normal`}>
              Remove <Text style={tw`font-sans-semibold`}>{artist.name}</Text> from your represented artists?
            </Text>
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 py-3 border border-neutral-300 rounded-sm items-center`}
                activeOpacity={0.85}
                onPress={() => clear()}
              >
                <Text style={tw`text-sm text-neutral-700`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 py-3 bg-red-600 rounded-sm items-center`}
                activeOpacity={0.85}
                onPress={async () => {
                  clear();
                  if (!galleryId || !artist.artist_id) {
                    updateModal({
                      showModal: true,
                      modalType: "error",
                      message: "Invalid gallery or artist. Please try again.",
                    });
                    return;
                  }
                  setRemovingId(artist.artist_id);
                  try {
                    const res = await removeArtistFromRosterService(
                      galleryId,
                      artist.artist_id,
                    );
                    if (!res.isOk) {
                      updateModal({
                        showModal: true,
                        modalType: "error",
                        message:
                          res.message || "Could not remove artist. Please try again.",
                      });
                      return;
                    }
                    await queryClient.invalidateQueries({ queryKey: ROSTER_QK(galleryId) });
                  } catch (error: any) {
                    updateModal({
                      showModal: true,
                      modalType: "error",
                      message:
                        error?.message || error?.body?.message || "An unexpected error occurred. Please try again later.",
                    });
                  } finally {
                    setRemovingId(null);
                  }
                }}
              >
                <Text style={tw`text-sm text-white`}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ),
      });
    },
    [galleryId, queryClient, removingId, updateConfirmationModal, clear, updateModal],
  );

  const openAdd = useCallback(() => {
    navigation.navigate(screenName.gallery.addArtistToRoster, {
      galleryId,
    });
  }, [navigation, galleryId]);

  const isInitialLoading = rosterQuery.isLoading && !rosterQuery.data;

  const listHeader = (
    <RosterListSearchHeader searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
  );

  const emptyRoster = !isInitialLoading && roster.length === 0;
  const noMatches =
    !isInitialLoading &&
    roster.length > 0 &&
    filteredRoster.length === 0 &&
    searchTerm.trim().length > 0;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <View
        style={[
          tw`flex-row items-center gap-2.5 px-5`,
          { paddingTop: insets.top + 16 },
        ]}
      >
        <Text style={[tw`text-lg flex-1 font-medium`, { color: colors.black }]}>
          Represented Artists
        </Text>
        <FittedBlackButton
          value="Add artist"
          onClick={openAdd}
          style={tw`h-[36px] px-4`}
          textStyle={tw`text-[13px]`}
        >
          <Feather name="plus" color="#fff" size={16} />
        </FittedBlackButton>
      </View>

      <Text style={tw`text-sm text-neutral-500 px-5 mt-2 tracking-wide`}>
        Manage the artists actively represented by your gallery on Omenai.
      </Text>

      {isInitialLoading ? (
        <RosterLoadingState />
      ) : emptyRoster ? (
        <RosterEmptyState onAddPress={openAdd} />
      ) : noMatches ? (
        <RosterNoSearchResultsState
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
        />
      ) : (
        <FlatList
          data={filteredRoster}
          keyExtractor={(item) => item.artist_id}
          contentContainerStyle={tw`px-5 pb-8 pt-5`}
          refreshControl={
            <RefreshControl refreshing={rosterQuery.isFetching} onRefresh={onRefresh} />
          }
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <RosterArtistRow
              artist={item}
              onRemovePress={confirmRemove}
              removingArtistId={removingId}
            />
          )}
        />
      )}
    </View>
  );
}

import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { colors } from "#config/colors.config";
import { useSearchStore } from "#store/discovery/searchStore";
import { fetchSearchKeyWordResults } from "#services/discovery/fetchSearchKeywordResults";
import ArtworksListing from "#components/general/ArtworksListing";
import SearchInput from "#components/inputs/SearchInput";
import MiniArtworkCardLoader from "#components/general/MiniArtworkCardLoader";
import EmptyArtworks from "#components/general/EmptyArtworks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { SEARCH_QK } from "#utils/core/queryKeys";

import { useModalStore } from "#store/account/modal/modalStore";

export default function SearchResults() {
  const { submittedQuery } = useSearchStore();
  const insets = useSafeAreaInsets();
  const { updateModal } = useModalStore();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: SEARCH_QK.query(submittedQuery),
    queryFn: async () => {
      const results = await fetchSearchKeyWordResults(submittedQuery);
      if (results.isOk) {
        return results.body.data;
      } else {
        throw new Error(results.body || "Search failed");
      }
    },
    enabled: submittedQuery.length > 2,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      updateModal({
        message: error.message,
        showModal: true,
        modalType: "error",
      });
    }
  }, [error, updateModal]);

  const dataLength = submittedQuery.length === 0 ? 0 : data.length;

  return (
    <View style={[tw`flex-1 bg-white`, { paddingTop: insets.top + 16 }]}>
      <View style={tw`px-5`}>
        <SearchInput />
        {submittedQuery.length > 0 ? (
          <View style={tw`pt-6 pb-2 gap-1`}>
            <Text
              style={[tw`text-xl font-serif`, { color: colors.primary_black }]}
            >
              Results for “{submittedQuery}”
            </Text>
            <Text
              style={tw`text-xs uppercase tracking-widest font-sans-regular text-neutral-500`}
            >
              {dataLength} {dataLength === 1 ? "Artwork" : "Artworks"}
            </Text>
          </View>
        ) : (
          <View>
            <Text
              style={[
                tw`text-lg font-sans-medium py-6`,
                { color: colors.primary_black },
              ]}
            >
              Search for artworks on Omenai
            </Text>
          </View>
        )}
      </View>
      {isLoading && submittedQuery.length > 2 && (
        <View style={tw`flex-1 mt-[10px]`}>
          <MiniArtworkCardLoader />
        </View>
      )}
      {!isLoading && dataLength > 0 && (
        <View style={tw`flex-1 mt-[10px]`}>
          <ArtworksListing data={data} onRefresh={async () => {}} />
        </View>
      )}
      {submittedQuery.length > 0 && dataLength === 0 && !isLoading && (
        <View style={tw`flex-1`}>
          <EmptyArtworks
            description={
              submittedQuery.length < 3 && dataLength === 0
                ? "Please enter at least 3 characters to search..."
                : `Can't find artwork you're looking for, try checking for mispellings`
            }
          />
        </View>
      )}
    </View>
  );
}

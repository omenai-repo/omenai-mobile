import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { colors } from "../../config/colors.config";
import { useSearchStore } from "#store/search/searchStore";
import { fetchSearchKeyWordResults } from "#services/search/fetchSearchKeywordResults";
import ArtworksListing from "#components/general/ArtworksListing";
import SearchInput from "#components/inputs/SearchInput";
import MiniArtworkCardLoader from "#components/general/MiniArtworkCardLoader";
import EmptyArtworks from "#components/general/EmptyArtworks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { SEARCH_QK } from "#utils/queryKeys";
import { useDebounce } from "#hooks/useDebounce";
import { useModalStore } from "#store/modal/modalStore";

export default function SearchResults() {
  const { searchQuery } = useSearchStore();
  const insets = useSafeAreaInsets();
  const { updateModal } = useModalStore();

  const debouncedSearch = useDebounce(searchQuery, 400);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: SEARCH_QK.query(debouncedSearch),
    queryFn: async () => {
      const results = await fetchSearchKeyWordResults(debouncedSearch);
      if (results.isOk) {
        return results.body.data;
      } else {
        throw new Error(results.body || "Search failed");
      }
    },
    enabled: debouncedSearch.length > 2,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
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

  const dataLength = searchQuery.length === 0 ? 0 : data.length;

  return (
    <>
      <View style={[tw`flex-1 bg-white`, { paddingTop: insets.top + 16 }]}>
        <View style={tw`px-[20px]`}>
          <SearchInput />
          {searchQuery.length > 0 ? (
            <>
              <Text
                style={[
                  tw`text-[18px] font-medium py-[20px]`,
                  { color: colors.primary_black },
                ]}
              >
                Search for “{searchQuery}”:
              </Text>
              <Text style={tw`text-[16px] text-[#808080]`}>
                {dataLength} results found
              </Text>
            </>
          ) : (
            <View>
              <Text
                style={[
                  tw`text-[18px] font-medium py-[20px]`,
                  { color: colors.primary_black },
                ]}
              >
                Search for artworks on Omenai
              </Text>
            </View>
          )}
        </View>
        {isLoading && debouncedSearch.length > 2 && (
          <View style={tw`mt-[10px]`}>
            <MiniArtworkCardLoader />
          </View>
        )}
        {!isLoading && dataLength > 0 && (
          <View style={tw`flex-1 mt-[10px]`}>
            <ArtworksListing data={data} onRefresh={async () => {}} />
          </View>
        )}
        {searchQuery.length > 0 && dataLength === 0 && !isLoading && (
          <View style={tw`flex-1`}>
            <EmptyArtworks
              description={
                searchQuery.length < 3 && dataLength === 0
                  ? "Please enter at least 3 characters to search..."
                  : `Can't find artwork you're looking for, try checking for mispellings`
              }
            />
          </View>
        )}
      </View>
    </>
  );
}

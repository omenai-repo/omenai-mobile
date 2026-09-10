import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import debounce from "lodash/debounce";
import { useAppStore } from "#store/app/appStore";

import { fetchUserSupportTickets } from "#services/account/support/support.service";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { colors } from "#config/colors.config";
import { useInfiniteQuery } from "@tanstack/react-query";

import { screenName } from "#constants/screenNames.constants";
import { useSupportTicketsFilterStore } from "#store/account/support/supportTicketsFilterStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { SupportTicketItem } from "./components/SupportTicketItem";
import { EmptySupportTicket } from "./components/EmptySupportTicket";

export default function SupportTicketsScreen() {
  const insets = useSafeAreaInsets();
  const { userSession } = useAppStore();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { status, priority, year, getActiveFilterCount } =
    useSupportTicketsFilterStore();
  const activeFilterCount = getActiveFilterCount();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const updateDebouncedSearch = useCallback(
    debounce((text: string) => {
      setDebouncedSearch(text);
    }, 500),
    [],
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    updateDebouncedSearch(text);
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [
      "support_tickets",
      userSession?.id,
      status,
      priority,
      year,
      debouncedSearch,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      if (!userSession?.id) return { data: [], pagination: { totalPages: 1 } };

      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: "10",
        status,
        priority,
        year,
        id: userSession.id,
      });

      if (debouncedSearch) params.append("search", debouncedSearch);

      const result = await fetchUserSupportTickets(params);
      if (result.isOk && result.success) {
        return result;
      }
      throw new Error(result.message || "Failed to fetch tickets");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userSession?.id,
  });

  const flattenData = data?.pages.flatMap((page) => page.data) || [];

  const onLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Support History" />

      <View style={tw`px-4 py-2 bg-white z-10`}>
        <View style={tw`flex-row items-center gap-2 mb-2`}>
          <View
            style={tw`flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-sm px-3 py-3`}
          >
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search tickets..."
              style={tw`flex-1 ml-2 text-base text-gray-900`}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(screenName.supportTicketsFilterModal)
            }
            style={tw`relative p-3 bg-gray-50 border border-gray-200 rounded-sm`}
          >
            <Ionicons name="options-outline" size={22} color="#374151" />
            {activeFilterCount > 0 && (
              <View
                style={[
                  tw`absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center`,
                  { backgroundColor: colors.black },
                ]}
              >
                <Text style={tw`text-white text-xs font-bold`}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <View style={tw`flex-1 px-4 bg-gray-50 pt-4`}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.black}
            style={tw`mt-10`}
          />
        ) : (
          <FlashList
            data={flattenData}
            renderItem={({ item }) => <SupportTicketItem item={item} />}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            ListEmptyComponent={<EmptySupportTicket />}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator
                  size="small"
                  color={colors.black}
                  style={tw`py-4`}
                />
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}

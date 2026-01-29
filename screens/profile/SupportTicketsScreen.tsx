import React, { useCallback, useEffect, useState } from "react";
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
import { format } from "date-fns";
import debounce from "lodash/debounce";
import { useAppStore } from "#store/app/appStore";

import { fetchUserSupportTickets } from "#services/support/support.service";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { colors } from "#config/colors.config";
import { useInfiniteQuery } from "@tanstack/react-query";
import WithModal from "#components/modal/WithModal";
import { screenName } from "#constants/screenNames.constants";
import { useSupportTicketsFilterStore } from "#store/support/supportTicketsFilterStore";
import { StackNavigationProp } from "@react-navigation/stack";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":
        return { bg: "#DBEAFE", text: "#1D4ED8" };
      case "IN_PROGRESS":
        return { bg: "#FEF9C3", text: "#A16207" };
      case "RESOLVED":
        return { bg: "#DCFCE7", text: "#15803D" };
      case "CLOSED":
        return { bg: "#F3F4F6", text: "#374151" };
      default:
        return { bg: "#F3F4F6", text: "#374151" };
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View
        style={tw`bg-white p-4 rounded-xl border border-gray-100 mb-3 shadow-sm`}
      >
        <View style={tw`flex-row justify-between items-start mb-2`}>
          <View>
            <View style={tw`bg-gray-100 px-2 py-1 rounded self-start mb-1`}>
              <Text style={tw`text-[10px] uppercase text-gray-500 font-mono`}>
                {item.ticketId}
              </Text>
            </View>
            <Text style={tw`font-semibold text-gray-900 capitalize`}>
              {item.category.replace(/_/g, " ").toLowerCase()}
            </Text>
          </View>
          <View
            style={[
              tw`px-2 py-1 rounded-full`,
              { backgroundColor: statusStyle.bg },
            ]}
          >
            <Text
              style={[
                tw`text-[10px] font-bold uppercase`,
                { color: statusStyle.text },
              ]}
            >
              {item.status.replace(/_/g, " ")}
            </Text>
          </View>
        </View>

        <Text
          style={tw`text-gray-600 text-sm mb-3 leading-5`}
          numberOfLines={2}
        >
          {item.message}
        </Text>

        <View
          style={tw`flex-row justify-between items-center pt-3 border-t border-gray-100`}
        >
          <View style={tw`flex-row items-center gap-1`}>
            <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
            <Text style={tw`text-xs text-gray-500`}>
              {format(new Date(item.createdAt), "MMM d, yyyy")}
            </Text>
          </View>

          <View style={tw`flex-row items-center gap-1`}>
            <Text
              style={[
                tw`text-[10px] font-bold uppercase px-2 py-0.5 rounded border`,
                item.priority === "HIGH"
                  ? tw`border-red-200 text-red-600 bg-red-50`
                  : item.priority === "LOW"
                  ? tw`border-blue-200 text-blue-600 bg-blue-50`
                  : tw`border-gray-200 text-gray-600 bg-gray-50`,
              ]}
            >
              {item.priority}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <WithModal>
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="Support History" />

        <View style={tw`px-4 py-2 bg-white z-10`}>
          <View style={tw`flex-row items-center gap-2 mb-2`}>
            <View
              style={tw`flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-3`}
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
              style={tw`relative p-3 bg-gray-50 border border-gray-200 rounded-xl`}
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
              renderItem={renderItem}
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
              ListEmptyComponent={() => (
                <View style={tw`items-center justify-center mt-20`}>
                  <View
                    style={tw`w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4`}
                  >
                    <Ionicons
                      name="file-tray-outline"
                      size={32}
                      color="#9CA3AF"
                    />
                  </View>
                  <Text style={tw`text-gray-900 font-semibold mb-1`}>
                    No tickets found
                  </Text>
                  <Text style={tw`text-gray-500 text-sm`}>
                    Try adjusting your filters
                  </Text>
                </View>
              )}
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
    </WithModal>
  );
}

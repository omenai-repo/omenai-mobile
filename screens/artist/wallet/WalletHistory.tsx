import {
  View,
  Text,
  useWindowDimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useMemo, useState } from "react";
import tw from "twrnc";
import YearDropdown from "../orders/YearDropdown";
import { WalletContainer } from "./WalletScreen";
import { fetchArtistTransactions } from "services/wallet/fetchArtistTransactions";
import Loader from "components/general/Loader";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackScreenButton from "components/buttons/BackScreenButton";

const BASE_TXNS_QK = ["wallet", "artist", "txns"] as const;
const txnsKey = (year: number) =>
  [...BASE_TXNS_QK, { status: "all", year }] as const;

const PAGE_SIZE = 10; // assuming API default is 10

const WalletHistory = ({ navigation }: any) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: txnsKey(selectedYear),
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const res = await fetchArtistTransactions({
        page: Number(pageParam),
        status: "all",
        year: String(selectedYear),
      });
      if (!res?.isOk) throw new Error("Failed to fetch transactions");
      const items = Array.isArray(res.data) ? res.data : [];
      return {
        items,
        nextPage:
          items.length === PAGE_SIZE ? Number(pageParam) + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: { nextPage?: number }) => lastPage.nextPage,
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true, // only if stale
    refetchOnWindowFocus: true, // only if stale
    refetchOnReconnect: true, // only if stale
  });

  const transactions = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.items),
    [data]
  );

  const showEmpty = !isLoading && transactions.length === 0;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BackScreenButton handleClick={() => navigation.goBack()} />
        <Text style={tw`text-[16px] font-medium text-[#1A1A1A]`}>
          Transaction History
        </Text>
        <YearDropdown
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          style={tw`mb-0`}
        />
      </View>

      {/* List */}
      {transactions.length > 0 && (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) =>
            `${item.trans_id ?? item.id ?? "txn"}-${index}`
          }
          renderItem={({ item }) => (
            <WalletContainer
              status={item.trans_status}
              amount={item.trans_amount}
              dateTime={item.createdAt}
              onPress={() =>
                navigation.navigate("TransactionDetailsScreen", {
                  transaction: item,
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`gap-[8px] pb-[100px]`}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            isFetchingNextPage ? <Loader size={200} height={100} /> : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={() => refetch()}
              tintColor="#000"
              colors={["#000"]}
            />
          }
        />
      )}

      {/* Empty state */}
      {showEmpty && (
        <View
          style={tw.style(`justify-center items-center`, {
            marginTop: height / 4,
          })}
        >
          <Text style={tw`text-[18px] text-[#1A1A1A] font-medium`}>
            No transactions found
          </Text>
        </View>
      )}

      {/* Initial loader */}
      {isLoading && transactions.length === 0 && (
        <View
          style={tw.style(`justify-center items-center`, {
            marginTop: height / 4,
          })}
        >
          <Loader size={200} height={100} />
        </View>
      )}
    </View>
  );
};

export default WalletHistory;

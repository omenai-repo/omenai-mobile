import {
  View,
  Text,
  useWindowDimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useMemo, useState } from "react";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "#store/app/appStore";
import { fetchSubscriptionTransactions } from "#services/transactions/fetchSubscriptionTransactions";
import Loader from "#components/general/Loader";
import ListSkeleton from "#components/skeleton/ListSkeleton";
import { Ionicons } from "@expo/vector-icons";
import {
  SubscriptionTransactionRow,
  Txn,
} from "./components/SubscriptionTransactionRow";
import BackHeaderTitle from "#components/header/BackHeaderTitle";

const PAGE_SIZE = 15;

const ItemSeparator = () => <View style={tw`h-3`} />;

const SubscriptionHistory = ({ navigation }: any) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { userSession: user } = useAppStore();

  const {
    data: allTransactions,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["fetch_sub_trans", user?.id],
    queryFn: async () => {
      const res = await fetchSubscriptionTransactions(user.id);
      if (res?.isOk) return res.data as Txn[];
      throw new Error(res?.message || "Something went wrong");
    },
    staleTime: 0,
  });

  // Client-side pagination state
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);

  const fullList = useMemo(() => {
    if (!allTransactions) return [];
    // Newest first
    return [...allTransactions].reverse();
  }, [allTransactions]);

  const visibleList = useMemo(() => {
    return fullList.slice(0, displayedCount);
  }, [fullList, displayedCount]);

  const loadMore = () => {
    if (displayedCount < fullList.length) {
      setDisplayedCount((prev) => prev + PAGE_SIZE);
    }
  };

  const showEmpty = !isLoading && fullList.length === 0;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Transaction History" />
      {/* List */}
      {!isLoading && visibleList.length > 0 && (
        <FlatList
          data={visibleList}
          keyExtractor={(item) => item.trans_id}
          renderItem={({ item, index }) => (
            <SubscriptionTransactionRow item={item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-[100px] px-5 pt-2`}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={ItemSeparator}
          ListFooterComponent={
            displayedCount < fullList.length ? (
              <Loader size={40} />
            ) : (
              <View style={tw`h-10`} />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
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
          <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
          <Text style={tw`text-[16px] text-gray-500 font-medium mt-4`}>
            No transactions found
          </Text>
        </View>
      )}

      {/* Initial loader */}
      {isLoading && (
        <ListSkeleton count={8} itemHeight={80} showImage={false} />
      )}
    </View>
  );
};

export default SubscriptionHistory;

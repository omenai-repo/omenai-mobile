import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, FlatList, Platform } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from 'store/app/appStore';
import { formatISODate } from 'utils/utils_formatISODate';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { fetchSubscriptionTransactions } from 'services/transactions/fetchSubscriptionTransactions';

// ---- types (adjust if your service returns differently)
type Txn = {
  trans_id: string;
  status: 'successful' | 'failed' | 'pending' | string;
  date: string; // ISO
  amount: number;
  currency?: string; // optional
};

export default function TransactionsListing() {
  const { userSession: user } = useAppStore();

  const {
    data: transactions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['fetch_sub_trans', user?.id],
    queryFn: async () => {
      const res = await fetchSubscriptionTransactions(user.id);
      if (res?.isOk) return res.data as Txn[];
      throw new Error(res?.message || 'Something went wrong');
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  const list = useMemo(() => {
    if (!transactions) return [];
    // mirror web: newest last → reverse for top-down timeline
    return [...transactions].reverse();
  }, [transactions]);

  if (isLoading) {
    return (
      <View
        style={tw`bg-white rounded-2xl border border-slate-200 p-6 items-center justify-center`}
      >
        <ActivityIndicator />
        <Text style={tw`mt-2 text-slate-600`}>Loading transactions…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`bg-white rounded-2xl border border-slate-200 p-6`}>
        <Text style={tw`text-base font-semibold text-slate-900 mb-2`}>
          Recent Transaction Activity
        </Text>
        <View
          style={tw`items-center justify-center py-10 rounded-xl bg-red-50 border border-red-200`}
        >
          <Ionicons name="alert-circle" size={28} color="#b91c1c" />
          <Text style={tw`mt-2 text-red-700`}>
            {(error as Error)?.message ?? 'Failed to load transactions'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[tw`bg-white rounded-2xl border border-slate-200 p-6`, shadow()]}>
      <Text style={tw`text-base font-semibold text-slate-900 mb-4`}>
        Recent Transaction Activity
      </Text>

      {list.length === 0 ? (
        <View style={tw`items-center justify-center py-12`}>
          <Ionicons name="receipt-outline" size={36} color="#64748b" />
          <Text style={tw`mt-2 text-slate-500`}>No transactions found</Text>
        </View>
      ) : (
        <View style={tw`relative`}>
          {/* timeline line */}
          <View style={tw`absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200`} />

          <FlatList
            data={list}
            keyExtractor={(item) => item.trans_id}
            contentContainerStyle={tw`pr-1`}
            renderItem={({ item, index }) => <Row item={item} index={index} />}
            ItemSeparatorComponent={() => <View style={tw`h-3`} />}
          />
        </View>
      )}
    </View>
  );
}

function Row({ item, index }: { item: Txn; index: number }) {
  const statusText =
    item.status === 'successful'
      ? 'Payment processed successfully'
      : item.status === 'failed'
      ? 'Payment failed'
      : 'Payment pending';

  const statusColor =
    item.status === 'successful'
      ? tw`text-green-600`
      : item.status === 'failed'
      ? tw`text-red-600`
      : tw`text-amber-600`;

  // match web default "USD" formatting when currency not provided
  const amountLabel = utils_formatPrice(item.amount, item.currency ?? 'USD');

  return (
    <View style={tw`relative flex-row items-start pb-3`}>
      {/* dot / index */}
      <View style={tw`mr-4`}>
        <View
          style={tw`w-10 h-10 bg-white border-2 border-slate-300 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-xs font-semibold text-slate-600`}>{index + 1}</Text>
        </View>
      </View>

      {/* card */}
      <View style={tw`flex-1 bg-slate-50 rounded-lg p-4`}>
        <View style={tw`flex-row items-start justify-between`}>
          <View style={tw`flex-shrink`}>
            <Text style={tw`text-[11px] font-semibold text-slate-500`}>#{item.trans_id}</Text>
            <Text style={[tw`text-[11px] font-medium mt-0.5`, statusColor]}>{statusText}</Text>
            <Text style={tw`text-[11px] text-slate-600 mt-1`}>{formatISODate(item.date)}</Text>
          </View>

          <Text style={tw`text-slate-900 font-semibold`}>{amountLabel}</Text>
        </View>
      </View>
    </View>
  );
}

function shadow() {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 3 },
    default: {},
  });
}

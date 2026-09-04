import React, { useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "#store/app/appStore";
import { formatISODate } from "#utils/date/utils_formatISODate";
import { utils_formatPrice } from "#utils/commerce/utils_priceFormatter";
import { fetchSubscriptionTransactions } from "#services/commerce/transactions/fetchSubscriptionTransactions";
import { currency_symbol } from "#json/currencySymbol";

// ---- types (adjust if your service returns differently)
type Txn = {
  trans_id: string;
  status: string;
  date: string; // ISO
  amount: number;
  currency?: string; // optional
};

export default function TransactionsListing() {
  const { userSession: user } = useAppStore();
  const navigation = useNavigation<any>();

  const {
    data: transactions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetch_sub_trans", user?.id],
    queryFn: async () => {
      const res = await fetchSubscriptionTransactions(user.id);
      if (res?.isOk) return res.data as Txn[];
      throw new Error(res?.message || "Something went wrong");
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
        style={tw`bg-white rounded-sm border border-slate-200 p-6 items-center justify-center`}
      >
        <ActivityIndicator />
        <Text style={tw`mt-2 text-slate-600`}>Loading transactions…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`bg-white rounded-sm border border-slate-200 p-6`}>
        <Text style={tw`text-base font-semibold text-slate-900 mb-2`}>
          Recent Transaction Activity
        </Text>
        <View
          style={tw`items-center justify-center py-10 rounded-sm bg-red-50 border border-red-200`}
        >
          <Ionicons name="alert-circle" size={28} color="#b91c1c" />
          <Text style={tw`mt-2 text-red-700`}>
            {(error as Error)?.message ?? "Failed to load transactions"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[tw`bg-white rounded-sm border border-slate-200 p-6`, shadow()]}
    >
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <Text style={tw`text-base font-semibold text-slate-900`}>
          Recent Transaction Activity
        </Text>
        <Pressable
          onPress={() => navigation.navigate("SubscriptionHistory")}
          style={tw`flex-row items-center`}
        >
          <Text style={tw`text-sm font-medium text-slate-600 mr-1`}>
            Show All
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#475569" />
        </Pressable>
      </View>

      {list.length === 0 ? (
        <View style={tw`items-center justify-center py-12`}>
          <Ionicons name="receipt-outline" size={36} color="#64748b" />
          <Text style={tw`mt-2 text-slate-500`}>No transactions found</Text>
        </View>
      ) : (
        <View style={tw`relative`}>
          {/* timeline line */}
          <View style={tw`absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200`} />

          <View style={tw`pr-1`}>
            {list.slice(0, 5).map((item, index, sliced) => (
              <React.Fragment key={item.trans_id}>
                <Row item={item} index={index} />
                {index < sliced.length - 1 ? (
                  <View style={tw`h-3`} />
                ) : null}
              </React.Fragment>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function getStatusConfig(status: string) {
  switch (status) {
    case "successful":
      return {
        text: "Payment processed successfully",
        color: tw`text-green-600`,
      };
    case "failed":
      return {
        text: "Payment failed",
        color: tw`text-red-600`,
      };
    case "pending":
    default:
      return {
        text: "Payment pending",
        color: tw`text-amber-600`,
      };
  }
}

function Row({ item, index }: { item: Txn; index: number }) {
  const { text: statusText, color: statusColor } = getStatusConfig(item.status);

  // match web default "USD" formatting when currency not provided
  const currencyCode = item.currency ?? "USD";
  const symbolItem = currency_symbol.find(
    (c) => c.abbreviation.toLowerCase() === currencyCode.toLowerCase(),
  );
  const symbol = symbolItem ? symbolItem.symbol : "$";

  const amountLabel = utils_formatPrice(item.amount, symbol);

  return (
    <View style={tw`relative flex-row items-start pb-3`}>
      {/* dot / index */}
      <View style={tw`mr-4`}>
        <View
          style={tw`w-10 h-10 bg-white border-2 border-slate-300 rounded-full items-center justify-center`}
        >
          <Text style={tw`text-xs font-semibold text-slate-600`}>
            {index + 1}
          </Text>
        </View>
      </View>

      {/* card */}
      <View style={tw`flex-1 bg-slate-50 rounded-sm p-4`}>
        <View style={tw`flex-row items-start justify-between`}>
          <View style={tw`flex-shrink`}>
            <Text style={tw`text-[11px] font-semibold text-slate-500`}>
              #{item.trans_id}
            </Text>
            <Text style={[tw`text-[11px] font-medium mt-0.5`, statusColor]}>
              {statusText}
            </Text>
            <Text style={tw`text-[11px] text-slate-600 mt-1`}>
              {formatISODate(item.date)}
            </Text>
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
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 3 },
    default: {},
  });
}

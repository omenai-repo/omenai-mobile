import React from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { TransactionSkeletonCard } from "#components/skeleton/TransactionSkeletonCard";
import { WalletTransactionItem } from "./WalletTransactionItem";
import { Feather } from "@expo/vector-icons";

interface WalletTransactionSectionProps {
  transactions: any[];
  isLoading: boolean;
  onPressShowAll: () => void;
  onPressTransaction: (item: any) => void;
}

export const WalletTransactionSection = ({
  transactions,
  isLoading,
  onPressShowAll,
  onPressTransaction,
}: WalletTransactionSectionProps) => {
  const sortedTransactions = transactions
    ? [...transactions]
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5)
    : [];

  return (
    <View style={tw`flex-1 px-5 bg-[#F7F7F7]`}>
      <View style={tw`mt-[30px] pb-6 flex-row items-center`}>
        <Text style={tw`font-serif text-lg flex-1`}>Transaction History</Text>
        <Pressable
          onPress={onPressShowAll}
          style={tw`flex-row items-center gap-[5px]`}
        >
          <Text style={tw`text-sm text-slate-500 font-semibold`}>Show All</Text>
          <Feather name="arrow-right" size={14} color={tw.color("slate-500")} />
        </Pressable>
      </View>

      <View style={tw`flex-1`}>
        {!isLoading ? (
          <View style={tw`gap-2 mb-[150px]`}>
            {sortedTransactions.length === 0 ? (
              <View style={tw`flex-1 justify-center items-center mt-[50px]`}>
                <Text style={tw`text-sm text-[#454545]`}>
                  No transactions found
                </Text>
              </View>
            ) : (
              <View
                style={tw`bg-white rounded-md border border-neutral-100 overflow-hidden`}
              >
                {sortedTransactions.map((item, index) => (
                  <WalletTransactionItem
                    key={index}
                    status={item.trans_status}
                    amount={item.trans_amount}
                    dateTime={item.createdAt}
                    isLast={index === sortedTransactions.length - 1}
                    onPress={() => onPressTransaction(item)}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <TransactionSkeletonCard count={5} style={tw`mb-[150px]`} />
        )}
      </View>
    </View>
  );
};

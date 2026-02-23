import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { getArtistCurrencySymbol } from "#utils/utils_getArtistCurrencySymbol";

interface WithdrawalAmountInputProps {
  amount: string;
  setAmount: (text: string) => void;
  convertedAmount: number;
  rate: number;
  loading: boolean;
  loadAmount: boolean;
  fetchTransferRate: () => void;
  amountInputRef: React.RefObject<TextInput | null>;
  walletData: any;
}

export function WithdrawalAmountInput({
  amount,
  setAmount,
  convertedAmount,
  rate,
  loading,
  loadAmount,
  fetchTransferRate,
  amountInputRef,
  walletData,
}: Readonly<WithdrawalAmountInputProps>) {
  return (
    <View style={tw`mb-6`}>
      <Text style={tw`mb-3 text-[13px] font-light text-slate-700`}>
        Withdrawal Amount
      </Text>

      {/* You Send */}
      <View style={tw`bg-[#f8fafc] rounded-md p-4 border border-[#e2e8f0]`}>
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <Text style={tw`text-[13px] text-slate-600`}>You Send</Text>
          <Text style={tw`text-[13px] font-light text-slate-700`}>
            {walletData?.wallet_currency || "USD"}
          </Text>
        </View>
        <View style={tw`relative justify-center`}>
          <Text style={tw`absolute left-3 text-slate-500 z-10`}>$</Text>
          <TextInput
            ref={amountInputRef}
            style={tw`w-full pl-8 pr-4 py-2 bg-white border border-slate-300 rounded text-[13px] font-semibold text-black`}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#9ca3af"
            editable={!loading}
          />
        </View>
      </View>

      {/* Convert Button Centered */}
      <View style={tw`flex-row justify-center my-3`}>
        <TouchableOpacity
          disabled={!amount || loading || loadAmount}
          onPress={() => amount && fetchTransferRate()}
          style={tw`p-2 bg-slate-100 rounded-md items-center justify-center ${
            !amount || loading || loadAmount ? "opacity-50" : ""
          }`}
        >
          {loadAmount ? (
            <ActivityIndicator size="small" color="#475569" />
          ) : (
            <Ionicons name="refresh" size={20} color="#475569" />
          )}
        </TouchableOpacity>
      </View>

      {/* You Receive */}
      <View style={tw`bg-[#f0fdf4] rounded-md p-4 border border-[#bbf7d0]`}>
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <Text style={tw`text-[13px] text-green-700`}>You Receive</Text>
          <Text style={tw`text-[13px] font-light text-green-800`}>
            {walletData?.base_currency}
          </Text>
        </View>
        <View style={tw`bg-white rounded px-4 py-3 border border-green-300`}>
          <Text style={tw`text-[13px] font-semibold text-green-800`}>
            {convertedAmount
              ? `${getArtistCurrencySymbol(
                  walletData?.base_currency,
                )} ${convertedAmount.toLocaleString()}`
              : "0.00"}
          </Text>
        </View>
      </View>

      {/* Exchange Rate Info */}
      {rate > 0 && Number(amount) > 0 && convertedAmount > 0 && (
        <View
          style={tw`bg-[#eff6ff] rounded-md p-3 border border-[#bfdbfe] mt-4 flex-row items-center gap-2`}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#2563eb"
          />
          <Text style={tw`text-[13px] font-semibold text-blue-700`}>
            {`Exchange rate: 1 ${
              walletData?.wallet_currency || "USD"
            } = ${rate.toFixed(2)} ${walletData?.base_currency}`}
          </Text>
        </View>
      )}
    </View>
  );
}

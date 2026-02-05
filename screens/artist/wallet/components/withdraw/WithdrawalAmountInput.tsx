import React from "react";
import { View, Text, TextInput, useWindowDimensions } from "react-native";
import tw from "twrnc";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
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
  const { width } = useWindowDimensions();

  return (
    <View style={tw`mb-6`}>
      <Text style={tw`mb-2 font-medium`}>Enter Amount</Text>

      {/* You Send */}
      <View style={tw`bg-white border border-[#00000020] rounded-xl p-4`}>
        <Text style={tw`text-sm mb-1 text-gray-600`}>You Send</Text>
        <TextInput
          ref={amountInputRef}
          style={tw`py-3 text-base font-bold text-[#1A1A1A]`}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          editable={!loading}
        />
      </View>

      {/* Convert Button Centered */}
      <View style={[tw`mt-4`, { marginHorizontal: width / 3.5 }]}>
        <FittedBlackButton
          value="Convert"
          isLoading={loadAmount}
          isDisabled={!amount || loading}
          onClick={() => amount && fetchTransferRate()}
          textStyle={{ fontWeight: "600" }}
        />
      </View>

      {/* You Get */}
      <View style={tw`bg-white border border-[#00000020] rounded-xl p-4 mt-4`}>
        <Text style={tw`text-sm mb-1 text-gray-600`}>You Get</Text>
        <Text style={tw`text-base font-bold text-[#1A1A1A]`}>
          {convertedAmount
            ? `${getArtistCurrencySymbol(
                walletData.base_currency,
              )} ${convertedAmount.toLocaleString()}`
            : "--"}
        </Text>
      </View>

      {rate > 0 && (
        <Text style={tw`text-xs mt-2 text-gray-500`}>
          {`Rate: 1 ${walletData.wallet_currency} = ${getArtistCurrencySymbol(
            walletData.base_currency,
          )} ${rate.toFixed(2)}`}
        </Text>
      )}
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import LongBlackButton from "#components/buttons/LongBlackButton";

interface PrimaryAccountDetailsProps {
  accountNumber: string | undefined;
  bankName: string | undefined;
  accountName: string | undefined;
  onPressChange: () => void;
}

export const PrimaryAccountDetails = ({
  accountNumber,
  bankName,
  accountName,
  onPressChange,
}: PrimaryAccountDetailsProps) => {
  return (
    <View style={tw`mt-5`}>
      <View
        style={tw`bg-white border border-neutral-100 rounded-md p-5 mb-5 gap-2.5`}
      >
        <DetailRow
          label="Bank Name:"
          value={bankName}
          textStyle={tw`uppercase text-center`}
        />
        <DetailRow label="Account Number:" value={accountNumber} />
        <DetailRow
          label="Account Name:"
          value={accountName}
          textStyle={tw`capitalize`}
        />
      </View>
      <LongBlackButton
        onClick={onPressChange}
        value="Change Primary Account"
        outline
        style={tw`border-neutral-100 bg-white`}
      />
    </View>
  );
};

const DetailRow = ({
  label,
  value,
  textStyle,
}: {
  label: string;
  value: string | undefined;
  textStyle?: any;
}) => (
  <View style={tw`flex-row items-center gap-5`}>
    <Text style={tw`text-sm flex-1 text-slate-600`}>{label}</Text>
    <Text style={[tw`text-sm font-medium text-slate-900`, textStyle]}>
      {value}
    </Text>
  </View>
);

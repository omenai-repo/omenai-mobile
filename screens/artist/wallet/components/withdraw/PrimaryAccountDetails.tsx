import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { AccountRow } from "#components/general/AccountRow";

interface PrimaryAccountDetailsProps {
  walletData: any;
}

export function PrimaryAccountDetails({
  walletData,
}: Readonly<PrimaryAccountDetailsProps>) {
  return (
    <View style={tw`mb-6`}>
      <Text style={tw`mb-2 font-medium`}>Primary Account Details</Text>
      <View
        style={tw`bg-[#FFFFFF] border border-[#00000033] p-4 rounded-md gap-[8px]`}
      >
        <AccountRow
          label="Account Number:"
          value={walletData?.primary_withdrawal_account?.account_number}
        />
        <AccountRow
          label="Bank Name:"
          value={walletData?.primary_withdrawal_account?.bank_name}
        />
        <AccountRow
          label="Account Name:"
          value={walletData?.primary_withdrawal_account?.account_name}
        />
      </View>
    </View>
  );
}

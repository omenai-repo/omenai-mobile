import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { AccountRow } from "#components/general/AccountRow";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { useModalStore } from "#store/modal/modalStore";

interface PrimaryAccountDetailsProps {
  walletData: any;
}

export function PrimaryAccountDetails({
  walletData,
}: Readonly<PrimaryAccountDetailsProps>) {
  const [isRevealed, setIsRevealed] = useState(false);
  const { updateModal } = useModalStore();
  const accountType = walletData?.primary_withdrawal_account?.type;
  const accountIdentifierLabel =
    accountType === "eu" || accountType === "international"
      ? "IBAN:"
      : "Account Number:";
  const rawAccountIdentifier =
    accountType === "eu" || accountType === "international"
      ? walletData?.primary_withdrawal_account?.iban
      : walletData?.primary_withdrawal_account?.account_number;
  const displayBankName = walletData?.primary_withdrawal_account?.bank_name
    ? walletData.primary_withdrawal_account.bank_name.toUpperCase()
    : accountType === "eu"
      ? "EUROPEAN BANK"
      : accountType === "us"
        ? "US BANK"
        : accountType === "uk"
          ? "UK BANK"
          : accountType === "international"
            ? "INTERNATIONAL BANK"
            : "BANK";

  const accountIdentifierValue = useMemo(() => {
    const raw = rawAccountIdentifier || "";
    if (!raw) return "-";

    if (isRevealed) {
      if (accountType === "eu" || accountType === "international") {
        return raw.replaceAll(/(.{4})/g, "$1 ").trim();
      }
      return raw;
    }

    if (accountType === "eu" || accountType === "international") {
      if (raw.length < 8) return raw;
      return `${raw.slice(0, 4)} •••• •••• •••• ${raw.slice(-4)}`;
    }
    if (raw.length < 4) return raw;
    return `•••• •••• ${raw.slice(-4)}`;
  }, [accountType, isRevealed, rawAccountIdentifier]);

  const copyIdentifier = async () => {
    if (!rawAccountIdentifier) return;
    await Clipboard.setStringAsync(rawAccountIdentifier);
    updateModal({
      message: `${accountIdentifierLabel.replaceAll(":", "")} copied.`,
      showModal: true,
      modalType: "success",
    });
  };

  return (
    <View style={tw`mb-6`}>
      <Text style={tw`mb-2 font-medium`}>Primary Account Details</Text>
      <View
        style={tw`bg-[#FFFFFF] border border-[#00000033] p-4 rounded-sm gap-[8px]`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-1`}>
            <AccountRow label={accountIdentifierLabel} value={accountIdentifierValue} />
          </View>
          <View style={tw`flex-row gap-1 pl-1`}>
            <Pressable
              onPress={() => setIsRevealed((prev) => !prev)}
              style={tw`p-1`}
            >
              <Feather
                name={isRevealed ? "eye-off" : "eye"}
                size={16}
                color="#64748B"
              />
            </Pressable>
            <Pressable onPress={copyIdentifier} style={tw`p-1`}>
              <Feather name="copy" size={16} color="#64748B" />
            </Pressable>
          </View>
        </View>
        <AccountRow
          label="Bank Name:"
          value={displayBankName}
        />
        <AccountRow
          label="Account Name:"
          value={walletData?.primary_withdrawal_account?.account_name}
        />
      </View>
    </View>
  );
}

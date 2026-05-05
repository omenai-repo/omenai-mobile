import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import LongBlackButton from "#components/buttons/LongBlackButton";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { useModalStore } from "#store/modal/modalStore";

interface PrimaryAccountDetailsProps {
  accountNumber: string | undefined;
  accountType?: "africa" | "uk" | "eu" | "us" | "international";
  bankName: string | undefined;
  accountName: string | undefined;
  onPressChange: () => void;
}

const isIbanType = (
  accountType: PrimaryAccountDetailsProps["accountType"],
) => accountType === "eu" || accountType === "international";

const getAccountIdentifierLabel = (
  accountType: PrimaryAccountDetailsProps["accountType"],
) => (isIbanType(accountType) ? "IBAN:" : "Account Number:");

const getFallbackBankName = (
  accountType: PrimaryAccountDetailsProps["accountType"],
) => {
  switch (accountType) {
    case "eu":
      return "EUROPEAN BANK";
    case "us":
      return "US BANK";
    case "uk":
      return "UK BANK";
    case "international":
      return "INTERNATIONAL BANK";
    default:
      return "BANK";
  }
};

const getDisplayBankName = (
  bankName: string | undefined,
  accountType: PrimaryAccountDetailsProps["accountType"],
) => (bankName ? bankName.toUpperCase() : getFallbackBankName(accountType));

const formatIbanDisplay = (raw: string, isRevealed: boolean) => {
  if (isRevealed) return raw.replaceAll(/(.{4})/g, "$1 ").trim();
  if (raw.length < 8) return raw;
  const start = raw.slice(0, 4);
  const end = raw.slice(-4);
  return `${start} •••• •••• •••• ${end}`;
};

const formatAccountDisplay = (
  accountNumber: string | undefined,
  accountType: PrimaryAccountDetailsProps["accountType"],
  isRevealed: boolean,
) => {
  const raw = accountNumber || "";
  if (!raw) return "-";
  if (isIbanType(accountType)) return formatIbanDisplay(raw, isRevealed);
  if (isRevealed) return raw;
  if (raw.length < 4) return raw;
  return `•••• •••• ${raw.slice(-4)}`;
};

export const PrimaryAccountDetails = ({
  accountNumber,
  accountType,
  bankName,
  accountName,
  onPressChange,
}: PrimaryAccountDetailsProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { updateModal } = useModalStore();
  const accountIdentifierLabel = getAccountIdentifierLabel(accountType);
  const displayBankName = getDisplayBankName(bankName, accountType);

  const displayValue = useMemo(() => {
    return formatAccountDisplay(accountNumber, accountType, isRevealed);
  }, [accountNumber, accountType, isRevealed]);

  const copyIdentifier = async () => {
    if (!accountNumber) return;
    await Clipboard.setStringAsync(accountNumber);
    updateModal({
      message: `${accountIdentifierLabel.replaceAll(":", "")} copied.`,
      showModal: true,
      modalType: "success",
    });
  };

  return (
    <View style={tw`mt-5`}>
      <View
        style={tw`bg-white border border-neutral-100 rounded-sm p-5 mb-5 gap-2.5`}
      >
        <DetailRow
          label="Bank Name:"
          value={displayBankName}
          textStyle={tw`uppercase text-center`}
        />
        <DetailRow
          label={accountIdentifierLabel}
          value={displayValue}
          controls={
            <View style={tw`flex-row gap-1`}>
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
          }
        />
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
  controls,
}: {
  label: string;
  value: string | undefined;
  textStyle?: any;
  controls?: React.ReactNode;
}) => (
  <View style={tw`flex-row items-center gap-3`}>
    <Text style={tw`text-sm flex-1 text-slate-600`}>{label}</Text>
    <Text style={[tw`text-sm font-medium text-slate-900`, textStyle]}>
      {value || "-"}
    </Text>
    {controls}
  </View>
);

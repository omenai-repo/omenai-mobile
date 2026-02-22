import React from "react";
import { View, Text, ScrollView } from "react-native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { formatISODate } from "#utils/utils_formatISODate";
import { Ionicons } from "@expo/vector-icons";
import { utils_formatPrice } from "#utils/utils_priceFormatter";

type TransactionStatus = "FAILED" | "PENDING" | "SUCCESSFUL";

const getStatusConfig = (status: TransactionStatus) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Processing",
        textColor: "#92400e", // amber-800
        bgColor: "#fffbeb", // amber-50
        borderColor: "#fde68a", // amber-200
        badgeBg: "#fef3c7", // amber-100
        badgeText: "#92400e", // amber-800
        icon: "time-outline" as const,
        message:
          "Funds are on the way. This may take up to 24 hours or more depending on your bank's processing time.",
      };
    case "SUCCESSFUL":
      return {
        label: "Successful",
        textColor: "#065f46", // emerald-800
        bgColor: "#ecfdf5", // emerald-50
        borderColor: "#a7f3d0", // emerald-200
        badgeBg: "#d1fae5", // emerald-100
        badgeText: "#065f46", // emerald-800
        icon: "checkmark-circle-outline" as const,
        message: "Funds have been deposited successfully.",
      };
    case "FAILED":
      return {
        label: "Failed",
        textColor: "#991b1b", // red-800
        bgColor: "#fef2f2", // red-50
        borderColor: "#fecaca", // red-200
        badgeBg: "#fee2e2", // red-100
        badgeText: "#991b1b", // red-800
        icon: "close-circle-outline" as const,
        message:
          "Transaction failed and funds have been added back to your wallet. Please contact support if you need assistance.",
      };
    default:
      return {
        label: status,
        textColor: "#475569",
        bgColor: "#f8fafc",
        borderColor: "#e2e8f0",
        badgeBg: "#f1f5f9",
        badgeText: "#475569",
        icon: "information-circle-outline" as const,
        message: "",
      };
  }
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View
    style={tw`flex-row justify-between items-start py-3 border-b border-gray-100`}
  >
    <Text style={tw`text-gray-500 text-sm flex-1`}>{label}</Text>
    <Text style={tw`text-black text-sm font-semibold flex-1 text-right`}>
      {value}
    </Text>
  </View>
);

export const TransactionDetailsScreen = ({ route }: { route: any }) => {
  const { transaction } = route.params;
  const status = transaction?.trans_status as TransactionStatus;
  const config = getStatusConfig(status);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Transaction Details" />

      <ScrollView contentContainerStyle={tw`px-5 pt-6 pb-10`}>
        {/* Transaction Info Card */}
        <View
          style={tw`bg-white rounded-sm border border-gray-200 overflow-hidden`}
        >
          {/* Card Header */}
          <View
            style={tw`px-5 pt-5 pb-4 border-b border-gray-100 flex-row items-center justify-between`}
          >
            <Text style={tw`text-base font-bold text-black`}>
              Transaction Info
            </Text>

            {/* Status Badge */}
            <View
              style={[
                tw`flex-row items-center gap-[5px] rounded-full px-3 py-1`,
                { backgroundColor: config.badgeBg },
              ]}
            >
              <Ionicons name={config.icon} size={13} color={config.badgeText} />
              <Text
                style={[tw`text-xs font-semibold`, { color: config.badgeText }]}
              >
                {config.label}
              </Text>
            </View>
          </View>

          {/* Detail Rows */}
          <View style={tw`px-5`}>
            <DetailRow
              label="Transaction ID"
              value={transaction?.trans_id ?? "—"}
            />
            <DetailRow
              label="Reference"
              value={transaction?.trans_flw_ref_id ?? "—"}
            />
            <DetailRow
              label="Amount"
              value={utils_formatPrice(transaction?.trans_amount)}
            />
            <DetailRow
              label="Date"
              value={formatISODate(transaction?.createdAt)}
            />
          </View>

          {/* Accent Message Box */}
          {config.message ? (
            <View style={tw`px-5 pb-5 pt-4`}>
              <View
                style={[
                  tw`flex-row items-start gap-[8px] p-3 rounded-md border`,
                  {
                    backgroundColor: config.bgColor,
                    borderColor: config.borderColor,
                  },
                ]}
              >
                <Ionicons
                  name={config.icon}
                  size={16}
                  color={config.textColor}
                  style={{ marginTop: 1 }}
                />
                <Text
                  style={[
                    tw`text-xs flex-1 leading-5`,
                    { color: config.textColor },
                  ]}
                >
                  {config.message}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

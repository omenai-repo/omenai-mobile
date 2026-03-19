import React from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";

type ReviewStatus =
  | "PENDING_ADMIN_REVIEW"
  | "PENDING_ARTIST_ACTION"
  | "APPROVED_ARTIST_PRICE"
  | "APPROVED_COUNTER_PRICE"
  | "AUTO_APPROVED"
  | "DECLINED_BY_ADMIN"
  | "DECLINED_BY_ARTIST"
  | string;

function getStatusConfig(status: ReviewStatus) {
  switch (status) {
    case "PENDING_ADMIN_REVIEW":
      return {
        label: "Under Review",
        icon: "clock",
        badge: tw`bg-[#EAF2FF] border border-[#BFD7FF]`,
        text: tw`text-[#1E5FD6]`,
      };
    case "PENDING_ARTIST_ACTION":
      return {
        label: "Action Required",
        icon: "alert-circle",
        badge: tw`bg-[#FFF4E5] border border-[#FFD9A3]`,
        text: tw`text-[#9A5A00]`,
      };
    case "APPROVED_ARTIST_PRICE":
    case "APPROVED_COUNTER_PRICE":
    case "AUTO_APPROVED":
      return {
        label: "Approved",
        icon: "check-circle",
        badge: tw`bg-[#E9F9EF] border border-[#B5E8C6]`,
        text: tw`text-[#167D42]`,
      };
    case "DECLINED_BY_ADMIN":
    case "DECLINED_BY_ARTIST":
      return {
        label: "Declined",
        icon: "x-circle",
        badge: tw`bg-[#F5F5F5] border border-[#DFDFDF]`,
        text: tw`text-[#575757]`,
      };
    default:
      return {
        label: "Review",
        icon: "clock",
        badge: tw`bg-[#F5F5F5] border border-[#DFDFDF]`,
        text: tw`text-[#575757]`,
      };
  }
}

export default function ReviewStatusBadge({
  status,
}: {
  status: ReviewStatus;
}) {
  const config = getStatusConfig(status);

  return (
    <View
      style={[tw`px-2 py-1 rounded-md flex-row items-center`, config.badge]}
    >
      <Feather
        name={config.icon as any}
        size={12}
        color={(config.text as any).color || "#575757"}
      />
      <Text style={[tw`text-xs font-semibold ml-1.5`, config.text]}>
        {config.label}
      </Text>
    </View>
  );
}

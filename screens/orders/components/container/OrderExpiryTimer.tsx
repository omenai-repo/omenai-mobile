import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

interface OrderExpiryTimerProps {
  payment_information: string;
  order_accepted: string;
  remainingTime: number;
}

export const OrderExpiryTimer = ({
  payment_information,
  order_accepted,
  remainingTime,
}: Readonly<OrderExpiryTimerProps>) => {
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (
    payment_information === "pending" &&
    order_accepted === "accepted" &&
    remainingTime > 0
  ) {
    return (
      <View style={tw`mt-3`}>
        <View
          style={tw`flex-row items-center bg-[#FFF1F0] border border-[#FCA5A5] px-3 py-2 rounded-lg`}
        >
          <Ionicons name="time-outline" size={16} color="#C71C16" />
          <Text style={tw`ml-2 text-[13px] text-[#C71C16]`}>
            Time left to pay:{" "}
            <Text style={tw`font-semibold`}>{formatTime(remainingTime)}</Text>
          </Text>
        </View>
      </View>
    );
  }

  return null;
};

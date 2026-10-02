import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import StatusPill from "../StatusPill";

interface OrderStatusDetailsProps {
  price: string;
  status: "pending" | "processing" | "completed";
  payment_information: string;
  tracking_link: string;
  order_accepted: string;
  delivery_confirmed: boolean;
  availability: boolean;
  order_decline_reason?: string;
}

export const OrderStatusDetails = ({
  price,
  status,
  payment_information,
  tracking_link,
  order_accepted,
  delivery_confirmed,
  availability,
  order_decline_reason,
}: Readonly<OrderStatusDetailsProps>) => {
  return (
    <>
      <View style={tw`flex-row items-center gap-[20px]`}>
        <Text style={tw`text-xs uppercase font-bold text-gray-400`}>Price</Text>
        <Text style={tw`text-[14px] text-[#454545] font-semibold`}>
          {price}
        </Text>
      </View>
      <View style={tw`flex-row items-center gap-[20px]`}>
        <Text style={tw`text-xs uppercase font-bold text-gray-400`}>
          Status
        </Text>
        <View style={{ flexWrap: "wrap" }}>
          <StatusPill
            status={status}
            payment_status={payment_information}
            tracking_status={tracking_link}
            order_accepted={order_accepted}
            delivery_confirmed={delivery_confirmed}
            availability={availability}
          />
        </View>
      </View>
      {order_accepted === "declined" && (
        <Text style={{ color: "#ff0000", fontSize: 14 }}>
          Reason: {order_decline_reason}
        </Text>
      )}
    </>
  );
};

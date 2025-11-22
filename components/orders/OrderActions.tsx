import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { OrderActionType, OrderActionsProps } from "types/orders";

export const getOrderActionType = ({
  status,
  payment_status,
  tracking_status,
  order_accepted,
}: Pick<
  OrderActionsProps,
  "status" | "payment_status" | "tracking_status" | "order_accepted"
>): OrderActionType => {
  if (
    status === "processing" &&
    order_accepted === "accepted" &&
    payment_status === "completed" &&
    tracking_status !== null
  ) {
    return "track";
  }

  if (
    status === "pending" &&
    (order_accepted ?? "") === "" &&
    payment_status === "pending" &&
    tracking_status === null
  ) {
    return "action";
  }

  return null;
};

const OrderActionsBase = ({
  status,
  payment_status,
  tracking_status,
  order_accepted,
  trackBtn,
  acceptBtn,
  declineBtn,
}: OrderActionsProps) => {
  const type = getOrderActionType({ status, payment_status, tracking_status, order_accepted });

  if (type === "track") {
    return (
      <Pressable
        style={tw`bg-black py-3 px-4 rounded-full items-center`}
        onPress={trackBtn}
        accessible
        accessibilityLabel="Track this shipment"
      >
        <Text style={tw`text-white text-[13px] font-semibold`}>Track this shipment</Text>
      </Pressable>
    );
  }

  if (type === "action") {
    return (
      <View style={tw`flex-row items-center gap-[30px]`}>
        <Pressable
          onPress={declineBtn}
          style={tw`h-[40px] justify-center items-center bg-[#C71C16] rounded-[20px] px-[15px] flex-1`}
          accessible
          accessibilityLabel="Decline order"
        >
          <Text style={tw`text-[13px] text-white font-semibold`}>Decline order</Text>
        </Pressable>
        <Pressable
          onPress={acceptBtn}
          style={tw`h-[40px] justify-center items-center bg-[#00C885] rounded-[20px] px-[15px] flex-1`}
          accessible
          accessibilityLabel="Accept order"
        >
          <Text style={tw`text-[13px] text-white font-semibold`}>Accept order</Text>
        </Pressable>
      </View>
    );
  }

  return null;
};

export const OrderActions = memo(OrderActionsBase);
export default OrderActions;

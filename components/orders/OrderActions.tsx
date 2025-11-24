import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import FittedBlackButton from "components/buttons/FittedBlackButton";
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
        <View style={tw`flex-1`}>
          <FittedBlackButton
            value="Decline order"
            onClick={() => declineBtn?.()}
            style={tw`bg-[#C71C16]`}
            textStyle={tw`text-[13px] font-semibold`}
          />
        </View>
        <View style={tw`flex-1`}>
          <FittedBlackButton
            value="Accept order"
            onClick={() => acceptBtn?.()}
            style={tw`bg-[#00C885]`}
            textStyle={tw`text-[13px] font-semibold`}
          />
        </View>
      </View>
    );
  }

  return null;
};

export const OrderActions = memo(OrderActionsBase);
export default OrderActions;

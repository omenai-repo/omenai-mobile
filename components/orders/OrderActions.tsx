import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import { OrderActionType, OrderActionsProps } from "#types/orders";
import { useDevice } from "#hooks/useDevice";

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
  galleryAcceptBlocked,
  gallerySubscriptionNotice,
  onGallerySubscribeForOrders,
}: OrderActionsProps) => {
  const { isTablet } = useDevice();
  const type = getOrderActionType({
    status,
    payment_status,
    tracking_status,
    order_accepted,
  });

  if (type === "track") {
    return (
      <View style={isTablet && tw`flex-wrap`}>
        <Pressable
          style={[
            tw`py-3 px-4 rounded-sm items-center`,
            { backgroundColor: colors.black },
          ]}
          onPress={trackBtn}
          accessible
          accessibilityLabel="Track this shipment"
        >
          <Text
            style={[tw`text-[13px] font-semibold`, { color: colors.white }]}
          >
            Track this shipment
          </Text>
        </Pressable>
      </View>
    );
  }

  if (type === "action") {
    // if (galleryAcceptBlocked) {
    //   const notice =
    //     gallerySubscriptionNotice?.trim() ||
    //     "Your gallery subscription is inactive or has expired. Renew your plan to process this order.";
    //   return (
    //     <View style={tw`w-full gap-3`}>
    //       <Text
    //         style={tw`text-[13px] text-[#454545] leading-[19px]`}
    //         accessibilityRole="text"
    //       >
    //         {notice}
    //       </Text>
    //       <FittedBlackButton
    //         value="Renew to process order"
    //         onClick={() => onGallerySubscribeForOrders?.()}
    //         textStyle={tw`text-[13px] font-semibold`}
    //         responsive
    //         accessibilityLabel="Renew subscription to process this order"
    //       />
    //     </View>
    //   );
    // }

    return (
      <View style={tw`flex-row items-center gap-[30px]`}>
        <View style={tw`flex-1`}>
          <FittedBlackButton
            value="Decline order"
            onClick={() => declineBtn?.()}
            style={tw`h-9 bg-white border border-gray-200`}
            textStyle={tw`text-[13px] font-semibold text-gray-900`}
          />
        </View>
        <View style={tw`flex-1`}>
          <FittedBlackButton
            value="Accept order"
            onClick={() => acceptBtn?.()}
            style={tw`h-9`}
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

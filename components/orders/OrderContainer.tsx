import { View, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OrderHeader from "./OrderHeader";
import React from "react";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { dropdownIcon, dropUpIcon } from "#utils/assets/SvgImages";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { StatusBadge } from "#components/orders/StatusBadge";
import { OrderActions } from "#components/orders/OrderActions";
import { DetailRow } from "./DetailRow";
import type { OrderContainerProps } from "#types/orders";

function OrderContainerInner(props: Readonly<OrderContainerProps>) {
  const {
    id,
    open,
    setOpen,
    artId,
    artName,
    price,
    dateTime,
    status,
    lastId,
    trackBtn,
    url,
    payment_status,
    tracking_status,
    order_accepted,
    delivered,
    order_decline_reason,
    exclusivity_type,
  } = props;

  const image_href = getImageFileView(url, 300);
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;
  const animatedMaxHeight = React.useRef(new Animated.Value(0)).current;

  const currentIcon = open ? dropUpIcon : dropdownIcon;

  React.useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(animatedMaxHeight, {
          toValue: 300,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedMaxHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [open]);

  return (
    <Pressable
      onPress={() => setOpen(!open)}
      style={tw.style(
        `border-t-[1px] border-l-[1px] border-r-[1px] border-[#E7E7E7] p-[20px]`,
        id === 0 && `rounded-t-md`,
        lastId && `border-b-[1px] rounded-b-md`,
      )}
      accessible
      accessibilityLabel={`Order ${artName}, ${
        open ? "collapse" : "expand"
      } details`}
      accessibilityRole="button"
    >
      <View style={tw`flex-row items-center`}>
        <OrderHeader image_href={image_href} artId={artId} artName={artName}>
          {!open && (
            <View style={tw`mt-1`}>
              <StatusBadge
                status={status}
                payment_status={payment_status}
                tracking_status={tracking_status}
                order_accepted={order_accepted}
                delivered={delivered}
              />
            </View>
          )}
        </OrderHeader>
        <View
          style={tw`border border-[#F6F6F6] bg-[#F6F6F6] justify-center items-center h-[35px] w-[35px] rounded-sm`}
        >
          {typeof currentIcon === "string" && <SvgXml xml={currentIcon} />}
        </View>
      </View>

      <Animated.View
        style={{
          maxHeight: animatedMaxHeight,
          opacity: animatedOpacity,
          overflow: "hidden",
        }}
      >
        <View style={tw`gap-5 mt-4`}>
          <DetailRow label="Price" value={price} />
          <DetailRow label="Date" value={dateTime} />
          <DetailRow label="Status">
            <StatusBadge
              status={status}
              payment_status={payment_status}
              tracking_status={tracking_status}
              order_accepted={order_accepted}
              delivered={delivered}
            />
          </DetailRow>
          {order_accepted === "declined" && (
            <Text style={{ color: "#ff0000", fontSize: 14 }}>
              Reason: {order_decline_reason}
            </Text>
          )}

          {exclusivity_type === "exclusive" &&
            order_accepted !== "declined" &&
            status !== "completed" && (
              <View style={tw`flex-row items-center gap-1 mt-2`}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={tw.color("gray-500")}
                />
                <Text style={tw`text-[13px] text-gray-500 flex-1`}>
                  This artpiece is still within its exclusivity period
                </Text>
              </View>
            )}

          <OrderActions
            status={status}
            payment_status={payment_status}
            tracking_status={tracking_status}
            order_accepted={order_accepted}
            exclusivity_type={exclusivity_type}
            trackBtn={trackBtn}
            acceptBtn={props.acceptBtn}
            declineBtn={props.declineBtn}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const OrderContainer = React.memo(OrderContainerInner);

export default OrderContainer;

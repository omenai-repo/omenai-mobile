import { View, Text, Pressable, Image, Animated } from "react-native";
import React from "react";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { dropdownIcon, dropUpIcon } from "utils/SvgImages";
import { getImageFileView } from "lib/storage/getImageFileView";
import StatusBadge from "components/orders/StatusBadge";
import OrderActions from "components/orders/OrderActions";
import type { OrderContainerProps } from "types/orders";

export const OrderContainer = (props: OrderContainerProps) => {
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

  const image_href = getImageFileView(url, 700);
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
        id === 0 && `rounded-t-[15px]`,
        lastId && `border-b-[1px] rounded-b-[15px]`
      )}
      accessible
      accessibilityLabel={`Order ${artName}, ${
        open ? "collapse" : "expand"
      } details`}
      accessibilityRole="button"
    >
      <View style={tw`flex-row items-center`}>
        <View style={tw`flex-row items-center gap-[10px] flex-1`}>
          <Image
            source={{ uri: image_href }}
            style={tw`h-[42px] w-[42px] rounded-[3px]`}
          />
          <View style={tw`gap-[5px] pr-[20px] max-w-[80%]`}>
            <Text
              style={tw`text-[12px] text-[#454545]`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {artId}
            </Text>
            <Text
              style={tw`text-[14px] text-[#454545] font-semibold`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {artName}
            </Text>
          </View>
        </View>
        <View
          style={tw`border border-[#F6F6F6] bg-[#F6F6F6] justify-center items-center h-[35px] w-[35px] rounded-[8px]`}
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
        <View style={tw`gap-[20px] mt-[15px]`}>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Price</Text>
            <Text style={tw`text-[14px] text-[#454545] font-semibold`}>
              {price}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Date</Text>
            <Text style={tw`text-[14px] text-[#454545] font-semibold`}>
              {dateTime}
            </Text>
          </View>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Status</Text>
            <StatusBadge
              status={status}
              payment_status={payment_status}
              tracking_status={tracking_status}
              order_accepted={order_accepted}
              delivered={delivered}
            />
          </View>
          {order_accepted === "declined" && (
            <Text style={{ color: "#ff0000", fontSize: 14 }}>
              Reason: {order_decline_reason}
            </Text>
          )}

          {exclusivity_type === "exclusive" &&
            order_accepted !== "declined" && (
              <Text style={tw`text-[13px] text-amber-500 mt-2`}>
                This artpiece is still within its exclusivity period
              </Text>
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
};

export default OrderContainer;

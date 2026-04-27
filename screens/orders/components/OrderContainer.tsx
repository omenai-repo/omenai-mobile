import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Animated } from "react-native";
import OrderHeader from "../../../components/orders/OrderHeader";
import { SvgXml } from "react-native-svg";
import tw from "twrnc";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { dropdownIcon, dropUpIcon } from "#utils/SvgImages";
import { useHighRiskFeatureFlag } from "#hooks/useFeatureFlag";
import ConfirmOrderDeliveryModal from "./ConfirmOrderDeliveryModal";
import { OrderExpiryTimer } from "./container/OrderExpiryTimer";
import { OrderStatusDetails } from "./container/OrderStatusDetails";
import { OrderPaymentAction } from "./container/OrderPaymentAction";
import { OrderActions } from "./container/OrderActions";
import StatusPill from "./StatusPill";

interface HoldStatus {
  hold_end_date: string;
}

interface OrderContainerProps {
  id: number;
  open: boolean;
  setOpen: () => void;
  artId: string;
  artName: string;
  price: string;
  status: "pending" | "processing" | "completed";
  lastId: boolean;
  url: string;
  payment_information: string;
  tracking_information: {
    id: string;
    link: string;
  };
  order_accepted: string;
  delivery_confirmed: boolean;
  availability: boolean;
  orderId: string;
  holdStatus: HoldStatus | null;
  updatedAt: string;
  order_decline_reason?: string;
  trackBtn: () => void;
  invoice?: InvoiceTypes;
  invoiceNumber?: string;
  seller_designation?: string;
}

const OrderContainer: React.FC<OrderContainerProps> = React.memo(
  ({
    id,
    open,
    setOpen,
    artId,
    artName,
    price,
    status,
    lastId,
    url,
    payment_information,
    tracking_information,
    order_accepted,
    delivery_confirmed,
    availability,
    orderId,
    holdStatus,
    updatedAt,
    trackBtn,
    order_decline_reason = "",
    seller_designation,
    invoice,
    invoiceNumber,
  }) => {
    const image_href = getImageFileView(url, 300);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [confirmOrderModal, setConfirmOrderModal] = useState(false);

    const {
      value: isFlutterwavePaymentEnabled,
      loading: isFlutterwaveLoading,
    } = useHighRiskFeatureFlag("flutterwave_payment_enabled");
    const { value: isStripePaymentEnabled, loading: isStripeLoading } =
      useHighRiskFeatureFlag("stripe_payment_enabled");

    const areFlagsLoading = isFlutterwaveLoading || isStripeLoading;

    const showBlocker =
      (seller_designation === "artist" && !isFlutterwavePaymentEnabled) ||
      (seller_designation === "gallery" && !isStripePaymentEnabled);

    const expiresAt = React.useMemo(
      () =>
        holdStatus
          ? new Date(holdStatus.hold_end_date)
          : new Date(new Date(updatedAt).getTime() + 24 * 60 * 60 * 1000),
      [holdStatus, updatedAt],
    );

    useEffect(() => {
      const targetTime = expiresAt.getTime();
      const intervalId = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeLeft = targetTime - currentTime;
        if (timeLeft <= 0) {
          clearInterval(intervalId);
          setRemainingTime(0);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }, [expiresAt]);

    const animatedHeight = useRef(new Animated.Value(0)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (open) {
        Animated.parallel([
          Animated.timing(animatedHeight, {
            toValue: contentHeight,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(animatedHeight, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start();
      }
    }, [open, contentHeight, animatedHeight, animatedOpacity]);

    return (
      <View
        style={tw`
        border-t-[1px] border-l-[1px] border-r-[1px] border-[#E7E7E7] p-[20px]
        ${id === 0 ? "rounded-t-md" : ""}
        ${lastId ? "border-b-[1px] rounded-b-md" : ""}
      `}
      >
        <View style={tw`flex-row items-center`}>
          <OrderHeader image_href={image_href} artId={artId} artName={artName}>
            {!open && (
              <View
                style={{
                  transform: [{ scale: 0.8 }],
                  alignSelf: "flex-start",
                  marginLeft: -10,
                  marginTop: 4,
                }}
              >
                <StatusPill
                  status={status}
                  payment_status={payment_information}
                  tracking_status={tracking_information.link}
                  order_accepted={order_accepted}
                  delivery_confirmed={delivery_confirmed}
                  availability={availability}
                />
              </View>
            )}
          </OrderHeader>
          <Pressable
            onPress={() => setOpen()}
            style={tw`border border-[#F6F6F6] bg-[#F6F6F6] justify-center items-center h-[35px] w-[35px] rounded-sm`}
          >
            <SvgXml xml={open ? dropUpIcon : dropdownIcon} />
          </Pressable>
        </View>

        <OrderExpiryTimer
          payment_information={payment_information}
          order_accepted={order_accepted}
          remainingTime={remainingTime}
        />

        <Animated.View
          style={{
            height: animatedHeight,
            opacity: animatedOpacity,
            overflow: "hidden",
          }}
        >
          <View
            style={{ position: "absolute", width: "100%" }}
            onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
          >
            <View style={tw`gap-[20px] mt-[15px]`}>
              <OrderStatusDetails
                price={price}
                status={status}
                payment_information={payment_information}
                tracking_link={tracking_information.link}
                order_accepted={order_accepted}
                delivery_confirmed={delivery_confirmed}
                availability={availability}
                order_decline_reason={order_decline_reason}
              />

              <OrderPaymentAction
                availability={availability}
                payment_information={payment_information}
                order_accepted={order_accepted}
                remainingTime={remainingTime}
                showBlocker={showBlocker ?? false}
                areFlagsLoading={areFlagsLoading}
                orderId={orderId}
              />

              <OrderActions
                availability={availability}
                payment_information={payment_information}
                tracking_link={tracking_information.link}
                order_accepted={order_accepted}
                status={status}
                delivery_confirmed={delivery_confirmed}
                trackBtn={trackBtn}
                setConfirmOrderModal={setConfirmOrderModal}
                invoice={invoice}
                invoiceNumber={invoiceNumber}
              />
            </View>
          </View>
        </Animated.View>

        <ConfirmOrderDeliveryModal
          orderId={orderId}
          modalVisible={confirmOrderModal}
          setModalVisible={setConfirmOrderModal}
        />
      </View>
    );
  },
);

export default OrderContainer;

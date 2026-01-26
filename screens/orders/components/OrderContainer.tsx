import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Pressable, Animated } from "react-native";
import OrderHeader from "../../../components/orders/OrderHeader";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import tw from "twrnc";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { dropdownIcon, dropUpIcon } from "#utils/SvgImages";
import StatusPill from "./StatusPill";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import { useHighRiskFeatureFlag } from "#hooks/useFeatureFlag";
import { screenName } from "#constants/screenNames.constants";
import ConfirmOrderDeliveryModal from "./ConfirmOrderDeliveryModal";
import { useAppStore } from "#store/app/appStore";
import { InvoiceTypes } from "#types/types";
import { colors } from "#config/colors.config";

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

const OrderContainer: React.FC<OrderContainerProps> = ({
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
  const { userType } = useAppStore();

  const activeInvoice = invoice;
  const image_href = getImageFileView(url, 700);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [confirmOrderModal, setConfirmOrderModal] = useState(false);

  const { value: isFlutterwavePaymentEnabled } = useHighRiskFeatureFlag(
    "flutterwave_payment_enabled",
  );
  const { value: isStripePaymentEnabled } = useHighRiskFeatureFlag(
    "stripe_payment_enabled",
  );

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

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const renderCountdownTimer = () => {
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
        ${id === 0 ? "rounded-t-[15px]" : ""}
        ${lastId ? "border-b-[1px] rounded-b-[15px]" : ""}
      `}
    >
      <View style={tw`flex-row items-center`}>
        <OrderHeader image_href={image_href} artId={artId} artName={artName} />
        <Pressable
          onPress={() => setOpen()}
          style={tw`border border-[#F6F6F6] bg-[#F6F6F6] justify-center items-center h-[35px] w-[35px] rounded-[8px]`}
        >
          <SvgXml xml={open ? dropUpIcon : dropdownIcon} />
        </Pressable>
      </View>

      {renderCountdownTimer()}

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
            <View style={tw`flex-row items-center gap-[20px]`}>
              <Text style={tw`text-xs uppercase font-bold text-gray-400`}>
                Price
              </Text>
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
                  tracking_status={tracking_information.link}
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
            {availability &&
              payment_information === "pending" &&
              order_accepted === "accepted" &&
              remainingTime > 0 && (
                <>
                  {showBlocker ? (
                    <FittedBlackButton
                      value="Pay now — under maintenance"
                      isDisabled
                      onClick={() => {}}
                      style={{ height: 40 }}
                    />
                  ) : (
                    <FittedBlackButton
                      value="Pay now"
                      onClick={() =>
                        navigation.navigate(screenName.payment, {
                          id: orderId,
                        })
                      }
                      style={{ height: 40 }}
                    />
                  )}

                  {showBlocker && (
                    <Text style={tw`text-[12px] text-[#666]`}>
                      We’re fine-tuning our payment system to resolve a minor
                      issue and ensure every transaction remains flawlessly
                      seamless.
                    </Text>
                  )}
                </>
              )}
            {/* Bottom Section Wrapper for smaller gap */}
            <View style={tw`gap-3`}>
              {availability &&
                payment_information === "completed" &&
                tracking_information.link?.trim() && (
                  <View style={tw`flex-row gap-2`}>
                    <FittedBlackButton
                      value="Track Shipment"
                      onClick={trackBtn}
                      style={{
                        flex: 1,
                        backgroundColor: colors.black,
                        height: 40,
                      }}
                      textStyle={{ fontSize: 12, fontWeight: "600" }}
                    />
                    {!delivery_confirmed && (
                      <FittedBlackButton
                        value="Confirm Delivery"
                        onClick={() => setConfirmOrderModal(true)}
                        style={{
                          flex: 1,
                          backgroundColor: "#16A34A",
                          height: 40,
                        }}
                        textStyle={{ fontSize: 12, fontWeight: "600" }}
                      />
                    )}
                  </View>
                )}

              {availability &&
                payment_information === "completed" &&
                order_accepted === "accepted" &&
                status !== "completed" &&
                !tracking_information.link && (
                  <View
                    style={[
                      tw`rounded-lg`,
                      {
                        padding: 10,
                        backgroundColor: "#f3f3f3",
                      },
                    ]}
                  >
                    <Text style={{ color: "#666", textAlign: "center" }}>
                      Awaiting tracking information
                    </Text>
                  </View>
                )}

              {payment_information === "completed" && userType === "user" && (
                <Pressable
                  onPress={() => {
                    navigation.navigate("ViewReceiptScreen", {
                      invoice: activeInvoice,
                      invoiceNumber: invoiceNumber,
                    });
                  }}
                  disabled={!activeInvoice && !invoiceNumber}
                  style={({ pressed }) => [
                    tw`flex-row items-center justify-center rounded-lg h-[40px] bg-gray-100`,
                    pressed && { opacity: 0.8 },
                    !activeInvoice && !invoiceNumber && { opacity: 0.5 },
                  ]}
                >
                  <Text
                    style={tw`text-xs font-semibold text-gray-900`}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    View Receipt
                  </Text>
                </Pressable>
              )}
            </View>
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
};

export default OrderContainer;

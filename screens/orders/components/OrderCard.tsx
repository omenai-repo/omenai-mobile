import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "config/colors.config";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import { getImageFileView } from "lib/storage/getImageFileView";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import DropDownButton from "./DropDownButton";
import { useModalStore } from "store/modal/modalStore";
import StatusPill from "./StatusPill";
import ConfirmOrderDeliveryModal from "./ConfirmOrderDeliveryModal";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

export default function OrderCard({
  artworkName,
  dateOrdered,
  status,
  state,
  artworkPrice,
  url,
  orderId,
  payment_information,
  tracking_information,
  shipping_quote,
  order_accepted,
  delivery_confirmed,
  availability,
}: OrderCardProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [showTrackingInfo, setShowTrackingInfo] = useState<boolean>(false);
  const [confirmOrderModal, setConfirmOrderModal] = useState(false);
  const { updateModal } = useModalStore();

  async function openTrackingLink() {
    const url = tracking_information?.link || "";

    const validUrl = await Linking.canOpenURL(url);
    if (validUrl) {
      Linking.openURL(url);
    } else {
      updateModal({
        message: "Invalid tracking link",
        modalType: "error",
        showModal: true,
      });
    }
  }

  let image_href = getImageFileView(url, 700);

  return (
    <View style={{ paddingVertical: 10, gap: 15 }}>
      <View style={styles.listItem}>
        <Image
          source={{ uri: image_href }}
          style={{ width: 100, backgroundColor: "#f5f5f5", borderRadius: 5 }}
          resizeMode="cover"
        />
        <View style={styles.listItemDetails}>
          <Text style={styles.orderItemTitle}>{artworkName}</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 7,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 500, flex: 1 }}>
              {utils_formatPrice(artworkPrice)}
            </Text>
            <Text style={{ fontSize: 14 }}>Order ID: #{orderId}</Text>
            {/* <Text style={styles.orderItemDetails}>Ordered: {dateOrdered}</Text> */}
          </View>
          <View style={{ flexWrap: "wrap", marginTop: 15 }}>
            <StatusPill
              status={status}
              payment_status={payment_information?.status || ""}
              tracking_status={tracking_information?.link || ""}
              order_accepted={order_accepted.status}
              delivery_confirmed={delivery_confirmed}
              availability={availability}
            />
          </View>
          <View style={{ flexWrap: "wrap", marginTop: 15 }}>
            {!availability ? (
              <View style={styles.disabledButton}>
                <Text style={styles.disabledButtonText}>
                  No action required
                </Text>
              </View>
            ) : (
              <>
                {/* Pay Now Button */}
                <View style={tw`flex-1`}>
                  {payment_information?.status === "pending" &&
                    status !== "completed" &&
                    order_accepted.status === "accepted" && (
                      <FittedBlackButton
                        height={40}
                        value="Pay now"
                        onClick={() =>
                          navigation.navigate(screenName.payment, {
                            id: orderId,
                          })
                        }
                        isDisabled={false}
                      />
                    )}
                </View>
                {/* Track Order and Confirm Delivery Buttons */}
                <View style={styles.buttonRow}>
                  {payment_information?.status === "completed" &&
                    status !== "completed" &&
                    !delivery_confirmed &&
                    tracking_information?.link?.trim() && ( // Checks for non-empty string
                      <Pressable
                        onPress={() => setShowTrackingInfo(!showTrackingInfo)}
                        style={tw`h-[40px] w-[45px] bg-[#000] rounded-full justify-center items-center `}
                      >
                        <Ionicons
                          name="location-outline"
                          size={25}
                          color="#fff"
                        />
                      </Pressable>
                    )}

                  {payment_information?.status === "completed" &&
                    status !== "completed" && // Add status check for consistency
                    !delivery_confirmed &&
                    tracking_information?.link?.trim() && (
                      <FittedBlackButton
                        height={40}
                        value="Confirm order delivery"
                        onClick={() => setConfirmOrderModal(true)}
                        isDisabled={false}
                        bgColor="#16A34A"
                      />
                    )}
                </View>
                {/* Awaiting Tracking Information */}
                {payment_information?.status === "completed" &&
                  order_accepted.status === "accepted" &&
                  status !== "completed" &&
                  tracking_information?.link === "" && (
                    <View style={styles.disabledButton}>
                      <Text style={styles.disabledButtonText}>
                        Awaiting tracking information
                      </Text>
                    </View>
                  )}
              </>
            )}
          </View>
        </View>
      </View>
      {showTrackingInfo && (
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{ fontSize: 14, color: colors.primary_black }}>
              Tracking ID:
            </Text>
            <Text
              style={{ flex: 1, fontSize: 14, color: colors.primary_black }}
            >
              {tracking_information?.id}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{ fontSize: 14, color: colors.primary_black }}>
              Tracking link:
            </Text>
            <TouchableOpacity
              style={{ flexWrap: "wrap", flex: 1, overflow: "hidden" }}
              onPress={openTrackingLink}
            >
              <Text
                style={{ fontSize: 14, color: "#0000ff90", flexWrap: "wrap" }}
              >
                {tracking_information?.link}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ConfirmOrderDeliveryModal
        orderId={orderId}
        modalVisible={confirmOrderModal}
        setModalVisible={setConfirmOrderModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    gap: 15,
  },
  statusPill: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "#004617",
    fontSize: 12,
    borderRadius: 20,
    flexWrap: "wrap",
  },
  listItemDetails: {
    flex: 1,
    paddingTop: 10,
  },
  orderItemTitle: {
    fontSize: 14,
    color: colors.primary_black,
  },
  orderItemDetails: {
    color: "#616161",
    fontSize: 12,
    marginTop: 5,
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButtonText: {
    fontSize: 12,
    color: "#858585",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
});

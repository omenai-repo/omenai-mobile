import React from "react";
import { View, Text, Pressable } from "react-native";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppStore } from "#store/app/appStore";
import { InvoiceTypes } from "#types/types";

interface OrderActionsProps {
  availability: boolean;
  payment_information: string;
  tracking_link: string;
  order_accepted: string;
  status: string;
  delivery_confirmed: boolean;
  trackBtn: () => void;
  setConfirmOrderModal: (visible: boolean) => void;
  invoice?: InvoiceTypes;
  invoiceNumber?: string;
}

export const OrderActions = ({
  availability,
  payment_information,
  tracking_link,
  order_accepted,
  status,
  delivery_confirmed,
  trackBtn,
  setConfirmOrderModal,
  invoice,
  invoiceNumber,
}: Readonly<OrderActionsProps>) => {
  const { userType } = useAppStore();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={tw`gap-3`}>
      {availability &&
        payment_information === "completed" &&
        tracking_link?.trim() && (
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
        !tracking_link && (
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
              invoice: invoice,
              invoiceNumber: invoiceNumber,
            });
          }}
          disabled={!invoice && !invoiceNumber}
          style={({ pressed }) => [
            tw`flex-row items-center justify-center rounded-lg h-[40px] bg-gray-100`,
            pressed && { opacity: 0.8 },
            !invoice && !invoiceNumber && { opacity: 0.5 },
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
  );
};

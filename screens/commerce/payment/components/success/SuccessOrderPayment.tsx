import { Image, Text, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";

import { images } from "#constants/images.constants";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "#store/app/appStore";
import { navigateToCollectorOrders } from "#lib/navigation/navigateToCollectorOrders";

export default function SuccessOrderPayment() {
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userSession?.id);

  const handleReturnToOrders = async () => {
    if (userId) {
      await queryClient.invalidateQueries({ queryKey: ["orders", userId] });
    }
    navigateToCollectorOrders();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 100,
          paddingHorizontal: 20,
        }}
      >
        <Image
          source={images.successCheck}
          style={{ width: 100, objectFit: "contain" }}
        />
        <Text
          style={{ fontSize: 18, color: colors.primary_black, fontWeight: 500 }}
        >
          Your transaction was successful
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            color: colors.grey,
            marginBottom: 40,
          }}
        >
          The payment for this artwork was successful, you should recieve an
          email with your payment reciept
        </Text>
        <LongBlackButton
          value="Return to orders"
          onClick={handleReturnToOrders}
        />
      </View>
    </View>
  );
}

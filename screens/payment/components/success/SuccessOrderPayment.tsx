import { Image, Text, View } from "react-native";
import React from "react";
import { colors } from "config/colors.config";

import success_check from "assets/icons/success_check.png";
import LongBlackButton from "components/buttons/LongBlackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { useOrderStore } from "store/orders/Orders";

export default function SuccessOrderPayment() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { setRefreshTrigger, refreshTrigger } = useOrderStore();

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
        <Image source={success_check} style={{ width: 100, objectFit: "contain" }} />
        <Text style={{ fontSize: 18, color: colors.primary_black, fontWeight: 500 }}>
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
          The payment for this artwork was successful, you should recieve an email with your payment
          reciept
        </Text>
        <LongBlackButton
          value="Return to orders"
          onClick={() => {
            setRefreshTrigger(refreshTrigger + 1);
            navigation.navigate(screenName.gallery.orders);
          }}
        />
      </View>
    </View>
  );
}

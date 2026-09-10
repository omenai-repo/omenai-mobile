import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import { Feather } from "@expo/vector-icons";
import OrderCard from "./OrderCard";

type PendingListingProps = {
  listing: any[];
};

export default function PendingListing({ listing }: PendingListingProps) {
  if (listing.length > 0)
    return (
      <View style={styles.container}>
        {listing.map((order, index) => (
          <OrderCard order={order} key={order.order_id ?? index} />
        ))}
      </View>
    );

  return (
    <View style={styles.emptyOrders}>
      <Feather name="package" size={40} color={colors.primary_black} />
      <Text
        style={{ fontSize: 18, marginTop: 10, color: colors.primary_black }}
      >
        No orders on your account
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
  },
  emptyOrders: {
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { formatIntlDateTime } from "#utils/date/utils_formatIntlDateTime";
import { Feather } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import OrderCard from "./OrderCard";

export default function HistoryListing({
  orders,
}: {
  orders: CreateOrderModelTypes[];
}) {
  // Sort orders by createdAt in ascending order
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedOrders.length > 0)
    return (
      <View>
        {sortedOrders.map((order, index) => {
          return (
            <View key={index}>
              <Text style={styles.dateTitle}>
                {formatIntlDateTime(order.createdAt)}
              </Text>
              <OrderCard order={order} />
            </View>
          );
        })}
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
  emptyOrders: {
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
  dateTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary_black,
  },
});

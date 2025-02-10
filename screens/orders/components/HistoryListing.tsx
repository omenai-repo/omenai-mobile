import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { formatIntlDateTime } from "utils/utils_formatIntlDateTime";
import { Feather } from "@expo/vector-icons";
import { colors } from "config/colors.config";
import OrderCard from "./OrderCard";

export default function HistoryListing({
  orders,
}: {
  orders: CreateOrderModelTypes[];
}) {
  if (orders.length > 0)
    return (
      <View>
        {orders.map((order, index) => {
          return (
            <View key={index}>
              <Text style={styles.dateTitle}>
                {formatIntlDateTime(order.createdAt)}
              </Text>
              <OrderCard
                url={order.artwork_data.url}
                orderId={order.order_id}
                artworkName={order.artwork_data.title}
                artworkPrice={order.artwork_data.pricing.usd_price}
                dateOrdered={order.createdAt}
                state="history"
                status={order.status}
                payment_information={order.payment_information}
                tracking_information={order.shipping_details.tracking}
                shipping_quote={order.shipping_details.quote}
                order_accepted={order.order_accepted}
                availability={order.availability}
                delivery_confirmed={order.shipping_details.delivery_confirmed}
              />
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
    fontSize: 18,
    fontWeight: 500,
    color: colors.primary_black,
  },
});

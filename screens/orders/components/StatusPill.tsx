import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { colors } from "config/colors.config";

type StatusPillProps = {
  status: string;
  payment_status: string;
  tracking_status: string;
  order_accepted: string;
  delivery_confirmed: boolean;
  availability: boolean;
};

export default function StatusPill({
  status,
  payment_status,
  tracking_status,
  order_accepted,
  delivery_confirmed,
  availability,
}: StatusPillProps) {
  if (!availability) {
    return (
      <View style={[styles.pill, { backgroundColor: "#00800015" }]}>
        <Feather name="x-circle" size={14} />
        <Text style={styles.text}>Artwork unavailable for purchase</Text>
      </View>
    );
  }

  // Order declined case
  if (order_accepted === "declined") {
    return (
      <View style={[styles.pill, { backgroundColor: "#ff000020" }]}>
        <Feather name="x-circle" size={14} />
        <Text style={styles.text}>Order declined</Text>
      </View>
    );
  }

  // Order completion case
  if (status === "completed" && delivery_confirmed) {
    return (
      <View style={[styles.pill, { backgroundColor: "#00800015" }]}>
        <AntDesign name="check-circle" size={14} />
        <Text style={styles.text}>Order has been completed</Text>
      </View>
    );
  }

  // Payment pending after acceptance
  if (order_accepted === "accepted" && payment_status === "pending") {
    return (
      <View style={[styles.pill, { backgroundColor: "#FFBF0040" }]}>
        <MaterialIcons name="info-outline" size={14} />
        <Text style={styles.text}>Awaiting payment</Text>
      </View>
    );
  }

  // Payment completed but no tracking
  if (payment_status === "completed" && !tracking_status) {
    return (
      <View style={[styles.pill, { backgroundColor: "#00800020" }]}>
        <AntDesign name="check-circle" size={14} />
        <Text style={styles.text}>Payment completed</Text>
      </View>
    );
  }

  // Tracking added but not delivered
  if (payment_status === "completed" && tracking_status && !delivery_confirmed) {
    return (
      <View style={[styles.pill, { backgroundColor: "#00800015" }]}>
        <AntDesign name="check-circle" size={14} />
        <Text style={styles.text}>Delivery in progress</Text>
      </View>
    );
  }

  // Order Fulfilled
  if (delivery_confirmed) {
    return (
      <View style={[styles.pill, { backgroundColor: "#00800020" }]}>
        <AntDesign name="check-circle" size={14} />
        <Text style={styles.text}> This order has been fulfilled</Text>
      </View>
    );
  }

  // Order in Review
  if (!order_accepted) {
    return (
      <View style={[styles.pill, { backgroundColor: "#FFBF0040" }]}>
        <MaterialIcons name="info-outline" size={14} />
        <Text style={styles.text}>Order in review</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
  },
  text: {
    fontSize: 12,
    color: colors.primary_black,
  },
});

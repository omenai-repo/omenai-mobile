import { Text, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import { StatusBadgeItem } from "#components/orders/StatusBadgeItem";

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
      <StatusBadgeItem
        icon="x-circle"
        family="Feather"
        label="Artwork unavailable for purchase"
        customBgColor="#00800015"
        iconColor={colors.primary_black}
        textStyle="text-gray-900"
      />
    );
  }

  // Order declined case
  if (order_accepted === "declined") {
    return (
      <StatusBadgeItem
        icon="x-circle"
        family="Feather"
        label="Order declined"
        customBgColor="#ff000020"
        iconColor="#991B1B"
        textStyle="text-red-800"
      />
    );
  }

  // Order completion case
  if (status === "completed" && delivery_confirmed) {
    return (
      <StatusBadgeItem
        icon="check-circle"
        family="AntDesign"
        label="Order has been completed"
        customBgColor="#00800015"
        iconColor="#166534"
        textStyle="text-green-800"
      />
    );
  }

  // Payment pending after acceptance
  if (order_accepted === "accepted" && payment_status === "pending") {
    return (
      <StatusBadgeItem
        icon="info-outline"
        family="MaterialIcons"
        label="Awaiting payment"
        customBgColor="#FFBF0040"
        iconColor="#92400E"
        textStyle="text-yellow-800"
      />
    );
  }

  // Payment completed but no tracking
  if (payment_status === "completed" && !tracking_status) {
    return (
      <StatusBadgeItem
        icon="check-circle"
        family="AntDesign"
        label="Payment completed"
        customBgColor="#00800020"
        iconColor="#166534"
        textStyle="text-green-800"
      />
    );
  }

  // Tracking added but not delivered
  if (
    payment_status === "completed" &&
    tracking_status &&
    !delivery_confirmed
  ) {
    return (
      <StatusBadgeItem
        icon="check-circle"
        family="AntDesign"
        label="Delivery in progress"
        customBgColor="#00800015"
        iconColor="#166534"
        textStyle="text-green-800"
      />
    );
  }

  // Order Fulfilled
  if (delivery_confirmed) {
    return (
      <StatusBadgeItem
        icon="check-circle"
        family="AntDesign"
        label="This order has been fulfilled"
        customBgColor="#00800020"
        iconColor="#166534"
        textStyle="text-green-800"
      />
    );
  }

  // Order in Review
  if (!order_accepted) {
    return (
      <StatusBadgeItem
        icon="info-outline"
        family="MaterialIcons"
        label="Order in review"
        customBgColor="#FFBF0040"
        iconColor="#92400E"
        textStyle="text-yellow-800"
      />
    );
  }

  return null;
}

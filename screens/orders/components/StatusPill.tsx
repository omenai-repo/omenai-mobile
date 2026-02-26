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

const getStatusConfig = (props: StatusPillProps) => {
  const {
    status,
    payment_status,
    tracking_status,
    order_accepted,
    delivery_confirmed,
    availability,
  } = props;

  if (!availability) {
    return {
      icon: "x-circle",
      family: "Feather" as const,
      label: "Artwork unavailable for purchase",
      customBgColor: "#00800015",
      iconColor: colors.primary_black,
      textStyle: "text-gray-900",
    };
  }

  if (order_accepted === "declined") {
    return {
      icon: "x-circle",
      family: "Feather" as const,
      label: "Order declined",
      customBgColor: "#ff000020",
      iconColor: "#991B1B",
      textStyle: "text-red-800",
    };
  }

  switch (status) {
    case "completed":
      if (delivery_confirmed) {
        return {
          icon: "check-circle",
          family: "AntDesign" as const,
          label: "Order has been completed",
          customBgColor: "#00800015",
          iconColor: "#166534",
          textStyle: "text-green-800",
        };
      }
      break;

    case "pending":
      if (!order_accepted) {
        return {
          icon: "info-outline",
          family: "MaterialIcons" as const,
          label: "Order in review",
          customBgColor: "#FFBF0040",
          iconColor: "#92400E",
          textStyle: "text-yellow-800",
        };
      }
      break;

    case "processing":
      if (order_accepted === "accepted") {
        if (payment_status === "pending") {
          return {
            icon: "info-outline",
            family: "MaterialIcons" as const,
            label: "Awaiting payment",
            customBgColor: "#FFBF0040",
            iconColor: "#92400E",
            textStyle: "text-yellow-800",
          };
        }
        if (payment_status === "completed") {
          return tracking_status && !delivery_confirmed
            ? {
                icon: "check-circle",
                family: "AntDesign" as const,
                label: "Delivery in progress",
                customBgColor: "#00800015",
                iconColor: "#166534",
                textStyle: "text-green-800",
              }
            : {
                icon: "check-circle",
                family: "AntDesign" as const,
                label: "Payment completed",
                customBgColor: "#00800020",
                iconColor: "#166534",
                textStyle: "text-green-800",
              };
        }
      } else if (!order_accepted) {
        return {
          icon: "info-outline",
          family: "MaterialIcons" as const,
          label: "Order in review",
          customBgColor: "#FFBF0040",
          iconColor: "#92400E",
          textStyle: "text-yellow-800",
        };
      }
      break;
  }

  // Fallback for general fulfillment if not caught by switch
  if (delivery_confirmed) {
    return {
      icon: "check-circle",
      family: "AntDesign" as const,
      label: "This order has been fulfilled",
      customBgColor: "#00800020",
      iconColor: "#166534",
      textStyle: "text-green-800",
    };
  }

  return null;
};

export default function StatusPill(props: StatusPillProps) {
  const config = getStatusConfig(props);

  if (!config) return null;

  return (
    <StatusBadgeItem
      icon={config.icon}
      family={config.family}
      label={config.label}
      customBgColor={config.customBgColor}
      iconColor={config.iconColor}
      textStyle={config.textStyle}
    />
  );
}

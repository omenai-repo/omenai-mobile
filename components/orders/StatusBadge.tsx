import React, { memo } from "react";
import type { StatusBadgeProps } from "#types/orders";
import { StatusBadgeItem } from "#components/orders/StatusBadgeItem";

const getStatusConfig = (props: StatusBadgeProps) => {
  const { status, payment_status, tracking_status, order_accepted, delivered } =
    props;

  if (order_accepted === "declined") {
    return {
      icon: "close-circle-outline" as const,
      label: "Order declined",
      bgStyle: "bg-red-200",
      textStyle: "text-red-800",
      iconColor: "#991B1B",
    };
  }

  switch (status) {
    case "completed":
      if (order_accepted === "accepted" && delivered) {
        return {
          icon: "checkmark-done-outline" as const,
          label: "Order has been fulfilled",
          bgStyle: "bg-green-100",
          textStyle: "text-green-800",
          iconColor: "#166534",
        };
      }
      break;

    case "pending":
      if (!order_accepted && payment_status === "pending") {
        return {
          icon: "time-outline" as const,
          label: "Awaiting acceptance",
          bgStyle: "bg-yellow-100",
          textStyle: "text-yellow-800",
          iconColor: "#92400E",
        };
      }
      break;

    case "processing":
      if (order_accepted === "accepted") {
        if (payment_status === "pending") {
          return {
            icon: "alert-circle-outline" as const,
            label: "Awaiting payment",
            bgStyle: "bg-yellow-100",
            textStyle: "text-yellow-800",
            iconColor: "#92400E",
          };
        }
        if (payment_status === "completed") {
          return tracking_status
            ? {
                icon: "car-outline" as const,
                label: "Delivery in progress",
                bgStyle: "bg-green-100",
                textStyle: "text-green-800",
                iconColor: "#166534",
              }
            : {
                icon: "card-outline" as const,
                label: "Payment completed",
                bgStyle: "bg-green-100",
                textStyle: "text-green-800",
                iconColor: "#166534",
              };
        }
      } else if (!order_accepted && payment_status === "pending") {
        return {
          icon: "information-circle-outline" as const,
          label: "Action required",
          bgStyle: "bg-yellow-100",
          textStyle: "text-yellow-800",
          iconColor: "#92400E",
        };
      }
      break;
  }

  return null;
};

const StatusBadgeBase = (props: StatusBadgeProps) => {
  const config = getStatusConfig(props);

  if (!config) return null;

  return (
    <StatusBadgeItem
      icon={config.icon}
      label={config.label}
      bgStyle={config.bgStyle}
      textStyle={config.textStyle}
      iconColor={config.iconColor}
    />
  );
};

export const StatusBadge = memo(StatusBadgeBase);
export default StatusBadge;

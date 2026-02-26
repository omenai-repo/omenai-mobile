import React, { memo } from "react";
import type { StatusBadgeProps } from "#types/orders";
import { StatusBadgeItem } from "#components/orders/StatusBadgeItem";

const StatusBadgeBase = ({
  status,
  payment_status,
  tracking_status,
  order_accepted,
  delivered,
}: StatusBadgeProps) => {
  if (
    status === "pending" &&
    (order_accepted ?? "") === "" &&
    payment_status === "pending" &&
    !tracking_status
  ) {
    return (
      <StatusBadgeItem
        icon="time-outline"
        label="Awaiting acceptance"
        bgStyle="bg-yellow-100"
        textStyle="text-yellow-800"
        iconColor="#92400E"
      />
    );
  }

  if (
    status === "processing" &&
    order_accepted === "accepted" &&
    payment_status === "pending" &&
    !tracking_status
  ) {
    return (
      <StatusBadgeItem
        icon="alert-circle-outline"
        label="Awaiting payment"
        bgStyle="bg-yellow-100"
        textStyle="text-yellow-800"
        iconColor="#92400E"
      />
    );
  }

  if (
    status === "processing" &&
    order_accepted === "accepted" &&
    payment_status === "completed" &&
    !tracking_status
  ) {
    return (
      <StatusBadgeItem
        icon="card-outline"
        label="Payment completed"
        bgStyle="bg-green-100"
        textStyle="text-green-800"
        iconColor="#166534"
      />
    );
  }

  if (
    status === "processing" &&
    order_accepted === "accepted" &&
    payment_status === "completed" &&
    tracking_status
  ) {
    return (
      <StatusBadgeItem
        icon="car-outline"
        label="Delivery in progress"
        bgStyle="bg-green-100"
        textStyle="text-green-800"
        iconColor="#166534"
      />
    );
  }

  if (
    status === "processing" &&
    (order_accepted ?? "") === "" &&
    payment_status === "pending" &&
    !tracking_status
  ) {
    return (
      <StatusBadgeItem
        icon="information-circle-outline"
        label="Action required"
        bgStyle="bg-yellow-100"
        textStyle="text-yellow-800"
        iconColor="#92400E"
      />
    );
  }

  if ((order_accepted ?? "") === "declined") {
    return (
      <StatusBadgeItem
        icon="close-circle-outline"
        label="Order declined"
        bgStyle="bg-red-200"
        textStyle="text-red-800"
        iconColor="#991B1B"
      />
    );
  }

  if (status === "completed" && order_accepted === "accepted" && delivered) {
    return (
      <StatusBadgeItem
        icon="checkmark-done-outline"
        label="Order has been fulfilled"
        bgStyle="bg-green-100"
        textStyle="text-green-800"
        iconColor="#166534"
      />
    );
  }

  return null;
};

export const StatusBadge = memo(StatusBadgeBase);
export default StatusBadge;

import React from "react";
import { OrdersScreen } from "screens/orders/OrdersScreen";

const GALLERY_ORDERS_QK = ["orders", "gallery"] as const;

export default function GalleryOrdersListing() {
  return (
    <OrdersScreen
      queryKey={GALLERY_ORDERS_QK}
      errorMessage="Failed to fetch orders"
      userType="gallery"
    />
  );
}

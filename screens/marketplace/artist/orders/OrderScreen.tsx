import React from "react";

import { ORDERS_QK } from "#utils/core/queryKeys";
import { OrdersScreen } from "#screens/commerce/orders/OrdersScreen";

const OrderScreen = () => {
  return (
    <OrdersScreen
      queryKey={ORDERS_QK}
      errorMessage="Failed to load orders"
      userType="artist"
    />
  );
};

export default OrderScreen;

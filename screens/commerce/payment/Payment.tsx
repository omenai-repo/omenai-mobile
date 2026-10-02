import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import OrderSkeleton from "#components/skeleton/OrderSkeleton";
import { getSingleOrder } from "#services/commerce/orders/getSingleOrder";
import { checkLockStatus } from "#services/commerce/orders/checkLockStatus";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/account/modal/modalStore";
import OrderDetails from "./components/orderDetails/OrderDetails";
import BackHeaderTitle from "#components/header/BackHeaderTitle";

type PaymentRouteParams = {
  id?: string;
  order_id?: string;
  user_id?: string;
};

type artworkDetailsProps = {
  data:
    | (CreateOrderModelTypes & { createdAt: string; updatedAt: string })
    | null;
  locked: boolean;
};

export default function Payment() {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [artworkDetails, setArtworkDetails] = useState<artworkDetailsProps>({
    data: null,
    locked: false,
  });

  useEffect(() => {
    const { id, order_id, user_id } = route.params as PaymentRouteParams;
    const orderId = id ?? order_id;

    if (!orderId || !userSession.id) {
      setIsLoading(false);
      return;
    }

    const resolvedOrderId = orderId;
    const sessionUserId = userSession.id;

    if (user_id && user_id !== sessionUserId) {
      setAccessDenied(true);
      setIsLoading(false);
      updateModal({
        message: "This payment link is for a different account. Please sign in with the correct account.",
        showModal: true,
        modalType: "error",
      });
      navigation.goBack();
      return;
    }

    setIsLoading(true);
    setAccessDenied(false);

    async function handleFetchOrderDetails() {
      const data = await getSingleOrder(resolvedOrderId);
      if (data?.isOk) {
        const lock_status = await checkLockStatus(resolvedOrderId, sessionUserId);
        setArtworkDetails({
          data: data.data,
          locked: lock_status?.data.locked,
        });
      }

      setIsLoading(false);
    }

    handleFetchOrderDetails();
  }, [route.params, userSession.id, navigation, updateModal]);

  if (accessDenied) return null;

  if (isLoading)
    return (
      <View>
        <BackHeaderTitle title="Confirm order details" />
        <OrderSkeleton />
      </View>
    );

  if (!isLoading && artworkDetails.data !== null)
    return (
      <OrderDetails data={artworkDetails.data} locked={artworkDetails.locked} />
    );

  return null;
}

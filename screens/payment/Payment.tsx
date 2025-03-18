import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import WithModal from "components/modal/WithModal";
import OrderDetails from "./components/orderDetails/OrderDetails";
import Loader from "components/general/Loader";
import { getSingleOrder } from "services/orders/getSingleOrder";
import { checkLockStatus } from "services/orders/checkLockStatus";
import { useAppStore } from "store/app/appStore";

type artworkDetailsProps = {
  data:
    | (CreateOrderModelTypes & { createdAt: string; updatedAt: string })
    | null;
  locked: boolean;
};

export default function Payment() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();

  const { userSession } = useAppStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [artworkDetails, setArtworkDetails] = useState<artworkDetailsProps>({
    data: null,
    locked: false,
  });

  useEffect(() => {
    setIsLoading(true);
    const { id } = route.params as { id: string };
    if (!userSession.id) {
      //toast error message and go back
      return;
    }

    async function handleFetchOrderDetails() {
      const data = await getSingleOrder(id);
      if (data?.isOk) {
        const lock_status = await checkLockStatus(id, userSession.id);
        setArtworkDetails({
          data: data.data,
          locked: lock_status?.data.locked,
        });
      }

      setIsLoading(false);
    }

    handleFetchOrderDetails();
  }, []);

  if (isLoading) return <Loader />;

  if (!isLoading && artworkDetails.data !== null)
    return (
      <WithModal>
        <OrderDetails
          data={artworkDetails.data}
          locked={artworkDetails.locked}
        />
      </WithModal>
    );
}

const styles = StyleSheet.create({});

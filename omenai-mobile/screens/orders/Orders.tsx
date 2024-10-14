import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "config/colors.config";
import { SafeAreaView } from "react-native-safe-area-context";
import OrdersListing from "./components/PendingListing";
import { getOrdersForUser } from "services/orders/getOrdersForUser";
import { useOrderStore } from "store/orders/Orders";
import HistoryListing from "./components/HistoryListing";
import WithModal from "components/modal/WithModal";
import OrderslistingLoader from "screens/galleryOrders/components/OrderslistingLoader";
import { useModalStore } from "store/modal/modalStore";
import ScrollWrapper from "components/general/ScrollWrapper";

type TabItemProps = {
  name: OrderTabsTypes;
  isSelected: boolean;
};

export type OrderTabsTypes = "Pending" | "Order history";

export default function Orders() {
  const { selectedTab, setSelectedTab, isLoading, setIsLoading } =
    useOrderStore();
  const [refreshing, setRefreshing] = useState(false);

  const { updateModal } = useModalStore();

  const [data, setData] = useState<{ pendingOrders: []; completedOrders: [] }>({
    pendingOrders: [],
    completedOrders: [],
  });

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    handleFetchOrders();
  }, []);

  useEffect(() => {
    handleFetchOrders();
  }, [selectedTab]);

  const handleFetchOrders = async () => {
    setIsLoading(true);

    const results = await getOrdersForUser();

    if (results?.isOk) {
      const data = results.data;

      const pending_orders = data.filter(
        (order: CreateOrderModelTypes) =>
          !order.delivery_confirmed && order.availability
      );
      const completed_orders = data.filter(
        (order: CreateOrderModelTypes) =>
          order.delivery_confirmed || !order.availability
      );

      setData({
        pendingOrders: pending_orders,
        completedOrders: completed_orders,
      });
    } else {
      updateModal({
        message: "Something went wrong fetching orders, reload page",
        modalType: "error",
        showModal: true,
      });
    }

    setIsLoading(false);
  };

  const TabItem = ({ name, isSelected }: TabItemProps) => {
    return (
      <TouchableOpacity
        style={[
          styles.tabItem,
          isSelected && { backgroundColor: colors.primary_black },
        ]}
        onPress={() => setSelectedTab(name)}
      >
        <Text
          style={[styles.tabItemText, isSelected && { color: colors.white }]}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <WithModal>
      <SafeAreaView style={styles.safeArea}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={[styles.tabContainer]}>
            <TabItem name="Pending" isSelected={selectedTab === "Pending"} />
            <TabItem
              name="Order history"
              isSelected={selectedTab === "Order history"}
            />
          </View>
        </View>
      </SafeAreaView>
      <ScrollWrapper
        style={styles.mainContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <OrderslistingLoader />
        ) : (
          <View>
            {selectedTab === "Pending" ? (
              <OrdersListing listing={data.pendingOrders} />
            ) : (
              <HistoryListing orders={data.completedOrders} />
            )}
          </View>
        )}
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: Platform.OS === "android" ? 15 : 10
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  tabItem: {
    height: 44,
    flex: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  tabItemText: {
    color: "#858585",
    fontSize: 14,
  },
  loadingContainer: {
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

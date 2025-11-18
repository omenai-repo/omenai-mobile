import { Text, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import WithModal from "components/modal/WithModal";
import TabSwitcher from "components/orders/TabSwitcher";
import OrderslistingLoader from "./components/OrderslistingLoader";
import EmptyOrdersListing from "./components/EmptyOrdersListing";
import YearDropdown from "screens/artist/orders/YearDropdown";
import DeclineOrderModal from "screens/artist/orders/DeclineOrderModal";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOrdersManagement } from "hooks/useOrdersManagement";
import { OrdersList } from "components/orders/OrdersList";

const GALLERY_ORDERS_QK = ["orders", "gallery"] as const;

export default function GalleryOrdersListing() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [declineModal, setDeclineModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderModalMetadata, setOrderModalMetadata] = useState({
    is_current_order_exclusive: false,
    art_id: "",
    seller_designation: "gallery",
  });

  const {
    selectedTab,
    setSelectedTab,
    openSection,
    selectedYear,
    setSelectedYear,
    ordersQuery,
    pending,
    processing,
    currentOrders,
    toggleRecentOrder,
    isInitialLoading,
    isRefreshing,
  } = useOrdersManagement({
    queryKey: GALLERY_ORDERS_QK,
    errorMessage: "Failed to fetch orders",
  });

  const galleryTabs = [
    { title: "Pending", key: "pending", count: pending?.length ?? 0 },
    { title: "Processing", key: "processing", count: processing?.length ?? 0 },
    { title: "Completed", key: "completed" },
  ];

  return (
    <WithModal>
      <View style={[tw`flex-1 bg-[#F7F7F7]`, { paddingTop: insets.top + 16 }]}>
        <TabSwitcher
          tabs={galleryTabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as "pending" | "processing" | "completed")}
        />

        <View
          style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[50px] android:mb-[30px]`}
        >
          {isInitialLoading ? (
            <OrderslistingLoader />
          ) : currentOrders.length === 0 ? (
            <EmptyOrdersListing status={selectedTab} />
          ) : (
            <>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-[16px] text-[#454545] font-semibold mb-[25px] flex-1`}>
                  Your Orders
                </Text>
                <YearDropdown selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
              </View>

              <OrdersList
                data={currentOrders}
                openSection={openSection}
                toggleRecentOrder={toggleRecentOrder}
                selectedTab={selectedTab}
                isRefreshing={isRefreshing}
                onRefresh={() => ordersQuery.refetch()}
                onAccept={(item) =>
                  navigation.navigate("DimensionsDetails", {
                    orderId: item.order_id,
                  })
                }
                onDecline={(item) => {
                  setOrderModalMetadata({
                    is_current_order_exclusive: false,
                    art_id: item.artwork_data?.art_id,
                    seller_designation: item.seller_designation || "gallery",
                  });
                  setOrderId(item.order_id);
                  setDeclineModal(true);
                }}
                onTrack={(item) =>
                  navigation.navigate("ShipmentTrackingScreen", {
                    orderId: item.order_id,
                    tracking_id: item.shipping_details.shipment_information.tracking.id,
                  })
                }
              />
            </>
          )}
        </View>

        <DeclineOrderModal
          isModalVisible={declineModal}
          setIsModalVisible={setDeclineModal}
          orderId={orderId}
          orderModalMetadata={orderModalMetadata}
          refresh={() => queryClient.invalidateQueries({ queryKey: GALLERY_ORDERS_QK })}
        />
      </View>
    </WithModal>
  );
}

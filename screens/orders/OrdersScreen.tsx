import { Text, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import WithModal from "components/modal/WithModal";
import TabSwitcher from "components/orders/TabSwitcher";
import OrderslistingLoader from "screens/galleryOrders/components/OrderslistingLoader";
import EmptyOrdersListing from "screens/galleryOrders/components/EmptyOrdersListing";
import YearDropdown from "screens/artist/orders/YearDropdown";
import DeclineOrderModal from "screens/artist/orders/DeclineOrderModal";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOrdersManagement } from "hooks/useOrdersManagement";
import { OrdersList } from "components/orders/OrdersList";

interface OrdersScreenProps {
  queryKey: readonly [string, ...string[]];
  errorMessage?: string;
  userType: "artist" | "gallery";
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  queryKey,
  errorMessage = "Failed to load orders",
  userType,
}) => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [declineModal, setDeclineModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderModalMetadata, setOrderModalMetadata] = useState({
    is_current_order_exclusive: false,
    art_id: "",
    seller_designation: userType,
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
    queryKey,
    errorMessage,
  });

  const isArtworkExclusiveDate = (createdAt: string | Date) => {
    const created = new Date(createdAt).getTime();
    const diffDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return diffDays <= 90;
  };

  const tabs = [
    { title: "Pending", key: "pending", count: pending?.length ?? 0 },
    { title: "Processing", key: "processing", count: processing?.length ?? 0 },
    { title: "Completed", key: "completed" },
  ];

  const handleDecline = (item: any) => {
    const isExclusive =
      userType === "artist" &&
      item?.artwork_data?.exclusivity_status?.exclusivity_type === "exclusive" &&
      isArtworkExclusiveDate(item?.createdAt);

    setOrderId(item?.order_id);
    setOrderModalMetadata({
      is_current_order_exclusive: isExclusive,
      art_id: item?.artwork_data?.art_id,
      seller_designation: item?.seller_designation || userType,
    });
    setDeclineModal(true);
  };

  const renderContent = () => {
    if (isInitialLoading) {
      return <OrderslistingLoader />;
    }

    if (currentOrders.length === 0) {
      return <EmptyOrdersListing status={selectedTab} />;
    }

    return (
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
              orderId: item?.order_id,
            })
          }
          onDecline={handleDecline}
          onTrack={(item) =>
            navigation.navigate("ShipmentTrackingScreen", {
              orderId: item?.order_id,
              tracking_id: item?.shipping_details?.shipment_information?.tracking?.id,
            })
          }
          {...(userType === "artist" && {
            renderExclusivityType: (item) =>
              item?.artwork_data?.exclusivity_status?.exclusivity_type || "non-exclusive",
          })}
        />
      </>
    );
  };

  return (
    <WithModal>
      <View style={[tw`flex-1 bg-[#F7F7F7]`, { paddingTop: insets.top + 16 }]}>
        <TabSwitcher
          tabs={tabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as "pending" | "processing" | "completed")}
        />

        <View
          style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[50px] android:mb-[30px]`}
        >
          {renderContent()}
        </View>

        <DeclineOrderModal
          isModalVisible={declineModal}
          setIsModalVisible={setDeclineModal}
          orderId={orderId}
          orderModalMetadata={orderModalMetadata}
          refresh={() => queryClient.invalidateQueries({ queryKey })}
        />
      </View>
    </WithModal>
  );
};

import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import DeclineOrderModal from "./DeclineOrderModal";
import EmptyOrdersListing from "screens/galleryOrders/components/EmptyOrdersListing";
import OrderslistingLoader from "screens/galleryOrders/components/OrderslistingLoader";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import { formatIntlDateTime } from "utils/utils_formatIntlDateTime";
import YearDropdown from "./YearDropdown";
import WithModal from "components/modal/WithModal";
import TabSwitcher from "components/orders/TabSwitcher";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OrderContainer from "components/orders/OrderContainer";
import { ORDERS_QK } from "utils/queryKeys";
import { useOrdersManagement } from "hooks/useOrdersManagement";

const OrderScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [declineModal, setDeclineModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderModalMetadata, setOrderModalMetadata] = useState({
    is_current_order_exclusive: false,
    art_id: "",
    seller_designation: "",
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
    completed,
    currentOrders,
    toggleRecentOrder,
    isInitialLoading,
    isRefreshing,
  } = useOrdersManagement({
    queryKey: ORDERS_QK,
    errorMessage: "Failed to load orders",
  });

  const isArtworkExclusiveDate = (createdAt: string | Date) => {
    const created = new Date(createdAt).getTime();
    const diffDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return diffDays <= 90;
  };

  const artistTabs = [
    { title: "Pending", key: "pending", count: pending?.length ?? 0 },
    { title: "Processing", key: "processing", count: processing?.length ?? 0 },
    { title: "Completed", key: "completed" },
  ];

  return (
    <WithModal>
      <View style={[tw`flex-1 bg-[#F7F7F7]`, { paddingTop: insets.top + 16 }]}>
        <TabSwitcher
          tabs={artistTabs}
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

              <FlatList
                data={currentOrders}
                keyExtractor={(item, index) =>
                  item?.order_id?.toString?.() ?? item?.artwork_data?._id ?? `order-${index}`
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-[30px]`}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => ordersQuery.refetch()}
                    tintColor="#000"
                    colors={["#000"]}
                  />
                }
                renderItem={({ item, index }) => (
                  <OrderContainer
                    id={index}
                    url={item?.artwork_data?.url}
                    open={!!openSection[item.order_id]}
                    setOpen={() => toggleRecentOrder(item.order_id)}
                    artId={item?.order_id}
                    artName={item?.artwork_data?.title}
                    dateTime={formatIntlDateTime(item?.createdAt)}
                    price={utils_formatPrice(item?.artwork_data?.pricing?.usd_price)}
                    status={selectedTab}
                    lastId={index === currentOrders.length - 1}
                    acceptBtn={
                      selectedTab === "pending"
                        ? () =>
                            navigation.navigate("DimensionsDetails", {
                              orderId: item?.order_id,
                            })
                        : undefined
                    }
                    declineBtn={
                      selectedTab === "pending"
                        ? () => {
                            const isExclusive =
                              item?.artwork_data?.exclusivity_status?.exclusivity_type ===
                                "exclusive" && isArtworkExclusiveDate(item?.createdAt);

                            setOrderId(item?.order_id);
                            setOrderModalMetadata({
                              is_current_order_exclusive: isExclusive,
                              art_id: item?.artwork_data?.art_id,
                              seller_designation: item?.seller_designation || "artist",
                            });
                            setDeclineModal(true);
                          }
                        : undefined
                    }
                    delivered={item?.shipping_details?.delivery_confirmed}
                    order_accepted={item?.order_accepted?.status}
                    order_decline_reason={item?.order_accepted?.reason}
                    payment_status={item?.payment_information?.status}
                    tracking_status={item?.shipping_details?.shipment_information?.tracking?.id}
                    trackBtn={() =>
                      navigation.navigate("ShipmentTrackingScreen", {
                        orderId: item?.order_id,
                        tracking_id: item?.shipping_details?.shipment_information?.tracking?.id,
                      })
                    }
                    exclusivity_type={
                      item?.artwork_data?.exclusivity_status?.exclusivity_type || "non-exclusive"
                    }
                  />
                )}
              />
            </>
          )}
        </View>

        <DeclineOrderModal
          isModalVisible={declineModal}
          setIsModalVisible={setDeclineModal}
          orderId={orderId}
          orderModalMetadata={orderModalMetadata}
          refresh={() => queryClient.invalidateQueries({ queryKey: ORDERS_QK })}
        />
      </View>
    </WithModal>
  );
};

export default OrderScreen;

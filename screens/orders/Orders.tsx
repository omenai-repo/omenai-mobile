import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import tw from "twrnc";
import WithModal from "components/modal/WithModal";
import OrderslistingLoader from "screens/galleryOrders/components/OrderslistingLoader";
import TabSwitcher from "components/orders/TabSwitcher";
import EmptyOrdersListing from "screens/galleryOrders/components/EmptyOrdersListing";
import YearDropdown from "screens/artist/orders/YearDropdown";
import OrderContainer from "./components/OrderContainer"; // Make sure this path is correct
import { useNavigation } from "@react-navigation/native";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import { useCollectorOrders } from "hooks/useCollectorOrders";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type OrderTabsTypes = "pending" | "history";

export default function Orders() {
  const navigation = useNavigation<any>();
  const { data, isLoading, isRefetching, refetch } = useCollectorOrders();
  const insets = useSafeAreaInsets();

  const [selectedTab, setSelectedTab] = useState<OrderTabsTypes>("pending");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({});

  // Choose list by tab
  const tabOrders = useMemo(() => {
    if (!data) return [];
    return selectedTab === "pending" ? data.pendingOrders ?? [] : data.completedOrders ?? [];
  }, [data, selectedTab]);

  // Client-side year filter (optional but handy)
  const currentOrders = useMemo(() => {
    if (!Array.isArray(tabOrders)) return [];
    return tabOrders.filter((o) => {
      const dt = new Date(o?.updatedAt ?? o?.createdAt ?? Date.now());
      return dt.getFullYear() === selectedYear;
    });
  }, [tabOrders, selectedYear]);

  // Tabs (guard length)
  const collectorTabs = useMemo(
    () => [
      {
        title: "Orders",
        key: "pending",
        count: data?.pendingOrders?.length ?? 0,
      },
      { title: "Order History", key: "history" },
    ],
    [data?.pendingOrders?.length]
  );

  const toggleRecentOrder = useCallback((key: string | number) => {
    const k = String(key);
    setOpenSection((prev) => ({ ...prev, [k]: !prev[k] }));
  }, []);

  const keyExtractor = useCallback(
    (item: any) => `${item.order_id}::${item.artwork_data?._id ?? "na"}`,
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <OrderContainer
        id={index}
        url={item.artwork_data.url}
        open={!!openSection[item.order_id]}
        setOpen={() => toggleRecentOrder(item.order_id)}
        artId={item.order_id}
        artName={item.artwork_data.title}
        price={utils_formatPrice(item.artwork_data.pricing.usd_price)}
        status={item.status}
        lastId={index === currentOrders.length - 1}
        order_accepted={item.order_accepted.status}
        availability={item.availability}
        delivery_confirmed={item.shipping_details.delivery_confirmed}
        tracking_information={item.shipping_details.shipment_information.tracking}
        payment_information={item.payment_information.status}
        seller_designation={item.seller_designation}
        orderId={item.order_id}
        holdStatus={item.hold_status}
        updatedAt={item.updatedAt}
        order_decline_reason={item.order_accepted.reason}
        trackBtn={() =>
          navigation.navigate("ShipmentTrackingScreen", {
            orderId: item.order_id,
            tracking_id: item.shipping_details.shipment_information.tracking.id,
          })
        }
      />
    ),
    [currentOrders.length, navigation, openSection, toggleRecentOrder]
  );

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <WithModal>
      <View style={[tw`flex-1 bg-[#F7F7F7]`, { paddingTop: insets.top + 16 }]}>
        <TabSwitcher
          tabs={collectorTabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as OrderTabsTypes)}
        />

        <View
          style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[50px] android:mb-[30px]`}
        >
          {isLoading ? (
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
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-[30px]`}
                renderItem={renderItem}
                refreshing={isRefetching}
                onRefresh={onRefresh}
              />
            </>
          )}
        </View>
      </View>
    </WithModal>
  );
}

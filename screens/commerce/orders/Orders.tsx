import React, { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import tw from "twrnc";
import OrderslistingLoader from "#components/orders/shared/OrderslistingLoader";
import TabSwitcher from "#components/orders/TabSwitcher";
import EmptyOrdersListing from "#components/orders/shared/EmptyOrdersListing";
import YearDropdown from "#components/orders/shared/YearDropdown";
import CollectorOrderListItem from "./components/CollectorOrderListItem";
import { useCollectorOrders } from "#hooks/useCollectorOrders";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FilterDropdown from "./components/FilterDropdown";
import { useHighRiskFeatureFlag } from "#hooks/useFeatureFlag";
import type { CollectorOrderPaymentFlags } from "#types/orders";
import type { OrderTabsTypes } from "#types/orders";


export default function Orders() {
  const { data, isLoading, refetch } = useCollectorOrders();
  const insets = useSafeAreaInsets();

  const [selectedTab, setSelectedTab] = useState<OrderTabsTypes>("orders");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({});
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  const { value: isFlutterwavePaymentEnabled, loading: isFlutterwaveLoading } =
    useHighRiskFeatureFlag("flutterwave_payment_enabled");
  const { value: isStripePaymentEnabled, loading: isStripeLoading } =
    useHighRiskFeatureFlag("stripe_payment_enabled");

  const paymentFlags = useMemo<CollectorOrderPaymentFlags>(
    () => ({
      isFlutterwavePaymentEnabled,
      isStripePaymentEnabled,
      areFlagsLoading: isFlutterwaveLoading || isStripeLoading,
    }),
    [
      isFlutterwavePaymentEnabled,
      isStripePaymentEnabled,
      isFlutterwaveLoading,
      isStripeLoading,
    ],
  );

  const tabOrders = useMemo(() => {
    if (!data) return [];
    return selectedTab === "orders"
      ? data.pendingOrders ?? []
      : data.completedOrders ?? [];
  }, [data, selectedTab]);

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const currentOrders = useMemo(() => {
    if (!Array.isArray(tabOrders)) return [];
    return tabOrders.filter((o) => {
      const dt = new Date(o?.updatedAt ?? o?.createdAt ?? Date.now());
      const matchesYear = dt.getFullYear() === selectedYear;

      let matchesStatus = true;
      if (statusFilter !== "all") {
        switch (statusFilter) {
          case "pending":
            matchesStatus = o.order_accepted?.status === "";
            break;
          case "awaiting_payment":
            matchesStatus =
              o.order_accepted?.status === "accepted" &&
              o.payment_information?.status === "pending";
            break;
          case "delivery_in_progress":
            matchesStatus =
              o.order_accepted?.status === "accepted" &&
              o.payment_information?.status === "completed" &&
              !o.shipping_details?.delivery_confirmed;
            break;
          case "completed":
            matchesStatus =
              o.status === "completed" &&
              o.shipping_details?.delivery_confirmed;
            break;
          case "declined":
            matchesStatus = o.order_accepted?.status === "declined";
            break;
        }
      }

      return matchesYear && matchesStatus;
    });
  }, [tabOrders, selectedYear, statusFilter]);

  const collectorTabs = useMemo(
    () => [
      {
        title: "Orders",
        key: "orders",
        count: data?.pendingOrders?.length ?? 0,
      },
      { title: "Order History", key: "history" },
    ],
    [data?.pendingOrders?.length],
  );

  const toggleRecentOrder = useCallback((orderId: string) => {
    setOpenSection((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  }, []);

  const handleTabChange = useCallback((key: any) => {
    setSelectedTab(key);
    setOpenSection({});
  }, []);

  const keyExtractor = useCallback(
    (item: CreateOrderModelTypes) =>
      `${item.order_id}::${item.artwork_data?._id ?? "na"}`,
    [],
  );

  const listLength = currentOrders.length;

  const renderItem = useCallback(
    (row: { item: CreateOrderModelTypes; index: number }) => (
      <CollectorOrderListItem
        item={row.item}
        index={row.index}
        isOpen={!!openSection[row.item.order_id]}
        isLast={row.index === listLength - 1}
        onToggleOpen={toggleRecentOrder}
        paymentFlags={paymentFlags}
      />
    ),
    [openSection, listLength, toggleRecentOrder, paymentFlags],
  );

  const onRefresh = useCallback(async () => {
    setIsPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  }, [refetch]);

  const showFullLoader = isLoading && !data;

  return (
    <View style={[tw`flex-1 bg-[#F7F7F7]`, { paddingTop: insets.top + 16 }]}>
      <TabSwitcher
        tabs={collectorTabs}
        selectedKey={selectedTab}
        setSelectedKey={handleTabChange}
      />

      <View
        style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-sm p-[20px] mt-[20px] mx-[15px] mb-[50px] android:mb-[30px]`}
      >
        <View
          style={[
            tw`flex-row items-center gap-2 mb-6 z-50 w-full`,
            { elevation: 50 },
          ]}
        >
          <FilterDropdown
            data={
              selectedTab === "orders"
                ? [
                    { label: "All Status", value: "all" },
                    { label: "Pending", value: "pending" },
                    { label: "Awaiting Payment", value: "awaiting_payment" },
                    {
                      label: "Delivery in Progress",
                      value: "delivery_in_progress",
                    },
                  ]
                : [
                    { label: "All Status", value: "all" },
                    { label: "Completed", value: "completed" },
                    { label: "Declined", value: "declined" },
                  ]
            }
            selectedValue={statusFilter}
            onSelect={(val) => setStatusFilter(val)}
            style={tw`flex-1`}
          />
          <YearDropdown
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            style={tw`mb-0 w-[120px]`}
          />
        </View>

        {showFullLoader ? (
          <OrderslistingLoader />
        ) : currentOrders.length === 0 ? (
          <EmptyOrdersListing status={selectedTab} />
        ) : (
          <FlatList
            data={currentOrders}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`pb-[30px]`}
            renderItem={renderItem}
            extraData={openSection}
            refreshing={isPullRefreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </View>
  );
}

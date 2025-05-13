import { StyleSheet, Text, View, Platform, Image, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { colors } from 'config/colors.config';
import { getOrdersForUser } from 'services/orders/getOrdersForUser';
import WithModal from 'components/modal/WithModal';
import OrderslistingLoader from 'screens/galleryOrders/components/OrderslistingLoader';
import { useModalStore } from 'store/modal/modalStore';
import tw from 'twrnc';
import TabSwitcher from 'components/orders/TabSwitcher';
import EmptyOrdersListing from 'screens/galleryOrders/components/EmptyOrdersListing';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import YearDropdown from 'screens/artist/orders/YearDropdown';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import OrderContainer from './components/OrderContainer';
import { useOrderStore } from 'store/orders/Orders';

export type OrderTabsTypes = 'pending' | 'history';

export default function Orders() {
  const navigation = useNavigation<any>();
  const { isLoading, setIsLoading, refreshTrigger, selectedTab, setSelectedTab, data, setData } =
    useOrderStore();
  const [refreshing, setRefreshing] = useState(false);
  const [openSection, setOpenSection] = useState<{ [key: number]: boolean }>({});
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { updateModal } = useModalStore();

  const handleRefresh = async () => {
    setRefreshing(true);
    await handleFetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    if (refreshTrigger) {
      handleFetchOrders();
    }
  }, [refreshTrigger]);

  useFocusEffect(
    useCallback(() => {
      handleRefresh(); // Auto refresh when screen gains focus
    }, []),
  );

  const handleFetchOrders = async () => {
    setIsLoading(true);

    const results = await getOrdersForUser();

    if (results?.isOk) {
      const data = results.data;

      const pending_orders = data.filter(
        (order: CreateOrderModelTypes) =>
          !order.shipping_details.delivery_confirmed &&
          order.availability &&
          order.status !== 'completed',
      );
      const completed_orders = data.filter(
        (order: CreateOrderModelTypes) =>
          order.shipping_details.delivery_confirmed ||
          !order.availability ||
          order.status === 'completed',
      );
      setIsLoading(false);
      setData({
        pendingOrders: pending_orders,
        completedOrders: completed_orders,
      });
    } else {
      setIsLoading(false);
      updateModal({
        message: 'Something went wrong fetching orders, reload page',
        modalType: 'error',
        showModal: true,
      });
    }
  };

  const toggleRecentOrder = (key: number) => {
    setOpenSection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getOrders = () => {
    if (selectedTab === 'pending') return data.pendingOrders;
    if (selectedTab === 'history') return data.completedOrders;
    return data.completedOrders;
  };

  const currentOrders = getOrders();

  const collectorTabs = [
    { title: 'Pending', key: 'pending', count: data.pendingOrders.length },
    { title: 'Order History', key: 'history' },
  ];

  return (
    <WithModal>
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <Image
          style={tw.style(`w-[130px] h-[30px] mt-[80px] ml-[20px]`)}
          resizeMode="contain"
          source={require('../../assets/omenai-logo.png')}
        />

        <TabSwitcher
          tabs={collectorTabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as 'pending' | 'history')}
        />

        <View
          style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[140px]`}
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
                keyExtractor={(item) => item.artwork_data._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-[30px]`}
                renderItem={({ item, index }) => (
                  <OrderContainer
                    id={index}
                    url={item.artwork_data.url}
                    open={openSection[item.artwork_data._id]}
                    setOpen={() => toggleRecentOrder(item.artwork_data._id)}
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
                    orderId={item.order_id}
                    holdStatus={item.hold_status}
                    updatedAt={item.updatedAt}
                    trackBtn={() =>
                      navigation.navigate('ShipmentTrackingScreen', { orderId: item.order_id })
                    }
                  />
                )}
              />
            </>
          )}
        </View>
      </View>
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
    paddingTop: Platform.OS === 'android' ? 15 : 10,
    marginBottom: 150,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE8E8',
    borderRadius: 30,
    padding: 10,
    gap: 10,
  },
  tabItem: {
    height: 44,
    flex: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabItemText: {
    color: '#858585',
    fontSize: 14,
  },
  loadingContainer: {
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    paddingTop: 80,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    height: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButtonText: {
    fontSize: 12,
    color: '#858585',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
});

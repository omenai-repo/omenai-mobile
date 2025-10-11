import { FlatList, Image, Text, View, RefreshControl } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import WithModal from 'components/modal/WithModal';
import TabSwitcher from 'components/orders/TabSwitcher';
import OrderslistingLoader from './components/OrderslistingLoader';
import EmptyOrdersListing from './components/EmptyOrdersListing';
import YearDropdown from 'screens/artist/orders/YearDropdown';
import { useModalStore } from 'store/modal/modalStore';
import { getOrdersBySellerId } from 'services/orders/getOrdersBySellerId';
import { organizeOrders } from 'utils/utils_splitArray';
import DeclineOrderModal from 'screens/artist/orders/DeclineOrderModal';
import { OrderContainer } from 'screens/artist/orders/OrderScreen';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GALLERY_ORDERS_QK = ['orders', 'gallery'] as const;

export default function GalleryOrdersListing() {
  const navigation = useNavigation<any>();
  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [selectedTab, setSelectedTab] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [openSection, setOpenSection] = useState<{ [key: string]: boolean }>({});
  const [declineModal, setDeclineModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [orderModalMetadata, setOrderModalMetadata] = useState({
    is_current_order_exclusive: false,
    art_id: '',
    seller_designation: 'gallery',
  });

  // Fetch all gallery orders; UI will split into tabs + filter by year.
  const ordersQuery = useQuery({
    queryKey: GALLERY_ORDERS_QK,
    queryFn: async () => {
      try {
        const res = await getOrdersBySellerId();
        if (!res?.isOk) throw new Error('Failed to fetch orders');
        return Array.isArray(res.data) ? res.data : [];
      } catch (e: any) {
        updateModal({
          message: e?.message ?? 'Failed to fetch orders',
          showModal: true,
          modalType: 'error',
        });
        return [];
      }
    },
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true, // only if stale
    refetchOnReconnect: true, // only if stale
    refetchOnWindowFocus: true, // only if stale
  });

  // Split into tabs once
  const { pending, processing, completed } = useMemo(() => {
    const parsed = organizeOrders(ordersQuery.data ?? []);
    return parsed;
  }, [ordersQuery.data]);

  // Optional: filter rows by year
  const filterByYear = useCallback(
    (arr: any[]) => {
      if (!Array.isArray(arr)) return [];
      return arr.filter((o) => new Date(o.createdAt).getFullYear() === selectedYear);
    },
    [selectedYear],
  );

  const currentOrders =
    selectedTab === 'pending'
      ? filterByYear(pending)
      : selectedTab === 'processing'
      ? filterByYear(processing)
      : filterByYear(completed);

  const galleryTabs = [
    { title: 'Pending', key: 'pending', count: pending?.length ?? 0 },
    { title: 'Processing', key: 'processing', count: processing?.length ?? 0 },
    { title: 'Completed', key: 'completed' },
  ];

  const toggleRecentOrder = (key: string) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isInitialLoading = ordersQuery.isLoading && !ordersQuery.data;
  const isRefreshing = ordersQuery.isFetching && !!ordersQuery.data; // background spinner during refetch

  return (
    <WithModal>
      <View style={tw.style(`flex-1 bg-[#F7F7F7]`, { paddingTop: insets.top + 16 })}>
        {/* <Image
          style={tw.style(`w-[130px] h-[30px] mt-[80px] android:mt-[40px] ml-[20px]`)}
          resizeMode="contain"
          source={require('../../assets/omenai-logo.png')}
        /> */}

        <TabSwitcher
          tabs={galleryTabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as 'pending' | 'processing' | 'completed')}
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
                keyExtractor={(item) => item.order_id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-[30px]`}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => ordersQuery.refetch()}
                    tintColor="#000"
                    colors={['#000']}
                  />
                }
                renderItem={({ item, index }) => (
                  <OrderContainer
                    id={index}
                    url={item.artwork_data.url}
                    open={openSection[item.artwork_data._id]}
                    setOpen={() => toggleRecentOrder(item.artwork_data._id)}
                    artId={item.order_id}
                    artName={item.artwork_data.title}
                    dateTime={formatIntlDateTime(item.createdAt)}
                    price={utils_formatPrice(item.artwork_data.pricing.usd_price)}
                    order_decline_reason={item.order_accepted.reason}
                    status={selectedTab}
                    lastId={index === currentOrders.length - 1}
                    acceptBtn={
                      selectedTab === 'pending'
                        ? () => navigation.navigate('DimentionsDetails', { orderId: item.order_id })
                        : undefined
                    }
                    declineBtn={
                      selectedTab === 'pending'
                        ? () => {
                            setOrderModalMetadata({
                              is_current_order_exclusive: false,
                              art_id: item.artwork_data?.art_id,
                              seller_designation: item.seller_designation || 'gallery',
                            });
                            setOrderId(item.order_id);
                            setDeclineModal(true);
                          }
                        : undefined
                    }
                    delivered={item.shipping_details.delivery_confirmed}
                    order_accepted={item.order_accepted.status}
                    payment_status={item.payment_information.status}
                    tracking_status={item.shipping_details.shipment_information.tracking.id}
                    trackBtn={() =>
                      navigation.navigate('ShipmentTrackingScreen', { orderId: item.order_id })
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
          refresh={() => queryClient.invalidateQueries({ queryKey: GALLERY_ORDERS_QK })}
        />
      </View>
    </WithModal>
  );
}

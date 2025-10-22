import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import DeclineOrderModal from './DeclineOrderModal';
import { organizeOrders } from 'utils/utils_splitArray';
import EmptyOrdersListing from 'screens/galleryOrders/components/EmptyOrdersListing';
import OrderslistingLoader from 'screens/galleryOrders/components/OrderslistingLoader';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import YearDropdown from './YearDropdown';
import { getOrdersBySellerId } from 'services/orders/getOrdersBySellerId';
import { useModalStore } from 'store/modal/modalStore';
import WithModal from 'components/modal/WithModal';
import TabSwitcher from 'components/orders/TabSwitcher';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderContainer from 'components/orders/OrderContainer';
import { OrderStatusKey } from 'types/orders';
import { ORDERS_QK } from 'utils/queryKeys';
import { isArtworkExclusiveDate } from 'utils/utils_orderHelpers';

type OrderModalMetadata = {
  is_current_order_exclusive: boolean;
  art_id: string;
  seller_designation: string;
};

const OrderScreen = () => {
  const navigation = useNavigation<any>();
  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [selectedTab, setSelectedTab] = useState<OrderStatusKey>('pending');
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({});
  const [declineModal, setDeclineModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [orderId, setOrderId] = useState('');
  const [orderModalMetadata, setOrderModalMetadata] = useState<OrderModalMetadata>({
    is_current_order_exclusive: false,
    art_id: '',
    seller_designation: '',
  });

  const ordersQuery = useQuery({
    queryKey: ORDERS_QK,
    queryFn: async () => {
      try {
        const res = await getOrdersBySellerId();
        if (!res?.isOk) throw new Error(res?.body?.message ?? 'Failed to load orders');
        return res.data;
      } catch (err: any) {
        updateModal({
          message: err?.message ?? 'Failed to load orders',
          showModal: true,
          modalType: 'error',
        });
      }
    },
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true, // only if stale
    refetchOnReconnect: true, // only if stale
    refetchOnWindowFocus: true, // only if stale
  });

  // Pull-to-refresh: force a refetch now
  const onRefresh = useCallback(() => ordersQuery.refetch(), [ordersQuery]);

  // Split into tabs (memoized)
  const { pending, processing, completed } = useMemo(() => {
    const parsed = organizeOrders(Array.isArray(ordersQuery.data) ? ordersQuery.data : []);
    return parsed;
  }, [ordersQuery.data]);

  const filterByYear = useCallback(
    (arr: any[]) => {
      if (!Array.isArray(arr)) return [];
      return arr.filter((o) => {
        const dt = new Date(o.createdAt);
        return dt.getFullYear() === selectedYear;
      });
    },
    [selectedYear],
  );

  const currentOrders =
    selectedTab === 'pending'
      ? filterByYear(pending)
      : selectedTab === 'processing'
      ? filterByYear(processing)
      : filterByYear(completed);

  const artistTabs = [
    { title: 'Pending', key: 'pending', count: pending?.length ?? 0 },
    { title: 'Processing', key: 'processing', count: processing?.length ?? 0 },
    { title: 'Completed', key: 'completed' },
  ];

  const toggleRecentOrder = useCallback((key: string) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isInitialLoading = ordersQuery.isLoading && !ordersQuery.data;
  const isRefreshing = ordersQuery.isFetching && !!ordersQuery.data; // background spinner

  return (
    <WithModal>
      <View style={tw.style(`flex-1 bg-[#F7F7F7]`, { paddingTop: insets.top + 16 })}>
        {/* <Image
          style={tw.style(`w-[130px] h-[30px] mt-[80px] android:mt-[40px] ml-[20px]`)}
          resizeMode="contain"
          source={require('../../../assets/omenai-logo.png')}
        /> */}

        <TabSwitcher
          tabs={artistTabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as OrderStatusKey)}
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
                    onRefresh={onRefresh}
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
                            const isExclusive =
                              item?.artwork_data?.exclusivity_status?.exclusivity_type ===
                                'exclusive' && isArtworkExclusiveDate(item.createdAt);

                            setOrderId(item.order_id);
                            setOrderModalMetadata({
                              is_current_order_exclusive: isExclusive,
                              art_id: item.artwork_data?.art_id,
                              seller_designation: item.seller_designation || 'artist',
                            });
                            setDeclineModal(true);
                          }
                        : undefined
                    }
                    delivered={item.shipping_details.delivery_confirmed}
                    order_accepted={item.order_accepted.status}
                    order_decline_reason={item.order_accepted.reason}
                    payment_status={item.payment_information.status}
                    tracking_status={item.shipping_details.shipment_information.tracking.id}
                    trackBtn={() =>
                      navigation.navigate('ShipmentTrackingScreen', {
                        orderId: item.order_id,
                        tracking_id: item.shipping_details.shipment_information.tracking.id,
                      })
                    }
                    exclusivity_type={
                      item?.artwork_data?.exclusivity_status?.exclusivity_type || 'non-exclusive'
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

import { View, Text, Pressable, FlatList, RefreshControl, Image } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import tw from 'twrnc';
import { Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { dropdownIcon, dropUpIcon } from 'utils/SvgImages';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DeclineOrderModal from './DeclineOrderModal';
import { organizeOrders } from 'utils/utils_splitArray';
import EmptyOrdersListing from 'screens/galleryOrders/components/EmptyOrdersListing';
import OrderslistingLoader from 'screens/galleryOrders/components/OrderslistingLoader';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import YearDropdown from './YearDropdown';
import { Ionicons } from '@expo/vector-icons';
import { getOrdersBySellerId } from 'services/orders/getOrdersBySellerId';
import { useModalStore } from 'store/modal/modalStore';
import WithModal from 'components/modal/WithModal';
import TabSwitcher from 'components/orders/TabSwitcher';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// ----------------- Query Key
const ORDERS_QK = ['orders', 'artist'] as const;

function renderStatusBadge({
  status,
  payment_status,
  tracking_status,
  order_accepted,
  delivered,
}: any) {
  const badgeBaseStyle = tw`flex-row items-center px-3 py-1 rounded-full`;
  if (
    status === 'pending' &&
    order_accepted === '' &&
    payment_status === 'pending' &&
    tracking_status === ''
  ) {
    return (
      <View style={[badgeBaseStyle, tw`bg-yellow-100`]}>
        <Ionicons name="time-outline" size={14} color="#92400E" style={tw`mr-1`} />
        <Text style={tw`text-[12px] font-medium text-yellow-800`}>Awaiting acceptance</Text>
      </View>
    );
  }
  if (
    status === 'processing' &&
    order_accepted === 'accepted' &&
    payment_status === 'pending' &&
    tracking_status === ''
  ) {
    return (
      <View style={[badgeBaseStyle, tw`bg-yellow-100`]}>
        <Ionicons name="alert-circle-outline" size={14} color="#92400E" style={tw`mr-1`} />
        <Text style={tw`text-[12px] font-medium text-yellow-800`}>Awaiting payment</Text>
      </View>
    );
  }
  if (
    status === 'processing' &&
    order_accepted === 'accepted' &&
    payment_status === 'completed' &&
    tracking_status === ''
  ) {
    return (
      <View style={[badgeBaseStyle, tw`bg-green-100`]}>
        <Ionicons name="card-outline" size={14} color="#166534" style={tw`mr-1`} />
        <Text style={tw`text-[12px] font-medium text-green-800`}>Payment completed</Text>
      </View>
    );
  }
  if (
    status === 'processing' &&
    order_accepted === 'accepted' &&
    payment_status === 'completed' &&
    tracking_status !== ''
  ) {
    return (
      <View style={[badgeBaseStyle, tw`bg-green-100`]}>
        <Ionicons name="car-outline" size={14} color="#166534" style={tw`mr-1`} />
        <Text style={tw`text-[12px] font-medium text-green-800`}>Delivery in progress</Text>
      </View>
    );
  }
  if (
    status === 'processing' &&
    order_accepted === '' &&
    payment_status === 'pending' &&
    tracking_status === ''
  ) {
    return (
      <View style={[badgeBaseStyle, tw`bg-yellow-100`]}>
        <Ionicons name="information-circle-outline" size={14} color="#92400E" style={tw`mr-1`} />
        <Text style={tw`text-[12px] font-medium text-yellow-800`}>Action required</Text>
      </View>
    );
  }
  if (status === 'completed' && order_accepted === 'declined') {
    return (
      <View style={[badgeBaseStyle, tw`bg-red-200`]}>
        <Ionicons name="close-circle-outline" size={14} color="#991B1B" style={tw`mr-1`} />
        <Text style={tw`text-[12px] font-medium text-red-800`}>Order declined</Text>
      </View>
    );
  }
  if (status === 'completed' && order_accepted === 'accepted' && delivered) {
    return (
      <View style={[badgeBaseStyle, tw`bg-green-100`]}>
        <Ionicons name="checkmark-done-outline" size={14} color="#166534" style={tw`mr-1`} />
        <Text style={tw`text-[12px] font-medium text-green-800`}>Order has been fulfilled</Text>
      </View>
    );
  }
  return null;
}

const renderButtonAction = ({ status, payment_status, tracking_status, order_accepted }: any) => {
  if (
    status === 'processing' &&
    order_accepted === 'accepted' &&
    payment_status === 'pending' &&
    tracking_status === ''
  ) {
    return null;
  }
  if (
    status === 'processing' &&
    order_accepted === 'accepted' &&
    payment_status === 'completed' &&
    tracking_status === ''
  ) {
    return null;
  }
  if (
    status === 'processing' &&
    order_accepted === 'accepted' &&
    payment_status === 'completed' &&
    tracking_status !== ''
  ) {
    return 'track';
  }
  if (
    status === 'pending' &&
    order_accepted === '' &&
    payment_status === 'pending' &&
    tracking_status === ''
  ) {
    return 'action';
  }
  return null;
};

export const OrderContainer = (props: any) => {
  const {
    id,
    open,
    setOpen,
    artId,
    artName,
    price,
    dateTime,
    status,
    lastId,
    declineBtn,
    acceptBtn,
    trackBtn,
    url,
    payment_status,
    tracking_status,
    order_accepted,
    delivered,
    order_decline_reason,
  } = props;

  const image_href = getImageFileView(url, 700);
  const animatedHeight = React.useRef(new Animated.Value(0)).current;
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const wantsButtons = ['track', 'action'].includes(
      renderButtonAction({ status, payment_status, tracking_status, order_accepted }) as any,
    );
    const targetHeight = wantsButtons ? 180 : order_accepted === 'declined' ? 180 : 120;

    if (open) {
      Animated.timing(animatedHeight, {
        toValue: targetHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [open, status, payment_status, tracking_status, order_accepted]);

  return (
    <Pressable
      onPress={() => setOpen(!open)}
      style={tw.style(
        `border-t-[1px] border-l-[1px] border-r-[1px] border-[#E7E7E7] p-[20px]`,
        id === 0 && `rounded-t-[15px]`,
        lastId && `border-b-[1px] rounded-b-[15px]`,
      )}
    >
      <View style={tw`flex-row items-center`}>
        <View style={tw`flex-row items-center gap-[10px] flex-1`}>
          <Image source={{ uri: image_href }} style={tw`h-[42px] w-[42px] rounded-[3px]`} />
          <View style={tw`gap-[5px]`}>
            <Text style={tw`text-[12px] text-[#454545]`}>{artId}</Text>
            <Text style={tw`text-[14px] text-[#454545] font-semibold`}>{artName}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => setOpen(!open)}
          style={tw`border border-[#F6F6F6] bg-[#F6F6F6] justify-center items-center h-[35px] w-[35px] rounded-[8px]`}
        >
          {/* Guard SvgXml prop just in case */}
          {typeof (open ? dropUpIcon : dropdownIcon) === 'string' ? (
            <SvgXml xml={open ? dropUpIcon : dropdownIcon} />
          ) : null}
        </Pressable>
      </View>

      <Animated.View
        style={{ height: animatedHeight, opacity: animatedOpacity, overflow: 'hidden' }}
      >
        <View style={tw`gap-[20px] mt-[15px]`}>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Price</Text>
            <Text style={tw`text-[14px] text-[#454545] font-semibold`}>{price}</Text>
          </View>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Date</Text>
            <Text style={tw`text-[14px] text-[#454545] font-semibold`}>{dateTime}</Text>
          </View>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Status</Text>
            {renderStatusBadge({
              status,
              payment_status,
              tracking_status,
              order_accepted,
              delivered,
            })}
          </View>
          {order_accepted === 'declined' && (
            <Text style={{ color: '#ff0000', fontSize: 14 }}>Reason: {order_decline_reason}</Text>
          )}

          {renderButtonAction({ status, payment_status, tracking_status, order_accepted }) ===
            'track' && (
            <Pressable style={tw`bg-black py-3 px-4 rounded-full items-center`} onPress={trackBtn}>
              <Text style={tw`text-white text-[13px] font-semibold`}>Track this shipment</Text>
            </Pressable>
          )}

          {renderButtonAction({ status, payment_status, tracking_status, order_accepted }) ===
            'action' && (
            <View style={tw`flex-row items-center gap-[30px]`}>
              <Pressable
                onPress={props.declineBtn}
                style={tw`h-[40px] justify-center items-center bg-[#C71C16] rounded-[20px] px-[15px] flex-1`}
              >
                <Text style={tw`text-[13px] text-white font-semibold`}>Decline order</Text>
              </Pressable>
              <Pressable
                onPress={props.acceptBtn}
                style={tw`h-[40px] justify-center items-center bg-[#00C885] rounded-[20px] px-[15px] flex-1`}
              >
                <Text style={tw`text-[13px] text-white font-semibold`}>Accept order</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const OrderScreen = () => {
  const navigation = useNavigation<any>();
  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({});
  const [declineModal, setDeclineModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [orderId, setOrderId] = useState('');

  // Fetch all orders once (per cache lifecycle); UI filters by tab
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

  // (Optional) Filter by year if needed
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
      <View style={tw`flex-1 bg-[#F7F7F7] pt-[80px] android:pt-[40px]`}>
        {/* <Image
          style={tw.style(`w-[130px] h-[30px] mt-[80px] android:mt-[40px] ml-[20px]`)}
          resizeMode="contain"
          source={require('../../../assets/omenai-logo.png')}
        /> */}

        <TabSwitcher
          tabs={artistTabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as 'pending' | 'processing' | 'completed')}
        />

        <View
          style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[140px]`}
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
                            setDeclineModal(true);
                            setOrderId(item.order_id);
                          }
                        : undefined
                    }
                    delivered={item.shipping_details.delivery_confirmed}
                    order_accepted={item.order_accepted.status}
                    order_decline_reason={item.order_accepted.reason}
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
          refresh={() => queryClient.invalidateQueries({ queryKey: ORDERS_QK })}
        />
      </View>
    </WithModal>
  );
};

export default OrderScreen;

import { FlatList, Image, Text, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import WithModal from 'components/modal/WithModal';
import TabSwitcher from 'components/orders/TabSwitcher';
import OrderslistingLoader from './components/OrderslistingLoader';
import EmptyOrdersListing from './components/EmptyOrdersListing';
import YearDropdown from 'screens/artist/orders/YearDropdown';
import { galleryOrdersStore } from 'store/gallery/galleryOrdersStore';
import { useModalStore } from 'store/modal/modalStore';
import { getOrdersBySellerId } from 'services/orders/getOrdersBySellerId';
import { organizeOrders } from 'utils/utils_splitArray';
import DeclineOrderModal from 'screens/artist/orders/DeclineOrderModal';
import { OrderContainer } from 'screens/artist/orders/OrderScreen';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import { utils_formatPrice } from 'utils/utils_priceFormatter';

export default function GalleryOrdersListing() {
  const { data, setData } = galleryOrdersStore();
  const navigation = useNavigation<any>();
  const { updateModal } = useModalStore();

  const [selectedTab, setSelectedTab] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [openSection, setOpenSection] = useState<{ [key: number]: boolean }>({});
  const [declineModal, setDeclineModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // guards
  const inFlightRef = useRef(false);
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleFetchOrders = useCallback(async () => {
    if (inFlightRef.current) return; // single-flight guard
    inFlightRef.current = true;

    // show skeleton only for the very first load
    setIsLoading((prev) => prev || true);

    try {
      const results = await getOrdersBySellerId();
      const raw = results?.data ?? [];

      const parsed = organizeOrders(raw);

      if (!isMountedRef.current) return;
      setData({
        pending: parsed.pending,
        processing: parsed.processing,
        completed: parsed.completed,
      });
    } catch (e: any) {
      if (!isMountedRef.current) return;
      updateModal({
        message: 'Error fetching orders. Please try again.',
        modalType: 'error',
        showModal: true,
      });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        inFlightRef.current = false;
      }
    }
  }, [setData, updateModal]);

  const handleRefresh = useCallback(async () => {
    if (inFlightRef.current) return; // don’t double-run while a fetch is in progress
    setRefreshing(true);
    await handleFetchOrders();
    if (isMountedRef.current) setRefreshing(false);
  }, [handleFetchOrders]);

  useFocusEffect(
    useCallback(() => {
      // Runs once per focus; guarded to avoid double fetches
      handleRefresh();
      // no cleanup needed
    }, [handleRefresh]),
  );

  const toggleRecentOrder = (key: number) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getOrders = () => {
    if (selectedTab === 'pending') return data.pending;
    if (selectedTab === 'processing') return data.processing;
    return data.completed;
  };

  const currentOrders = getOrders();

  const galleryTabs = [
    { title: 'Pending', key: 'pending', count: data.pending.length },
    { title: 'Processing', key: 'processing', count: data.processing.length },
    { title: 'Completed', key: 'completed' },
  ];

  return (
    <WithModal>
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <Image
          style={tw.style(`w-[130px] h-[30px] mt-[80px] android:mt-[40px] ml-[20px]`)}
          resizeMode="contain"
          source={require('../../assets/omenai-logo.png')}
        />

        <TabSwitcher
          tabs={galleryTabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as 'pending' | 'processing' | 'completed')}
        />

        <View
          style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[140px] android:mb-[20px]`}
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
                keyExtractor={(item) => item.order_id}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                contentContainerStyle={tw`pb-[30px]`}
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
                        ? () =>
                            navigation.navigate('DimentionsDetails', {
                              orderId: item.order_id,
                            })
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
          refresh={handleFetchOrders}
        />
      </View>
    </WithModal>
  );
}

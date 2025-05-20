import { View, Text, Pressable, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import tw from 'twrnc';
import { Image } from 'react-native';
import { Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { dropdownIcon, dropUpIcon } from 'utils/SvgImages';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DeclineOrderModal from './DeclineOrderModal';
import { organizeOrders } from 'utils/utils_splitArray';
import { artistOrdersStore } from 'store/artist/artistOrdersStore';
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

function renderStatusBadge({
  status,
  payment_status,
  tracking_status,
  order_accepted,
  delivered,
}: {
  status: string;
  payment_status: string;
  tracking_status: string;
  order_accepted: string;
  delivered: boolean;
}) {
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

const renderButtonAction = ({
  status,
  payment_status,
  tracking_status,
  order_accepted,
}: {
  status: string;
  payment_status: string;
  tracking_status: string;
  order_accepted: string;
}) => {
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

export const OrderContainer = ({
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
}: {
  id: number;
  open: boolean;
  setOpen: (e: boolean) => void;
  artId: string;
  artName: string;
  price: string;
  dateTime: string;
  status: 'pending' | 'processing' | 'completed';
  lastId: boolean;
  declineBtn?: () => void;
  acceptBtn?: () => void;
  trackBtn?: () => void;
  url: string;
  payment_status: string;
  tracking_status: string;
  order_accepted: string;
  delivered: boolean;
}) => {
  let image_href = getImageFileView(url, 700);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(animatedHeight, {
        toValue:
          renderButtonAction({ status, payment_status, tracking_status, order_accepted }) ===
            'track' ||
          renderButtonAction({ status, payment_status, tracking_status, order_accepted }) ===
            'action'
            ? 180
            : 120, // Adjust height based on content
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
  }, [open]);

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
          <SvgXml xml={open ? dropUpIcon : dropdownIcon} />
        </Pressable>
      </View>

      {/* Animated Dropdown */}
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
                onPress={declineBtn}
                style={tw`h-[40px] justify-center items-center bg-[#C71C16] rounded-[20px] px-[15px] flex-1`}
              >
                <Text style={tw`text-[13px] text-white font-semibold`}>Decline order</Text>
              </Pressable>
              <Pressable
                onPress={acceptBtn}
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
  const [selectedTab, setSelectedTab] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [openSection, setOpenSection] = useState<{ [key: number]: boolean }>({});
  const [declineModal, setDeclineModal] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { updateModal } = useModalStore();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [orderId, setOrderId] = useState('');

  const { data, setData } = artistOrdersStore();

  const handleRefresh = async () => {
    setRefreshing(true);
    await handleFetchOrders();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh(); // Auto refresh when screen gains focus
    }, []),
  );

  const handleFetchOrders = async () => {
    const results = await getOrdersBySellerId();
    if (results?.isOk) {
      let data = results?.data;
      const parsedOrders = organizeOrders(data);

      setData({
        pending: parsedOrders.pending,
        processing: parsedOrders.processing,
        completed: parsedOrders.completed,
      });
      setIsloading(false);
    } else {
      setIsloading(false);
      updateModal({
        message: results?.body?.message ?? '',
        showModal: true,
        modalType: 'error',
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
    if (selectedTab === 'pending') return data.pending;
    if (selectedTab === 'processing') return data.processing;
    return data.completed;
  };

  const currentOrders = getOrders();

  const artistTabs = [
    { title: 'Pending', key: 'pending', count: data.pending.length },
    { title: 'Processing', key: 'processing', count: data.processing.length },
    { title: 'Completed', key: 'completed' },
  ];

  return (
    <WithModal>
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <Image
          style={tw.style(`w-[130px] h-[30px] mt-[80px] ml-[20px]`)}
          resizeMode="contain"
          source={require('../../../assets/omenai-logo.png')}
        />

        <TabSwitcher
          tabs={artistTabs}
          selectedKey={selectedTab}
          setSelectedKey={(key) => setSelectedTab(key as 'pending' | 'processing' | 'completed')}
        />

        <View
          style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[140px]`}
        >
          {isloading ? (
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
                    dateTime={formatIntlDateTime(item.createdAt)}
                    price={utils_formatPrice(item.artwork_data.pricing.usd_price)}
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
};

export default OrderScreen;

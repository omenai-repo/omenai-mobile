import { View, Text, Pressable, FlatList, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import tw from 'twrnc';
import { Image } from 'react-native';
import { Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { arrowUpRightWhite, dropdownIcon, dropUpIcon } from 'utils/SvgImages';
import ScrollWrapper from 'components/general/ScrollWrapper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DeclineOrderModal from './DeclineOrderModal';
import { getOverviewOrders } from 'services/orders/getOverviewOrders';
import { organizeOrders } from 'utils/utils_splitArray';
import { artistOrdersStore } from 'store/artist/artistOrdersStore';
import EmptyOrdersListing from 'screens/galleryOrders/components/EmptyOrdersListing';
import OrderslistingLoader from 'screens/galleryOrders/components/OrderslistingLoader';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { formatIntlDateTime } from 'utils/utils_formatIntlDateTime';
import YearDropdown from './YearDropdown';

const TabSwitcher = ({
  selectTab,
  setSelectTab,
  pendingCount = 0,
  processingCount = 0,
}: {
  selectTab: number;
  setSelectTab: (e: number) => void;
  pendingCount?: number;
  processingCount?: number;
}) => {
  const animatedValue = useRef(new Animated.Value(selectTab - 1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: selectTab - 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectTab]);

  const tabWidth = 100 / 3;

  const tabs = [
    { title: 'Pending', count: pendingCount },
    { title: 'Processing', count: processingCount },
    { title: 'Completed', count: 0 },
  ];

  return (
    <View
      style={tw`relative flex-row items-center bg-[#ffff] p-[10px] mt-[30px] mx-[20px] rounded-[56px]`}
    >
      {/* Animated Pill Background */}
      <Animated.View
        style={[
          tw`absolute h-[45px] bg-black rounded-[56px] shadow-md`,
          {
            width: `${tabWidth}%`,
            left: animatedValue.interpolate({
              inputRange: [0, 1, 2],
              outputRange: ['3%', '37%', '69%'],
            }),
          },
        ]}
      />

      {tabs.map((tab, index) => {
        return (
          <Pressable
            key={index}
            onPress={() => setSelectTab(index + 1)}
            style={tw`flex-1 justify-center items-center h-[45px]`}
          >
            <View style={tw`flex-row items-center justify-center relative`}>
              <Animated.Text
                style={[
                  tw`text-[13px] font-medium`,
                  {
                    color: animatedValue.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: ['#00000099', '#FFFFFF', '#00000099'],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              >
                {tab.title}
              </Animated.Text>

              {/* Badge */}
              {tab.count > 0 && (
                <View
                  style={tw`absolute -top-[10px] -right-[16px] bg-red-500 rounded-full px-[6px] py-[2px] z-10`}
                >
                  <Text style={tw`text-white text-[10px] font-bold`}>{tab.count}</Text>
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const RecentOrderContainer = ({
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
  url,
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
  url: string;
}) => {
  let image_href = getImageFileView(url, 700);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(animatedHeight, {
        toValue: status === 'pending' ? 180 : 120, // Adjust height based on content
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

  const statusStyles = {
    pending: {
      bg: '#FFBF0040',
      text: '#1a1a1a',
    },
    processing: {
      bg: '#007AFF20',
      text: '#007AFF',
    },
    completed: {
      bg: '#00C85120',
      text: '#00C851',
    },
  };

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
            <View
              style={tw.style(`rounded-[12px] h-[30px] justify-center items-center px-[12px]`, {
                backgroundColor: statusStyles[status].bg,
              })}
            >
              <Text
                style={tw.style(`text-[12px]`, {
                  color: statusStyles[status]?.text || '#1a1a1a',
                })}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          </View>

          {status === 'pending' && (
            <View style={tw`flex-row items-center gap-[30px]`}>
              <Pressable
                onPress={declineBtn}
                style={tw`h-[40px] justify-center items-center bg-[#C71C16] rounded-[20px] px-[15px] flex-1`}
              >
                <Text style={tw`text-[13px] text-[#fff] font-semibold`}>Decline order</Text>
              </Pressable>
              <Pressable
                onPress={acceptBtn}
                style={tw`h-[40px] justify-center items-center bg-[#00C885] rounded-[20px] px-[15px] flex-1`}
              >
                <Text style={tw`text-[13px] text-[#fff] font-semibold`}>Accept order</Text>
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
  const [selectTab, setSelectTab] = useState(1);
  const [openSection, setOpenSection] = useState<{ [key: number]: boolean }>({});
  const [declineModal, setDeclineModal] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

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
    const results = await getOverviewOrders();
    let data = results?.data;
    const parsedOrders = organizeOrders(data);

    setData({
      pending: parsedOrders.pending,
      processing: parsedOrders.processing,
      completed: parsedOrders.completed,
    });
    setIsloading(false);
  };

  const toggleRecentOrder = (key: number) => {
    setOpenSection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getOrders = () => {
    if (selectTab === 1) return data.pending;
    if (selectTab === 2) return data.processing;
    return data.completed;
  };

  const currentOrders = getOrders();
  const status = selectTab === 1 ? 'pending' : selectTab === 2 ? 'processing' : 'completed';

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <Image
        style={tw.style(`w-[130px] h-[30px] mt-[80px] ml-[20px]`)}
        resizeMode="contain"
        source={require('../../../assets/omenai-logo.png')}
      />

      <TabSwitcher
        selectTab={selectTab}
        setSelectTab={setSelectTab}
        pendingCount={data.pending.length}
        processingCount={data.processing.length}
      />

      <View
        style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[140px]`}
      >
        {isloading ? (
          <OrderslistingLoader />
        ) : currentOrders.length === 0 ? (
          <EmptyOrdersListing status={status} />
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
                <RecentOrderContainer
                  id={index}
                  url={item.artwork_data.url}
                  open={openSection[item.artwork_data._id]}
                  setOpen={() => toggleRecentOrder(item.artwork_data._id)}
                  artId={item.order_id}
                  artName={item.artwork_data.title}
                  dateTime={formatIntlDateTime(item.createdAt)}
                  price={utils_formatPrice(item.artwork_data.pricing.usd_price)}
                  status={status}
                  lastId={index === currentOrders.length - 1}
                  acceptBtn={
                    status === 'pending'
                      ? () =>
                          // navigation.navigate('DimentionsDetails', {
                          //   orderId: item.order_id,
                          // })
                          navigation.navigate('ShipmentTrackingScreen')
                      : undefined
                  }
                  declineBtn={status === 'pending' ? () => setDeclineModal(true) : undefined}
                />
              )}
            />
          </>
        )}
      </View>

      <DeclineOrderModal
        isModalVisible={declineModal}
        setIsModalVisible={setDeclineModal}
        confirmBtn={() => {}}
      />
    </View>
  );
};

export default OrderScreen;

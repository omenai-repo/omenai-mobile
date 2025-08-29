import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, RefreshControl, Image, Pressable } from 'react-native';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { dropdownIcon, dropUpIcon, arrowUpRightWhite } from 'utils/SvgImages';
import Header from 'components/header/Header';
import ScrollWrapper from 'components/general/ScrollWrapper';
import SalesOverview from 'screens/overview/components/SalesOverview';
import { Animated } from 'react-native';
import { getOverviewOrders } from 'services/orders/getOverviewOrders';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { getImageFileView } from 'lib/storage/getImageFileView';
import OrderslistingLoader from 'screens/galleryOrders/components/OrderslistingLoader';
import { HighlightCard } from './HighlightCard';
import { useFocusEffect } from '@react-navigation/native';

export const RecentOrderContainer = ({
  id,
  open,
  setOpen,
  artId,
  artName,
  price,
  buyerName,
  status,
  lastId,
  url,
}: {
  id: number;
  open: boolean;
  setOpen: () => void;
  artId: string;
  artName: string;
  price: string;
  buyerName: string;
  status: 'pending' | 'processing' | 'completed' | 'history';
  lastId: boolean;
  url: string;
}) => {
  const image_href = getImageFileView(url, 700);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(animatedHeight, {
        toValue: 120,
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
    pending: { bg: '#FFBF0040', text: '#1a1a1a' },
    processing: { bg: '#007AFF20', text: '#007AFF' },
    completed: { bg: '#00C85120', text: '#00C851' },
    history: { bg: '#00C85120', text: '#00C851' },
  };

  return (
    <View
      style={tw.style(
        `border-t border-l border-r border-[#E7E7E7] p-[20px]`,
        id === 0 && `rounded-t-[15px]`,
        lastId && `border-b rounded-b-[15px]`,
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
          onPress={setOpen}
          style={tw`border border-[#F6F6F6] bg-[#F6F6F6] justify-center items-center h-[35px] w-[35px] rounded-[8px]`}
        >
          <SvgXml xml={open ? dropUpIcon : dropdownIcon} />
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
          {buyerName && (
            <View style={tw`flex-row items-center gap-[20px]`}>
              <Text style={tw`text-[14px] text-[#737373]`}>Buyer</Text>
              <Text style={tw`text-[14px] text-[#454545] font-semibold`}>{buyerName}</Text>
            </View>
          )}
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Status</Text>
            <View
              style={tw.style(`rounded-[12px] h-[30px] justify-center items-center px-[12px]`, {
                backgroundColor: statusStyles[status].bg,
              })}
            >
              <Text style={tw.style(`text-[12px]`, { color: statusStyles[status]?.text })}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const ArtistOverview = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [openSection, setOpenSection] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = useCallback(async () => {
    // When called by initial mount, show main loader
    // When called by pull-to-refresh, we’ll manage refreshing separately
    try {
      if (!refreshing) setIsLoading(true);
      const results = await getOverviewOrders();
      setData(results?.isOk ? results.data : []);
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [refreshing]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchRecentOrders();
    } finally {
      setRefreshing(false);
    }
  }, [fetchRecentOrders]);

  const toggleRecentOrder = useCallback((key: number) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header />

        {/* Highlight Cards */}
        <HighlightCard refreshCount={refreshing} />

        <SalesOverview refreshCount={refreshing} />

        {/* Recent Orders */}
        {data.length !== 0 && (
          <View
            style={tw`border border-[#E7E7E7] bg-[#FFFFFF] rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[150px]`}
          >
            <View style={tw`flex-row items-center mb-[25px]`}>
              <Text style={tw`text-[16px] text-[#454545] font-semibold flex-1`}>Recent Orders</Text>
              {!isLoading && (
                <View style={tw`flex-row items-center gap-[3px]`}>
                  <Text style={tw`text-[12px] text-[#3D3D3D] font-semibold`}>Show All</Text>
                  <SvgXml xml={arrowUpRightWhite} />
                </View>
              )}
            </View>

            {isLoading ? (
              <OrderslistingLoader />
            ) : (
              data.map((item, index) => (
                <RecentOrderContainer
                  key={index}
                  id={index}
                  url={item.artwork_data.url}
                  open={openSection[item.artwork_data._id]}
                  setOpen={() => toggleRecentOrder(item.artwork_data._id)}
                  artId={item.order_id}
                  artName={item.artwork_data.title}
                  buyerName={item.buyer_details.name}
                  price={utils_formatPrice(item.artwork_data.pricing.usd_price)}
                  status={item.status}
                  lastId={index === data.length - 1}
                />
              ))
            )}
          </View>
        )}

        {data.length === 0 && !isLoading && (
          <>
            <Text style={tw`text-[16px] text-[#454545] font-semibold mt-[20px] mx-[15px]`}>
              Recent Orders
            </Text>
            <View
              style={tw`border border-[#00000033] bg-[#fff] rounded-[25px] px-[100px] py-[120px] mt-[20px] mx-[15px] mb-[150px]`}
            >
              <View
                style={tw`items-center justify-center py-[15px] px-[15px] bg-[#f5f5f5] rounded-[40px]`}
              >
                <Text style={tw`text-[16px] text-center`}>No Recent Orders</Text>
              </View>
            </View>
          </>
        )}
      </ScrollWrapper>
    </View>
  );
};

export default ArtistOverview;

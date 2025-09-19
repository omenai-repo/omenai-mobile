// screens/overview/ArtistOverview.tsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, RefreshControl, Image, Pressable, Animated } from 'react-native';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { dropdownIcon, dropUpIcon, arrowUpRightWhite } from 'utils/SvgImages';
import Header from 'components/header/Header';
import ScrollWrapper from 'components/general/ScrollWrapper';
import SalesOverview from 'screens/overview/components/SalesOverview';
import OrderslistingLoader from 'screens/galleryOrders/components/OrderslistingLoader';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { HighlightCard } from './HighlightCard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOverviewOrders } from 'services/orders/getOverviewOrders';

export const QK = {
  highlight: (slice: 'sales' | 'net' | 'revenue' | 'balance') =>
    ['overview', 'highlight', slice] as const,
  salesOverview: ['overview', 'salesOverview'] as const,
  overviewOrders: ['overview', 'orders', 'recent'] as const,
};

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

  React.useEffect(() => {
    const to = open ? 120 : 0;
    Animated.timing(animatedHeight, { toValue: to, duration: 300, useNativeDriver: false }).start();
    Animated.timing(animatedOpacity, {
      toValue: open ? 1 : 0,
      duration: open ? 200 : 150,
      useNativeDriver: false,
    }).start();
  }, [open, animatedHeight, animatedOpacity]);

  const statusStyles = {
    pending: { bg: '#FFBF0040', text: '#1a1a1a' },
    processing: { bg: '#007AFF20', text: '#007AFF' },
    completed: { bg: '#00C85120', text: '#00C851' },
    history: { bg: '#00C85120', text: '#00C851' },
  } as const;

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
          {!!buyerName && (
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
              <Text style={tw.style(`text-[12px]`, { color: statusStyles[status].text })}>
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
  const queryClient = useQueryClient();
  const [openSection, setOpenSection] = useState<Record<number, boolean>>({});

  // Recent orders via query
  const ordersQuery = useQuery({
    queryKey: QK.overviewOrders,
    queryFn: async () => {
      const res = await getOverviewOrders();
      return res?.isOk ? res.data : [];
    },
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const isLoadingOrders = ordersQuery.isLoading && !ordersQuery.data;
  const data = ordersQuery.data ?? [];

  const isAnyFetching = ordersQuery.isFetching; // You can OR in other components’ isFetching if you want a unified spinner

  const onRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QK.highlight('sales') }),
      queryClient.invalidateQueries({ queryKey: QK.highlight('net') }),
      queryClient.invalidateQueries({ queryKey: QK.highlight('revenue') }),
      queryClient.invalidateQueries({ queryKey: QK.highlight('balance') }),
      queryClient.invalidateQueries({ queryKey: QK.salesOverview }),
      queryClient.invalidateQueries({ queryKey: QK.overviewOrders }),
    ]);
  }, [queryClient]);

  const toggleRecentOrder = useCallback((key: number) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isAnyFetching} onRefresh={onRefresh} />}
      >
        <Header />

        {/* Highlight Cards & Sales chart use their own queries and report loading via onLoadingChange if needed */}
        <HighlightCard />
        <SalesOverview />

        {/* Recent Orders */}
        {data.length !== 0 && (
          <View
            style={tw`border border-[#E7E7E7] bg-[#FFFFFF] rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[150px]`}
          >
            <View style={tw`flex-row items-center mb-[25px]`}>
              <Text style={tw`text-[16px] text-[#454545] font-semibold flex-1`}>Recent Orders</Text>
              {!isLoadingOrders && (
                <View style={tw`flex-row items-center gap-[3px]`}>
                  <Text style={tw`text-[12px] text-[#3D3D3D] font-semibold`}>Show All</Text>
                  <SvgXml xml={arrowUpRightWhite} />
                </View>
              )}
            </View>

            {isLoadingOrders ? (
              <OrderslistingLoader />
            ) : (
              data.map((item: any, index: number) => (
                <RecentOrderContainer
                  key={index}
                  id={index}
                  url={item.artwork_data.url}
                  open={!!openSection[item.artwork_data._id]}
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

        {data.length === 0 && !isLoadingOrders && (
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

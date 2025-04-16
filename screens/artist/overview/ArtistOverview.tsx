import { View, Text, RefreshControl, Image, Pressable } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import tw from 'twrnc';
import Header from 'components/header/Header';
import { SvgXml } from 'react-native-svg';
import {
  arrowUpRight,
  arrowUpRightWhite,
  bullishArrow,
  dropdownIcon,
  dropUpIcon,
} from 'utils/SvgImages';
import ScrollWrapper from 'components/general/ScrollWrapper';
import SalesOverview from 'screens/overview/components/SalesOverview';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchHighlightData } from 'services/overview/fetchHighlightData';
import { getWalletBalance } from 'services/overview/getWalletBalance';
import { useAppStore } from 'store/app/appStore';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { getOverviewOrders } from 'services/orders/getOverviewOrders';

// const data = [
//   {
//     id: 1,
//     artId: '021231',
//     artworkName: 'The Milwalk Art (Green)',
//     price: '$32,032',
//     buyerName: 'Moses Khan',
//     status: 'Pending',
//   },
//   {
//     id: 2,
//     artId: '021231',
//     artworkName: 'The Milwalk Art (Green)',
//     price: '$32,032',
//     buyerName: 'Moses Khan',
//     status: 'Pending',
//   },
//   {
//     id: 3,
//     artId: '021231',
//     artworkName: 'The Milwalk Art (Green)',
//     price: '$32,032',
//     buyerName: 'Moses Khan',
//     status: 'Pending',
//   },
//   {
//     id: 4,
//     artId: '021231',
//     artworkName: 'The Milwalk Art (Green)',
//     price: '$32,032',
//     buyerName: 'Moses Khan',
//     status: 'Pending',
//   },
// ];

const OverviewContainer = ({
  label,
  amount,
  isTotalArtworks,
}: {
  label: string;
  amount: string;
  isTotalArtworks: boolean;
}) => {
  return (
    <View
      style={tw`bg-[#000000] min-h-[60px] border border-[#E7E7E7] p-[20px] rounded-[20px] flex-1`}
    >
      <View style={tw`flex-row items-center gap-[10px]`}>
        <Text style={tw`text-[16px] text-[#FFFFFF] font-medium flex-1`}>{label}</Text>
        {/* <SvgXml xml={arrowUpRight} /> */}
      </View>

      <Text style={tw`text-[24px] text-[#FFFFFF] font-semibold mt-[10px]`}>{amount}</Text>

      {/* {isTotalArtworks && (
        <View style={tw`flex-row items-center gap-[5px] mt-[5px]`}>
          <View style={tw`flex-row items-center`}>
            <SvgXml xml={bullishArrow} />
            <Text style={tw`text-[12px] text-[#04910C] font-bold`}>10.6%</Text>
          </View>
          <Text style={tw`text-[12px] text-[#FFFFFF]`}>From last week</Text>
        </View>
      )} */}
    </View>
  );
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
  setOpen: (e: boolean) => void;
  artId: string;
  artName: string;
  price: string;
  buyerName: string;
  status: string;
  lastId: boolean;
  url: string;
}) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(animatedHeight, {
        toValue: 120, // Adjust height based on content
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
    <View
      style={tw.style(
        `border-t-[1px] border-l-[1px] border-r-[1px] border-[#E7E7E7] p-[20px]`,
        id === 1 && `rounded-t-[15px]`,
        lastId && `border-b-[1px] rounded-b-[15px]`,
      )}
    >
      <View style={tw`flex-row items-center`}>
        <View style={tw`flex-row items-center gap-[10px] flex-1`}>
          <Image source={{ uri: url }} style={tw`h-[42px] w-[42px] rounded-[3px]`} />
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
            <Text style={tw`text-[14px] text-[#323130] font-bold`}>{price}</Text>
          </View>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Buyer</Text>
            <Text style={tw`text-[14px] text-[#323130] font-bold`}>{buyerName}</Text>
          </View>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Status</Text>
            <View
              style={tw`rounded-[12px] h-[30px] justify-center items-center bg-[#F3FFC8] px-[12px]`}
            >
              <Text style={tw`text-[12px] font-bold text-[#28B652]`}>{status}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const ArtistOverview = () => {
  const { userSession } = useAppStore();
  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [openSection, setOpenSection] = useState<{ [key: number]: boolean }>({});
  const [totalArtwork, setTotalArtwork] = useState(0);
  const [walletBal, setWalletBal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    handleFetchHighlightData();
    handleFetchWalletBal();
  }, [refreshCount]);

  const handleFetchHighlightData = async () => {
    // setIsLoading(true)
    let data1 = await fetchHighlightData('artworks');
    setTotalArtwork(data1);
    setIsLoading(false);
  };

  const handleFetchWalletBal = async () => {
    // setIsLoading(true)
    let data1 = await getWalletBalance({ id: userSession.id });
    setWalletBal(data1.balances.available);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);

    async function handleFetchRecentOrders() {
      try {
        const results = await getOverviewOrders();
        if (results?.isOk) {
          const data = results.data;
          setData(data);
        } else {
          setData([]);
        }
      } catch (error) {
        // console.error("Error fetching recent orders:", error);
        setData([]); // Handle errors gracefully
      } finally {
        setIsLoading(false); // Ensure loading is turned off
      }
    }

    handleFetchRecentOrders();
  }, [refreshCount]);

  const onRefresh = useCallback(() => {
    // setRefreshing(true);
    setRefreshCount((prev) => prev + 1);
  }, []);

  const toggleRecentOrder = (key: number) => {
    setOpenSection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header />

        <View style={tw`flex-row items-center gap-[20px] mx-[15px] mt-[30px] mb-[20px]`}>
          <OverviewContainer
            label="Total Artworks"
            amount={totalArtwork.toString()}
            isTotalArtworks={true}
          />
          <OverviewContainer
            label="Wallet Balance"
            amount={`${utils_formatPrice(walletBal)}`}
            isTotalArtworks={false}
          />
        </View>

        <SalesOverview refreshCount={refreshCount} userType="artist" />

        {data.length !== 0 && (
          <View
            style={tw`border border-[#E7E7E7] bg-[#FFFFFF] rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[150px]`}
          >
            <View style={tw`flex-row items-center mb-[25px]`}>
              <Text style={tw`text-[16px] text-[#454545] font-semibold flex-1`}>Recent Orders</Text>
              <View style={tw`flex-row items-center gap-[3px]`}>
                <Text style={tw`text-[12px] text-[#3D3D3D] font-semibold`}>Show All</Text>
                <SvgXml xml={arrowUpRightWhite} />
              </View>
            </View>
            {data.map((item, index) => {
              return (
                <RecentOrderContainer
                  key={index}
                  id={index}
                  url={item.artwork_data.url}
                  open={openSection[index]}
                  setOpen={() => toggleRecentOrder(index)}
                  artId={item.artId}
                  artName={item.artwork_data.title}
                  buyerName={'john doe'}
                  price={utils_formatPrice(item.artwork_data.pricing.usd_price)}
                  status={item.order_accepted.status}
                  lastId={index === data[data.length - 1].id}
                />
              );
            })}
          </View>
        )}

        {data.length === 0 && (
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

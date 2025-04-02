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

const data = [
  {
    id: 1,
    artId: '021231',
    artworkName: 'The Milwalk Art (Green)',
    price: '$32,032',
    buyerName: 'Moses Khan',
    status: 'Pending',
  },
  {
    id: 2,
    artId: '021231',
    artworkName: 'The Milwalk Art (Green)',
    price: '$32,032',
    buyerName: 'Moses Khan',
    status: 'Pending',
  },
  {
    id: 3,
    artId: '021231',
    artworkName: 'The Milwalk Art (Green)',
    price: '$32,032',
    buyerName: 'Moses Khan',
    status: 'Pending',
  },
  {
    id: 4,
    artId: '021231',
    artworkName: 'The Milwalk Art (Green)',
    price: '$32,032',
    buyerName: 'Moses Khan',
    status: 'Pending',
  },
];

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
    <View style={tw`bg-[#000000] border border-[#E7E7E7] p-[20px] rounded-[20px] flex-1`}>
      <View style={tw`flex-row items-center gap-[10px]`}>
        <Text style={tw`text-[16px] text-[#FFFFFF] font-semibold flex-1`}>{label}</Text>
        <SvgXml xml={arrowUpRight} />
      </View>

      <Text style={tw`text-[24px] text-[#FFFFFF] font-semibold mt-[35px]`}>{amount}</Text>
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

const RecentOrderContainer = ({
  open,
  setOpen,
  artId,
  artName,
  price,
  buyerName,
  status,
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  artId: string;
  artName: string;
  price: string;
  buyerName: string;
  status: string;
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
    <View style={tw`border border-[#E7E7E7] p-[20px]`}>
      <View style={tw`flex-row items-center`}>
        <View style={tw`flex-row items-center gap-[10px] flex-1`}>
          <Image
            source={require('../../assets/images/acrylic_art.jpg')}
            style={tw`h-[42px] w-[42px] rounded-[3px]`}
          />
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
  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [openSection, setOpenSection] = useState<{ [key: number]: boolean }>({});

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
          <OverviewContainer label="Total Artworks Sold" amount="$81.000" isTotalArtworks={true} />
          <OverviewContainer label="Available Balance" amount="$5,000" isTotalArtworks={false} />
        </View>

        <SalesOverview refreshCount={refreshCount} userType="artist" />

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
          {data.map((item) => {
            return (
              <RecentOrderContainer
                key={item.id}
                open={openSection[item.id]}
                setOpen={() => toggleRecentOrder(item.id)}
                artId={item.artId}
                artName={item.artworkName}
                buyerName={item.buyerName}
                price={item.price}
                status={item.status}
              />
            );
          })}
        </View>
      </ScrollWrapper>
    </View>
  );
};

export default ArtistOverview;

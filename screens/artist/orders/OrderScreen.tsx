import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import tw from 'twrnc';
import { Image } from 'react-native';
import { Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { arrowUpRightWhite, dropdownIcon, dropUpIcon } from 'utils/SvgImages';
import ScrollWrapper from 'components/general/ScrollWrapper';
import { useNavigation } from '@react-navigation/native';
import DeclineOrderModal from './DeclineOrderModal';

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
  {
    id: 5,
    artId: '021231',
    artworkName: 'The Milwalk Art (Green)',
    price: '$32,032',
    buyerName: 'Moses Khan',
    status: 'Pending',
  },
  {
    id: 6,
    artId: '021231',
    artworkName: 'The Milwalk Art (Green)',
    price: '$32,032',
    buyerName: 'Moses Khan',
    status: 'Pending',
  },
  {
    id: 7,
    artId: '021231',
    artworkName: 'The Milwalk Art (Green)',
    price: '$32,032',
    buyerName: 'Moses Khan',
    status: 'Pending',
  },
  {
    id: 8,
    artId: '021231',
    artworkName: 'The Milwalk Art (Green)',
    price: '$32,032',
    buyerName: 'Moses Khan',
    status: 'Pending',
  },
];

const TabSwitcher = ({
  selectTab,
  setSelectTab,
}: {
  selectTab: number;
  setSelectTab: (e: number) => void;
}) => {
  const animatedValue = useRef(new Animated.Value(selectTab - 1)).current; // Start at current tab index

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: selectTab - 1, // Convert tab index to animation position
      duration: 300, // Smooth transition
      useNativeDriver: false, // Background color interpolation doesn't support native driver
    }).start();
  }, [selectTab]);

  const tabWidth = 100 / 3; // Assuming 3 tabs, each takes 1/3rd of the width

  return (
    <View style={tw`relative flex-row items-center bg-[#FFFFFF] p-[20px] mt-[30px] gap-[20px]`}>
      {/* Animated Indicator */}
      <Animated.View
        style={[
          tw`absolute h-[40px] bg-[#000] rounded-[56px]`,
          {
            width: `${tabWidth}%`,
            left: animatedValue.interpolate({
              inputRange: [0, 1, 2],
              outputRange: ['3%', '38%', '73%'],
            }),
          },
        ]}
      />

      {/* Tabs */}
      {['Pending', 'Completed', 'In Progress'].map((tab, index) => (
        <Pressable
          key={index}
          onPress={() => setSelectTab(index + 1)}
          style={tw`flex-1 h-[40px] justify-center items-center rounded-[56px]`}
        >
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
            {tab}
          </Animated.Text>
        </Pressable>
      ))}
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
  buyerName,
  status,
  lastId,
  declineBtn,
  acceptBtn,
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
  declineBtn?: () => void;
  acceptBtn?: () => void;
}) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(animatedHeight, {
        toValue: 180, // Adjust height based on content
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
        id === 1 && `rounded-t-[15px]`,
        lastId && `border-b-[1px] rounded-b-[15px]`,
      )}
    >
      <View style={tw`flex-row items-center`}>
        <View style={tw`flex-row items-center gap-[10px] flex-1`}>
          <Image
            source={require('../../../assets/images/acrylic_art.jpg')}
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
              style={tw`rounded-[12px] h-[30px] justify-center items-center bg-[#FFBF0040] px-[12px]`}
            >
              <Text style={tw`text-[12px] font-bold text-[#1a1a1a]`}>{status}</Text>
            </View>
          </View>

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

  const toggleRecentOrder = (key: number) => {
    setOpenSection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <Image
        style={tw.style(`w-[130px] h-[30px] mt-[80px] ml-[20px]`)}
        resizeMode="contain"
        source={require('../../../assets/omenai-logo.png')}
      />

      <TabSwitcher selectTab={selectTab} setSelectTab={setSelectTab} />

      <View
        style={tw`border border-[#E7E7E7] bg-[#FFFFFF] flex-1 rounded-[25px] p-[20px] mt-[20px] mx-[15px] mb-[140px]`}
      >
        <Text style={tw`text-[16px] text-[#454545] font-semibold mb-[25px]`}>Your Orders</Text>
        <ScrollWrapper showsVerticalScrollIndicator={false}>
          {data.map((item) => {
            return (
              <RecentOrderContainer
                key={item.id}
                id={item.id}
                open={openSection[item.id]}
                setOpen={() => toggleRecentOrder(item.id)}
                artId={item.artId}
                artName={item.artworkName}
                buyerName={item.buyerName}
                price={item.price}
                status={item.status}
                lastId={item.id === data[data.length - 1].id}
                acceptBtn={() => navigation.navigate('DimentionsDetails')}
                declineBtn={() => setDeclineModal(true)}
              />
            );
          })}
        </ScrollWrapper>
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

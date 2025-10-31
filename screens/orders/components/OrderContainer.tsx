// RecentOrderContainer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import tw from 'twrnc';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { dropdownIcon, dropUpIcon } from 'utils/SvgImages';
import StatusPill from './StatusPill';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { screenName } from 'constants/screenNames.constants';
import ConfirmOrderDeliveryModal from './ConfirmOrderDeliveryModal';

interface OrderContainerProps {
  id: number;
  open: boolean;
  setOpen: (e: boolean) => void;
  artId: string;
  artName: string;
  price: string;
  status: 'pending' | 'processing' | 'completed';
  lastId: boolean;
  url: string;
  payment_information: string;
  tracking_information: {
    id: string;
    link: string;
  };
  order_accepted: string;
  delivery_confirmed: boolean;
  availability: boolean;
  orderId: string;
  holdStatus: HoldStatus | null;
  updatedAt: string;
  trackBtn: () => void;
  order_decline_reason?: string;
}

const OrderContainer: React.FC<OrderContainerProps> = ({
  id,
  open,
  setOpen,
  artId,
  artName,
  price,
  status,
  lastId,
  url,
  payment_information,
  tracking_information,
  order_accepted,
  delivery_confirmed,
  availability,
  orderId,
  holdStatus,
  updatedAt,
  trackBtn,
  order_decline_reason = '',
}) => {
  const image_href = getImageFileView(url, 700);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [confirmOrderModal, setConfirmOrderModal] = useState(false);

  const expiresAt = holdStatus
    ? new Date(holdStatus.hold_end_date)
    : new Date(new Date(updatedAt).getTime() + 24 * 60 * 60 * 1000);

  useEffect(() => {
    const targetTime = expiresAt.getTime();
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeLeft = targetTime - currentTime;

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        setRemainingTime(0);
      } else {
        setRemainingTime(timeLeft);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderCountdownTimer = () => {
    if (payment_information === 'pending' && order_accepted === 'accepted' && remainingTime > 0) {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 14, color: 'red' }}>
            Hold expires in: {formatTime(remainingTime)}
          </Text>
        </View>
      );
    }
    return null;
  };

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      // Calculate height based on current state
      const baseHeight =
        status === 'completed' ? 80 : !order_accepted ? 80 : delivery_confirmed ? 80 : 140;

      // Start animations together
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: baseHeight,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Close animations
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [open]);

  return (
    <View
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

      {renderCountdownTimer()}

      <Animated.View
        style={{ height: animatedHeight, opacity: animatedOpacity, overflow: 'hidden' }}
      >
        <View style={tw`gap-[20px] mt-[15px]`}>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Price</Text>
            <Text style={tw`text-[14px] text-[#454545] font-semibold`}>{price}</Text>
          </View>
          <View style={tw`flex-row items-center gap-[20px]`}>
            <Text style={tw`text-[14px] text-[#737373]`}>Status</Text>
            <View style={{ flexWrap: 'wrap' }}>
              <StatusPill
                status={status}
                payment_status={payment_information}
                tracking_status={tracking_information.link}
                order_accepted={order_accepted}
                delivery_confirmed={delivery_confirmed}
                availability={availability}
              />
            </View>
          </View>
          {order_accepted === 'declined' && (
            <Text style={{ color: '#ff0000', fontSize: 14 }}>Reason: {order_decline_reason}</Text>
          )}
          {availability &&
            payment_information === 'pending' &&
            order_accepted === 'accepted' &&
            remainingTime > 0 && (
              <FittedBlackButton
                height={40}
                value="Pay now"
                onClick={() =>
                  navigation.navigate(screenName.payment, {
                    id: orderId,
                  })
                }
                isDisabled={false}
              />
            )}
          {availability &&
            payment_information === 'completed' &&
            !delivery_confirmed &&
            tracking_information.link && (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  onPress={trackBtn}
                  style={tw`h-[35px] w-[35px] bg-[#000] rounded-full justify-center items-center`}
                >
                  <Ionicons name="location-outline" size={18} color="#fff" />
                </Pressable>
                <FittedBlackButton
                  height={35}
                  value="Confirm order delivery"
                  onClick={() => setConfirmOrderModal(true)}
                  isDisabled={false}
                  fontSize={12}
                  bgColor="#16A34A"
                />
              </View>
            )}
          {availability &&
            payment_information === 'completed' &&
            order_accepted === 'accepted' &&
            status !== 'completed' &&
            !tracking_information.link && (
              <View style={{ padding: 10, backgroundColor: '#f3f3f3', borderRadius: 91 }}>
                <Text style={{ color: '#666', textAlign: 'center' }}>
                  Awaiting tracking information
                </Text>
              </View>
            )}
        </View>

        <ConfirmOrderDeliveryModal
          orderId={orderId}
          modalVisible={confirmOrderModal}
          setModalVisible={setConfirmOrderModal}
        />
      </Animated.View>
    </View>
  );
};

export default OrderContainer;

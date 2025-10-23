import React, { memo } from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import type { StatusBadgeProps } from 'types/orders';

const StatusBadgeBase = ({
  status,
  payment_status,
  tracking_status,
  order_accepted,
  delivered,
}: StatusBadgeProps) => {
  const badgeBaseStyle = tw`flex-row items-center px-3 py-1 rounded-full`;

  if (
    status === 'pending' &&
    (order_accepted ?? '') === '' &&
    payment_status === 'pending' &&
    !tracking_status
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
    !tracking_status
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
    !tracking_status
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
    tracking_status
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
    (order_accepted ?? '') === '' &&
    payment_status === 'pending' &&
    !tracking_status
  ) {
    return (
      <View style={[badgeBaseStyle, tw`bg-yellow-100`]}>
        <Ionicons name="information-circle-outline" size={14} color="#92400E" style={tw`mr-1`} />
        <Text style={tw`text-[12px] font-medium text-yellow-800`}>Action required</Text>
      </View>
    );
  }

  if ((order_accepted ?? '') === 'declined') {
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
};

export const StatusBadge = memo(StatusBadgeBase);
export default StatusBadge;

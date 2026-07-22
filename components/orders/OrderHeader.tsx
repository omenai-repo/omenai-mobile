import React from "react";
import { View, Text, Image } from "react-native";
import tw from "twrnc";

interface OrderHeaderProps {
  image_href: string;
  artId: string;
  artName: string;
  children?: React.ReactNode;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  image_href,
  artId,
  artName,
  children,
}) => (
  <View style={tw`flex-row items-center gap-[10px] flex-1`}>
    <Image
      source={{ uri: image_href }}
      style={tw`h-[42px] w-[42px] rounded-sm`}
    />
    <View style={tw`gap-[5px] pr-[20px] max-w-[80%]`}>
      <Text
        style={tw`text-xs text-gray-400`}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {artId}
      </Text>
      <Text
        style={tw`text-md capitalize text-[#454545] font-medium`}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {artName}
      </Text>
      {children}
    </View>
  </View>
);

export default React.memo(OrderHeader);

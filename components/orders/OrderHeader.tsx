import React from "react";
import { View, Text, Image } from "react-native";
import tw from "twrnc";

interface OrderHeaderProps {
  image_href: string;
  artId: string;
  artName: string;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  image_href,
  artId,
  artName,
}) => (
  <View style={tw`flex-row items-center`}>
    <View style={tw`flex-row items-center gap-[10px] flex-1`}>
      <Image
        source={{ uri: image_href }}
        style={tw`h-[42px] w-[42px] rounded-[3px]`}
      />
      <View style={tw`gap-[5px] pr-[20px] max-w-[80%]`}>
        <Text
          style={tw`text-[12px] text-[#454545]`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {artId}
        </Text>
        <Text
          style={tw`text-[14px] text-[#454545] font-semibold`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {artName}
        </Text>
      </View>
    </View>
  </View>
);

export default OrderHeader;

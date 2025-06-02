import React from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { SvgXml } from 'react-native-svg';
import tw from 'twrnc';
import { colors } from 'config/colors.config';
import { curvedTabBg } from 'utils/SvgImages';

const TabButton = ({
  name,
  activeIcon,
  inActiveIcon,
  accessibilityState,
  onPress,
}: {
  name: string;
  activeIcon: string;
  inActiveIcon: string;
  accessibilityState?: any;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  const focused = accessibilityState?.selected;

  return (
    <TouchableOpacity
      onPress={(event) => onPress?.(event)}
      activeOpacity={1}
      style={tw`flex-1 items-center justify-end pb-3`} // align items bottom
    >
      {focused && (
        <View style={tw`absolute top-[-17px]`}>
          <SvgXml xml={curvedTabBg} width={100} height={60} />
        </View>
      )}

      <View
        style={[
          tw`items-center justify-center`,
          focused && tw`absolute top-[-35px] bg-[#000000] rounded-full w-[48px] h-[48px]`, // bump icon up into the curve
        ]}
      >
        <SvgXml xml={focused ? activeIcon : inActiveIcon} width={26} height={26} />
      </View>
      {focused && <Text style={[tw`text-white mt-2 font-bold`, { fontSize: 13 }]}>{name}</Text>}
    </TouchableOpacity>
  );
};

export default TabButton;

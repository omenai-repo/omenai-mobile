import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { curvedTabBg } from 'utils/SvgImages';

const AnimatedView = Animated.createAnimatedComponent(View);

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
  const translateY = useSharedValue(focused ? -25 : 0);

  useEffect(() => {
    translateY.value = withTiming(focused ? -25 : 0, { duration: 500 });
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedCurveStyle = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0, { duration: 500 }),
  }));

  return (
    <TouchableOpacity
      onPress={(event) => onPress?.(event)}
      activeOpacity={1}
      style={tw`flex-1 items-center justify-end pb-3`}
    >
      {/* Curved Background */}
      <AnimatedView style={[tw`absolute top-[-17px]`, animatedCurveStyle]}>
        <SvgXml xml={curvedTabBg} width={100} height={60} />
      </AnimatedView>

      {/* Icon */}
      <AnimatedView
        style={[
          tw`items-center justify-center`,
          focused && tw`bg-[#000] rounded-full w-[48px] h-[48px]`,
          animatedIconStyle,
        ]}
      >
        <SvgXml xml={focused ? activeIcon : inActiveIcon} width={26} height={26} />
      </AnimatedView>

      {focused && <Text style={[tw`text-white mt-2 font-bold`, { fontSize: 13 }]}>{name}</Text>}
    </TouchableOpacity>
  );
};

export default TabButton;

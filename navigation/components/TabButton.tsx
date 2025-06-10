import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { curvedTabBg } from 'utils/SvgImages';
import {
  BottomTabDataArtist,
  BottomTabDataGallery,
  BottomTabDataIndividual,
} from 'utils/BottomTabData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from 'store/app/appStore';

type TabDataType = {
  id: number;
  name: string;
  activeIcon: string;
  inActiveIcon: string;
  component: ({
    account_id,
    showScreen,
  }: {
    account_id: string;
    showScreen: boolean;
  }) => React.ReactElement | undefined;
};

const { width } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  tabData,
}: {
  state: any;
  descriptors: any;
  navigation: any;
  tabData: TabDataType[];
}) => {
  const tabWidth = width / state.routes.length;
  const translateX = useSharedValue(0);
  const { bottom } = useSafeAreaInsets();
  const { userType } = useAppStore();

  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });
  }, [state.index]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={tw.style(`flex-row bg-black px-5`, {
        height: Platform.OS === 'android' ? 100 + bottom : 100,
      })}
    >
      {/* Sliding Bubble Indicator */}
      <AnimatedView
        style={[
          tw`absolute left-0 items-center`,
          { width: tabWidth, alignItems: 'center' },
          sliderStyle,
        ]}
      >
        <SvgXml xml={curvedTabBg} style={tw`top-[-1px]`} />
        <View
          style={tw`bg-black rounded-full w-[48px] h-[48px] items-center justify-center top-[-58px]`}
        >
          <SvgXml xml={tabData[state.index].activeIcon} width={26} height={26} />
        </View>
        <Text style={tw`text-white font-bold text-[13px] top-[-30px]`}>
          {tabData[state.index].name}
        </Text>
      </AnimatedView>

      {/* Render touchable inactive icons */}
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        const iconXml = isFocused ? tabData[index].activeIcon : tabData[index].inActiveIcon;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={[tw`flex-1 items-center justify-center top-[-10px]`]}
          >
            {!isFocused && <SvgXml xml={iconXml} width={26} height={26} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;

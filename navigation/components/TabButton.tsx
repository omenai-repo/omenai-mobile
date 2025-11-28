import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { SvgXml } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import tw from "twrnc";
import { colors } from "config/colors.config";
import { curvedTabBg } from "utils/SvgImages";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

const { width } = Dimensions.get("window");

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
  const bubbleTop = -58;

  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });
  }, [state.index, tabWidth, translateX]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        tw`flex-row px-5`,
        Platform.OS === "android"
          ? {
              backgroundColor: colors.black,
              paddingTop: 36,
              paddingBottom: bottom + 23,
            }
          : { backgroundColor: colors.black, height: 100 },
      ]}
    >
      {/* Sliding Bubble Indicator */}
      <AnimatedView
        style={[
          tw`absolute left-0 items-center`,
          { width: tabWidth, alignItems: "center" },
          sliderStyle,
        ]}
      >
        <SvgXml xml={curvedTabBg} style={tw`top-[-1px]`} />
        <View
          style={[
            tw`rounded-full w-[48px] h-[48px] items-center justify-center`,
            { backgroundColor: colors.black, top: bubbleTop },
          ]}
        >
          <SvgXml
            xml={tabData[state.index].activeIcon}
            width={26}
            height={26}
          />
        </View>
        <Text
          style={[
            tw`font-bold text-[13px]`,
            { color: colors.white, top: bubbleTop + 28 },
          ]}
        >
          {tabData[state.index].name}
        </Text>
      </AnimatedView>

      {/* Render touchable inactive icons */}
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        const iconXml = isFocused
          ? tabData[index].activeIcon
          : tabData[index].inActiveIcon;

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

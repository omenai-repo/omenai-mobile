import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, Platform } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";

type Tab = {
  title: string;
  key: string | number;
  count?: number;
};

type Props = {
  tabs: Tab[];
  selectedKey: string | number;
  setSelectedKey: (key: string | number) => void;
};

const TabSwitcher = ({ tabs, selectedKey, setSelectedKey }: Props) => {
  const selectedIndex = tabs.findIndex((tab) => tab.key === selectedKey);
  const animatedValue = useRef(new Animated.Value(selectedIndex)).current;

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.key === selectedKey);
    Animated.timing(animatedValue, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedKey, tabs, animatedValue]);

  const tabWidth = 100 / tabs.length;

  return (
    <View
      style={[
        tw`relative flex-row items-center bg-white p-[10px] mx-[20px] rounded-[56px]`,
        { overflow: "visible" },
      ]}
    >
      {/* Animated Pill Background */}
      <Animated.View
        style={[
          tw`absolute h-[45px] rounded-[56px]`,
          // Keep iOS shadow, avoid elevation on Android so it doesn't cover the badge
          Platform.OS === "ios" ? tw`shadow-md` : {},
          {
            backgroundColor: colors.black,
            width: `${tabWidth}%`,
            left: animatedValue.interpolate({
              inputRange: tabs.map((_, i) => i),
              outputRange: tabs.map((_, i) => `${i * (100 / tabs.length) + 3}%`),
            }),
            elevation: Platform.OS === "android" ? 0 : undefined,
          },
        ]}
      />

      {tabs.map((tab, index) => (
        <Pressable
          key={tab.key.toString()}
          onPress={() => setSelectedKey(tab.key)}
          style={tw`flex-1 justify-center items-center h-[45px]`}
        >
          <View style={tw`flex-row items-center justify-center relative`}>
            <Text
              style={[
                tw`text-[13px] font-medium`,
                { color: tab.key === selectedKey ? colors.white : `${colors.black}99` },
              ]}
            >
              {tab.title}
            </Text>

            {/* Badge */}
            {tab.count !== undefined && tab.count > 0 && (
              <View
                style={[
                  tw`absolute -top-[10px] -right-[16px] bg-red-500 rounded-full px-[6px] py-[2px] z-10`,
                  { elevation: Platform.OS === "android" ? 10 : 0 },
                ]}
              >
                <Text style={tw`text-white text-[10px] font-bold`}>
                  {tab.count > 99 ? "99+" : tab.count}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default TabSwitcher;

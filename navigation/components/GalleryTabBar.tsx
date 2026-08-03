import React from "react";
import { Pressable, Text, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { SvgXml } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { curvedTabBg } from "#utils/assets/SvgImages";
import { colors } from "#config/colors.config";
import tw from "twrnc";

type GalleryTabMeta = {
  name: string;
  label: string;
  activeIcon?: string;
  inActiveIcon?: string;
};

type GalleryTabBarProps = BottomTabBarProps & {
  tabMeta: GalleryTabMeta[];
  onPressMore: () => void;
  moreRouteName: string;
};

function MoreGlyph() {
  return (
    <View style={tw`w-4 h-4 flex-row flex-wrap justify-between content-between`}>
      <View style={tw`w-1.5 h-1.5 rounded-full bg-white`} />
      <View style={tw`w-1.5 h-1.5 rounded-full bg-white`} />
      <View style={tw`w-1.5 h-1.5 rounded-full bg-white`} />
      <View style={tw`w-1.5 h-1.5 rounded-full bg-white`} />
    </View>
  );
}

export default function GalleryTabBar({
  state,
  navigation,
  descriptors,
  tabMeta,
  onPressMore,
  moreRouteName,
}: GalleryTabBarProps) {
  const { bottom } = useSafeAreaInsets();
  const bottomPadding = Math.max(bottom, 12);
  const visibleRoutes = state.routes.filter((route) =>
    tabMeta.some((item) => item.name === route.name),
  );
  const activeRouteKey = state.routes[state.index]?.key;

  return (
    <View
      style={[
        tw`flex-row items-end justify-between px-2.5 overflow-visible`,
        { backgroundColor: colors.black, paddingBottom: bottomPadding },
      ]}
    >
      {visibleRoutes.map((route) => {
        const isFocused = activeRouteKey === route.key;
        const meta = tabMeta.find((item) => item.name === route.name);
        const isMoreRoute = route.name === moreRouteName;

        const onPress = () => {
          if (isMoreRoute) {
            onPressMore();
            return;
          }

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const label =
          meta?.label ??
          (descriptors[route.key].options.tabBarLabel as string) ??
          route.name;

        return (
          <Pressable
            key={route.key}
            style={[tw`flex-1 items-center justify-end min-h-14`, isMoreRoute && tw`justify-end`]}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            {isMoreRoute ? (
              <View
                style={[
                  tw`absolute items-center justify-center`,
                  { top: 0, zIndex: 5 },
                ]}
              >
                <SvgXml
                  xml={curvedTabBg}
                  width={114}
                  height={31}
                  style={{ top: -1 }}
                />
                <View
                  style={[
                    tw`w-12 h-12 rounded-full items-center justify-center bg-[#0D1228]`,
                    {
                      top: -58,
                      shadowColor: "#000000",
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.2,
                      shadowRadius: 12,
                      elevation: 8,
                    },
                  ]}
                >
                  <MoreGlyph />
                </View>
              </View>
            ) : (
              <>
                {meta?.activeIcon && meta?.inActiveIcon ? (
                  <SvgXml
                    xml={isFocused ? meta.activeIcon : meta.inActiveIcon}
                    width={24}
                    height={24}
                  />
                ) : null}
                <Text
                  style={[
                    tw`text-[11px] font-semibold`,
                    { color: isFocused ? "#FFFFFF" : "rgba(255,255,255,0.66)" },
                  ]}
                >
                  {label}
                </Text>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

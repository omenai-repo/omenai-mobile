import React, { useMemo } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "#config/colors.config";

export type MoreSheetItem = {
  key: string;
  label: string;
  icon?: string;
  routeName: string;
  keywords?: string[];
  isDanger?: boolean;
  onPress: () => void;
};

type MoreSheetProps = {
  visible: boolean;
  menuItems: MoreSheetItem[];
  onClose: () => void;
};

export default function MoreSheet({
  visible,
  menuItems,
  onClose,
}: MoreSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const items = useMemo(() => menuItems, [menuItems]);

  const onPressItem = (item: MoreSheetItem) => {
    item.onPress();
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        Keyboard.dismiss();
        onClose();
      }}
    >
      <Pressable
        style={tw`flex-1 bg-[rgba(16,24,40,0.2)]`}
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View style={tw`flex-1 justify-end`}>
          <View
            style={[tw`mx-3 items-center`, { marginBottom: bottom + 85 }]}
            pointerEvents="box-none"
          >
            <Pressable
              style={[
                tw`w-full rounded-[16px] pt-3.5 pb-3.5 px-3.5 border`,
                {
                  backgroundColor: colors.black,
                  borderColor: "rgba(255,255,255,0.05)",
                },
              ]}
              onPress={(event) => event.stopPropagation()}
            >
              <View style={tw`flex-row flex-wrap justify-between gap-y-2`}>
                {items.map((item) => (
                  <Pressable
                    key={item.key}
                    style={[
                      tw`w-[48.8%] rounded-[10px] border py-2.5 px-2.5 flex-row items-center gap-x-2`,
                      item.isDanger
                        ? tw`bg-[#2B1218] border-[#5B1A28]`
                        : tw`bg-[#18213A] border-[rgba(255,255,255,0.05)]`,
                    ]}
                    onPress={() => onPressItem(item)}
                  >
                    <View style={tw`w-5 h-5 items-center justify-center`}>
                      {item.icon ? (
                        <SvgXml xml={item.icon} width={17} height={17} />
                      ) : item.isDanger ? (
                        <Ionicons name="log-out-outline" size={17} color="#EF4444" />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        tw`flex-1 text-[12px] font-medium`,
                        item.isDanger ? tw`text-[#EF4444]` : tw`text-white`,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

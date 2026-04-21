import React, { useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  TextInput,
  Text,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { GalleryOverviewLogo } from "#components/header/Header";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import type { MoreSheetMode } from "./MoreSheetContext";

export type MoreSheetItem = {
  key: string;
  label: string;
  icon?: string;
  routeName: string;
  keywords?: string[];
  onPress: () => void;
};

type MoreSheetProps = {
  visible: boolean;
  menuItems: MoreSheetItem[];
  searchItems: MoreSheetItem[];
  onClose: () => void;
  mode: MoreSheetMode;
};

export default function MoreSheet({
  visible,
  menuItems,
  searchItems,
  onClose,
  mode,
}: MoreSheetProps) {
  const { bottom, top } = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    const items = mode === "search" ? searchItems : menuItems;
    if (!normalizedQuery) return items;
    return items.filter((item) => {
      const haystack = [
        item.label,
        ...(item.keywords ?? []),
        item.routeName,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [menuItems, mode, normalizedQuery, searchItems]);

  const onPressItem = (item: MoreSheetItem) => {
    item.onPress();
    setQuery("");
    setIsSearchFocused(false);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        setQuery("");
        setIsSearchFocused(false);
        Keyboard.dismiss();
        onClose();
      }}
    >
      <Pressable
        style={tw`flex-1 bg-[rgba(16,24,40,0.2)]`}
        onPress={() => {
          setQuery("");
          setIsSearchFocused(false);
          Keyboard.dismiss();
          onClose();
        }}
      >
        <KeyboardAvoidingView
          behavior={mode === "search" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
          style={tw`flex-1 ${mode === "search" ? "bg-white" : "justify-end"}`}
        >
          {mode === "menu" ? (
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
                  {menuItems.map((item) => (
                    <Pressable
                      key={item.key}
                      style={tw`w-[48.8%] rounded-[10px] bg-[#18213A] border border-[rgba(255,255,255,0.05)] py-2.5 px-2.5 flex-row items-center gap-x-2`}
                      onPress={() => onPressItem(item)}
                    >
                      <View style={tw`w-5 h-5 items-center justify-center`}>
                        {item.icon ? <SvgXml xml={item.icon} width={17} height={17} /> : null}
                      </View>
                      <Text style={tw`flex-1 text-white text-[12px] font-medium`}>
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Pressable>
            </View>
          ) : (
          <Pressable
            style={[
              tw`flex-1 bg-white`,
              {
                paddingTop: top + 16,
                paddingBottom: bottom + 16,
              },
            ]}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={tw`px-5 pb-4`}>
              <GalleryOverviewLogo />
            </View>

            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.key}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 18 }}
              ListEmptyComponent={() => (
                <View style={tw`py-10`}>
                  <Text style={tw`text-center text-[#667085] text-[14px]`}>
                    No screens found
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onPressItem(item)}
                  style={tw`py-4 flex-row items-center`}
                >
                  <View
                    style={tw`p-2 mr-3 rounded-md bg-[${colors.black}] items-center justify-center`}
                  >
                    {item.icon ? (
                      <SvgXml xml={item.icon} width={16} height={16} />
                    ) : (
                      <View style={tw`w-2 h-2 rounded-full bg-[#101828]`} />
                    )}
                  </View>
                  <Text style={tw`flex-1 text-[${colors.black}] text-[17px]`}>{item.label}</Text>
                </Pressable>
              )}
            />

            <View style={tw`px-4 mt-auto`}>
              <View style={tw`flex-row items-center`}>
                <View
                  style={[
                    tw`flex-1 rounded-[26px] px-4 py-3 flex-row items-center border`,
                    {
                      backgroundColor: "#FFFFFF",
                      borderColor: isSearchFocused
                        ? "rgba(16,24,40,0.35)"
                        : "rgba(16,24,40,0.15)",
                    },
                  ]}
                >
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color={colors.black}
                    style={tw`mr-2`}
                  />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search for anything"
                    placeholderTextColor="#98A2B3"
                    style={tw`flex-1 text-[#101828] text-[16px]`}
                    returnKeyType="search"
                  />
                </View>
                <Pressable
                  onPress={() => {
                    setQuery("");
                    setIsSearchFocused(false);
                    Keyboard.dismiss();
                    onClose();
                  }}
                  style={tw`ml-3 w-12 h-12 rounded-full border border-[rgba(16,24,40,0.2)] items-center justify-center bg-[#F2F4F7]`}
                >
                  <Ionicons name="close" size={24} color={colors.black} />
                </Pressable>
              </View>
            </View>
          </Pressable>
          )}
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

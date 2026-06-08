import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Modal, Pressable, Text, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import { getImageFileView } from "#lib/storage/getImageFileView";

/** Minimal artwork shape for immersive carousel (fair events, gallery works, etc.). */
export type ArtworksImmersiveItem = {
  art_id: string;
  url: string;
  title: string;
  artist: string;
  year?: string | number | null;
  medium?: string | null;
};

type Props<T extends ArtworksImmersiveItem> = {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly items: T[];
  readonly getHeaderText: (currentIndex: number, total: number) => string;
  readonly onItemPress: (item: T) => void;
  readonly renderMetaFooter?: (item: T) => React.ReactNode;
};

export default function ArtworksImmersiveModal<T extends ArtworksImmersiveItem>({
  visible,
  onClose,
  items,
  getHeaderText,
  onItemPress,
  renderMetaFooter,
}: Readonly<Props<T>>) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const listRef = useRef<FlatList<T>>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = useCallback(
    (next: number) => {
      if (items.length === 0) return;
      const safe = ((next % items.length) + items.length) % items.length;
      setIndex(safe);
      listRef.current?.scrollToIndex({ index: safe, animated: true });
    },
    [items.length],
  );

  useEffect(() => {
    if (!visible) return;
    setIndex(0);
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [visible]);

  const renderItem = useCallback(
    ({ item }: { item: T }) => (
      <Pressable
        onPress={() => onItemPress(item)}
        style={[tw`justify-center items-center px-8`, { width: screenWidth, height: screenHeight }]}
      >
        <Image
          source={{ uri: getImageFileView(item.url, 1400) }}
          style={tw`w-full h-[70%]`}
          contentFit="contain"
        />
        <View style={[tw`absolute left-8`, { bottom: Math.max(insets.bottom + 16, 48) }]}>
          <Text style={tw`text-xs uppercase tracking-widest text-neutral-600`}>{item.artist}</Text>
          <Text style={tw`font-serif-italic text-2xl text-black mt-1`}>
            {item.title}
            {item.year != null && String(item.year).trim() !== "" ? `, ${item.year}` : ""}
          </Text>
          {!!item.medium && (
            <Text style={tw`text-xs uppercase tracking-widest text-neutral-600 mt-1 font-sans-regular`}>
              {item.medium}
            </Text>
          )}
          {renderMetaFooter?.(item)}
        </View>
      </Pressable>
    ),
    [insets.bottom, onItemPress, renderMetaFooter, screenHeight, screenWidth],
  );

  if (items.length === 0) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={tw`flex-1 bg-white`}>
        <View
          style={[
            tw`absolute top-0 left-0 right-0 z-20 px-5 flex-row justify-between items-center`,
            { paddingTop: Math.max(insets.top + 12, 24) },
          ]}
        >
          <Text style={tw`text-xs uppercase tracking-widest text-neutral-800 font-sans-regular flex-1 pr-3`}>
            {getHeaderText(index, items.length)}
          </Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={24} color={tw.color("neutral-800")} />
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) => item.art_id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const next = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
            setIndex(Math.min(Math.max(next, 0), items.length - 1));
          }}
          onScrollToIndexFailed={({ index: failed }) => {
            setTimeout(() => listRef.current?.scrollToIndex({ index: failed, animated: false }), 100);
          }}
          getItemLayout={(_, i) => ({
            length: screenWidth,
            offset: screenWidth * i,
            index: i,
          })}
          renderItem={renderItem}
        />

        <Pressable
          onPress={() => scrollTo(index - 1)}
          style={tw`absolute left-4 top-1/2 -mt-6 z-20 h-8 w-8 rounded-full bg-white/90 border border-neutral-300 items-center justify-center`}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color={tw.color("neutral-700")} />
        </Pressable>
        <Pressable
          onPress={() => scrollTo(index + 1)}
          style={tw`absolute right-4 top-1/2 -mt-6 z-20 h-8 w-8 rounded-full bg-white/90 border border-neutral-300 items-center justify-center`}
        >
          <MaterialCommunityIcons name="chevron-right" size={24} color={tw.color("neutral-700")} />
        </Pressable>
      </View>
    </Modal>
  );
}

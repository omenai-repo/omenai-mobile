import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import type { GalleryEventRecord } from "#services/events/events.service";

type Props = {
  readonly event: GalleryEventRecord;
};

const { width: screenWidth } = Dimensions.get("window");
const resolveProgramImageUri = (imageId?: string) => {
  if (!imageId) return "";
  if (/^https?:\/\//i.test(imageId)) {
    return imageId;
  }
  return getPromotionalFileView(imageId, 1400);
};

export default function FairEventHero({ event }: Readonly<Props>) {
  const images = useMemo(
    () =>
      Array.isArray(event.installation_views) && event.installation_views.length > 0
        ? event.installation_views
        : [event.cover_image],
    [event.cover_image, event.installation_views],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMulti = images.length > 1;
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndexRef = useRef(0);
  const heroWidth = screenWidth;

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (!isMulti) return;

    const timer = setInterval(() => {
      const nextIndex = (selectedIndexRef.current + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * heroWidth, animated: true });
      setSelectedIndex(nextIndex);
    }, 5500);

    return () => clearInterval(timer);
  }, [heroWidth, images.length, isMulti]);

  const eventLabel = event.event_type.replaceAll("_", " ").toUpperCase();

  return (
    <View style={tw`overflow-hidden bg-[#111]`}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={isMulti}
        onMomentumScrollEnd={(e) => {
          const rawIndex = e.nativeEvent.contentOffset.x / heroWidth;
          const idx = ((Math.round(rawIndex) % images.length) + images.length) % images.length;
          setSelectedIndex(Math.max(0, Math.min(idx, images.length - 1)));
        }}
      >
        {images.map((img, idx) => (
          <View key={`${img}-${idx}`} style={{ width: heroWidth, height: 280 }}>
            <Image
              source={{ uri: resolveProgramImageUri(img) }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
            <View style={tw`absolute inset-0 bg-black/25`} />
          </View>
        ))}
      </ScrollView>

      <View style={tw`absolute top-4 left-4`}>
        <View style={tw`bg-white/20 border border-white/25 px-3 py-1 rounded-sm`}>
          <Text style={tw`text-white text-xs tracking-widest uppercase font-sans-medium`}>
            {eventLabel}
          </Text>
        </View>
      </View>

      {isMulti && (
        <View style={tw`absolute top-4 right-4`}>
          <Text style={tw`text-white/90 text-xs tracking-widest font-sans-medium`}>
            {String(selectedIndex + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </Text>
        </View>
      )}

      <View style={tw`absolute bottom-4 left-4 right-4 flex-row items-end justify-between`}>
        <Text style={tw`text-white/80 text-xs tracking-widest uppercase font-sans-normal`}>
          {images.length > 1 ? "Installation View" : "Exhibition Cover"}
          {images.length > 1 ? ` - ${images.length} Images` : ""}
        </Text>

        {isMulti && (
          <View style={tw`flex-row items-center`}>
            {images.map((img, idx) => (
              <Pressable
                key={`dot-${img || idx}`}
                onPress={() => {
                  setSelectedIndex(idx);
                  scrollRef.current?.scrollTo({ x: idx * heroWidth, animated: true });
                }}
                style={[
                  tw`h-[3px] rounded-sm mr-1.5`,
                  idx === selectedIndex ? tw`w-7 bg-white` : tw`w-3 bg-white/40`,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

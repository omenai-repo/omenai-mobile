import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import {
  getEventStatus,
  type GalleryEventRecord,
} from "#services/events/events.service";

type Props = {
  item: GalleryEventRecord;
  onPress: () => void;
};

const resolveCoverImageUri = (coverImage?: string) =>
  coverImage
    ? /^https?:\/\//i.test(coverImage)
      ? coverImage
      : getPromotionalFileView(coverImage, 900)
    : "";

export default function EventCard({ item, onPress }: Props) {
  const status = getEventStatus(item.start_date, item.end_date);
  const isClosed = status === "Past";
  const isFair = item.event_type === "art_fair";

  return (
    <Pressable style={tw`mb-5`} onPress={onPress}>
      <View style={tw`relative`}>
        <Image
          source={{ uri: resolveCoverImageUri(item.cover_image) }}
          style={tw`w-full h-[220px] rounded-md bg-[#EDEDED]`}
        />
        <View style={tw`absolute top-3 left-3`}>
          <Text
            style={tw.style(
              "px-2 py-1 text-[10px] uppercase tracking-widest font-medium rounded-sm",
              isClosed ? "bg-black/70 text-white" : "bg-white/90 text-neutral-900",
            )}
          >
            {isClosed ? "Closed" : item.event_type.replace("_", " ")}
          </Text>
        </View>
      </View>
      <View style={tw`mt-2`}>
        <Text style={tw`text-[11px] uppercase tracking-wide text-neutral-500`}>
          {item.gallery?.name || "Gallery"}
        </Text>
        <Text style={tw`text-[#1F1F1F] text-[18px] font-semibold`}>
          {item.title}
        </Text>
        <Text style={tw`text-[11px] uppercase tracking-wide mt-1 text-neutral-500`}>
          {new Date(item.start_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}{" "}
          —{" "}
          {new Date(item.end_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
        {isFair && item.location?.city ? (
          <Text style={tw`text-[11px] uppercase tracking-wide mt-0.5 text-neutral-700`}>
            {item.location.city}
            {item.location.country ? `, ${item.location.country}` : ""}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

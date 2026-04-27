import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import SectionHeader from "#components/general/SectionHeader";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import { useFairsEventsPreview } from "#screens/individual/hooks/useFairsEvents";
import { screenName } from "#constants/screenNames.constants";
import { getEventStatus } from "#services/events/events.service";

const SKELETON_ITEMS = ["skeleton-1", "skeleton-2", "skeleton-3"];
const resolveCoverImageUri = (coverImage?: string) =>
  coverImage
    ? /^https?:\/\//i.test(coverImage)
      ? coverImage
      : getPromotionalFileView(coverImage, 700)
    : "";

export default function FairsEvents() {
  const navigation = useNavigation<any>();
  const { data: events = [], isLoading } = useFairsEventsPreview(10);

  return (
    <View style={tw`mt-6`}>
      <SectionHeader
        title="Fairs & Events"
        onActionPress={() => navigation.navigate(screenName.individual.fairsEvents)}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pt-5 gap-4`}
      >
        {isLoading
          ? SKELETON_ITEMS.map((item) => (
              <View key={item} style={tw`w-[250px]`}>
                <View style={tw`w-full h-[170px] rounded-md bg-[#EAEAEA]`} />
                <View style={tw`h-3 w-24 rounded-sm bg-[#E6E6E6] mt-3`} />
                <View style={tw`h-4 w-48 rounded-sm bg-[#E6E6E6] mt-2`} />
                <View style={tw`h-3 w-36 rounded-sm bg-[#E6E6E6] mt-2`} />
                <View style={tw`h-3 w-28 rounded-sm bg-[#E6E6E6] mt-1.5`} />
              </View>
            ))
          : events.map((event) => (
          (() => {
            const status = getEventStatus(event.start_date, event.end_date);
            const isClosed = status === "Past";
            const isFair = event.event_type === "art_fair";

            return (
              <Pressable
                key={event.event_id}
                onPress={() =>
                  navigation.navigate(screenName.individual.fairEventDetails, {
                    eventId: event.event_id,
                  })
                }
                style={tw`w-[250px]`}
              >
                <View style={tw`relative`}>
                  <Image
                    source={{
                      uri: resolveCoverImageUri(event.cover_image),
                    }}
                    style={tw`w-full h-[170px] rounded-md bg-[#EAEAEA]`}
                  />
                  <View style={tw`absolute top-3 left-3`}>
                    <Text
                      style={[
                        tw`px-2 py-1 text-[10px] uppercase tracking-widest font-medium rounded-sm`,
                        isClosed ? tw`bg-black/70 text-white` : tw`bg-white/90 text-neutral-900`,
                      ]}
                    >
                      {isClosed ? "Closed" : event.event_type.replace("_", " ")}
                    </Text>
                  </View>
                </View>
                <Text
                  style={tw`text-xs uppercase tracking-wide text-neutral-500 mt-2`}
                >
                  {event.gallery?.name || "Gallery"}
                </Text>
                <Text style={tw`text-base capitalize font-serif leading-snug mt-1 text-neutral-900`}>
                  {event.title}
                </Text>
                <Text style={tw`text-xs uppercase tracking-wide mt-1 text-neutral-500`}>
                  {new Date(event.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  —{" "}
                  {new Date(event.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                {isFair && event.location?.city ? (
                  <Text style={tw`text-xs uppercase tracking-wide mt-0.5 text-neutral-700`}>
                    {event.location.city}
                    {event.location.country ? `, ${event.location.country}` : ""}
                  </Text>
                ) : null}
              </Pressable>
            );
          })()
        ))}
      </ScrollView>
    </View>
  );
}

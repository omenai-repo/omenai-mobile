import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import SectionHeader from "#components/general/SectionHeader";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { useFeaturedShows } from "#screens/individual/hooks/useFeaturedShows";
import { screenName } from "#constants/screenNames.constants";
import { getEventStatus } from "#services/events/events.service";

const SKELETON_ITEMS = ["skeleton-1", "skeleton-2", "skeleton-3"];

export default function FeaturedShows() {
  const navigation = useNavigation<any>();
  const { data: shows = [], isLoading } = useFeaturedShows(10);

  return (
    <View style={tw`mt-6`}>
      <SectionHeader
        subtitle="FEATURED SHOWS"
        title="Shows to discover"
        onActionPress={() => navigation.navigate(screenName.individual.shows)}
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
          : shows.map((show) => {
            const status = getEventStatus(show.start_date, show.end_date);
            const isClosed = status === "Past";

            return (
              <Pressable
                key={show.event_id}
                onPress={() =>
                  navigation.navigate(screenName.individual.showDetails, {
                    eventId: show.event_id,
                  })
                }
                style={tw`w-[250px]`}
              >
                <View style={tw`relative`}>
                  <Image
                    source={{ uri: getImageFileView(show.cover_image, 700) }}
                    style={tw`w-full h-[170px] rounded-md bg-[#EAEAEA]`}
                  />
                  <View style={tw`absolute top-3 left-3`}>
                    <Text
                      style={[
                        tw`px-2 py-1 text-[10px] uppercase tracking-widest font-medium rounded-sm`,
                        isClosed ? tw`bg-black/70 text-white` : tw`bg-white/90 text-neutral-900`,
                      ]}
                    >
                      {isClosed ? "Closed" : show.event_type.replace("_", " ")}
                    </Text>
                  </View>
                </View>

                <Text style={tw`text-xs uppercase tracking-wide text-neutral-500 mt-2`}>
                  {show.gallery?.name || "Gallery"}
                </Text>
                <Text style={tw`text-base capitalize font-serif leading-snug mt-1 text-neutral-900`}>
                  {show.title}
                </Text>
                <Text style={tw`text-xs uppercase tracking-wide mt-1 text-neutral-500`}>
                  {new Date(show.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  —{" "}
                  {new Date(show.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                {show.location?.city ? (
                  <Text style={tw`text-xs uppercase tracking-wide mt-0.5 text-neutral-700`}>
                    {show.location.city}
                    {show.location.country ? `, ${show.location.country}` : ""}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
      </ScrollView>
    </View>
  );
}

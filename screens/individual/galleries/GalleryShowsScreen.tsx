import React from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { FlatList, Text, View } from "react-native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import EventCard from "#screens/individual/components/EventCard";
import { useShows } from "#screens/individual/hooks/useShows";
import { screenName } from "#constants/screenNames.constants";

type RouteParams = RouteProp<
  {
    params: {
      galleryId: string;
      galleryName?: string;
    };
  },
  "params"
>;

export default function GalleryShowsScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<any>();
  const { galleryId, galleryName } = route.params;
  const { data: shows = [], isLoading } = useShows();
  const filtered = shows.filter((item) => item.gallery_id === galleryId);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title={`${galleryName || "Gallery"} Shows`} />
      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-[#757575]`}>Loading shows...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.event_id}
          contentContainerStyle={tw`px-5 pt-5 pb-12`}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={tw`py-16 items-center`}>
              <Text style={tw`text-[#757575]`}>
                No shows available for this gallery
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() =>
                navigation.navigate(screenName.individual.showDetails, {
                  eventId: item.event_id,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

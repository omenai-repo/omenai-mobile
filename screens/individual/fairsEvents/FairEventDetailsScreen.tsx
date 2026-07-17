import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import ProgramDetailsContent from "#screens/individual/components/ProgramDetailsContent";
import ProgramDetailsSkeleton from "#screens/individual/components/ProgramDetailsSkeleton";
import { useFairEventDetails } from "#screens/individual/hooks/useFairsEvents";

type RouteParams = RouteProp<
  { params: { eventId: string } },
  "params"
>;

export default function FairEventDetailsScreen() {
  const route = useRoute<RouteParams>();
  const { data: event, isLoading } = useFairEventDetails(route.params?.eventId);

  if (isLoading) {
    return <ProgramDetailsSkeleton kind="fair_event" />;
  }

  if (!event) {
    return (
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BackHeaderTitle title="Event Details" />
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-[#757575]`}>Event not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title={event.title} />
      <ScrollView contentContainerStyle={tw`pb-10`}>
        <ProgramDetailsContent event={event} />
      </ScrollView>
    </View>
  );
}

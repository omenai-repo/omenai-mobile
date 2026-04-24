import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import ProgramDetailsContent from "#screens/individual/components/ProgramDetailsContent";
import ProgramDetailsSkeleton from "#screens/individual/components/ProgramDetailsSkeleton";
import { useShowDetails } from "#screens/individual/hooks/useShows";

type RouteParams = RouteProp<
  { params: { eventId: string } },
  "params"
>;

export default function ShowDetailsScreen() {
  const route = useRoute<RouteParams>();
  const { data: show, isLoading } = useShowDetails(route.params?.eventId);

  if (isLoading) {
    return <ProgramDetailsSkeleton kind="show" />;
  }

  if (!show) {
    return (
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BackHeaderTitle title="Show Details" />
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-[#757575]`}>Show not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title={show.title} />
      <ScrollView contentContainerStyle={tw`pb-10`}>
        <ProgramDetailsContent event={show} />
      </ScrollView>
    </View>
  );
}

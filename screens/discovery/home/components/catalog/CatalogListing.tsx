import { View, ScrollView } from "react-native";
import React from "react";
import { mediums } from "#constants/mediums";
import SectionHeader from "#components/general/SectionHeader";
import { CatalogCard } from "./CatalogCard";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";
import tw from "twrnc";

export default function CatalogListing({
  hideAction,
}: Readonly<{
  hideAction?: boolean;
}>) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={tw`mt-6`}>
      <SectionHeader
        subtitle="FEATURED COLLECTIONS"
        title="Browse by medium"
        onActionPress={
          hideAction
            ? undefined
            : () => navigation.navigate(screenName.collections)
        }
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mt-5`}
        contentContainerStyle={tw`pl-5 gap-4`}
      >
        {mediums.map((item, index) => (
          <CatalogCard
            key={item.name || index.toString()}
            name={item.name}
            image={item.image}
            value={item.value}
          />
        ))}
      </ScrollView>
    </View>
  );
}

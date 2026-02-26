import { FlatList, View } from "react-native";
import React from "react";
import { mediums } from "#constants/mediums";
import SectionHeader from "#components/general/SectionHeader";
import { CatalogCard } from "./CatalogCard";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";
import tw from "twrnc";

export default function CatalogListing() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={tw`mt-6`}>
      <SectionHeader
        subtitle="FEATURED COLLECTIONS"
        title="Browse by medium"
        onActionPress={() => navigation.navigate(screenName.collections)}
      />
      <FlatList
        data={mediums}
        renderItem={({ item }) => (
          <CatalogCard name={item.name} image={item.image} value={item.value} />
        )}
        keyExtractor={(item, index) => item.name || index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={tw`mt-5`}
        contentContainerStyle={tw`pl-5`}
      />
    </View>
  );
}

import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BackHeaderTitle from "components/header/BackHeaderTitle";
import { mediums } from "constants/mediums";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { getNumberOfColumns } from "utils/utils_screen";
import tw from "twrnc";

export default function Collections() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const CatalogCard = ({ image, name, value }: CatalogCardTypes) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate(screenName.artworksMedium, {
            catalog: value,
            image: image,
          })
        }
      >
        <View style={tw`flex-1`}>
          <Image source={image} style={{ width: "100%", height: 150 }} />
          <Text style={{ fontSize: 14, marginTop: 10 }}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Art collections" />
      <FlatList
        data={mediums}
        numColumns={getNumberOfColumns()}
        contentContainerStyle={tw`px-5 gap-5 pb-5`}
        columnWrapperStyle={tw`gap-4`}
        renderItem={({ item }) => (
          <CatalogCard
            name={item.name}
            image={item.image}
            key={item.name}
            value={item.value}
          />
        )}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
}

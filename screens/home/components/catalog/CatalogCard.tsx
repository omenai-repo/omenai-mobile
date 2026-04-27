import { Image, Pressable, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";
import tw from "twrnc";

export const CatalogCard = ({ image, name, value }: CatalogCardTypes) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      onPress={() =>
        navigation.navigate(screenName.artworksMedium, {
          catalog: value,
          image: image,
        })
      }
    >
      <View style={tw`w-[220px] rounded-md bg-white shadow-sm shadow-black elevation-2 overflow-hidden`}>
        <Image source={image} style={tw`w-[220px] h-[220px]`} />
        <View style={tw`px-3 py-3`}>
          <Text style={tw`text-md text-neutral-900`}>{name}</Text>
        </View>
      </View>
    </Pressable>
  );
};

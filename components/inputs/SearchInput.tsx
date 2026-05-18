import { TouchableOpacity, View, TextInput, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { useSearchStore } from "#store/search/searchStore";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { StackNavigationProp } from "@react-navigation/stack";

export default function SearchInput() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { searchQuery, setSearchQuery, setSubmittedQuery } = useSearchStore();

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      setSubmittedQuery(searchQuery.trim());
      navigation.navigate(screenName.searchResults);
    }
  };

  return (
    <View
      style={[
        tw`h-[55px] bg-[#FAFAFA] border border-neutral-100 pl-4 pr-1.5 py-1.5 flex-row items-center rounded-sm`,
      ]}
    >
      <TextInput
        style={tw`flex-1 h-full font-sans-regular text-base mr-3`}
        placeholder="Ask Omenai"
        placeholderTextColor={"#858585"}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        testID="search-input"
      />
      <TouchableOpacity
        style={[
          tw`h-full rounded-sm items-center justify-center px-5`,
          { backgroundColor: colors.primary_black },
        ]}
        activeOpacity={0.5}
        onPress={handleSearch}
      >
        <Text style={tw`text-base font-sans-medium text-white`}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

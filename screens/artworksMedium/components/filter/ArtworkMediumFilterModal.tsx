import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import PriceFilter from "./PriceFilter";
import YearFilter from "./YearFilter";
import FilterPill from "./FilterPill";
import { artworkActionStore } from "store/artworks/ArtworkActionStore";
import { fetchPaginatedArtworks } from "services/artworks/fetchPaginatedArtworks";
import RarityFilter from "./RarityFilter";
import BackScreenButton from "components/buttons/BackScreenButton";
import LongBlackButton from "components/buttons/LongBlackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { artworksMediumFilterStore } from "store/artworks/ArtworksMediumFilterStore";
import { artworksMediumStore } from "store/artworks/ArtworksMediumsStore";
import ScrollWrapper from "components/general/ScrollWrapper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import tw from "twrnc";

export default function ArtworkMediumFilterModal() {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { filterOptions, selectedFilters, clearAllFilters } =
    artworksMediumFilterStore();
  const { paginationCount, updatePaginationCount } = artworkActionStore();
  const { setArtworks, setIsLoading, setPageCount, isLoading, medium } =
    artworksMediumStore();

  const handleSubmitFilter = async () => {
    updatePaginationCount("reset");
    setIsLoading(true);
    const response = await fetchPaginatedArtworks(paginationCount, {
      ...filterOptions,
      medium: [medium],
    });
    if (response?.isOk) {
      setPageCount(response.count);
      setArtworks(response.data);
    } else {
    }
    setIsLoading(false);
    navigation.goBack();
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.white }]}>
      <View
        style={[
          tw`flex-row items-center pb-2.5 gap-2.5 px-5`,
          {
            backgroundColor: colors.white,
            paddingTop: Platform.OS === "ios" ? 20 : top + 10,
          },
        ]}
      >
        <View style={tw`flex-1`}>
          <BackScreenButton cancle handleClick={() => navigation.goBack()} />
        </View>

        {selectedFilters.length > 0 && (
          <TouchableOpacity onPress={clearAllFilters}>
            <View
              style={[
                tw`flex-row items-center justify-center rounded-lg px-5 h-10 gap-2.5`,
                { backgroundColor: "#FAFAFA" },
              ]}
            >
              <Text style={[tw`text-sm`, { color: colors.primary_black }]}>
                Clear filters
              </Text>
              <Feather name="trash" size={18} color={colors.primary_black} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <ScrollWrapper style={tw`flex-1`}>
        {selectedFilters.length > 0 && (
          <View style={tw`flex-row items-center gap-2.5 mt-5 px-5 flex-wrap`}>
            {selectedFilters.map((filter, index) => (
              <FilterPill filter={filter.name} key={index} />
            ))}
          </View>
        )}
        <View style={tw`px-5 px-5 mt-4 gap-4`}>
          <PriceFilter />
          <YearFilter />
          <RarityFilter />
        </View>
        <View style={{ height: 200 }} />
      </ScrollWrapper>
      <View style={tw`absolute bottom-0 w-full p-5`}>
        <SafeAreaView>
          <LongBlackButton
            value={"Apply filters"}
            onClick={handleSubmitFilter}
            isLoading={isLoading}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}

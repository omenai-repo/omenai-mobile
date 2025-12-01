import { Platform, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import { filterStore } from "store/artworks/FilterStore";
import PriceFilter from "./PriceFilter";
import YearFilter from "./YearFilter";
import MediumFilter from "./MediumFilter";
import FilterPill from "./FilterPill";
import { artworkStore } from "store/artworks/ArtworkStore";
import { artworkActionStore } from "store/artworks/ArtworkActionStore";
import { fetchPaginatedArtworks } from "services/artworks/fetchPaginatedArtworks";
import RarityFilter from "./RarityFilter";
import BackScreenButton from "components/buttons/BackScreenButton";
import LongBlackButton from "components/buttons/LongBlackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import ScrollWrapper from "components/general/ScrollWrapper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type FilterProps = {
  children?: React.ReactNode;
};

export default function Filter({ children }: FilterProps) {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { filterOptions, selectedFilters, clearAllFilters } = filterStore();
  const { paginationCount, updatePaginationCount } = artworkActionStore();
  const { setArtworks, setIsLoading, setPageCount, isLoading } = artworkStore();

  const handleSubmitFilter = async () => {
    updatePaginationCount("reset");
    await fetchAndApply(paginationCount, filterOptions, true);
  };

  const handleClearAndApply = async () => {
    updatePaginationCount("reset");
    clearAllFilters();
    await fetchAndApply(
      1,
      { medium: [], price: [], rarity: [], year: [] },
      true
    );
  };

  const fetchAndApply = async (
    page: number,
    options: any,
    goBack: boolean = false
  ) => {
    try {
      setIsLoading(true);
      const response = await fetchPaginatedArtworks(page, options);
      if (response?.isOk) {
        setPageCount(response.count);
        setArtworks(response.data);
      }
    } finally {
      setIsLoading(false);
      if (goBack) navigation.goBack();
    }
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
        <View style={tw`flex-1 overflow-hidden`}>
          <BackScreenButton cancle handleClick={() => navigation.goBack()} />
        </View>

        {selectedFilters.length > 0 && (
          <TouchableOpacity onPress={handleClearAndApply}>
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
            {selectedFilters.map((filter) => (
              <FilterPill filter={filter.name} key={filter.name} />
            ))}
          </View>
        )}
        <View style={[tw`px-5 px-5 mt-4 gap-4`]}>
          <PriceFilter />
          <YearFilter />
          <MediumFilter />
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

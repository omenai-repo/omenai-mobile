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
import { SafeAreaView } from "react-native-safe-area-context";

type FilterProps = {
  children?: React.ReactNode;
};

export default function Filter({ children }: FilterProps) {
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
    await fetchAndApply(1, { medium: [], price: [], rarity: [], year: [] }, true);
  };

  const fetchAndApply = async (page: number, options: any, goBack: boolean = false) => {
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
      <SafeAreaView>
        <View
          style={[
            tw`flex-row items-center`,
            {
              backgroundColor: colors.white,
              paddingBottom: 10,
              paddingTop: Platform.OS === "ios" ? 20 : 50,
              gap: 10,
              paddingHorizontal: 20,
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
                  tw`flex-row items-center justify-center`,
                  {
                    backgroundColor: "#FAFAFA",
                    gap: 10,
                    height: 40,
                    paddingHorizontal: 20,
                    borderRadius: 30,
                  },
                ]}
              >
                <Text style={[tw`text-sm`, { color: colors.primary_black }]}>Clear filters</Text>
                <Feather name="trash" size={18} color={colors.primary_black} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
      <ScrollWrapper style={tw`flex-1`}>
        {selectedFilters.length > 0 && (
          <View
            style={[
              tw`flex-row items-center flex-wrap`,
              { gap: 10, marginTop: 20, paddingHorizontal: 20 },
            ]}
          >
            {selectedFilters.map((filter) => (
              <FilterPill filter={filter.name} key={filter.name} />
            ))}
          </View>
        )}
        <View style={[tw``, { gap: 15, marginTop: 30, paddingHorizontal: 20 }]}>
          <PriceFilter />
          <YearFilter />
          <MediumFilter />
          <RarityFilter />
        </View>
        <View style={{ height: 200 }} />
      </ScrollWrapper>
      <View style={[tw`absolute bottom-0 w-full`, { paddingHorizontal: 20, paddingVertical: 20 }]}>
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

import { Platform, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "config/colors.config";
import { Feather } from "@expo/vector-icons";
import BackScreenButton from "components/buttons/BackScreenButton";
import LongBlackButton from "components/buttons/LongBlackButton";
import ScrollWrapper from "components/general/ScrollWrapper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import FilterPill from "./FilterPill";

type FilterItem = {
  name: string;
  [key: string]: any;
};

type GenericFilterLayoutProps = {
  children: React.ReactNode;
  onApply: () => void;
  onClear: () => void;
  selectedFilters: FilterItem[];
  isLoading: boolean;
  title?: string;
};

export default function GenericFilterLayout({
  children,
  onApply,
  onClear,
  selectedFilters,
  isLoading,
  title,
}: GenericFilterLayoutProps) {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();

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
          <TouchableOpacity onPress={onClear}>
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
              <FilterPill
                filter={filter.name}
                key={`${filter.name}-${index}`}
              />
            ))}
          </View>
        )}
        <View style={[tw`px-5 px-5 mt-4 gap-4`]}>{children}</View>
        <View style={{ height: 200 }} />
      </ScrollWrapper>
      <View style={tw`absolute bottom-0 w-full p-5`}>
        <SafeAreaView>
          <LongBlackButton
            value={"Apply filters"}
            onClick={onApply}
            isLoading={isLoading}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}

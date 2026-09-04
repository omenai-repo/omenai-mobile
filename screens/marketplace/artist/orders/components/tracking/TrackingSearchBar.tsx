import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { SkeletonRow } from "./SkeletonRow";
import LongBlackButton from "#components/buttons/LongBlackButton";

interface TrackingSearchBarProps {
  trackingInput: string;
  setTrackingInput: (text: string) => void;
  handleSearch: () => void;
  isLoading: boolean;
}

export default function TrackingSearchBar({
  trackingInput,
  setTrackingInput,
  handleSearch,
  isLoading,
}: Readonly<TrackingSearchBarProps>) {
  return (
    <View style={tw`bg-white py-6`}>
      <Text style={tw`text-base font-sans-medium text-gray-900 mb-2`}>
        Enter Order ID
      </Text>
      <View
        style={tw`flex-row items-center bg-white rounded-sm border border-gray-200 overflow-hidden`}
      >
        <Ionicons name="search" size={20} color="#999" style={tw`pl-4`} />
        <TextInput
          style={tw`flex-1 px-3 font-sans-medium py-3 text-black`}
          placeholder="Order ID or tracking number"
          placeholderTextColor="#999"
          value={trackingInput}
          onChangeText={setTrackingInput}
          editable={!isLoading}
        />
      </View>
      <LongBlackButton
        value="Track"
        onClick={handleSearch}
        isLoading={isLoading}
        isDisabled={!trackingInput.trim()}
        style={tw`mt-4`}
      />

      {isLoading && (
        <View style={tw`mt-6 gap-3`}>
          <SkeletonRow widthPct={"60%"} height={16} />
          <SkeletonRow widthPct={"100%"} height={90} borderRadius={4} />
          <SkeletonRow widthPct={"100%"} height={120} borderRadius={4} />
        </View>
      )}
    </View>
  );
}

import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { SkeletonRow } from "./SkeletonRow";

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
    <View style={tw`bg-gray-50 bg-white`}>
      <View style={tw`px-4 py-4`}>
        <Text style={tw`text-base font-semibold text-gray-900 mb-2`}>
          Track Your Order
        </Text>

        <View style={tw`px-4 py-6`}>
          <Text style={tw`text-base font-semibold text-gray-900 mb-2`}>
            Enter Tracking Number
          </Text>
          <View
            style={tw`flex-row items-center bg-white rounded-xl border border-gray-200 overflow-hidden`}
          >
            <Ionicons name="search" size={20} color="#999" style={tw`pl-4`} />
            <TextInput
              style={tw`flex-1 px-4 py-3 text-base text-black`}
              placeholder="Order ID or tracking number"
              placeholderTextColor="#999"
              value={trackingInput}
              onChangeText={setTrackingInput}
              editable={!isLoading}
            />
          </View>
          <Pressable
            onPress={handleSearch}
            disabled={isLoading || !trackingInput.trim()}
            style={tw`bg-slate-900 rounded-xl py-3 mt-4 items-center justify-center ${
              isLoading || !trackingInput.trim() ? "opacity-50" : ""
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={tw`text-white font-semibold text-base`}>Track</Text>
            )}
          </Pressable>
        </View>

        {/* Loading skeletons (below input, not replacing it) */}
        {isLoading && (
          <View style={tw`mt-4`}>
            <SkeletonRow widthPct={"60%"} height={16} />
            <View style={tw`h-3`} />
            <SkeletonRow widthPct={"100%"} height={90} borderRadius={12} />
            <View style={tw`h-3`} />
            <SkeletonRow widthPct={"100%"} height={120} borderRadius={12} />
          </View>
        )}
      </View>
    </View>
  );
}

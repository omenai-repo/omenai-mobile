import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import tw from "twrnc";

import { colors } from "#config/colors.config";

export function RosterLoadingState() {
  return (
    <View style={tw`flex-1 items-center justify-center py-20`}>
      <ActivityIndicator color={colors.black} />
      <Text style={tw`text-xs uppercase tracking-widest text-neutral-400 mt-4`}>
        Loading roster…
      </Text>
    </View>
  );
}

type RosterEmptyStateProps = {
  readonly onAddPress: () => void;
};

export function RosterEmptyState({ onAddPress }: Readonly<RosterEmptyStateProps>) {
  return (
    <View
      style={tw`mx-5 mt-8 py-16 px-6 border border-dashed border-neutral-200 bg-neutral-50 rounded-sm items-center`}
    >
      <Text style={tw`text-sm text-neutral-500 text-center mb-4`}>
        Your roster is currently empty.
      </Text>
      <Pressable onPress={onAddPress}>
        <Text
          style={[
            tw`text-xs uppercase tracking-widest pb-0.5`,
            { borderBottomWidth: 1, borderBottomColor: colors.black, color: colors.black },
          ]}
        >
          Add your first artist
        </Text>
      </Pressable>
    </View>
  );
}

type RosterNoSearchResultsStateProps = {
  readonly searchTerm: string;
  readonly onClearSearch: () => void;
};

export function RosterNoSearchResultsState({
  searchTerm,
  onClearSearch,
}: Readonly<RosterNoSearchResultsStateProps>) {
  return (
    <View
      style={tw`mx-5 mt-8 py-16 border border-neutral-100 bg-white rounded-sm items-center px-6`}
    >
      <Text style={tw`text-sm text-neutral-500 text-center`}>
        No artists found matching &quot;{searchTerm}&quot;
      </Text>
      <Pressable onPress={onClearSearch} style={tw`mt-4`}>
        <Text
          style={[
            tw`text-xs uppercase tracking-widest pb-0.5`,
            { borderBottomWidth: 1, borderBottomColor: colors.black, color: colors.black },
          ]}
        >
          Clear search
        </Text>
      </Pressable>
    </View>
  );
}

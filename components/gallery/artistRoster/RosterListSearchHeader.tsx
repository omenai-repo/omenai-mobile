import React from "react";
import { Text, TextInput, View } from "react-native";
import tw from "twrnc";

import { colors } from "#config/colors.config";

type RosterListSearchHeaderProps = {
  readonly searchTerm: string;
  readonly onSearchTermChange: (t: string) => void;
};

export function RosterListSearchHeader({
  searchTerm,
  onSearchTermChange,
}: Readonly<RosterListSearchHeaderProps>) {
  return (
    <View style={tw`mb-4`}>
      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
        Search roster
      </Text>
      <TextInput
        value={searchTerm}
        onChangeText={onSearchTermChange}
        placeholder="Search roster…"
        placeholderTextColor="#a3a3a3"
        style={[
          tw`border border-neutral-200 rounded-sm px-3 py-3 text-sm`,
          { color: colors.black },
        ]}
      />
    </View>
  );
}

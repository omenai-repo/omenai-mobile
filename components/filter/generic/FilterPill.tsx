import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "config/colors.config";
import tw from "twrnc";

export default function GenericFilterPill({
  filter,
  onRemove,
}: {
  filter: string;
  onRemove: () => void;
}) {
  return (
    <TouchableOpacity onPress={onRemove}>
      <View
        style={[
          tw`flex-row items-center gap-2.5 py-2.5 px-4 rounded-lg`,
          { backgroundColor: colors.primary_black },
        ]}
      >
        <Text style={{ fontSize: 14, color: colors.white }}>{filter}</Text>
        <Feather name="x" size={20} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
}

import React from "react";
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "#config/colors.config";
import type { PickedAsset } from "../helpers/createEventHelpers";

type CoverImageSectionProps = Readonly<{
  coverPreviewUri: string;
  error?: string;
  onPress: () => void;
}>;

export function CoverImageSection({
  coverPreviewUri,
  error,
  onPress,
}: CoverImageSectionProps) {
  return (
    <>
      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
        Cover Image
      </Text>
      <Pressable
        onPress={onPress}
        style={[
          tw`w-full rounded-sm border overflow-hidden mb-1`,
          { borderColor: colors.inputBorder, backgroundColor: "#FAFAFA" },
        ]}
      >
        {coverPreviewUri ? (
          <Image
            source={{ uri: coverPreviewUri }}
            style={tw`h-48 w-full bg-neutral-100`}
            resizeMode="cover"
          />
        ) : (
          <View style={tw`h-40 items-center justify-center bg-neutral-50`}>
            <Ionicons name="image-outline" size={36} color="#A3A3A3" />
            <Text style={tw`text-xs text-neutral-500 mt-2`}>Tap to choose cover</Text>
          </View>
        )}
      </Pressable>
      {error ? (
        <Text style={tw`text-[10px] text-red-600 mb-4`}>{error}</Text>
      ) : (
        <View style={tw`mb-4`} />
      )}
    </>
  );
}

type InstallationViewsSectionProps = Readonly<{
  assets: PickedAsset[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}>;

export function InstallationViewsSection({
  assets,
  onAdd,
  onRemove,
}: InstallationViewsSectionProps) {
  return (
    <>
      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
        Installation Views (optional)
      </Text>
      <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
        {assets.map((a, index) => (
          <View key={`${a.uri}-${a.name}`} style={tw`w-[88px]`}>
            <Image
              source={{ uri: a.uri }}
              style={tw`h-20 rounded-sm bg-neutral-200`}
            />
            <Pressable onPress={() => onRemove(index)} style={tw`mt-1 py-1`}>
              <Text style={tw`text-[10px] text-red-600 text-center`}>Remove</Text>
            </Pressable>
          </View>
        ))}
        <TouchableOpacity
          onPress={onAdd}
          style={[
            tw`h-20 w-20 border border-dashed rounded-sm items-center justify-center`,
            { borderColor: colors.inputBorder, backgroundColor: "#FAFAFA" },
          ]}
        >
          <Ionicons name="add" size={28} color="#737373" />
        </TouchableOpacity>
      </View>
    </>
  );
}

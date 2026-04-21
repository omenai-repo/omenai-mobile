import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";

import { colors } from "#config/colors.config";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";
import type { RosterArtist } from "#types/roster.types";

type RosterArtistRowProps = {
  artist: RosterArtist;
  onRemovePress: (a: RosterArtist) => void;
  /** When set, all remove actions are disabled; this row shows "Removing…" if it matches. */
  removingArtistId?: string | null;
};

export function RosterArtistRow({
  artist,
  onRemovePress,
  removingArtistId = null,
}: RosterArtistRowProps) {
  const isThisRow = removingArtistId === artist.artist_id;
  const removeLocked = removingArtistId !== null;
  const imageUri = artist.logo ? getGalleryLogoFileView(artist.logo, 200, 200) : null;

  return (
    <View
      style={tw`bg-white border border-neutral-100 rounded-sm p-4 mb-3 flex-row items-start justify-between`}
    >
      <View style={tw`flex-row flex-1 gap-3`}>
        <View
          style={tw`h-12 w-12 shrink-0 rounded-sm bg-neutral-100 overflow-hidden items-center justify-center`}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={tw`h-12 w-12`} />
          ) : (
            <Text style={tw`text-xs font-medium text-neutral-500 tracking-wider`}>
              {artist.name.substring(0, 2).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={tw`flex-1 min-w-0`}>
          <View style={tw`flex-row items-center gap-1`}>
            <Text
              style={[tw`text-base font-medium flex-shrink`, { color: colors.black }]}
              numberOfLines={2}
            >
              {artist.name}
            </Text>
            {artist.artist_verified ? (
              <Feather name="check-circle" size={16} color="#2563eb" />
            ) : null}
          </View>
          <Text style={tw`text-xs text-neutral-400 mt-0.5`}>
            {artist.profile_status === "claimed" ? "Registered Profile" : "Gallery Managed"}
          </Text>
          {(artist.country_of_origin || artist.birthyear) && (
            <Text style={tw`text-[11px] text-neutral-400 mt-1`}>
              {[artist.country_of_origin, artist.birthyear ? `b. ${artist.birthyear}` : ""]
                .filter(Boolean)
                .join(", ")}
            </Text>
          )}
        </View>
      </View>
      <Pressable
        onPress={() => onRemovePress(artist)}
        disabled={removeLocked}
        hitSlop={8}
        style={tw`py-1 pl-2`}
      >
        <Text
          style={[
            tw`text-[10px] uppercase tracking-widest`,
            removeLocked && !isThisRow ? tw`text-neutral-300` : tw`text-red-500`,
          ]}
        >
          {isThisRow ? "Removing…" : "Remove"}
        </Text>
      </Pressable>
    </View>
  );
}

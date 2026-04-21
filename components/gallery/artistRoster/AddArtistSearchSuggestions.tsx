import React from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import tw from "twrnc";

import { colors } from "#config/colors.config";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";
import type { ArtistSearchResult } from "#types/roster.types";

import { formFieldLabelStyle, formTextInputStyle } from "./addArtistFormStyles";

type AddArtistSearchSuggestionsProps = {
  galleryId: string;
  query: string;
  onQueryChange: (text: string) => void;
  onFocusSearch: () => void;
  trimmedQuery: string;
  isDraftingSuggestion: boolean;
  isSearching: boolean;
  results: ArtistSearchResult[];
  artistId: string;
  onSelectArtist: (selected: ArtistSearchResult) => void;
  onCreateNew: () => void;
  onCommitTypedAsNewGhost: () => void;
};

export function AddArtistSearchSuggestions({
  galleryId,
  query,
  onQueryChange,
  onFocusSearch,
  trimmedQuery,
  isDraftingSuggestion,
  isSearching,
  results,
  artistId,
  onSelectArtist,
  onCreateNew,
  onCommitTypedAsNewGhost,
}: AddArtistSearchSuggestionsProps) {
  return (
    <>
      {!galleryId ? (
        <Text style={tw`text-sm text-red-600 mb-4`}>
          Gallery account could not be loaded. Close this screen and try again.
        </Text>
      ) : null}
      <Text style={formFieldLabelStyle}>Artist name</Text>
      <TextInput
        value={query}
        onChangeText={onQueryChange}
        onFocus={onFocusSearch}
        placeholder="Search or enter artist name…"
        placeholderTextColor={colors.inputLabel}
        style={formTextInputStyle}
      />

      {isDraftingSuggestion && (
        <View
          style={tw`mt-2 border border-neutral-100 rounded-sm bg-white max-h-72 overflow-hidden`}
        >
          {trimmedQuery.length >= 2 ? (
            isSearching ? (
              <View style={tw`p-4 flex-row items-center gap-2`}>
                <ActivityIndicator size="small" color={colors.black} />
                <Text style={tw`text-xs text-neutral-500 tracking-wide`}>Searching…</Text>
              </View>
            ) : (
              <>
                {results.map((res) => (
                  <Pressable
                    key={res.artist_id}
                    onPress={() => onSelectArtist(res)}
                    style={tw`flex-row items-center gap-3 p-3 border-b border-neutral-50`}
                  >
                    <View style={tw`h-8 w-8 rounded-full bg-neutral-100 overflow-hidden items-center justify-center`}>
                      {res.logo ? (
                        <Image
                          source={{ uri: getGalleryLogoFileView(res.logo, 64, 64) }}
                          style={tw`h-8 w-8`}
                        />
                      ) : (
                        <Text style={tw`text-[10px] font-medium text-neutral-500`}>
                          {res.name.substring(0, 2).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={tw`flex-1 min-w-0`}>
                      <Text style={[tw`text-sm font-medium`, { color: colors.black }]} numberOfLines={1}>
                        {res.name}
                      </Text>
                      <Text style={tw`text-[11px] text-neutral-500 mt-0.5`} numberOfLines={2}>
                        {res.profile_status === "claimed"
                          ? `Claimed profile • ${res.location || "Unknown location"}`
                          : `Unclaimed profile • ${res.represented_by ? `Represented by ${res.represented_by}` : "Unrepresented"}`}
                      </Text>
                    </View>
                  </Pressable>
                ))}
                <Pressable
                  onPress={onCreateNew}
                  style={tw`flex-row items-center gap-2 p-3 border-t border-neutral-100`}
                >
                  <View style={tw`w-5 h-5 rounded-full bg-neutral-900 items-center justify-center`}>
                    <Text style={tw`text-white text-xs`}>+</Text>
                  </View>
                  <Text style={[tw`text-sm font-medium flex-1`, { color: colors.black }]} numberOfLines={2}>
                    Create new artist: &quot;{trimmedQuery}&quot;
                  </Text>
                </Pressable>
              </>
            )
          ) : (
            <Pressable onPress={onCreateNew} style={tw`flex-row items-center gap-2 p-3`}>
              <View style={tw`w-5 h-5 rounded-full bg-neutral-900 items-center justify-center`}>
                <Text style={tw`text-white text-xs`}>+</Text>
              </View>
              <Text style={[tw`text-sm font-medium flex-1`, { color: colors.black }]} numberOfLines={2}>
                Create new artist: &quot;{trimmedQuery}&quot;
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {isDraftingSuggestion && !artistId && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Use typed name as new artist and continue below"
          onPress={() => {
            Keyboard.dismiss();
            onCommitTypedAsNewGhost();
          }}
          style={tw`mt-3 self-stretch px-2 py-2`}
        >
          <Text style={tw`text-xs text-neutral-500 text-center underline`}>
            Use &quot;{trimmedQuery}&quot; as a new artist — then add birth year and country below
          </Text>
        </Pressable>
      )}
    </>
  );
}

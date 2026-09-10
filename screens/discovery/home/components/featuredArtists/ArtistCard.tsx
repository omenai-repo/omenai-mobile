import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { getArtistInitials } from "#utils/core/getArtistInitials";
import FollowComponent from "#components/follow/FollowComponent";
import { MaterialIcons } from "@expo/vector-icons";

type ArtistCardProps = {
  artist: any;
  isFollowing: boolean;
  onToggleFollow: (artistId: string) => void;
  onPressArtist: () => void;
  disabled?: boolean;
};

const ArtistCard = ({
  artist,
  isFollowing,
  onToggleFollow,
  onPressArtist,
  disabled = false,
}: ArtistCardProps) => {
  const artworkUrl = artist.mostLikedArtwork?.url;
  const imageUri = artworkUrl ? getImageFileView(artworkUrl, 300) : null;
  const displayName = artist.artist ?? artist.name ?? "";

  return (
    <View style={tw`w-[300px]`}>
      <Pressable onPress={onPressArtist}>
        <View
          style={tw`w-full h-[200px] rounded-sm bg-neutral-200 items-center justify-center overflow-hidden`}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : (
            <Text style={tw`font-serif text-4xl text-neutral-500`}>
              {getArtistInitials(displayName)}
            </Text>
          )}
        </View>
      </Pressable>

      <View style={tw`flex-row items-center justify-between mt-[10px]`}>
        <Pressable onPress={onPressArtist} style={tw`flex-1`}>
          <View>
            <Text
              numberOfLines={1}
              style={tw`font-serif text-base text-neutral-900`}
            >
              {artist.artist}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              <MaterialIcons
                name="verified"
                size={18}
                color={tw.color("blue-600")}
              />
              <Text style={tw`ml-1 text-sm font-sans-regular`}>Verified</Text>
            </View>
          </View>
        </Pressable>

        <View style={tw`ml-3`}>
          <FollowComponent
            isFollowing={isFollowing}
            onPress={() => onToggleFollow(artist.author_id)}
            disabled={disabled}
          />
        </View>
      </View>
    </View>
  );
};

export default ArtistCard;

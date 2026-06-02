import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { getImageFileView } from "#lib/storage/getImageFileView";
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
  const imageUri = getImageFileView(artist.mostLikedArtwork.url, 300);
  return (
    <View style={tw`w-[300px]`}>
      <Pressable onPress={onPressArtist}>
        <Image
          source={{ uri: imageUri }}
          style={tw`w-full h-[200px] rounded-sm`}
          resizeMode="cover"
        />
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

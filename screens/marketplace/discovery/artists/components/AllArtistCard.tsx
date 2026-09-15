import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";
import FollowComponent from "#components/follow/FollowComponent";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { getArtistInitials } from "#utils/core/getArtistInitials";

export type DirectoryArtist = {
  artist_id: string;
  name: string;
  logo?: string;
  cardImage?: string;
  cardImageIsArtwork?: boolean;
  country_of_origin?: string;
  birthyear?: string;
  followerCount?: number;
};

type Props = {
  readonly artist: DirectoryArtist;
  readonly cardWidth: number;
  readonly isFollowing: boolean;
  readonly onToggleFollow: (artistId: string) => void;
  readonly onPressArtist: () => void;
  readonly disabled?: boolean;
};

export default function AllArtistCard({
  artist,
  cardWidth,
  isFollowing,
  onToggleFollow,
  onPressArtist,
  disabled = false,
}: Readonly<Props>) {
  const [imgError, setImgError] = useState(false);
  const imageH = (cardWidth * 4) / 5;
  const locationParts = [
    artist.country_of_origin,
    artist.birthyear ? `b. ${artist.birthyear}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const imageKey = artist.cardImage;
  let imageUri: string | null = null;
  if (imageKey) {
    imageUri = getImageFileView(imageKey, 600);
  }
  const showInitials = !imageUri || imgError;

  useEffect(() => {
    setImgError(false);
  }, [artist.artist_id, artist.cardImage]);

  return (
    <View style={[{ width: cardWidth }]}>
      <Pressable
        onPress={onPressArtist}
        style={({ pressed }) => [pressed && tw`opacity-90`]}
      >
        <View
          style={[
            tw`w-full bg-neutral-100 rounded-sm overflow-hidden items-center justify-center`,
            { width: cardWidth, height: imageH },
          ]}
        >
          {showInitials ? (
            <Text style={tw`font-serif text-4xl text-neutral-400`}>
              {getArtistInitials(artist.name)}
            </Text>
          ) : (
            <Image
              source={{ uri: imageUri! }}
              style={tw`w-full h-full`}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          )}
        </View>
      </Pressable>

      <View style={tw`mt-3 flex-row items-start justify-between`}>
        <Pressable
          onPress={onPressArtist}
          style={({ pressed }) => [
            tw`flex-1 pr-2 min-w-0`,
            pressed && tw`opacity-80`,
          ]}
        >
          <View style={tw`flex-row items-center`}>
            <Text
              numberOfLines={1}
              style={tw`font-serif text-sm text-neutral-900 shrink`}
            >
              {artist.name}
            </Text>
            <MaterialIcons
              name="verified"
              size={16}
              color={tw.color("blue-600")}
              style={tw`ml-1`}
            />
          </View>
          {!!locationParts && (
            <Text
              numberOfLines={1}
              style={tw`mt-1.5 text-[10px] uppercase tracking-widest text-neutral-500 font-sans-regular`}
            >
              {locationParts}
            </Text>
          )}
        </Pressable>
        <FollowComponent
          isFollowing={isFollowing}
          onPress={() => onToggleFollow(artist.artist_id)}
          disabled={disabled}
        />
      </View>
    </View>
  );
}

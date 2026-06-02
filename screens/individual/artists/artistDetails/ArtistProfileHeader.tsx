import React from "react";
import { Image, Text, View } from "react-native";
import tw from "twrnc";
import FollowComponent from "#components/follow/FollowComponent";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";
import { useArtistFollow } from "#hooks/useArtistFollow";
import type { ArtistProfileData } from "#services/partners/artistPartnerApi";
import { getArtistInitials } from "#utils/getArtistInitials";

type Props = {
  artistId: string;
  profile?: ArtistProfileData | null;
  nameFallback: string;
  logoFallback?: string;
  birthyearFallback?: string;
  countryFallback?: string;
};

export default function ArtistProfileHeader({
  artistId,
  profile,
  nameFallback,
  logoFallback,
  birthyearFallback,
  countryFallback,
}: Props) {
  const { isFollowingFor, toggleFollow, isLoadingFollowed, hasUser } =
    useArtistFollow();
  const isFollowing = isFollowingFor(artistId);

  const name = profile?.name ?? nameFallback;
  const logo = profile?.logo ?? logoFallback;
  const birthyear = (profile?.birthyear ?? birthyearFallback)?.trim();
  const country =
    profile?.country_of_origin?.trim() ||
    profile?.address?.country?.trim() ||
    countryFallback?.trim();
  const city = profile?.address?.city?.trim();
  const locationLine = [city, country].filter(Boolean).join(city && country ? ", " : "");

  const metaParts = [
    birthyear ? `Born ${birthyear}` : "",
    locationLine,
  ].filter(Boolean);
  const metaLine = metaParts.join(" · ");

  return (
    <View
      style={tw`w-full bg-white px-4 pt-2 pb-5 border-b border-neutral-100`}
    >
      <View style={tw`flex-row items-start justify-between gap-3`}>
        <View style={tw`flex-row items-start flex-1 min-w-0`}>
          <View
            style={tw`w-20 h-20 rounded-full overflow-hidden mr-4 bg-neutral-100 border border-neutral-200 items-center justify-center`}
          >
            {logo ? (
              <Image
                source={{ uri: getGalleryLogoFileView(logo, 400) }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            ) : (
              <Text style={tw`font-serif text-2xl text-neutral-500`}>
                {getArtistInitials(name)}
              </Text>
            )}
          </View>
          <View style={tw`flex-1 min-w-0 pt-1`}>
            <Text
              numberOfLines={2}
              style={tw`font-serif text-3xl text-neutral-900 leading-tight tracking-tight`}
            >
              {name}
            </Text>
            {!!metaLine && (
              <Text
                style={tw`mt-1.5 text-sm text-neutral-500 font-sans-regular`}
              >
                {metaLine}
              </Text>
            )}
          </View>
        </View>
        <View style={tw`shrink-0 pt-2`}>
          <FollowComponent
            isFollowing={isFollowing}
            onPress={() => toggleFollow(artistId)}
            disabled={!hasUser || isLoadingFollowed}
          />
        </View>
      </View>
    </View>
  );
}

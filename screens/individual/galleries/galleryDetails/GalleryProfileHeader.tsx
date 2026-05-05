import React from "react";
import { Image, Text, View } from "react-native";
import tw from "twrnc";
import FollowComponent from "#components/follow/FollowComponent";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";
import { useGalleryFollow } from "#hooks/useGalleryFollow";
import type { GalleryProfile } from "#services/partners/galleryPartnerApi";

type Props = {
  galleryId: string;
  profile?: GalleryProfile | null;
  nameFallback: string;
};

export default function GalleryProfileHeader({ galleryId, profile, nameFallback }: Props) {
  const { isFollowingFor, toggleFollow, isLoadingFollowed, hasUser } = useGalleryFollow();
  const isFollowing = isFollowingFor(galleryId);
  const name = profile?.name ?? nameFallback;
  const city = profile?.address?.city;
  const country = profile?.address?.country;
  const locationLine = [city, country].filter(Boolean).join(city && country ? ", " : "");

  return (
    <View style={tw`w-full bg-white px-4 pt-2 pb-6`}>
      <View style={tw`flex-row items-start justify-between gap-3`}>
        <View style={tw`flex-row items-start flex-1 min-w-0`}>
          {!!profile?.logo && (
            <View style={tw`w-20 h-20 overflow-hidden p-1 mr-4`}>
              <Image
                source={{ uri: getGalleryLogoFileView(profile.logo, 400) }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>
          )}
          <View style={tw`flex-1 min-w-0`}>
            <Text
              numberOfLines={2}
              style={tw`font-serif text-3xl text-neutral-900 leading-tight tracking-tight`}
            >
              {name}
            </Text>
            {!!locationLine && (
              <Text style={tw`mt-1.5 text-sm text-neutral-500 font-sans-regular`}>{locationLine}</Text>
            )}
          </View>
        </View>
        <View style={tw`shrink-0 pt-1`}>
          <FollowComponent
            isFollowing={isFollowing}
            onPress={() => {
              toggleFollow(galleryId);
            }}
            disabled={!hasUser || isLoadingFollowed}
          />
        </View>
      </View>
    </View>
  );
}

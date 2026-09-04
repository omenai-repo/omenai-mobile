import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { getArtistInitials } from "#utils/core/getArtistInitials";
import { useArtistWorks } from "#screens/marketplace/discovery/hooks/useArtistWorks";
import ArtistProfileHeader from "#screens/marketplace/discovery/artists/artistDetails/ArtistProfileHeader";
import ArtistBioSection from "#screens/marketplace/discovery/artists/artistDetails/ArtistBioSection";
import ArtistWorksContent from "#screens/marketplace/discovery/artists/artistDetails/ArtistWorksContent";

type RouteParams = RouteProp<
  {
    params: {
      artistId: string;
      name?: string;
      logo?: string;
      coverUrl?: string;
      birthyear?: string;
      country?: string;
    };
  },
  "params"
>;

export default function ArtistDetailsScreen() {
  const route = useRoute<RouteParams>();
  const {
    artistId,
    name: nameFallback,
    logo,
    coverUrl,
    birthyear: birthyearFallback,
    country: countryFallback,
  } = route.params;

  const [mediumFilter, setMediumFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const filters = useMemo(
    () => ({ medium: mediumFilter, price: priceFilter }),
    [mediumFilter, priceFilter],
  );

  const worksQuery = useArtistWorks(artistId, filters);
  const profile = worksQuery.data?.pages?.[0]?.artist;
  const artistName = profile?.name ?? nameFallback ?? "Artist";
  const [bio, setBio] = useState<string | null>(null);

  useEffect(() => {
    const nextBio = profile?.bio?.trim();
    if (nextBio) setBio(nextBio);
  }, [profile?.bio]);

  const coverImageUrl = useMemo(() => {
    if (coverUrl) return getImageFileView(coverUrl, 1200);
    const first = worksQuery.data?.pages?.[0]?.data?.[0]?.url;
    return first ? getImageFileView(first, 1200) : null;
  }, [coverUrl, worksQuery.data?.pages]);

  const showError =
    worksQuery.isError && !(worksQuery.data?.pages?.length ?? 0);

  return (
    <>
      <BackHeaderTitle title='' />
      <ScrollView style={tw`flex-1 bg-white`}>
        <View style={tw`relative w-full h-[200px] bg-neutral-900`}>
          {coverImageUrl ? (
            <>
              <Image
                source={{ uri: coverImageUrl }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
              <View style={tw`absolute inset-0 bg-black/30`} />
            </>
          ) : (
            <View style={tw`flex-1 items-center justify-center bg-neutral-800`}>
              <Text style={tw`font-serif text-5xl text-neutral-300`}>
                {getArtistInitials(artistName)}
              </Text>
            </View>
          )}
        </View>

        <ArtistProfileHeader
          artistId={artistId}
          profile={profile}
          nameFallback={nameFallback ?? "Artist"}
          logoFallback={logo}
          birthyearFallback={birthyearFallback}
          countryFallback={countryFallback}
        />

        <ArtistBioSection bio={bio} />

        {showError ? (
          <View style={tw`flex-1 items-center justify-center px-6 pt-8`}>
            <Text
              style={tw`text-center text-xs uppercase tracking-widest text-neutral-400`}
            >
              Could not load this artist. Try again, or go back.
            </Text>
            <Pressable
              onPress={() => worksQuery.refetch()}
              style={tw`mt-4 border border-neutral-300 rounded-sm px-4 py-2`}
            >
              <Text style={tw`text-sm text-neutral-900`}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <ArtistWorksContent
            worksQuery={worksQuery}
            mediumFilter={mediumFilter}
            priceFilter={priceFilter}
            onMediumChange={setMediumFilter}
            onPriceChange={setPriceFilter}
          />
        )}
      </ScrollView>
    </>
  );
}

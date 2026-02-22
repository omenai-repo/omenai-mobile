import React from "react";
import { Text, View, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import tw from "twrnc";
import { getFeaturedArtists } from "#services/overview/fetchFeaturedArtist";
import { HOME_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import ArtistCard from "./ArtistCard";
import SectionHeader from "#components/general/SectionHeader";

type Artist = {
  author_id: string;
  mostLikedArtwork: {
    url: string;
    artworkId: string;
    birthyear: string;
    country: string;
  };
  artist: string;
  totalLikes: number;
};

const FeaturedArtists = () => {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();

  const { data: artists = [] } = useQuery({
    queryKey: HOME_QK.featuredArtists(userSession?.id),
    queryFn: async () => {
      const res = await getFeaturedArtists();
      return res?.isOk && Array.isArray(res.data) ? (res.data as Artist[]) : [];
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });

  return (
    <View style={tw`mt-6`}>
      <SectionHeader subtitle="FEATURED ARTISTS" title="Artists to watch" />

      {artists.length > 0 ? (
        <FlatList
          data={artists}
          keyExtractor={(item) => item.author_id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-5 pt-5 gap-5`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("DetailsScreen", {
                  type: "artist",
                  id: item.author_id,
                  name: item.artist,
                  logo: item.mostLikedArtwork.url,
                })
              }
            >
              <ArtistCard
                image={item.mostLikedArtwork.url}
                name={item.artist}
                details={item.mostLikedArtwork}
                totalLikes={item.totalLikes}
              />
            </Pressable>
          )}
        />
      ) : (
        <View style={tw`p-[30px]`}>
          <Text style={tw`text-[#858585] text-center`}>
            No featured artists available
          </Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(FeaturedArtists);

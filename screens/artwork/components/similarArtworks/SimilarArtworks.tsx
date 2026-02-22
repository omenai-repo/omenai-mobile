import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import ArtworkCard from "#components/artwork/ArtworkCard";
import { fetchArtworksByCriteria } from "#services/artworks/fetchArtworksByCriteria";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import { FlatList } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { Feather } from "@expo/vector-icons";
import { ArtworkFlatlistItem } from "#types/types";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";

export default function SimilarArtworks({
  medium,
  title = "",
}: Readonly<{
  medium: string;
  title: string;
}>) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { data, isLoading } = useQuery({
    queryKey: ["similarArtworks", medium],
    queryFn: async () => {
      const results = await fetchArtworksByCriteria({
        medium,
        page: 1,
        filters: null,
      });

      if (results.isOk) {
        let resultsData = results.data as ArtworkFlatlistItem[];
        if (resultsData.length > 0) {
          const parsedResults = resultsData.filter((artwork) => {
            return artwork.title !== title;
          });

          return parsedResults.splice(0, 4);
        }
      }
      return [];
    },
  });

  if (!isLoading && (!data || data.length === 0)) {
    return null;
  }

  return (
    <View style={tw`mb-5`}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screenName.artworksMedium, {
            catalog: medium,
          })
        }
      >
        <View style={tw`flex-row items-center gap-[10px] px-5`}>
          <Text
            style={[tw`text-sm font-medium flex-1`, { color: colors.black }]}
          >
            Hot Recommendations
          </Text>
          <Feather name="chevron-right" color={colors.black} size={20} />
        </View>
      </TouchableOpacity>
      <View style={tw`mt-5`}>
        {isLoading ? (
          <ArtworkCardLoader />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ArtworkCard
                art_id={item.art_id}
                title={item.title}
                url={item.url}
                artist={item.artist}
                showPrice={item.pricing.shouldShowPrice === "Yes"}
                price={item.pricing.usd_price}
              />
            )}
            contentContainerStyle={tw`px-5 gap-5`}
            keyExtractor={(item) => item.title}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

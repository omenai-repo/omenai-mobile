import React from "react";
import { fetchArtworksByCriteria } from "#services/artworks/fetchArtworksByCriteria";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { ArtworkFlatlistItem } from "#types/types";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import ArtworkListSection from "./ArtworkListSection";

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

  return (
    <ArtworkListSection
      title="Hot Recommendations"
      data={data || []}
      isLoading={isLoading}
      onHeaderPress={() =>
        navigation.navigate(screenName.artworksMedium, {
          catalog: medium,
        })
      }
      containerStyle={tw`mt-5`}
    />
  );
}

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchArtworkByArtist } from "#services/artworks/fetchArtworkByArtist";
import ArtworkListSection from "./ArtworkListSection";
import tw from "twrnc";

interface SimilarArtworksByArtistProps {
  artist: string;
  currentArtworkTitle: string;
}

export default function SimilarArtworksByArtist({
  artist,
  currentArtworkTitle,
}: Readonly<SimilarArtworksByArtistProps>) {
  const { data: similarArtworks = [], isLoading } = useQuery({
    queryKey: ["artist-artworks", artist],
    enabled: !!artist,
    queryFn: async () => {
      const res = await fetchArtworkByArtist(artist);
      if (!res?.isOk) return [];
      const list = res.body.data as any[];
      return list.filter((a) => a.title !== currentArtworkTitle);
    },
  });

  return (
    <ArtworkListSection
      title={`Other Works by ${artist}`}
      data={similarArtworks}
      isLoading={isLoading}
      containerStyle={tw`mt-10`}
    />
  );
}

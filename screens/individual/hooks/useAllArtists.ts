import { useQuery } from "@tanstack/react-query";
import { getArtists } from "#services/overview/fetchArtist";
import { ARTIST_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import type { DirectoryArtist } from "#screens/individual/artists/components/AllArtistCard";

type ArtistApiRow = {
  artist_id?: string;
  author_id?: string;
  name?: string;
  artist?: string;
  logo?: string;
  mostLikedArtwork?: {
    url?: string;
    birthyear?: string;
    country?: string;
  };
  country_of_origin?: string;
  artistCountry?: string;
  birthyear?: string;
  followerCount?: number;
};

function toDirectoryArtist(row: ArtistApiRow): DirectoryArtist | null {
  const artist_id = String(row.artist_id ?? row.author_id ?? "").trim();
  if (!artist_id) return null;

  const artworkUrl = row.mostLikedArtwork?.url?.trim();
  
  return {
    artist_id,
    name: row.name ?? row.artist ?? "Artist",
    logo: row.logo,
    cardImage: artworkUrl || row.logo,
    cardImageIsArtwork: Boolean(artworkUrl),
    country_of_origin:
      row.country_of_origin ??
      row.artistCountry ??
      row.mostLikedArtwork?.country,
    birthyear: row.birthyear ?? row.mostLikedArtwork?.birthyear,
    followerCount: row.followerCount,
  };
}

function mergeArtistsDirectory(
  featured: ArtistApiRow[] = [],
  all: ArtistApiRow[] = [],
): DirectoryArtist[] {
  const seen = new Set<string>();
  const merged: DirectoryArtist[] = [];

  for (const row of [...featured, ...all]) {
    const artist = toDirectoryArtist(row);
    if (!artist || seen.has(artist.artist_id)) continue;
    seen.add(artist.artist_id);
    merged.push(artist);
  }

  return merged;
}

export function useAllArtists() {
  const { userSession } = useAppStore();

  return useQuery({
    queryKey: ARTIST_QK.directory(userSession?.id),
    queryFn: async () => {
      const res = await getArtists();
      if (!res?.isOk) {
        throw new Error(
          res?.message || res?.body?.message || "Failed to load artists.",
        );
      }

      return mergeArtistsDirectory(
        res.data?.featured_artists ?? [],
        res.data?.all_artists ?? [],
      );
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });
}

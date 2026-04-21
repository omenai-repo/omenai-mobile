export type RosterArtist = {
  artist_id: string;
  name: string;
  profile_status: "claimed" | "ghost";
  artist_verified: boolean;
  logo: string | null;
  birthyear?: string;
  country_of_origin?: string;
};

export type ArtistSearchResult = {
  artist_id: string;
  name: string;
  profile_status: "claimed" | "ghost";
  artist_verified: boolean;
  logo: string | null;
  birthyear?: string;
  country_of_origin?: string;
  location?: string;
  represented_by?: string;
};

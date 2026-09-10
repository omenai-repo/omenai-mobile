import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";
import type { ArtistSearchResult, RosterArtist } from "#types/roster.types";

export async function fetchGalleryRoster(gallery_id: string) {
  if (!gallery_id) {
    return {
      isOk: false,
      message: "Missing gallery id",
      roster: [] as RosterArtist[],
    };
  }

  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/gallery/roster?gallery_id=${encodeURIComponent(gallery_id)}`,
      { method: "GET" },
    );
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result.message,
      roster: (Array.isArray(result.roster) ? result.roster : []) as RosterArtist[],
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        "An error was encountered, please try again later or contact support",
      roster: [] as RosterArtist[],
    };
  }
}

export async function searchArtistsForRoster(query: string) {
  const q = query.trim();
  if (q.length < 2) {
    return { isOk: true, message: "", results: [] as ArtistSearchResult[] };
  }

  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/gallery/fetchArtists?q=${encodeURIComponent(q)}`,
      { method: "GET" },
    );
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result.message,
      results: (Array.isArray(result.results) ? result.results : []) as ArtistSearchResult[],
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        "An error was encountered, please try again later or contact support",
      results: [] as ArtistSearchResult[],
    };
  }
}

type AddExistingPayload = { gallery_id: string; artist_id: string };
type AddGhostPayload = {
  gallery_id: string;
  newGhostData: {
    name: string;
    birthyear: string;
    country_of_origin: string;
  };
};

export type AddArtistToRosterPayload = AddExistingPayload | AddGhostPayload;

export async function addArtistToRoster(payload: AddArtistToRosterPayload) {
  try {
    const response = await apiRequest(`${apiUrl}/api/requests/gallery/roster/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result.message,
      artist_id: result.artist_id as string | undefined,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        "An error was encountered, please try again later or contact support",
    };
  }
}

export async function removeArtistFromRosterService(
  gallery_id: string,
  artist_id: string,
) {
  try {
    const response = await apiRequest(`${apiUrl}/api/requests/gallery/roster/remove`, {
      method: "POST",
      body: JSON.stringify({ gallery_id, artist_id }),
    });
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result.message,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        "An error was encountered, please try again later or contact support",
    };
  }
}

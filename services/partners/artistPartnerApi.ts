import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

export type ArtistProfileData = {
  artist_id?: string;
  name: string;
  logo?: string;
  bio?: string;
  followerCount?: number;
  birthyear?: string;
  country_of_origin?: string;
  address?: { city?: string; country?: string; state?: string };
};

export type ArtistWorkRow = ArtworkFlatlistItem & {
  pricing?: Partial<ArtworkPricing> | number;
  price?: number;
  medium?: string;
  year?: string | number;
};

function buildWorkFilters(medium?: string, price?: string) {
  const queryFilters: {
    medium?: string[];
    price?: { min: number; max: number }[];
  } = {
    medium: [],
    price: [],
  };

  if (medium && medium !== "All") {
    queryFilters.medium!.push(medium);
  }

  if (price && price !== "All") {
    if (price === "Under 1000") {
      queryFilters.price!.push({ min: 0, max: 1000 });
    } else if (price === "Over 10000") {
      queryFilters.price!.push({ min: 10000, max: 100_000_000 });
    } else {
      const [min, max] = price.split("-").map(Number);
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        queryFilters.price!.push({ min, max });
      }
    }
  }

  if (queryFilters.medium!.length === 0) delete queryFilters.medium;
  if (queryFilters.price!.length === 0) delete queryFilters.price;

  return Object.keys(queryFilters).length > 0 ? queryFilters : undefined;
}

export async function fetchArtistWorksPage(
  artistId: string,
  page: number,
  opts?: { medium?: string; price?: string },
) {
  const q = new URLSearchParams({
    id: artistId,
    page: String(page),
  });
  const filters = buildWorkFilters(opts?.medium, opts?.price);
  if (filters) q.set("filters", JSON.stringify(filters));

  try {
    const res = await apiRequest(
      `${apiUrl}/api/requests/artist/fetchArtistData?${q.toString()}`,
      {
        method: "GET",
      },
    );
    const result = (await res.json()) as {
      message?: string;
      data?: ArtistProfileData;
      artist_artworks?: ArtistWorkRow[];
      page?: number;
      pageCount?: number;
      total?: number;
    };

    return {
      isOk: res.ok,
      message: result.message,
      artist: result.data,
      data: Array.isArray(result.artist_artworks) ? result.artist_artworks : [],
      pagination: {
        page: result.page ?? page,
        totalPages: result.pageCount ?? 1,
      },
      total: result.total ?? 0,
    };
  } catch {
    return {
      isOk: false,
      artist: undefined as ArtistProfileData | undefined,
      data: [] as ArtistWorkRow[],
      pagination: { page, totalPages: 1 },
      total: 0,
    };
  }
}

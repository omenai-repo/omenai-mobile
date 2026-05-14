export function createUploadedArtworkData(
  data: ArtworkUploadStateTypes,
  url: string,
  id: string,
  role_access: RoleAccess,
  image_format?:
    | { ratio: string; orientation: "landscape" | "portrait" | "square" }
    | null,
): Omit<
  ArtworkSchemaTypes,
  "art_id" | "should_show_on_sub_active" | "availability"
> {
  const width = String(data.length ?? data.width ?? "").trim();
  const height = String(data.height ?? "").trim();

  /** API requires artist_id XOR newGhostArtistName; galleries type a name → ghost artist stub. */
  const rosterArtistId = String(data.artist_id ?? "").trim();
  const ghostNameCandidate = String(data.newGhostArtistName ?? "").trim();
  const typedArtistName = String(data.artist ?? "").trim();

  const galleryArtistFields =
    role_access.role === "gallery"
      ? rosterArtistId
        ? { artist_id: rosterArtistId }
        : ghostNameCandidate
          ? { newGhostArtistName: ghostNameCandidate }
          : typedArtistName
            ? { newGhostArtistName: typedArtistName }
            : {}
      : {};

  const updatedArwordData = {
    artist: data.artist,
    dimensions: {
      height,
      width,
      weight: String(data.weight ?? ""),
    },
    pricing: {
      price: +data.price,
      shouldShowPrice: data.shouldShowPrice,
      usd_price: data.usd_price,
      currency: data.currency,
    },
    materials: data.materials,
    medium: data.medium,
    year: +data.year,
    title: data.title,
    rarity: data.rarity,
    url,
    author_id: id,
    ...(role_access.role === "artist" ? { artist_id: id } : {}),
    ...galleryArtistFields,
    artist_birthyear: data.artist_birthyear,
    artist_country_origin: data.artist_country_origin,
    certificate_of_authenticity: data.certificate_of_authenticity,
    artwork_description: data.artwork_description,
    packaging_type: data.packaging_type,
    signature: data.signature,
    role_access: role_access,
    image_format: image_format || undefined,
  };

  return updatedArwordData as Omit<
    ArtworkSchemaTypes,
    "art_id" | "should_show_on_sub_active" | "availability"
  >;
}

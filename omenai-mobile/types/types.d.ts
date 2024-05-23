type IndividualLoginData = {
  email: string;
  password: string;
};

type IndividualRegisterData = {
  name: string,
  email: string,
  password: string,
  confirmPassword: string
}

type GallerySignupData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
  admin: string;
  description: string;
};

type GalleryRegisterData = Omit<GallerySignupData, "confirmPassword">;

type GalleryWaitlistData = {
  name: string,
  email: string
}

type artworkListingType = 'trending' | 'recent' | 'curated';

type RouteIdentifier = "individual" | "gallery";

type userSessionType = {
  name: string,
  id: string,
  email: string,
  
}
type ArtworkDataType = {
  title: string,
  artist: string,
  artist_country_origin: string,
  artist_birthyear: string,
  artwork_description: string,
  pricing: {price: number, shouldShowPrice: "Yes" | "No"},
  year: string,
  dimensions: {depth: string, height: string, width: string, weight: string},
  framing: string,
  carrier: string,
  rarity: string,
  materials: string,
  medium: string,
  signature: string,
  updatedAt: string,
  url: string,
  certificate_of_authenticity: "Yes" | 'No'
}
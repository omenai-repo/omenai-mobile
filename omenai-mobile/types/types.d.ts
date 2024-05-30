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

type OrderAcceptedStatusTypes = {
  status: "accepted" | "declined" | "";
  reason?: string;
};
type TrackingInformationTypes = {
  tracking_id: string;
  tracking_link: string;
};
type PaymentStatusTypes = {
  status: "pending" | "completed";
  transaction_value: string;
  transaction_date: string;
  transaction_reference: string;
};

type ShippingQuoteTypes = {
  package_carrier: string;
  shipping_fees: string;
  taxes: string;
  additional_information?: string;
};

type RouteParamsType = {
  title: string;
};

type artworkOrderDataTypes = {
  pricing: {shouldShowPrice: "Yes" | "No", price: number},
  url: string,
  title: string,
  artist: string,
  gallery_id: string,
  art_id: string
}

type IndividualAddressTypes = {
  address_line: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  [key: string]: string;
};
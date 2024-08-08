type IndividualLoginData = {
  email: string;
  password: string;
};

type GalleryLoginData = {
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
  country: string
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
  availability: boolean,
  artist_birthyear: string,
  artwork_description: string,
  pricing: {price: number, shouldShowPrice: "Yes" | "No", usd_price: number},
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
  certificate_of_authenticity: "Yes" | 'No',
  art_id: string;
  gallery_id: string;
  impressions?: number;
  like_IDs?: string[];
}

type ArtworkFlatlistItem = {
  title: string,
  artist: string,
  pricing: {price: number, shouldShowPrice: "Yes" | "No", usd_price: number},
  url: string,
  availability: boolean,
  art_id: string;
  impressions: number;
  like_IDs: string[];
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

type OrderAcceptedStatusTypes = {
  status: "accepted" | "declined" | "";
  reason?: string;
};

type RouteParamsType = {
  title: string;
};

type accountsRouteParamsType = {
  type: "indiviaual" | "gallery";
};

type verifyEmailRouteParamsType = {
  account: {id: string, type: RouteIdentifier}
}

type artworkOrderDataTypes = {
  pricing: {shouldShowPrice: "Yes" | "No", price: number, usd_price: number},
  url: string,
  title: string,
  artist: string,
  gallery_id: string,
  art_id: string
}

type OrderCardProps = {
  artworkName: string,
  artworkPrice: number,
  dateOrdered: string,
  url: string,
  orderId: string,
  status: string,
  state: "pending" | "history",
  payment_information?: PaymentStatusTypes;
  tracking_information?: TrackingInformationTypes;
  shipping_quote?: ShippingQuoteTypes;
  order_accepted: OrderAcceptedStatusTypes;
  delivery_confirmed: boolean;
}

type IndividualAddressTypes = {
  address_line: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  [key: string]: string;
};

type ArtworkSchemaTypes = {
  artist: string;
  year: number;
  title: string;
  medium: string;
  rarity: string;
  materials: string;
  dimensions: ArtworkDimensions;
  url: string;
  pricing: ArtworkPricing;
  art_id: string;
  gallery_id: string;
  impressions?: number;
  like_IDs?: string[];
  artist_birthyear: string;
  artist_country_origin: string;
  certificate_of_authenticity: string;
  artwork_description?: string;
  framing: string;
  signature: string;
  carrier: string;
  should_show_on_sub_active?: boolean;
};

type editorialListingType = {
  title: string,
  id: string,
  author: string,
  date: string,
  url: string,
}

type ArtworkUploadStateTypes = {
  artist: string;
  year: number;
  title: string;
  medium: string;
  rarity: string;
  materials: string;
  height: string;
  width: string;
  depth?: string;
  weight: string;
  price: number;
  usd_price: number;
  shouldShowPrice: "Yes" | "No" | string;
  artist_birthyear: string;
  artist_country_origin: string;
  certificate_of_authenticity: string;
  artwork_description?: string;
  framing: string;
  signature: string;
  currency: string;
};

type OrderAcceptedStatusTypes = {
  status: "accepted" | "declined" | "";
  reason?: string;
};
type ShippingQuoteTypes = {
  package_carrier: string;
  shipping_fees: string;
  taxes: string;
  additional_information?: string;
};
type GalleryProfileUpdateData = {
  location?: string;
  admin?: string;
  description?: string;
};

type IndividualProfileUpdateData = {
  name?: string;
  preferences?: string[];
};

type TransactionModelSchemaTypes = {
  trans_id: string;
  trans_reference: string;
  trans_amount: string;
  trans_owner_id: string;
  trans_owner_role: "user" | "gallery";
  trans_gallery_id: string;
  trans_type: "purchase_payout" | "subscription";
  trans_date: Date;
};

type ArtworkPriceFilterData = {
  "pricing.price": number;
  "pricing.usd_price": number;
  "pricing.shouldShowPrice": string;
  "pricing.currency": string;
};

type CatalogCardTypes = {
  name: string, 
  value: string,
  image: string
}

type CreateOrderModelTypes = {
  createdAt: string | number | Date;
  artwork_data: Pick<
    ArtworkSchemaTypes,
    "artist" | "pricing" | "title" | "url" | "art_id"
  > & { _id: ObjectId };
  buyer: {
    name: string;
    email: string;
    user_id: string;
    _id: ObjectId;
  };
  gallery_id: string;
  order_id: string;
  status: string;
  shipping_address: IndividualAddressTypes;
  shipping_quote: ShippingQuoteTypes;
  payment_information: PaymentStatusTypes;
  tracking_information: TrackingInformationTypes;
  order_accepted: OrderAcceptedStatusTypes;
  delivery_confirmed: boolean;
};

type PlanProps = {
  name: string;
  pricing: {annual_price: string, monthly_price: string}
  benefits: string[];
  currency: string,
  plan_id: string
};

type ValidateChargeTypes = "redirect" | "pin" | "avs_noauth" | ""
type FinalChargeAuthTypes = "redirect" | "otp" | ""

type OrderShippingDetailsTypes = {
  addresses: {
    origin: AddressTypes;
    destination: AddressTypes;
  };
  delivery_confirmed: boolean;
  additional_information?: string;
  shipment_information: {
    carrier: string;
    shipment_product_code: string;
    dimensions: {
      length: number;
      weight: number;
      width: number;
      height: number;
    };
    pickup: {
      additional_information?: string;
      pickup_max_time: string;
      pickup_min_time: string;
    };
    tracking: TrackingInformationTypes;
    quote: ShippingQuoteTypes;
  };
};

type OrderBuyerAndSellerDetails = {
  id: string;
  name: string;
  email: string;
  address: AddressTypes;
};

 type OrderAcceptedStatusTypes = {
  status: "accepted" | "declined" | "";
  reason?: string;
};

 type TrackingInformationTypes = {
  id: string;
  link: string;
};

 type ShippingQuoteTypes = {
  fees: string;
  taxes: string;
};

type AddressTypes = {
  address_line: string;
  city: string;
  country: string;
  countryCode: string;
  state: string;
  zip: string;
};

type PaymentStatusTypes = {
  status: "pending" | "completed";
  transaction_value: string;
  transaction_date: string;
  transaction_reference: string;
};


type ArtworkDimensions = {
  width: string;
  height: string;
  depth?: string;
  weight: string;
};

type ArtistCategorization =
  | "emerging"
  | "early-mid"
  | "mid"
  | "late-mid"
  | "established"
  | "elite";

type RoleAccess = {
  role: "artist" | "gallery";
  designation: ArtistCategorization | null;
};

type ArtworkPricing = {
  price: number;
  usd_price: number;
  currency: string;
  shouldShowPrice: "Yes" | "No" | string;
};

type IndividualLoginData = {
  email: string;
  password: string;
};

type GalleryLoginData = {
  email: string;
  password: string;
};

type ArtistLoginData = {
  email: string;
  password: string;
};

type IndividualRegisterData = {
  name: string,
  email: string,
  password: string,
  confirmPassword: string
  address: AddressTypes
}

type GallerySignupData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: AddressTypes;
  admin: string;
  description: string;
  logo: {
    assets: ImageAsset[];
  } | null;
};

type ImageAsset = {
  uri: string;
  fileName?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  fileSize?: number;
};

type ArtistSignupData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  logo: {
    assets: ImageAsset[];
  } | null;
  art_style: string | string[];
  address: AddressTypes;
};

type ArtistRegisterData = Pick<ArtistSignupData, "name" | "email" | "password"> & {
  logo: string
}

type GalleryRegisterData = Pick<
  GallerySignupData,
  "name" | "admin" | "email" | "password" | "description"
> & {
  location: GalleryLocation;
  logo: string
};

type GalleryWaitlistData = {
  name: string,
  email: string
}

type artworkListingType = 'trending' | 'recent' | 'curated';

type RouteIdentifier = "individual" | "gallery" | "artist";

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
  author_id: string;
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
  id: string;
  link: string;
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
  type: "individual" | "gallery" | "artist";
};

type verifyEmailRouteParamsType = {
  account: {id: string, type: RouteIdentifier}
}

type ArtistDocumentationTypes = {
  cv?: string;
  socials?: { [key?: Socials]: string };
};

type Socials = "instagram" | "twitter" | "facebook" | "linkedin";

type ArtistCategorizationUpdateDataTypes = {
  answers: ArtistCategorizationAnswerTypes;
  bio: string;
  documentation: ArtistDocumentationTypes;
  artist_id: string;
};

type ArtistCategorizationAnswerTypes = {
  graduate: "yes" | "no";
  mfa: "yes" | "no";
  solo: number;
  group: number;
  museum_collection: "yes" | "no";
  biennale: "venice" | "other" | "none";
  museum_exhibition: "yes" | "no";
  art_fair: "yes" | "no";
};

type artworkOrderDataTypes = {
  pricing: {shouldShowPrice: "Yes" | "No", price: number, usd_price: number},
  url: string,
  title: string,
  artist: string,
  author_id: string,
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
  availability: boolean
}

type AddressTypes = {
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
  author_id: string;
  impressions?: number;
  like_IDs?: string[];
  artist_birthyear: string;
  artist_country_origin: string;
  certificate_of_authenticity: string;
  artwork_description?: string;
  framing: string;
  signature: string;
  should_show_on_sub_active?: boolean;
  role_access: RoleAccess;
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
  role_access: RoleAccess;
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

type PurchaseTransactionModelSchemaTypes = {
  trans_id: string;
  trans_reference: string;
  trans_initiator_id: string;
  trans_recipient_id: string;
  trans_pricing: PurchaseTransactionPricing;
  trans_date: Date;
  trans_recipient_role: "gallery" | "artist";
};

type PurchaseTransactionPricing = {
  unit_price: number;
  commission: number;
  shipping_cost: number;
  amount_total: number;
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
  artwork_data: Pick<
    ArtworkSchemaTypes,
    "artist" | "pricing" | "title" | "url" | "art_id"
  > & { _id: ObjectId };
  buyer_details: OrderBuyerAndSellerDetails
  seller_details: OrderBuyerAndSellerDetails
  order_id: string;
  status: "processing" | "completed" ;
  shipping_details: OrderShippingDetailsTypes;
  payment_information: PaymentStatusTypes;
  order_accepted: OrderAcceptedStatusTypes;
  createdAt: string,
  updatedAt: string,
  availability: boolean
}

type PlanProps = {
  name: string;
  pricing: {annual_price: string, monthly_price: string}
  benefits: string[];
  currency: string,
  plan_id: string,
  _id: string
};

type ValidateChargeTypes = "redirect" | "pin" | "avs_noauth" | "otp" | ""
type FinalChargeAuthTypes = "redirect" | "otp" | ""

type FLWDirectChargeDataTypes = CardInputTypes & {
  card: string;
  cvv: string;
  month: string;
  year: string;
  tx_ref: string;
  amount: string;
  customer: {
    name: string;
    email: string;
  };
  redirect: string;
  charge_type: string | null;
};

type AvsAuthorizationData = {
  mode: "avs_noauth";
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  address?: string;
};

type PinAuthorizationData = {
  mode: "pin";
  pin: string;
};

type SubscriptionModelSchemaTypes = {
  customer: {
    id: number;
    name: string;
    phone_number?: string;
    email: string;
    created_at: string;
    gallery_id: string;
  };
  start_date: Date;
  expiry_date: Date;
  status: "active" | "cancelled" | "expired";
  card: SubscriptionCardDetails;
  payment: SubscriptionPaymentTypes;
  plan_details: {
    type: string;
    value: { monthly_price: string; annual_price: string };
    currency: string;
    interval: "monthly" | "yearly";
  };
  next_charge_params: {
    value: number;
    currency: string;
    type: string;
    interval: "monthly" | "yearly";
    plan_id: string;
  };
};

type SubscriptionPlanDataTypes = {
  name: string;
  pricing: {
    annual_price: string;
    monthly_price: string;
  };
  plan_id: string;
  currency: string;
  benefits: string[];
};

type SubscriptionTokenizationTypes = {
  amount: number;
  email: string;
  tx_ref: string;
  token: string;
  gallery_id: string;
  plan_id: string;
  plan_interval: string;
};

type NextChargeParams = {
  value: number;
  currency: string;
  type: string;
  interval: string;
  id: string;
};
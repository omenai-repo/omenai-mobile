export type DeeplinkRole =
  | "auth"
  | "individual"
  | "artist"
  | "gallery"
  | "shared";

export type DeeplinkScreen = {
  role: DeeplinkRole;
  routeName: string;
  description: string;
  payloadHelp: string[];
};

const ROUTES_BY_ROLE: Record<DeeplinkRole, string[]> = {
  auth: [
    "Login",
    "Welcome",
    "Register",
    "Forgot-password",
    "verify-email",
    "ArtistOnboarding",
  ],
  shared: ["CancleOrderPayment", "SuccessOrderPayment"],
  individual: [
    "Overview",
    "Artworks",
    "Search",
    "Orders",
    "Profile",
    "Individual",
    "ShipmentTrackingScreen",
    "filter",
    "artwork-medium-filter-modal",
    "artwork-categories-filter-modal",
    "support-tickets-filter-modal",
    "Artwork",
    "purchase-artwork",
    "saved-artworks",
    "NotificationScreen",
    "edit-profile",
    "EditAddressScreen",
    "change-gallery-password",
    "artworks-medium",
    "ArticleScreen",
    "AllEditorialsScreen",
    "collections",
    "payment",
    "DetailsScreen",
    "delete-account",
    "biometric-settings",
    "ViewReceiptScreen",
    "support-tickets",
  ],
  artist: [
    "Overview",
    "Wallet",
    "Orders",
    "Artworks",
    "Review",
    "Profile",
    "Artist",
    "ShipmentTrackingScreen",
    "ArtistOnboarding",
    "ArtistOverview",
    "NotificationScreen",
    "OrderScreen",
    "DimensionsDetails",
    "WalletHistory",
    "AddPrimaryAcctScreen",
    "WithdrawScreen",
    "ForgotPinScreen",
    "ResetPinScreen",
    "WithdrawalSuccess",
    "TransactionDetailsScreen",
    "edit-profile",
    "EditAddressScreen",
    "change-gallery-password",
    "EditCredentialsScreen",
    "ViewCredentialsScreen",
    "upload-new-gallery-logo",
    "support-tickets-filter-modal",
    "upload-artwork",
    "proposal-price",
    "Artwork",
    "edit-artwork",
    "delete-account",
    "biometric-settings",
    "support-tickets",
  ],
  gallery: [
    "Overview",
    "Artworks",
    "Orders",
    "Billing",
    "Payouts",
    "Profile",
    "Gallery",
    "connect-stripe",
    "ShipmentTrackingScreen",
    "Artwork",
    "NotificationScreen",
    "upload-artwork",
    "gallery-order",
    "DimensionsDetails",
    "edit-profile",
    "EditAddressScreen",
    "change-gallery-password",
    "billing-plans",
    "PaymentMethodChangeScreen",
    "checkout",
    "BillingVerificationScreen",
    "edit-artwork",
    "delete-account",
    "biometric-settings",
    "support-tickets",
    "SubscriptionHistory",
    "upload-new-gallery-logo",
    "support-tickets-filter-modal",
  ],
};

export const deeplinkScreensByRole = ROUTES_BY_ROLE;

const ROUTE_DESCRIPTIONS: Partial<Record<string, string>> = {
  Login: "Open login screen.",
  Welcome: "Open welcome/landing screen.",
  Register: "Open account registration screen.",
  "Forgot-password": "Open forgot password flow.",
  "verify-email": "Open email verification screen.",
  ArtistOnboarding: "Open artist onboarding flow.",
  Artwork: "Open artwork details screen.",
  ShipmentTrackingScreen: "Open shipment tracking details.",
  DetailsScreen: "Open profile/details screen for artist or gallery.",
  payment: "Open payment screen.",
  checkout: "Open checkout flow.",
  BillingVerificationScreen: "Open billing verification result screen.",
  TransactionDetailsScreen: "Open wallet transaction details.",
  EditAddressScreen: "Open address edit screen.",
  "edit-artwork": "Open edit artwork screen.",
};

const ROUTE_PAYLOAD_HELP: Partial<Record<string, string[]>> = {
  Artwork: ["id"],
  ShipmentTrackingScreen: ["orderId", "tracking_id"],
  DetailsScreen: ["id", "type"],
  payment: ["id"],
  "Forgot-password": ["type"],
  "verify-email": ["account.id", "account.type"],
  "change-gallery-password": ["routeName"],
  "delete-account": ["routeName (optional)"],
  "artworks-medium": ["catalog"],
  DimensionsDetails: ["orderId"],
  PaymentMethodChangeScreen: ["planId", "planInterval"],
  BillingVerificationScreen: ["payment_intent"],
  "edit-artwork": ["art_id"],
  ViewReceiptScreen: ["invoice (optional)", "invoiceNumber (optional)"],
};

const getRouteDescription = (routeName: string) =>
  ROUTE_DESCRIPTIONS[routeName] ?? `Open ${routeName} screen.`;

const getPayloadHelp = (routeName: string) =>
  ROUTE_PAYLOAD_HELP[routeName] ?? [
    "No route-specific payload required. Keep auth/context metadata as needed.",
  ];

export const deeplinkScreens: DeeplinkScreen[] = (
  Object.entries(ROUTES_BY_ROLE) as [DeeplinkRole, string[]][]
).flatMap(([role, routes]) =>
  routes.map((routeName) => ({
    role,
    routeName,
    description: getRouteDescription(routeName),
    payloadHelp: getPayloadHelp(routeName),
  })),
);

export const buildDeeplinkUrl = (role: DeeplinkRole, routeName: string) =>
  `dl/${role}/${routeName}`;

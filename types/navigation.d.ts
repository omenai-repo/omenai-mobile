import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Welcome: undefined;
  Register: undefined;
  'Forgot-password': { type: RouteIdentifier };
  'verify-email': { account: { id: string; type: RouteIdentifier } };
  Home: undefined;
  Artwork: { title: string; url: string };
  Search: undefined;
  'purchase-artwork': { title: string };
  'saved-artworks': undefined;
  'edit-profile': undefined;
  'change-gallery-password': { routeName: string };
  'delete-account': { routeName?: string };
  collections: undefined;
  'artworks-medium': { catalog: string };
  filter: undefined;
  'artwork-medium-filter-modal': undefined;
  'artwork-categories-filter-modal': undefined;
  'artwork-categories': { title: string };
  NotificationScreen: undefined;
  ShipmentTrackingScreen: { orderId: string; tracking_id: string };
  DimensionsDetails: { orderId: string };
  EditAddressScreen: { currentAddress?: AddressTypes };
  DetailsScreen: { type: 'artist' | 'gallery'; id: string; name?: string; logo?: string };
  ArticleScreen: { article: EditorialSchemaTypes };
  AllEditorialsScreen: { editorials: EditorialSchemaTypes[] };
  MigrationUpgradeCheckout: undefined;
  BillingVerification: { payment_intent: string };
  'billing-plans': { plan_action: 'reactivation' | null };
  PaymentMethodChangeScreen: { planId: string; planInterval: string };
  'edit-artwork': { art_id: string };
  payment: { id: string };
  checkout: { plan?: any; interval?: string; sub_data?: any; action?: string };
  [key: string]: any;
};

export type RootNavigationProp = StackNavigationProp<RootStackParamList>;


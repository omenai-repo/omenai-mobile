import ArtistOverviewStack from "#navigation/ArtistOverviewStack";
import {
  catalogueIcon,
  catalogueIconFocused,
  homeIcon,
  homeIconFocused,
  orderIcon,
  orderIconFocused,
  ordersActive,
  ordersInActive,
  overviewActive,
  overviewInActive,
  profileActive,
  profileIcon,
  profileIconFocused,
  profileInActive,
  searchIcon,
  searchIconFocused,
  shippingActive,
  shippingInActive,
  walletActive,
  walletInActive,
  billingActive,
  billingInActive,
  reviewHubActive,
  reviewHubInActive,
} from "#utils/assets/SvgImages";
import WalletScreen from "#screens/marketplace/artist/wallet/WalletScreen";
import OrderScreen from "#screens/marketplace/artist/orders/OrderScreen";
import GalleryArtworksListing from "#screens/marketplace/gallery/artworks/GalleryArtworksListing";
import ArtistProfileScreen from "#screens/marketplace/artist/profile/ArtistProfileScreen";
import ArtistReviewHub from "#screens/marketplace/artist/reviews/ArtistReviewHub";
import IndividualHomeStack from "#navigation/IndividualHomeStack";
import GuestOverview from "#screens/marketplace/overview/GuestOverview";
import Catalog from "#screens/discovery/catalog/Catalog";
import SearchResults from "#screens/discovery/search/SearchResults";
import Orders from "#screens/commerce/orders/Orders";
import Profile from "#screens/account/profile/Profile";
import GalleryOverviewStack from "#navigation/GalleryOverviewStack";
import GalleryOrdersListing from "#screens/marketplace/gallery/orders/GalleryOrdersListing";
import Subscriptions from "#screens/commerce/subscriptions/Subscriptions";
import GuestProfilePlaceholder from "#screens/guest/GuestProfilePlaceholder";
import GalleryProfile from "#screens/marketplace/gallery/profile/galleryProfile/GalleryProfile";
import StripePayoutsTab from "#screens/commerce/stripe/payouts/StripePayoutsTab";

export const getBottomTabDataArtist = () => [
  {
    id: 1,
    activeIcon: overviewActive,
    inActiveIcon: overviewInActive,
    name: "Overview",
    component: ArtistOverviewStack,
  },
  {
    id: 2,
    activeIcon: walletActive,
    inActiveIcon: walletInActive,
    name: "Wallet",
    component: WalletScreen,
  },
  {
    id: 3,
    activeIcon: ordersActive,
    inActiveIcon: ordersInActive,
    name: "Orders",
    component: OrderScreen,
  },
  {
    id: 4,
    activeIcon: shippingActive,
    inActiveIcon: shippingInActive,
    name: "Artworks",
    component: GalleryArtworksListing,
  },
  {
    id: 5,
    activeIcon: reviewHubActive,
    inActiveIcon: reviewHubInActive,
    name: "Review",
    component: ArtistReviewHub,
  },
  {
    id: 6,
    activeIcon: profileActive,
    inActiveIcon: profileInActive,
    name: "Profile",
    component: ArtistProfileScreen,
  },
];

export const getBottomTabDataIndividual = () => [
  {
    id: 1,
    activeIcon: homeIcon,
    inActiveIcon: homeIconFocused,
    name: "Overview",
    component: IndividualHomeStack,
  },
  {
    id: 2,
    activeIcon: catalogueIcon,
    inActiveIcon: catalogueIconFocused,
    name: "Artworks",
    component: Catalog,
  },
  {
    id: 3,
    activeIcon: searchIcon,
    inActiveIcon: searchIconFocused,
    name: "Search",
    component: SearchResults,
  },
  {
    id: 4,
    activeIcon: orderIcon,
    inActiveIcon: orderIconFocused,
    name: "Orders",
    component: Orders,
  },
  {
    id: 5,
    activeIcon: profileIcon,
    inActiveIcon: profileIconFocused,
    name: "Profile",
    component: Profile,
  },
];

export const getBottomTabDataGuest = () => [
  {
    id: 1,
    activeIcon: homeIcon,
    inActiveIcon: homeIconFocused,
    name: "Overview",
    component: GuestOverview,
  },
  {
    id: 2,
    activeIcon: catalogueIcon,
    inActiveIcon: catalogueIconFocused,
    name: "Artworks",
    component: Catalog,
  },
  {
    id: 3,
    activeIcon: searchIcon,
    inActiveIcon: searchIconFocused,
    name: "Search",
    component: SearchResults,
  },
  {
    id: 4,
    activeIcon: profileIcon,
    inActiveIcon: profileIconFocused,
    name: "Profile",
    component: GuestProfilePlaceholder,
  },
];

export const getBottomTabDataGallery = () => [
  {
    id: 1,
    name: "Overview",
    activeIcon: overviewActive,
    inActiveIcon: overviewInActive,
    component: GalleryOverviewStack,
  },
  {
    id: 2,
    name: "Artworks",
    activeIcon: shippingActive,
    inActiveIcon: shippingInActive,
    component: GalleryArtworksListing,
  },
  {
    id: 3,
    name: "Orders",
    activeIcon: ordersActive,
    inActiveIcon: ordersInActive,
    component: GalleryOrdersListing,
  },
  {
    id: 4,
    name: "Billing",
    activeIcon: billingActive,
    inActiveIcon: billingInActive,
    component: Subscriptions,
  },
  {
    id: 5,
    name: "Payouts",
    activeIcon: walletActive,
    inActiveIcon: walletInActive,
    component: StripePayoutsTab,
  },
  {
    id: 6,
    name: "Profile",
    activeIcon: profileActive,
    inActiveIcon: profileInActive,
    component: GalleryProfile,
  },
];

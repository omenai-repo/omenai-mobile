import ArtistOverview from "#screens/artist/overview/ArtistOverview";
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
} from "./SvgImages";
import WalletScreen from "#screens/artist/wallet/WalletScreen";
import OrderScreen from "#screens/artist/orders/OrderScreen";
import GalleryArtworksListing from "#screens/galleryArtworksListing/GalleryArtworksListing";
import ArtistProfileScreen from "#screens/artist/profile/ArtistProfileScreen";
import ArtistReviewHub from "#screens/artist/reviews/ArtistReviewHub";
import Home from "#screens/home/Home";
import GuestOverview from "#screens/overview/GuestOverview";
import Catalog from "#screens/catalog/Catalog";
import SearchResults from "#screens/searchResults/SearchResults";
import Orders from "#screens/orders/Orders";
import Profile from "#screens/profile/Profile";
import Overview from "#screens/overview/Overview";
import GalleryOrdersListing from "#screens/galleryOrders/GalleryOrdersListing";
import Subscriptions from "#screens/subscriptions/Subscriptions";
import GuestProfilePlaceholder from "#screens/guest/GuestProfilePlaceholder";
import GalleryProfile from "#screens/galleryProfileScreens/galleryProfile/GalleryProfile";
import StripePayoutsTab from "#screens/stripeScreens/payouts/StripePayoutsTab";

export const getBottomTabDataArtist = () => [
  {
    id: 1,
    activeIcon: overviewActive,
    inActiveIcon: overviewInActive,
    name: "Overview",
    component: ArtistOverview,
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
    component: Home,
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
    component: Overview,
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

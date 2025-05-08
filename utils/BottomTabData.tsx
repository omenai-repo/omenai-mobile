import ArtistOverview from 'screens/artist/overview/ArtistOverview';
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
} from './SvgImages';
import WalletScreen from 'screens/artist/wallet/WalletScreen';
import OrderScreen from 'screens/artist/orders/OrderScreen';
import GalleryArtworksListing from 'screens/galleryArtworksListing/GalleryArtworksListing';
import ArtistProfileScreen from 'screens/artist/profile/ArtistProfileScreen';
import Home from 'screens/home/Home';
import Catalog from 'screens/catalog/Catalog';
import SearchResults from 'screens/searchResults/SearchResults';
import Orders from 'screens/orders/Orders';
import Profile from 'screens/profile/Profile';

export const BottomTabDataArtist = [
  {
    id: 1,
    activeIcon: overviewActive,
    inActiveIcon: overviewInActive,
    name: 'Overview',
    component: ArtistOverview,
  },
  {
    id: 2,
    activeIcon: walletActive,
    inActiveIcon: walletInActive,
    name: 'Wallet',
    component: WalletScreen,
  },
  {
    id: 2,
    activeIcon: ordersActive,
    inActiveIcon: ordersInActive,
    name: 'Orders',
    component: OrderScreen,
  },
  {
    id: 2,
    activeIcon: shippingActive,
    inActiveIcon: shippingInActive,
    name: 'Art Upload',
    component: GalleryArtworksListing,
  },
  {
    id: 2,
    activeIcon: profileActive,
    inActiveIcon: profileInActive,
    name: 'Profile',
    component: ArtistProfileScreen,
  },
];

export const BottomTabDataIndividual = [
  {
    id: 1,
    activeIcon: homeIcon,
    inActiveIcon: homeIconFocused,
    name: 'Overview',
    component: Home,
  },
  {
    id: 2,
    activeIcon: catalogueIcon,
    inActiveIcon: catalogueIconFocused,
    name: 'Catalog',
    component: Catalog,
  },
  {
    id: 3,
    activeIcon: searchIcon,
    inActiveIcon: searchIconFocused,
    name: 'Search',
    component: SearchResults,
  },
  {
    id: 4,
    activeIcon: orderIcon,
    inActiveIcon: orderIconFocused,
    name: 'Orders',
    component: Orders,
  },
  {
    id: 5,
    activeIcon: profileIcon,
    inActiveIcon: profileIconFocused,
    name: 'Profile',
    component: Profile,
  },
];

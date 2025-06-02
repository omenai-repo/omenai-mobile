import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import { screenName } from 'constants/screenNames.constants';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Catalog from 'screens/catalog/Catalog';
import Profile from 'screens/profile/Profile';
import SavedArtworks from 'screens/savedArtworks/SavedArtworks';
import PurchaseArtwork from 'screens/purchase/PurchaseArtwork';
import { colors } from 'config/colors.config';
import Home from 'screens/home/Home';
import Artwork from 'screens/artwork/Artwork';
import SearchResults from 'screens/searchResults/SearchResults';
import Orders from 'screens/orders/Orders';
import Payment from 'screens/payment/Payment';
import Filter from 'components/filter/Filter';
import Notifications from 'screens/notifications/Notifications';
import EditorialsListing from 'screens/editorialsListing/EditorialsListing';
import CancleOrderPayment from 'screens/payment/components/cancel/CancleOrderPayment';
import SuccessOrderPayment from 'screens/payment/components/success/SuccessOrderPayment';
import EditProfile from 'screens/editProfile/EditProfile';
import ArtworksMedium from 'screens/artworksMedium/ArtworksMedium';
import ArtworkMediumFilterModal from 'screens/artworksMedium/components/filter/ArtworkMediumFilterModal';
import Editorial from 'screens/editorial/Editorial';
import ArtworkCategoriesFilterModal from 'screens/artworkCategories/components/filter/ArtworkCategoriesFilterModal';
import Collections from 'screens/collections/Collections';
import ChangeGalleryPassword from 'screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword';
import { SvgXml } from 'react-native-svg';
import {
  catalogueIcon,
  catalogueIconFocused,
  homeIcon,
  homeIconFocused,
  orderIcon,
  orderIconFocused,
  profileIcon,
  profileIconFocused,
  searchIcon,
  searchIconFocused,
} from 'utils/SvgImages';
import { BottomTabDataIndividual } from 'utils/BottomTabData';
import TabButton from './components/TabButton';
import ShipmentTrackingScreen from 'screens/artist/orders/ShipmentTrackingScreen';
import EditAddressScreen from 'screens/editProfile/EditAddressScreen';

type CustomTabBarIconProps = {
  name: any;
  focused: boolean;
  title: string;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const hideHeader = { headerShown: false };

export default function IndividualNavigation() {
  const CustomTabBarIcon = ({ name, focused, title }: CustomTabBarIconProps) => {
    return (
      <View
        style={{
          alignItems: 'center',
          gap: 5,
        }}
      >
        <SvgXml xml={name} />
        <Text style={[{ fontSize: 13, color: colors.grey }, focused && { color: colors.white }]}>
          {title}
        </Text>
      </View>
    );
  };

  const IndividualTabNavigationScreens = () => {
    const { width } = useWindowDimensions();
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 100,
            backgroundColor: colors.black,
            paddingHorizontal: 20,
            position: 'absolute',
          },
        }}
      >
        {BottomTabDataIndividual.map(({ name, activeIcon, inActiveIcon, component, id }) => (
          <Tab.Screen
            key={id}
            name={name}
            component={component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => (
                <TabButton
                  {...props}
                  activeIcon={activeIcon}
                  inActiveIcon={inActiveIcon}
                  name={name}
                />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    );
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Individual"
        component={IndividualTabNavigationScreens}
        options={hideHeader}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name={screenName.filter} component={Filter} />
        <Stack.Screen
          name={screenName.artworkMediumFilterModal}
          component={ArtworkMediumFilterModal}
        />
        <Stack.Screen
          name={screenName.artworkCategoriesFilterModal}
          component={ArtworkCategoriesFilterModal}
        />
      </Stack.Group>
      <Stack.Screen name={screenName.artwork} component={Artwork} />
      <Stack.Screen name={screenName.searchResults} component={SearchResults} />
      <Stack.Screen name={screenName.purchaseArtwork} component={PurchaseArtwork} />
      <Stack.Screen name={screenName.savedArtworks} component={SavedArtworks} />
      <Stack.Screen name={screenName.payment} component={Payment} />
      <Stack.Screen name={screenName.notifications} component={Notifications} />
      <Stack.Screen name={screenName.editorialsListing} component={EditorialsListing} />
      <Stack.Screen name="ShipmentTrackingScreen" component={ShipmentTrackingScreen} />
      <Stack.Screen name={screenName.cancleOrderPayment} component={CancleOrderPayment} />
      <Stack.Screen name={screenName.successOrderPayment} component={SuccessOrderPayment} />
      <Stack.Screen name={screenName.editProfile} component={EditProfile} />
      <Stack.Screen name={'EditAddressScreen'} component={EditAddressScreen} />
      <Stack.Screen name={screenName.gallery.changePassword} component={ChangeGalleryPassword} />
      <Stack.Screen name={screenName.artworksMedium} component={ArtworksMedium} />
      <Stack.Screen name={screenName.editorial} component={Editorial} />
      <Stack.Screen name={screenName.collections} component={Collections} />
    </Stack.Navigator>
  );
}

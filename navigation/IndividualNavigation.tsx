import { Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import { screenName } from 'constants/screenNames.constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SavedArtworks from 'screens/savedArtworks/SavedArtworks';
import PurchaseArtwork from 'screens/purchase/PurchaseArtwork';
import { colors } from 'config/colors.config';
import Artwork from 'screens/artwork/Artwork';
import SearchResults from 'screens/searchResults/SearchResults';
import Filter from 'components/filter/Filter';
import EditProfile from 'screens/editProfile/EditProfile';
import ArtworksMedium from 'screens/artworksMedium/ArtworksMedium';
import ArtworkMediumFilterModal from 'screens/artworksMedium/components/filter/ArtworkMediumFilterModal';
import ArtworkCategoriesFilterModal from 'screens/artworkCategories/components/filter/ArtworkCategoriesFilterModal';
import Collections from 'screens/collections/Collections';
import ChangeGalleryPassword from 'screens/galleryProfileScreens/changeGalleryPassword/ChangeGalleryPassword';
import { SvgXml } from 'react-native-svg';
import { BottomTabDataIndividual } from 'utils/BottomTabData';
import ShipmentTrackingScreen from 'screens/artist/orders/ShipmentTrackingScreen';
import EditAddressScreen from 'screens/editProfile/EditAddressScreen';
import CustomTabBar from './components/TabButton';
import DetailsScreen from 'screens/home/components/DetailScreen';
import ArticleScreen from 'screens/home/components/editorials/ArticleScreen';
import AllEditorialsScreen from 'screens/home/components/editorials/AllEditorialsScreen';
import NotificationScreen from 'screens/notifications/NotificationScreen';
import DeleteAccountScreen from 'screens/deleteAccount/DeleteAccountScreen';

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
        tabBar={(props) => <CustomTabBar {...props} tabData={BottomTabDataIndividual} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        {BottomTabDataIndividual.map(({ name, component, id }) => (
          <Tab.Screen
            key={id}
            name={name}
            component={component}
            options={{
              tabBarShowLabel: false,
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
      <Stack.Screen name={'NotificationScreen'} component={NotificationScreen} />
      <Stack.Screen name="ShipmentTrackingScreen" component={ShipmentTrackingScreen} />
      <Stack.Screen name={screenName.editProfile} component={EditProfile} />
      <Stack.Screen name={'EditAddressScreen'} component={EditAddressScreen} />
      <Stack.Screen name={screenName.gallery.changePassword} component={ChangeGalleryPassword} />
      <Stack.Screen name={screenName.artworksMedium} component={ArtworksMedium} />
      <Stack.Screen name={'ArticleScreen'} component={ArticleScreen} />
      <Stack.Screen name={'AllEditorialsScreen'} component={AllEditorialsScreen} />
      <Stack.Screen name={screenName.collections} component={Collections} />
      <Stack.Screen name={'DetailsScreen'} component={DetailsScreen} />
      <Stack.Screen name={screenName.deleteAccount} component={DeleteAccountScreen} />
    </Stack.Navigator>
  );
}

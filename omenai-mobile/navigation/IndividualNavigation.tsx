import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
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
import Editorial from 'screens/editorial/Editorial';
import CancleOrderPayment from 'screens/payment/components/cancel/CancleOrderPayment';
import SuccessOrderPayment from 'screens/payment/components/success/SuccessOrderPayment';

type CustomTabBarIconProps = {
    name: any,
    focused: boolean,
    title: string
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const hideHeader = {headerShown: false}

export default function IndividualNavigation() {

    const CustomTabBarIcon = ({ name, focused, title }: CustomTabBarIconProps) => {
        return (
            <View style={{alignItems: 'center', gap: 5}}>
              <Feather name={name} size={focused ? 25 : 22} color={focused ? colors.black : colors.grey} />
              <Text style={[{fontSize: 13, color: colors.grey}, focused && {color: colors.primary_black}]}>{title}</Text>
            </View>
        );
    };

    const IndividualTabNavigationScreens = () => {
    return(
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
              let iconName = '';
  
              if (route.name === screenName.home) {
                iconName = 'home';
              } else if (route.name === screenName.catalog) {
                iconName = 'bookmark';
              }else if(route.name === screenName.orders){
                iconName = 'package'
              }else if(route.name === screenName.profile){
                iconName = 'user'
              }else if(route.name === screenName.searchResults){
                iconName = 'search'
              }
  
              return <CustomTabBarIcon title={route.name} name={iconName} focused={focused} />;
            },
            tabBarLabel: () => null,
            tabBarActiveTintColor: colors.primary_black,
            headerShown: false,
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: colors.white,
              paddingBottom: 10,
              paddingTop: 0,
              height: 70,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
          })}
        >
          <Tab.Screen
            name={screenName.home}
            component={Home}
          />
          <Tab.Screen 
            name={screenName.catalog} 
            component={Catalog}
          />
          <Tab.Screen 
            name={screenName.searchResults} 
            component={SearchResults}
          />
          <Tab.Screen 
            name={screenName.orders} 
            component={Orders}
          />
          <Tab.Screen 
            name={screenName.profile} 
            component={Profile}
          />
        </Tab.Navigator>
    )
    }

    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='Individual' component={IndividualTabNavigationScreens} options={hideHeader}/>
          <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen name={screenName.filter} component={Filter} />
          </Stack.Group>
          <Stack.Screen name={screenName.artwork} component={Artwork} />
          <Stack.Screen name={screenName.searchResults} component={SearchResults} />
          <Stack.Screen name={screenName.purchaseArtwork} component={PurchaseArtwork} />
          <Stack.Screen name={screenName.savedArtworks} component={SavedArtworks} />
          <Stack.Screen name={screenName.payment} component={Payment} />
          
          <Stack.Screen name={screenName.notifications} component={Notifications} />
          <Stack.Screen name={screenName.editorialsListing} component={EditorialsListing} />
          <Stack.Screen name={screenName.editorial} component={Editorial} />
          <Stack.Screen name={screenName.cancleOrderPayment} component={CancleOrderPayment} />
          <Stack.Screen name={screenName.successOrderPayment} component={SuccessOrderPayment} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
      borderRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconContainerActive: {
      backgroundColor: colors.primary_black
    }
  })
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

type CustomTabBarIconProps = {
    name: any,
    focused: boolean
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function IndividualNavigation() {

    const CustomTabBarIcon = ({ name, focused }: CustomTabBarIconProps) => {
        return (
            // <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Feather name={name} size={25} color={focused ? colors.black : colors.primary_black} />
            // </View>
        );
    };

    const IndividualTabNavigationComponents = () => {
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
  
              return <CustomTabBarIcon name={iconName} focused={focused} />;
            },
            tabBarLabel: () => null,
            tabBarActiveTintColor: colors.primary_black,
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
            options={{headerShown: false}}
          />
          <Tab.Screen 
            name={screenName.catalog} 
            component={Catalog}
            options={{ headerShown: false }}
          />
          <Tab.Screen 
            name={screenName.searchResults} 
            component={SearchResults}
            options={{ headerShown: false }}
          />
          <Tab.Screen 
            name={screenName.orders} 
            component={Orders}
            options={{ headerShown: false }}
          />
          <Tab.Screen 
            name={screenName.profile} 
            component={Profile}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
    )
    }

    return(
        <Stack.Navigator>
            <Stack.Screen name='Individual' component={IndividualTabNavigationComponents} options={{headerShown: false}} />
            <Stack.Screen name={screenName.artwork} component={Artwork} options={{ headerShown: false }} />
            <Stack.Screen name={screenName.searchResults} component={SearchResults} options={{headerShown: false}} />
            <Stack.Screen name={screenName.purchaseArtwork} component={PurchaseArtwork} options={{headerShown: false}} />
            <Stack.Screen name={screenName.savedArtworks} component={SavedArtworks} options={{headerShown: false}} />
            <Stack.Screen name={screenName.payment} component={Payment} options={{headerShown: false}} />
            <Stack.Screen name={screenName.filter} component={Filter} options={{headerShown: false}} />
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
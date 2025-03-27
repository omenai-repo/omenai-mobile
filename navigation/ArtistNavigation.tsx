import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  GestureResponderEvent,
  Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import { useAppStore } from 'store/app/appStore';
import ArtistOnboarding from 'screens/artistOnboarding/ArtistOnboarding';
import tw from 'twrnc';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';
import {
  ordersActive,
  ordersInActive,
  overviewActive,
  overviewInActive,
  profileActive,
  profileInActive,
  shippingActive,
  shippingInActive,
  walletActive,
  walletInActive,
} from 'utils/SvgImages';
import ArtistOverview from 'screens/artist/ArtistOverview';
import { colors } from 'config/colors.config';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabData = [
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
    component: ArtistOverview,
  },
  {
    id: 2,
    activeIcon: ordersActive,
    inActiveIcon: ordersInActive,
    name: 'Orders',
    component: ArtistOverview,
  },
  {
    id: 2,
    activeIcon: shippingActive,
    inActiveIcon: shippingInActive,
    name: 'Shipping',
    component: ArtistOverview,
  },
  {
    id: 2,
    activeIcon: profileActive,
    inActiveIcon: profileInActive,
    name: 'Profile',
    component: ArtistOverview,
  },
];

const BottomTabNav = () => {
  const TabButton = ({
    name,
    activeIcon,
    inActiveIcon,
    accessibilityState,
    onPress,
  }: {
    name: string;
    activeIcon: string;
    inActiveIcon: string;
    accessibilityState?: any;
    onPress?: (event: GestureResponderEvent) => void;
  }) => {
    const focused = accessibilityState?.selected;
    return (
      <TouchableOpacity
        onPress={(event) => onPress?.(event)}
        activeOpacity={1}
        style={tw`items-center flex-1 justify-center`}
      >
        <SvgXml xml={focused ? activeIcon : inActiveIcon} />
        <Text
          style={[
            { fontSize: 13, color: colors.grey, fontWeight: '700', marginTop: 10 },
            focused && { color: colors.white },
          ]}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 85,
          backgroundColor: colors.black,
          bottom: 30,
          borderRadius: 18,
          marginHorizontal: width / 20,
          position: 'absolute',
          paddingTop: Platform.OS === 'ios' ? 25 : 0,
        },
      }}
    >
      {BottomTabData.map(({ name, activeIcon, inActiveIcon, component, id }) => (
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

const ArtistNavigation = () => {
  const { userSession } = useAppStore();

  if (userSession.isOnboardingCompleted === false) {
    return <ArtistOnboarding />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />
      <Stack.Screen name="ArtistOnboarding" component={ArtistOnboarding} />
      <Stack.Screen name="ArtistOverview" component={ArtistOverview} />
    </Stack.Navigator>
  );
};

export default ArtistNavigation;

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "config/colors.config";
import { screenName } from "constants/screenNames.constants";
import { Text, View } from "react-native";
import Artwork from "screens/artwork/Artwork";
import GalleryArtworksListing from "screens/galleryArtworksListing/GalleryArtworksListing";
import Overview from "screens/overview/Overview";
import UploadArtwork from "screens/uploadArtwork/UploadArtwork";

type CustomTabBarIconProps = {
    name: any,
    focused: boolean,
    title: string
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const hideHeader = {headerShown: false}

export default function GalleryNavigation() {

    const CustomTabBarIcon = ({ name, focused, title }: CustomTabBarIconProps) => {
        return (
            <View style={{alignItems: 'center', gap: 5}}>
              <Ionicons name={name} size={focused ? 25 : 22} color={focused ? colors.black : colors.grey} />
              <Text style={[{fontSize: 13, color: colors.grey}, focused && {color: colors.primary_black}]}>{title}</Text>
            </View>
        );
    };
    
    const GalleryTabNavigationScreens = () => {
        return(
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                    let iconName = '';
        
                    if (route.name === screenName.gallery.overview) {
                        iconName = 'grid-outline';
                    }else if(route.name === screenName.gallery.artworks){
                        iconName = 'briefcase-outline'
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
                <Tab.Screen component={Overview} name={screenName.gallery.overview} />
                <Tab.Screen component={GalleryArtworksListing} name={screenName.gallery.artworks} />
            </Tab.Navigator>
        )
    }

    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={screenName.gallery.uploadArtwork} component={UploadArtwork} />
            <Stack.Screen name='Individual' component={GalleryTabNavigationScreens} options={hideHeader}/>
            <Stack.Screen name={screenName.artwork} component={Artwork} />
        </Stack.Navigator>
    )
}
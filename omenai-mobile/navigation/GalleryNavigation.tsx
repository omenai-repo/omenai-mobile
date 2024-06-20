import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "config/colors.config";
import { Text, View } from "react-native";
import Overview from "screens/overview/Overview";

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
              <Feather name={name} size={focused ? 25 : 22} color={focused ? colors.black : colors.grey} />
              <Text style={[{fontSize: 13, color: colors.grey}, focused && {color: colors.primary_black}]}>{title}</Text>
            </View>
        );
    };

    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen component={Overview} name="overview" />
        </Stack.Navigator>
    )
}
import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";

export default function AuthPlaceholder() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    // Immediately navigate to login screen when this tab is accessed
    navigation.navigate("AuthNavigation", { screen: screenName.login });
  }, [navigation]);

  return <View />;
}

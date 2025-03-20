import { View, Text } from "react-native";
import React from "react";
import { logout } from "utils/logout.utils";

const ArtistNavigation = () => {
  return (
    <View style={{ marginTop: 100 }}>
      <Text onPress={logout}>Logout</Text>
    </View>
  );
};

export default ArtistNavigation;

import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import ArtistRegisterationForms from "../../artistRegistrationForm/ArtistRegisterationForms";

const ArtistForm = () => {
  return (
    <View style={tw`mt-[40px] mb-[100px]`}>
      <ArtistRegisterationForms />
    </View>
  );
};

export default ArtistForm;

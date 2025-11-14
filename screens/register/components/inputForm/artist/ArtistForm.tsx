import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import ArtistRegisterationForms from "../../artistRegistrationForm/ArtistRegisterationForms";

const ArtistForm = () => {
  return (
    <View style={tw`mt-7`}>
      <ArtistRegisterationForms />
    </View>
  );
};

export default ArtistForm;

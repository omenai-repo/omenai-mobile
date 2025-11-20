import { View } from "react-native";
import React from "react";
import IndividualRegistrationForm from "../../individualRegistrationForm/IndividualRegistrationForm";
import tw from "twrnc";

const IndividualForm = () => {
  return (
    <View style={tw`mt-7`}>
      <IndividualRegistrationForm />
    </View>
  );
};

export default IndividualForm;

import { View, Text } from 'react-native';
import React from 'react';
import IndividualRegistrationForm from '../../individualRegistrationForm/IndividualRegistrationForm';
import tw from 'twrnc';

const IndividualForm = () => {
  return (
    <View style={tw`mt-[40px] mb-[100px]`}>
      <IndividualRegistrationForm />
    </View>
  );
};

export default IndividualForm;

import React from "react";
import { Text } from "react-native";
import tw from "twrnc";

export type AddressFieldProps = {
  label: string;
  value?: string | null;
};

const AddressField = ({ label, value }: AddressFieldProps) => {
  if (!value) return null;
  return (
    <Text style={tw`text-gray-800 font-sans-regular`}>
      <Text style={tw`font-sans-medium`}>{label} </Text>
      {value}
    </Text>
  );
};

export default AddressField;

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
    <Text style={tw`text-gray-800`}>
      <Text style={tw`font-semibold`}>{label} </Text>
      {value}
      {"\n"}
    </Text>
  );
};

export default AddressField;

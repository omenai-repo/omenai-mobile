import { Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

type DestinationAddressSectionProps = {
  destinationAddress: AddressTypes | null;
};

export default function DestinationAddressSection({
  destinationAddress,
}: Readonly<DestinationAddressSectionProps>) {
  return (
    <View style={tw`mt-4 border border-gray-200 rounded-sm bg-white p-5`}>
      <View
        style={tw`flex-row items-center border-b border-neutral-100 pb-3 mb-3`}
      >
        <Ionicons
          name="navigate-outline"
          size={20}
          color="#404040"
          style={tw`mr-2`}
        />
        <Text style={tw`text-[15px] font-medium text-neutral-900`}>
          Destination
        </Text>
      </View>

      {destinationAddress ? (
        <Text style={tw`text-sm font-medium text-neutral-900`}>
          {[destinationAddress.state, destinationAddress.country]
            .filter(Boolean)
            .join(", ")}
        </Text>
      ) : (
        <Text style={tw`text-sm text-neutral-500 italic`}>
          No destination address available.
        </Text>
      )}
    </View>
  );
}

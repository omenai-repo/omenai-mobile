import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";

interface ShipmentDetailsProps {
  shippingDetails: OrderShippingDetailsTypes;
  carrier: string;
  currentStatus: string;
  estimatedDelivery: string;
}

export default function ShipmentDetails({
  shippingDetails,
  carrier,
  currentStatus,
  estimatedDelivery,
}: Readonly<ShipmentDetailsProps>) {
  const formatEstimatedDelivery = () => {
    if (!estimatedDelivery) return "TBD";

    const date = new Date(estimatedDelivery);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={tw`bg-white rounded-sm pt-2 pb-4 gap-5`}>
      <View style={tw`flex-row justify-between items-start`}>
        <View style={tw`flex-1 pr-2`}>
          <Text style={tw`text-gray-500 text-base font-sans-regular`}>
            Origin
          </Text>
          <Text
            style={tw`text-[${colors.black}] text-sm font-sans-medium mt-1`}
          >
            {shippingDetails?.addresses.origin.city},{" "}
            {shippingDetails?.addresses.origin.country}
          </Text>
        </View>

        <View style={tw`flex-1 pl-2 items-end`}>
          <Text style={tw`text-gray-500 text-base font-sans-regular`}>
            Destination
          </Text>
          <Text
            style={tw`text-[${colors.black}] text-sm font-sans-medium mt-1`}
          >
            {shippingDetails?.addresses.destination.city},{" "}
            {shippingDetails?.addresses.destination.country}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row justify-between items-center`}>
        <View>
          <Text style={tw`text-gray-500 text-base font-sans-regular`}>
            Carrier
          </Text>
          <Text
            style={tw`text-[${colors.black}] text-sm font-sans-medium mt-1`}
          >
            {carrier || "N/A"}
          </Text>
        </View>

        <View style={tw`items-end`}>
          <Text style={tw`text-gray-500 text-base font-sans-regular`}>
            Status
          </Text>
          <Text
            style={tw`text-blue-600 text-sm font-sans-medium mt-1 tracking-wide uppercase`}
          >
            {(currentStatus || "Processing").replaceAll("_", " ")}
          </Text>
        </View>
      </View>

      <View>
        <Text style={tw`text-gray-500 text-base font-sans-regular`}>
          Estimated Delivery
        </Text>
        <Text style={tw`text-[${colors.black}] text-sm font-sans-medium mt-1`}>
          {formatEstimatedDelivery()}
        </Text>
      </View>
    </View>
  );
}

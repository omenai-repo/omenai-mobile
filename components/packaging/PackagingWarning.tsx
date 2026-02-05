import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface PackagingWarningProps {
  type: "rolled" | "stretched";
}

export default function PackagingWarning({
  type,
}: Readonly<PackagingWarningProps>) {
  const requirements = [
    "Heavy-duty double-walled cardboard box",
    "Minimum 2 inches of bubble wrap on all sides",
    "Reinforced corner protectors",
    "Face of artwork protected by acid-free paper",
  ];

  if (type === "stretched") {
    return (
      <View
        style={tw`mt-4 bg-red-50 border border-red-200 rounded-xl overflow-hidden`}
      >
        <View style={tw`p-4`}>
          <View style={tw`flex-row items-center mb-2`}>
            <Ionicons name="warning" size={18} color="#DC2626" />
            <Text style={tw`text-sm font-bold text-red-800 ml-2`}>
              Special Handling Required
            </Text>
          </View>
          <Text style={tw`text-xs text-red-700 leading-5 mb-3`}>
            Shipping stretched artwork attracts{" "}
            <Text style={tw`font-bold`}>significantly higher fees</Text>.
          </Text>

          <Text
            style={tw`text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide`}
          >
            Mandatory Packing Requirements:
          </Text>

          {requirements.map((item) => (
            <View key={item} style={tw`flex-row items-start mb-1.5`}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#6B7280"
                style={tw`mt-0.5 mr-2`}
              />
              <Text style={tw`text-xs text-gray-600 flex-1`}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View
      style={tw`mt-4 flex-row bg-amber-50 border border-amber-100 rounded-lg p-3`}
    >
      <Ionicons
        name="warning"
        size={16}
        color="#D97706"
        style={tw`mt-0.5 mr-2`}
      />
      <View style={tw`flex-1`}>
        <Text style={tw`text-sm font-semibold text-gray-900`}>
          White Glove Handling Required
        </Text>
        <Text style={tw`text-xs text-gray-600 mt-1 leading-5`}>
          Please ensure artworks are packed securely with bubble wrap and corner
          protectors.
        </Text>
      </View>
    </View>
  );
}

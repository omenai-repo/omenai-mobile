import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type PackagingType = "rolled" | "stretched";

interface PackagingTypeSelectorProps {
  value: PackagingType;
  onChange: (type: PackagingType) => void;
}

export default function PackagingTypeSelector({
  value,
  onChange,
}: Readonly<PackagingTypeSelectorProps>) {
  const [showStretchedWarning, setShowStretchedWarning] = useState(false);

  const handleStretchedClick = () => {
    setShowStretchedWarning(true);
    onChange("stretched");
  };

  const handleRolledClick = () => {
    setShowStretchedWarning(false);
    onChange("rolled");
  };

  const requirements = [
    "Heavy-duty double-walled cardboard box",
    "Minimum 2 inches of bubble wrap on all sides",
    "Reinforced corner protectors (plastic or foam)",
    "Face of artwork protected by acid-free paper",
  ];

  return (
    <View style={tw`mb-6`}>
      <Text style={tw`text-sm font-medium text-gray-700 mb-3`}>
        Shipping Configuration
      </Text>

      {/* Rolled Option - Always Visible */}
      <TouchableOpacity
        onPress={handleRolledClick}
        style={[
          tw`p-4 rounded-md border-2 mb-4`,
          value === "rolled"
            ? tw`border-gray-900 bg-gray-50`
            : tw`border-gray-200`,
        ]}
        activeOpacity={0.7}
      >
        <View style={tw`flex-row items-start`}>
          <View
            style={[
              tw`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 items-center justify-center`,
              value === "rolled" ? tw`border-gray-900` : tw`border-gray-300`,
            ]}
          >
            {value === "rolled" && (
              <View style={tw`w-2.5 h-2.5 rounded-full bg-gray-900`} />
            )}
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-semibold text-gray-900`}>
              Rolled (Standard)
            </Text>
            <Text style={tw`text-xs text-gray-500 mt-1 leading-5`}>
              Canvas is removed from the frame and shipped in a tube.
            </Text>
            <Text style={tw`text-xs text-emerald-600 font-medium mt-1`}>
              ✓ Recommended for lower shipping fees
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Stretched Link - Inconspicuous */}
      {!showStretchedWarning && value === "rolled" && (
        <TouchableOpacity onPress={handleStretchedClick} style={tw`py-2`}>
          <Text style={tw`text-xs text-gray-400 text-center underline`}>
            Need to ship stretched? (Not recommended)
          </Text>
        </TouchableOpacity>
      )}

      {/* Stretched Warning - Expanded View */}
      {showStretchedWarning && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={tw`border border-red-200 rounded-md overflow-hidden`}
        >
          {/* Warning Header */}
          <View style={tw`bg-red-50 p-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Ionicons name="warning" size={18} color="#DC2626" />
              <Text style={tw`text-sm font-bold text-red-800 ml-2`}>
                Special Handling Required
              </Text>
            </View>
            <Text style={tw`text-xs text-red-700 leading-5`}>
              Shipping stretched artwork attracts{" "}
              <Text style={tw`font-bold`}>significantly higher fees</Text>{" "}
              (volume weight). Only select this if the artwork absolutely cannot
              be rolled (e.g., heavy texture, rigid board).
            </Text>
          </View>

          {/* Stretched Selection */}
          <View style={tw`bg-white p-4`}>
            <TouchableOpacity
              onPress={() => onChange("stretched")}
              style={tw`flex-row items-center mb-4`}
            >
              <View
                style={[
                  tw`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center`,
                  value === "stretched"
                    ? tw`border-red-600`
                    : tw`border-gray-300`,
                ]}
              >
                {value === "stretched" && (
                  <View style={tw`w-2.5 h-2.5 rounded-full bg-red-600`} />
                )}
              </View>
              <Text style={tw`text-sm font-semibold text-gray-900`}>
                Ship as Stretched
              </Text>
            </TouchableOpacity>

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

          {/* Switch Back Link */}
          <TouchableOpacity
            onPress={handleRolledClick}
            style={tw`py-3 border-t border-gray-100`}
          >
            <Text style={tw`text-xs text-indigo-600 font-medium text-center`}>
              ← Switch back to Rolled (Save on fees)
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import LongBlackButton from "#components/buttons/LongBlackButton";

interface CarrierInterventionCardProps {
  orderId: string;
  carrier: string;
  hasDeclined: boolean;
  canBeRolled: boolean;
  packagingType: "rolled" | "stretched";
  onDecline: () => void;
  onSwitchToRolled: () => void;
  onTryCustomCrate: () => void;
}

export default function CarrierInterventionCard({
  orderId,
  carrier,
  hasDeclined,
  canBeRolled,
  packagingType,
  onDecline,
  onSwitchToRolled,
  onTryCustomCrate,
}: Readonly<CarrierInterventionCardProps>) {
  if (hasDeclined) {
    return (
      <View style={tw`bg-gray-50 border border-gray-200 rounded-lg p-5 mt-4`}>
        <View style={tw`flex-row items-start mb-4`}>
          <View
            style={tw`bg-white p-2 rounded-full shadow-sm border border-gray-100 mr-3`}
          >
            <Ionicons name="information-circle" size={24} color="#374151" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-semibold text-gray-900 mb-1`}>
              We completely understand.
            </Text>
            <Text style={tw`text-sm text-gray-600 leading-5`}>
              This piece exceeds logistics partner hard size limits. We are
              currently building a dedicated feature for massive artworks just
              like yours! In the meantime, we need to handle this specific order
              manually to ensure your art arrives safely.
            </Text>
          </View>
        </View>

        <View style={tw`mt-4`}>
          <LongBlackButton
            value="Contact Support for manual assistance"
            onClick={() =>
              Linking.openURL(
                `mailto:support@omenai.com?subject=Freight Assistance Needed: Order ${orderId}`,
              )
            }
          />
        </View>
      </View>
    );
  }

  // THE HEADS UP PATH
  return (
    <View style={tw`bg-amber-50 border border-amber-200 rounded-lg p-5 mt-4`}>
      <View style={tw`flex-row items-start mb-5`}>
        <Ionicons
          name="warning"
          size={24}
          color="#D97706"
          style={tw`mt-0.5 mr-3`}
        />
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-semibold text-amber-900 mb-1`}>
            Exceeds shipping courier maximum size limits
          </Text>
          <Text style={tw`text-sm text-amber-700/80 leading-5`}>
            The current packaging dimensions exceed our logistics partner hard
            size limits and will be rejected. To proceed with this order, please
            select an alternative option below.
          </Text>
        </View>
      </View>

      <View style={tw`gap-3`}>
        {/* Golden Path (Only shows if rolling actually solves the problem) */}
        {canBeRolled && (
          <TouchableOpacity
            onPress={onSwitchToRolled}
            style={tw`flex-row items-center p-4 bg-white border border-gray-200 rounded-lg`}
          >
            <View style={tw`bg-emerald-100 p-2 rounded-md mr-3`}>
              <Ionicons name="cube" size={20} color="#059669" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`font-semibold text-gray-900 text-sm`}>
                {packagingType === "rolled"
                  ? "Use a standard Tube (Recommended)"
                  : "Ship it Rolled (Recommended)"}
              </Text>
              <Text style={tw`text-xs text-gray-500 mt-0.5`}>
                The safest, most affordable option. We'll recalculate for a tube
                package.
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* DIY Path */}
        <TouchableOpacity
          onPress={onTryCustomCrate}
          style={tw`flex-row items-center p-4 bg-white border border-gray-200 rounded-lg`}
        >
          <View style={tw`bg-blue-100 p-2 rounded-md mr-3`}>
            <Ionicons name="resize" size={20} color="#2563EB" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`font-semibold text-gray-900 text-sm`}>
              I can pack it in a smaller Custom Box
            </Text>
            <Text style={tw`text-xs text-gray-500 mt-0.5`}>
              Enter exact dimensions to see if your crate fits within shipping
              size limits.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Empathy Path */}
        <TouchableOpacity
          onPress={onDecline}
          style={tw`items-center py-2 mt-1`}
        >
          <Text style={tw`text-xs font-medium text-gray-500`}>
            I cannot reduce the size (Requires manual assistance)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

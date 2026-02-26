import { Pressable, View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { Ionicons } from "@expo/vector-icons";
import AlertCard from "#components/general/AlertCard";

type AgreementSectionProps = {
  userType: string;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
};

export default function AgreementSection({
  userType,
  isChecked,
  setIsChecked,
}: Readonly<AgreementSectionProps>) {
  return (
    <View style={tw`mt-6 mx-5`}>
      {userType === "gallery" ? (
        <>
          <AlertCard
            title="Please review carefully"
            description="By accepting this order, you agree to hold the artwork for 24 hours to allow for payment and shipment processing. If the piece is on exhibition and paid for by this buyer, shipment will be scheduled at the exhibition's end date"
          />

          <Pressable
            onPress={() => setIsChecked(!isChecked)}
            style={tw`mt-4 flex-row items-center gap-3`}
          >
            <View
              style={tw`w-5 h-5 rounded-full border-2 border-gray-400 items-center justify-center`}
            >
              {isChecked && (
                <View
                  style={[
                    tw`w-3 h-3 rounded-full`,
                    { backgroundColor: colors.primary_black },
                  ]}
                />
              )}
            </View>
            <Text style={tw`text-sm text-gray-600 font-medium`}>
              I agree and continue
            </Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          onPress={() => setIsChecked(!isChecked)}
          style={tw`bg-white border border-gray-200 rounded-md p-4 flex-row gap-3 shadow-sm`}
        >
          <View style={tw`mt-0.5`}>
            <Ionicons
              name={isChecked ? "checkbox" : "square-outline"}
              size={24}
              color={isChecked ? colors.primary_black : "#9CA3AF"}
            />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-bold text-gray-900`}>
              Acknowledge Terms
            </Text>
            <Text style={tw`text-xs text-gray-500 leading-5`}>
              I confirm the selected packaging is sufficient and ready for
              pickup.
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

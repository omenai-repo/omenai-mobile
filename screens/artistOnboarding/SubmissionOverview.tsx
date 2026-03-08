import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { colors } from "#config/colors.config";

interface SubmissionOverviewProps {
  isConfirmed: boolean;
  setIsConfirmed: (val: boolean) => void;
  onNavigateBack: () => void;
  width: number;
}

const SubmissionOverview: React.FC<SubmissionOverviewProps> = ({
  isConfirmed,
  setIsConfirmed,
  onNavigateBack,
  width,
}) => {
  return (
    <View
      style={tw.style(`bg-white border border-gray-100 rounded-md p-6`, {
        marginHorizontal: width / 18,
      })}
    >
      {/* Top Check Success Icon */}
      <View style={tw`items-center mb-6`}>
        <View
          style={tw`w-16 h-16 rounded-full bg-purple-50 items-center justify-center border-4 border-white shadow-sm`}
        >
          <FontAwesome6 name="check" size={24} color="#8B5CF6" />
        </View>
        <Text style={tw`text-xs font-sans mt-4 text-slate-700 text-center`}>
          Review and Submit Your Artist Profile
        </Text>
        <Text
          style={tw`text-xs font-sans-regular mt-2 text-slate-700 text-center px-4`}
        >
          Please confirm that all the information you have provided in the
          previous steps is accurate and up-to-date.
        </Text>
      </View>

      {/* Verification Warning Box */}
      <View
        style={tw`bg-yellow-50 rounded-md p-4 mb-6 border border-yellow-200`}
      >
        <View style={tw`flex-row items-center mb-2`}>
          <FontAwesome6 name="triangle-exclamation" size={16} color="#B45309" />
          <Text style={tw`text-sm font-sans-semibold ml-2 text-yellow-900`}>
            Verification Warning
          </Text>
        </View>
        <Text
          style={tw`text-sm tracking-wide font-sans-regular text-amber-800`}
        >
          Providing false, misleading, or unverifiable information (e.g.,
          exhibitions, awards, education) could severely affect your
          verification status and would lead to a rejection of your acceptance
          to the platform. Ensure all details are accurate to avoid delays.
        </Text>
      </View>

      {/* Confirmation Checkbox */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsConfirmed(!isConfirmed)}
        style={tw`flex-row p-4 rounded-md mb-8 border bg-neutral-50 border-neutral-200`}
      >
        <View
          style={tw.style(
            `w-5 h-5 rounded border items-center justify-center`,
            isConfirmed
              ? `bg-[${colors.black}] border-[${colors.black}]`
              : `bg-white border-gray-300`,
          )}
        >
          {isConfirmed && <FontAwesome6 name="check" size={10} color="white" />}
        </View>
        <Text style={tw`flex-1 ml-3 text-sm font-sans-regular text-gray-700`}>
          I confirm that all statements and data provided throughout this
          onboarding journey are true, accurate, and verifiable.
        </Text>
      </TouchableOpacity>

      {/* Footer Nav */}
      <TouchableOpacity
        onPress={onNavigateBack}
        style={tw`flex-row items-center justify-center py-3 bg-neutral-100 rounded-md border border-neutral-200`}
      >
        <Ionicons name="information-circle-outline" size={20} color="#4B5563" />
        <Text style={tw`ml-2 text-sm font-sans-medium text-slate-700`}>
          Review Previous Steps
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubmissionOverview;

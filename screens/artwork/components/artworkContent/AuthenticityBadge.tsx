import React from "react";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import tw from "twrnc";
import { licenseIcon } from "#utils/SvgImages";

interface AuthenticityBadgeProps {
  certificateOfAuthenticity: string;
}

export default function AuthenticityBadge({
  certificateOfAuthenticity,
}: Readonly<AuthenticityBadgeProps>) {
  if (certificateOfAuthenticity?.toLowerCase() !== "yes") return null;

  return (
    <View style={tw`mt-4 flex-row items-center gap-2.5`}>
      <View
        style={tw`flex-row items-center justify-center gap-2.5 px-2.5 py-2 rounded-sm bg-[#F2F8F4]`}
      >
        <SvgXml xml={licenseIcon} />
        <Text style={tw`text-[#004617] text-[13px] font-medium`}>
          Certificate of authenticity available
        </Text>
      </View>
    </View>
  );
}

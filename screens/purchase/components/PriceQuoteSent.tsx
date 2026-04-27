import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import {
  packageIcon,
  clipboardIcon,
  walletIcon,
  clockIcon,
} from "../../../utils/SvgImages";
import { colors } from "#config/colors.config";

type TimelineItemProps = Readonly<{
  icon: string;
  title: string;
  description: string;
  isLast?: boolean;
}>;

const TimelineItem = ({
  icon,
  title,
  description,
  isLast,
}: TimelineItemProps) => {
  // Convert icon color to black if it's not already
  const blackIcon = icon
    .replaceAll("#2A9EDF", "black")
    .replaceAll('stroke="#2A9EDF"', 'stroke="black"');

  return (
    <View style={tw`flex-row`}>
      {/* Icon Column */}
      <View style={tw`items-center mr-4`}>
        <View
          style={tw`w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white z-10`}
        >
          <SvgXml xml={blackIcon} width={20} height={20} />
        </View>
        {!isLast && <View style={tw`flex-1 w-[1px] bg-gray-200 my-1`} />}
      </View>

      {/* Content Column */}
      <View style={tw`flex-1 pb-8`}>
        <Text style={tw`text-[15px] font-semibold text-black mb-1`}>
          {title}
        </Text>
        <Text style={tw`text-[13px] text-gray-500 leading-5`}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const TIMELINE_STEPS = [
  {
    icon: packageIcon,
    title: "Order Processing",
    description:
      "Your request has been securely placed. We will review and process it within the next 72 hours.",
  },
  {
    icon: clipboardIcon,
    title: "Validation & Logistics",
    description:
      "We validate order details, assess shipping availability to your location, and calculate applicable shipping and tax charges.",
  },
  {
    icon: walletIcon,
    title: "Payment Window",
    description:
      "Upon approval, you will receive a payment link. Payment must be completed within 24 hours to secure your purchase",
  },
  {
    icon: clockIcon,
    title: "Auto-Expiration",
    description:
      "If we cannot process the request within 72 hours, the order will be automatically declined, allowing you to retry later.",
  },
];

export default function PriceQuoteSent({
  handleClick,
}: Readonly<{
  handleClick: () => void;
}>) {
  return (
    <View style={tw`flex-1 bg-white px-5 py-10`}>
      <View style={tw`items-center mb-8`}>
        <View style={tw`mb-4`}>
          <Feather name="check-circle" size={60} color={colors.black} />
        </View>
        <Text style={tw`text-xl font-bold text-black mb-2`}>
          Order Received
        </Text>
        <Text style={tw`text-sm text-gray-500 text-center`}>
          We've sent a confirmation email
        </Text>
      </View>

      {/* What Happens Next Header */}
      <View style={tw`flex-row items-center mb-6`}>
        <Text
          style={tw`text-xs font-bold text-black tracking-widest uppercase mr-3`}
        >
          What Happens Next?
        </Text>
        <View style={tw`h-[1px] flex-1 bg-gray-300`} />
      </View>

      {/* Timeline */}
      <View style={tw`mb-6`}>
        {TIMELINE_STEPS.map((item) => (
          <TimelineItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            isLast={item === TIMELINE_STEPS[TIMELINE_STEPS.length - 1]}
          />
        ))}
      </View>

      {/* Bottom Button */}
      <View style={tw`mb-8 mt-auto`}>
        <TouchableOpacity
          onPress={handleClick}
          style={tw`w-full bg-[${colors.primary_black}] py-4 rounded-sm items-center`}
        >
          <Text style={tw`text-white font-medium text-base`}>
            Continue Browsing
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

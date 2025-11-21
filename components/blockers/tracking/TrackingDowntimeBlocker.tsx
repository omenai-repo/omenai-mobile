import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Linking, Animated, Clipboard } from "react-native";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { packageIcon, loaderIcon, clipboardIcon, checkIconWhite, globeIcon } from "utils/SvgImages";

/**
 * Props for the Blocker Screen
 */
interface TrackingBlockerProps {
  message?: string;
  trackingNumber?: string;
  externalLink?: string;
  externalLinkText?: string;
}

/**
 * Helper function to copy text to clipboard
 */
const copyToClipboard = (text: string, setCopied: (value: boolean) => void) => {
  Clipboard.setString(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

export default function TrackingDowntimeBlocker({
  message = "Our internal route optimization engine is under maintenance, causing a temporary delay in real-time tracking updates. We apologize for the inconvenience.",
  trackingNumber = "GM1234567890XX",
  externalLink = "https://www.dhl.com/global-en/home/tracking.html",
  externalLinkText = "Track on DHL Global Website",
}: TrackingBlockerProps) {
  const [copied, setCopied] = useState(false);
  const navigation = useNavigation();

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for outer ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation for loader
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleExternalLink = () => {
    Linking.openURL(externalLink).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <View style={tw`flex-1 bg-[#0f172a] items-center justify-center px-6 relative`}>
      {/* Background Grid Pattern */}
      <View style={tw`absolute top-0 left-0 right-0 bottom-0 opacity-5 bg-transparent`} />

      {/* Central Art: Package Handoff */}
      <View style={tw`relative w-24 h-24 items-center justify-center mb-8 z-30`}>
        <Animated.View
          style={[
            tw`absolute w-24 h-24 rounded-full border-4 border-[rgba(42,158,223,0.2)]`,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <View
          style={tw`w-20 h-20 bg-[#0f172a] rounded-full border-4 border-[#2A9EDF] items-center justify-center z-10 shadow-lg`}
        >
          <SvgXml xml={packageIcon} width={40} height={40} />
        </View>
        <Animated.View
          style={[
            tw`absolute -bottom-2 -right-2 bg-[#0f172a] p-1 rounded-[20px] border border-[#47748E]`,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <SvgXml xml={loaderIcon} width={16} height={16} />
        </Animated.View>
      </View>

      {/* Content */}
      <Text style={tw`text-white text-center text-2xl font-bold mb-3 z-30`}>
        Tracking Service <Text style={tw`text-[#2A9EDF]`}>Temporarily Offline</Text>
      </Text>

      <Text style={tw`text-[#47748E] text-center max-w-[380px] text-sm leading-[22px] mb-8 z-30`}>
        {message}
      </Text>

      {/* Tracking Number Section */}
      <View
        style={tw`bg-[#1f2937] p-4 rounded-lg w-full max-w-[380px] shadow-lg border border-[rgba(71,116,142,0.3)] mb-6 z-30`}
      >
        <Text style={tw`text-[10px] text-[#818181] uppercase tracking-widest mb-2 font-medium`}>
          Your Shipment Tracking Number
        </Text>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-white font-mono text-lg`}>{trackingNumber}</Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(trackingNumber, setCopied)}
            style={tw`p-2 rounded-[20px] ${copied ? "bg-[#10b981]" : "bg-[rgba(42,158,223,0.1)]"}`}
          >
            {copied ? (
              <SvgXml xml={checkIconWhite} width={16} height={16} />
            ) : (
              <SvgXml xml={clipboardIcon} width={16} height={16} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* External Link Call to Action */}
      <View style={tw`mt-4 w-full max-w-[380px] z-30`}>
        <Text style={tw`text-sm text-[#818181] mb-3`}>
          For immediate tracking, please use the provided link:
        </Text>

        <TouchableOpacity
          onPress={handleExternalLink}
          style={tw`flex-row items-center justify-center py-3 px-6 bg-[#2A9EDF] rounded-md shadow-lg`}
        >
          <SvgXml xml={globeIcon} width={16} height={16} style={tw`mr-1`} />
          <Text style={tw`text-white font-medium text-sm ml-2`}>{externalLinkText}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`flex-row items-center justify-center py-3 px-6 bg-[#0f172a] rounded-md border border-transparent mt-4 shadow-md`}
        >
          <SvgXml xml={globeIcon} width={16} height={16} style={tw`mr-1`} />
          <Text style={tw`text-white font-medium text-sm ml-2`}>Go Back</Text>
        </TouchableOpacity>

        <Text style={tw`mt-4 text-[10px] text-[#47748E] uppercase tracking-widest`}>
          OUR SERVICE WILL BE RESTORED SHORTLY.
        </Text>
      </View>
    </View>
  );
}

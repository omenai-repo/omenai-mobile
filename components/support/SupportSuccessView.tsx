import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import * as Clipboard from "expo-clipboard";
import LongBlackButton from "../buttons/LongBlackButton";

interface SupportSuccessViewProps {
  ticketId: string;
  onClose: () => void;
}

export default function SupportSuccessView({
  ticketId,
  onClose,
}: Readonly<SupportSuccessViewProps>) {
  const [isCopied, setIsCopied] = useState(false);

  const copyTicketId = async () => {
    if (ticketId) {
      await Clipboard.setStringAsync(ticketId);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <View style={tw`p-6 bg-white w-full items-center`}>
      <View
        style={tw`w-[80px] h-[80px] bg-[#DCFCE7] rounded-full items-center justify-center mb-6`}
      >
        <View
          style={tw`w-[60px] h-[60px] border-2 border-[#1A1A1A] rounded-full items-center justify-center`}
        >
          <Ionicons name="checkmark" size={32} color={colors.black} />
        </View>
      </View>

      <Text style={tw`text-2xl font-bold text-[#1A1A1A] mb-3 text-center`}>
        Request Received
      </Text>

      <Text style={tw`text-base text-gray-500 text-center mb-8 px-4`}>
        Our team has been notified and will review your request shortly.
      </Text>

      <View
        style={tw`w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 mb-8 items-center`}
      >
        <Text
          style={tw`text-xs font-bold text-gray-400 tracking-widest mb-2 uppercase`}
        >
          Ticket ID
        </Text>
        <Pressable
          onPress={copyTicketId}
          style={tw`flex-row items-center gap-2`}
        >
          <Text style={tw`text-xl font-bold text-[#1A1A1A]`}>{ticketId}</Text>
          {isCopied ? (
            <Ionicons name="checkmark" size={18} color="#94A3B8" />
          ) : (
            <Ionicons name="copy-outline" size={18} color="#94A3B8" />
          )}
        </Pressable>
        <Text style={tw`text-xs text-gray-400 mt-2`}>
          Tap to copy • Keep for your records
        </Text>
      </View>

      <LongBlackButton value="Close" onClick={onClose} style={tw`w-full`} />
    </View>
  );
}

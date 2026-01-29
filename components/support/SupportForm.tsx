import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import tw from "twrnc";
import { SupportCategory } from "../../types/types";
import { useSupport } from "../../providers/SupportProvider";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import SupportAiChat from "./SupportAiChat";
import SupportTicketForm from "./SupportTicketForm";

interface SupportFormProps {
  defaultCategory: SupportCategory;
  defaultReferenceId: string;
}

export default function SupportForm({
  defaultCategory,
  defaultReferenceId,
}: SupportFormProps) {
  const { closeSupport } = useSupport();
  const [mode, setMode] = useState<"CHAT" | "TICKET">("CHAT");
  const [isInActiveChat, setIsInActiveChat] = useState(false);

  const handleSwitchToTicket = () => {
    setMode("TICKET");
  };

  const handleBackToChat = () => {
    setMode("CHAT");
  };

  const handleBackFromActiveChat = () => {
    setIsInActiveChat(false);
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View
        style={tw`px-6 py-4 border-b border-gray-100 flex-row items-center justify-between`}
      >
        {mode === "TICKET" ? (
          <TouchableOpacity
            onPress={handleBackToChat}
            style={tw`flex-row items-center gap-1`}
          >
            <Ionicons name="chevron-back" size={16} color={colors.black} />
            <Text
              style={tw`text-xs font-bold uppercase tracking-wider text-gray-400`}
            >
              Back to AI
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={tw`flex-row items-center gap-2`}>
            {isInActiveChat && (
              <TouchableOpacity
                onPress={handleBackFromActiveChat}
                style={tw`mr-1`}
              >
                <Ionicons name="chevron-back" size={24} color={colors.black} />
              </TouchableOpacity>
            )}
            <View
              style={[
                tw`w-10 h-10 rounded-xl items-center justify-center`,
                { backgroundColor: colors.black },
              ]}
            >
              <Ionicons name="sparkles-sharp" size={18} color="white" />
            </View>
            <View>
              <Text style={tw`font-bold text-base text-gray-900`}>
                <Text style={tw`font-bold`}>Omenai</Text>{" "}
                <Text style={tw`font-normal text-gray-400`}>Advisor</Text>
              </Text>
              <View style={tw`flex-row items-center gap-1`}>
                <View style={tw`w-1.5 h-1.5 rounded-full bg-green-500`} />
                <Text
                  style={tw`text-[10px] text-gray-500 uppercase tracking-wider`}
                >
                  Live Assistant
                </Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={closeSupport}
          style={tw`p-2 bg-gray-100 rounded-full`}
        >
          <Ionicons name="close" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1`}>
        {mode === "CHAT" ? (
          <SupportAiChat
            onSwitchToTicket={handleSwitchToTicket}
            onActiveChatChange={setIsInActiveChat}
            isInActiveChat={isInActiveChat}
          />
        ) : (
          <SupportTicketForm
            defaultCategory={defaultCategory}
            defaultReferenceId={defaultReferenceId}
            onBackToChat={handleBackToChat}
          />
        )}
      </View>
    </View>
  );
}

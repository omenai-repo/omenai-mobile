import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import LongBlackButton from "../buttons/LongBlackButton";
import { ChatSession } from "../../store/support/supportChatStore";

interface SupportChatHistoryProps {
  greeting: string;
  userName: string;
  sessions: ChatSession[];
  onCreateNewSession: () => void;
  onSelectSession: (id: string) => void;
  onSwitchToTicket: () => void;
}

export default function SupportChatHistory({
  greeting,
  userName,
  sessions,
  onCreateNewSession,
  onSelectSession,
  onSwitchToTicket,
}: Readonly<SupportChatHistoryProps>) {
  return (
    <View style={tw`flex-1 p-6`}>
      <Text style={tw`font-serif text-2xl text-slate-800 mb-2`}>
        Good {greeting} {userName},
      </Text>
      <Text style={tw`text-gray-400 text-sm mb-8`}>
        Access your chat history or start a new inquiry.
      </Text>

      <LongBlackButton
        value="Start New Conversation"
        onClick={onCreateNewSession}
        icon={<Ionicons name="chatbubble-outline" size={20} color="white" />}
        style={tw`mb-8`}
      />

      {sessions.length > 0 ? (
        <View>
          <Text
            style={tw`text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1`}
          >
            Conversation History
          </Text>
          {sessions.map((sess) => (
            <TouchableOpacity
              key={sess.id}
              onPress={() => onSelectSession(sess.id)}
              style={tw`bg-white border border-gray-200 p-4 rounded-sm mb-2`}
            >
              <View style={tw`flex-row justify-between mb-1`}>
                <Text
                  numberOfLines={1}
                  style={tw`font-medium text-gray-800 text-sm w-3/4`}
                >
                  {sess.title}
                </Text>
                <Text style={tw`text-xs text-gray-400`}>
                  {new Date(sess.date).toLocaleDateString()}
                </Text>
              </View>
              <Text numberOfLines={1} style={tw`text-xs text-gray-400`}>
                {sess.preview}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={tw`items-center py-8`}>
          <Text
            style={tw`text-xs font-bold text-gray-300 uppercase tracking-widest`}
          >
            No Previous History
          </Text>
        </View>
      )}

      <View style={tw`flex-1 justify-end`}>
        <TouchableOpacity onPress={onSwitchToTicket} style={tw`items-center`}>
          <Text style={tw`text-xs text-gray-400 font-medium`}>
            Need human assistance?{" "}
            <Text style={tw`text-gray-600 underline`}>Create a Ticket</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

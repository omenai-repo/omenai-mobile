import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  FlatList,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../store/app/appStore";
import { colors } from "#config/colors.config";
import { useMutation } from "@tanstack/react-query";
import {
  useSupportChatStore,
  Message,
  ChatSession,
} from "../../store/support/supportChatStore";
import { sendAiChatMessage } from "../../services/support/support.service";
import LongBlackButton from "../buttons/LongBlackButton";

interface SupportAiChatProps {
  onSwitchToTicket: () => void;
  onActiveChatChange: (isActive: boolean) => void;
  isInActiveChat: boolean;
}

const SUGGESTIONS = [
  "About the Omenai platform",
  "Help me find great artworks",
  "Tell me about Omenai's purchase process",
  "Certificate of Authenticity?",
];

export default function SupportAiChat({
  onSwitchToTicket,
  onActiveChatChange,
  isInActiveChat,
}: SupportAiChatProps) {
  const { userSession } = useAppStore();
  const userId = userSession?.id;

  const sessions = useSupportChatStore((state) => state.getSessions(userId));
  const addSession = useSupportChatStore((state) => state.addSession);
  const updateSession = useSupportChatStore((state) => state.updateSession);

  const [activeSessionId, setActiveSessionIdLocal] = useState<string | null>(
    null,
  );
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<FlatList>(null);

  const setActiveSessionId = (id: string | null) => {
    setActiveSessionIdLocal(id);
    onActiveChatChange(id !== null);
  };

  useEffect(() => {
    if (!isInActiveChat && activeSessionId !== null) {
      setActiveSessionIdLocal(null);
    }
  }, [isInActiveChat]);

  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: async ({ messages }: { messages: Message[] }) => {
      return await sendAiChatMessage(messages);
    },
    onSuccess: (responseText, variables) => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
      };
      if (activeSessionId) {
        updateSession(
          activeSessionId,
          [...variables.messages, aiMessage],
          userId,
        );
      }
    },
    onError: (error, variables) => {
      console.error("AI Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again or create a support ticket.",
      };
      if (activeSessionId) {
        updateSession(
          activeSessionId,
          [...variables.messages, errorMessage],
          userId,
        );
      }
    },
  });

  const createNewSession = (initialMsg?: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: initialMsg ? initialMsg.slice(0, 30) + "..." : "New Conversation",
      date: Date.now(),
      preview: initialMsg || "Start of conversation",
      messages: [],
    };
    addSession(newSession, userId);
    setActiveSessionId(newSession.id);
    return newSession.id;
  };

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = createNewSession(textToSend);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };

    const currentSession = sessions.find((s) => s.id === currentSessionId);
    const updatedMessages = [...(currentSession?.messages || []), userMessage];

    if (currentSessionId) {
      updateSession(currentSessionId, updatedMessages, userId);
    }

    setInput("");
    Keyboard.dismiss();

    sendMessage({ messages: updatedMessages });
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const isChatView = !!activeSessionId || !userSession;

  if (!isChatView && userSession) {
    return (
      <View style={tw`flex-1 p-6`}>
        <Text style={tw`font-serif text-2xl text-slate-800 mb-2`}>
          Good{" "}
          {new Date().getHours() < 12
            ? "morning"
            : new Date().getHours() < 18
            ? "afternoon"
            : "evening"}{" "}
          {userSession.name?.split(" ")[0]},
        </Text>
        <Text style={tw`text-gray-400 text-sm mb-8`}>
          Access your chat history or start a new inquiry.
        </Text>

        <LongBlackButton
          value="Start New Conversation"
          onClick={() => createNewSession()}
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
                onPress={() => setActiveSessionId(sess.id)}
                style={tw`bg-white border border-gray-200 p-4 rounded-xl mb-2`}
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

  return (
    <View style={tw`flex-1`}>
      <FlatList
        ref={scrollViewRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`p-4 pb-20`}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={tw`mt-4`}>
            <Text
              style={tw`text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1`}
            >
              Suggested
            </Text>
            {SUGGESTIONS.map((s, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSend(s)}
                style={tw`bg-white border border-gray-200 p-4 rounded-xl mb-2 flex-row justify-between items-center`}
              >
                <Text style={tw`text-sm text-gray-700`}>{s}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.black} />
              </TouchableOpacity>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              tw`mb-4 max-w-[85%] rounded-2xl p-4`,
              item.role === "user"
                ? tw`bg-black self-end rounded-tr-sm`
                : tw`bg-gray-100 self-start rounded-tl-sm`,
            ]}
          >
            <Text
              style={[
                tw`text-sm leading-6`,
                item.role === "user" ? tw`text-white` : tw`text-gray-800`,
              ]}
            >
              {item.content}
            </Text>
          </View>
        )}
        ListFooterComponent={
          isLoading ? (
            <View style={tw`flex-row items-center gap-2 mb-4 ml-4`}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={tw`text-xs text-gray-400 font-medium`}>
                Thinking...
              </Text>
            </View>
          ) : null
        }
      />

      <View style={tw`p-4 border-t border-gray-100 bg-white`}>
        <View
          style={tw`flex-row items-center gap-2 relative bg-gray-50 border border-gray-200 rounded-xl px-4 py-2`}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Omenai Advisor..."
            multiline
            style={tw`flex-1 text-base text-black max-h-24 py-2`}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            disabled={!input.trim() || isLoading}
            onPress={() => handleSend()}
            style={[
              tw`p-2 rounded-lg`,
              input.trim() && !isLoading
                ? { backgroundColor: colors.black }
                : tw`bg-gray-300`,
            ]}
          >
            {isLoading ? (
              <View style={tw`w-4 h-4`} />
            ) : (
              <Ionicons name="arrow-up" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onSwitchToTicket}
          style={tw`mt-4 items-center`}
        >
          <Text style={tw`text-xs text-gray-400 font-medium`}>
            Need human assistance?{" "}
            <Text style={tw`text-gray-600 underline`}>Create a Ticket</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

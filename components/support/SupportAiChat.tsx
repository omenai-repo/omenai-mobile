import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../store/app/appStore";
import { colors } from "#config/colors.config";
import { useMutation } from "@tanstack/react-query";
import { useKeyboardHeight } from "../../hooks/useKeyboardHeight";
import {
  useSupportChatStore,
  Message,
  ChatSession,
} from "../../store/support/supportChatStore";
import { sendAiChatMessage } from "../../services/support/support.service";
import SupportChatHistory from "./SupportChatHistory";

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

// Global ref to avoid re-typing messages that have already been fully typed once.
const typedMessageIds = new Set<string>();

const MessageBubble = ({
  item,
  shouldAnimate,
}: {
  item: Message;
  shouldAnimate?: boolean;
}) => {
  const isAssistant = item.role === "assistant";
  const [displayedContent, setDisplayedContent] = useState(() => {
    // Start empty if it's the assistant, explicitly animating, and hasn't been typed before
    if (shouldAnimate && isAssistant && !typedMessageIds.has(item.id)) {
      return "";
    }
    return item.content;
  });

  useEffect(() => {
    if (shouldAnimate && isAssistant && !typedMessageIds.has(item.id)) {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedContent(item.content.slice(0, index));
        index++;
        if (index > item.content.length) {
          clearInterval(interval);
          typedMessageIds.add(item.id);
        }
      }, 15); // Adjust typing speed here

      return () => clearInterval(interval);
    } else {
      setDisplayedContent(item.content);
    }
  }, [item.content, item.id, isAssistant, shouldAnimate]);

  return (
    <View
      style={[
        tw`mb-4 max-w-[85%] rounded-sm p-4`,
        item.role === "user"
          ? [tw`self-end rounded-tr-sm`, { backgroundColor: colors.black }]
          : tw`bg-gray-100 self-start rounded-tl-sm`,
      ]}
    >
      <Text
        style={[
          tw`text-sm leading-6`,
          item.role === "user" ? tw`text-white` : tw`text-gray-800`,
        ]}
      >
        {item.role === "user" ? item.content : displayedContent}
      </Text>
    </View>
  );
};

export default function SupportAiChat({
  onSwitchToTicket,
  onActiveChatChange,
  isInActiveChat,
}: Readonly<SupportAiChatProps>) {
  const { userSession } = useAppStore();
  const userId = userSession?.id;

  const sessions = useSupportChatStore((state) => state.getSessions(userId));
  const addSession = useSupportChatStore((state) => state.addSession);
  const updateSession = useSupportChatStore((state) => state.updateSession);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const keyboardHeight = useKeyboardHeight();
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(
    null
  );
  const scrollViewRef = useRef<FlatList>(null);

  const updateActiveSessionId = (id: string | null) => {
    setActiveSessionId(id);
    onActiveChatChange(id !== null);
  };

  useEffect(() => {
    if (!isInActiveChat && activeSessionId !== null) {
      setActiveSessionId(null);
    }
  }, [isInActiveChat, activeSessionId]);

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
      setAnimatingMessageId(aiMessage.id);
      if (activeSessionId) {
        updateSession(
          activeSessionId,
          [...variables.messages, aiMessage],
          userId
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
      setAnimatingMessageId(errorMessage.id);
      if (activeSessionId) {
        updateSession(
          activeSessionId,
          [...variables.messages, errorMessage],
          userId
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
    updateActiveSessionId(newSession.id);
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

  const hour = new Date().getHours();
  let greeting = "evening";
  if (hour < 12) greeting = "morning";
  else if (hour < 18) greeting = "afternoon";

  if (!isChatView && userSession) {
    return (
      <SupportChatHistory
        greeting={greeting}
        userName={userSession.name?.split(" ")[0]}
        sessions={sessions}
        onCreateNewSession={() => createNewSession()}
        onSelectSession={updateActiveSessionId}
        onSwitchToTicket={onSwitchToTicket}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[
        tw`flex-1`,
        Platform.OS === "android"
          ? { paddingBottom: keyboardHeight }
          : undefined,
      ]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
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
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => handleSend(s)}
                style={tw`bg-white border border-gray-200 p-4 rounded-sm mb-2 flex-row justify-between items-center`}
              >
                <Text style={tw`text-sm text-gray-700`}>{s}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.black} />
              </TouchableOpacity>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <MessageBubble
            key={item.id}
            item={item}
            shouldAnimate={item.id === animatingMessageId}
          />
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
          style={tw`flex-row items-center gap-2 relative bg-gray-50 border border-gray-200 rounded-sm px-4 py-2`}
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
              tw`p-2 rounded-sm`,
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
    </KeyboardAvoidingView>
  );
}

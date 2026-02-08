import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  date: number;
  preview: string;
  messages: Message[];
}

interface SupportChatState {
  // Persisted data: Map userId -> sessions
  userSessions: Record<string, ChatSession[]>;
  // Transient data: Guest sessions
  guestSessions: ChatSession[];

  // Actions
  getSessions: (userId?: string) => ChatSession[];
  addSession: (session: ChatSession, userId?: string) => void;
  updateSession: (
    sessionId: string,
    messages: Message[],
    userId?: string,
  ) => void;
  clearGuestSessions: () => void;
}

const updateSessionList = (
  sessions: ChatSession[],
  sessionId: string,
  messages: Message[],
) => {
  const capMessages = (msgs: Message[]) =>
    msgs.length > 50 ? msgs.slice(-50) : msgs;

  return sessions.map((s: ChatSession) => {
    if (s.id === sessionId) {
      const capped = capMessages(messages);
      const lastMsg = capped[capped.length - 1];
      return {
        ...s,
        messages: capped,
        preview: lastMsg ? lastMsg.content.slice(0, 40) + "..." : s.preview,
        title:
          s.messages.length === 0 && capped.length > 0
            ? capped[0].content.slice(0, 30) + "..."
            : s.title,
      };
    }
    return s;
  });
};

export const useSupportChatStore = create<SupportChatState>()(
  persist(
    (set, get) => ({
      userSessions: {},
      guestSessions: [],

      getSessions: (userId) => {
        if (userId) {
          return get().userSessions[userId] || [];
        }
        return get().guestSessions;
      },

      addSession: (session, userId) => {
        if (userId) {
          set((state) => ({
            userSessions: {
              ...state.userSessions,
              [userId]: [session, ...(state.userSessions[userId] || [])].slice(
                0,
                5,
              ), // Limit to 5 per user
            },
          }));
        } else {
          set((state) => ({
            guestSessions: [session, ...state.guestSessions].slice(0, 5),
          }));
        }
      },

      updateSession: (sessionId, messages, userId) => {
        if (userId) {
          set((state) => ({
            userSessions: {
              ...state.userSessions,
              [userId]: updateSessionList(
                state.userSessions[userId] || [],
                sessionId,
                messages,
              ),
            },
          }));
        } else {
          set((state) => ({
            guestSessions: updateSessionList(
              state.guestSessions,
              sessionId,
              messages,
            ),
          }));
        }
      },

      clearGuestSessions: () => set({ guestSessions: [] }),
    }),
    {
      name: "omenai-support-chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ userSessions: state.userSessions }), // Only persist authenticated user sessions
    },
  ),
);

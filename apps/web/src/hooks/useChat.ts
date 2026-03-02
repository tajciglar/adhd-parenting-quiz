import { useCallback, useEffect, useReducer } from "react";
import { api } from "../lib/api";
import type {
  Conversation,
  Message,
  UserInfo,
  ChatResponse,
} from "../types/chat";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  userInfo: UserInfo | null;
}

type Action =
  | { type: "SET_USER_INFO"; userInfo: UserInfo }
  | { type: "SET_CONVERSATIONS"; conversations: Conversation[] }
  | { type: "SET_MESSAGES"; messages: Message[] }
  | { type: "SET_ACTIVE"; id: string; messages: Message[] }
  | { type: "NEW_CONVERSATION" }
  | { type: "SENDING"; sending: boolean }
  | {
      type: "MESSAGE_SENT";
      conversationId: string;
      userMessage: Message;
      assistantMessage: Message;
      isNew: boolean;
    }
  | { type: "REMOVE_CONVERSATION"; id: string }
  | { type: "LOADED" };

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  loading: true,
  sending: false,
  userInfo: null,
};

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "SET_USER_INFO":
      return { ...state, userInfo: action.userInfo };
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.conversations };
    case "SET_MESSAGES":
      return { ...state, messages: action.messages };
    case "SET_ACTIVE":
      return {
        ...state,
        activeConversationId: action.id,
        messages: action.messages,
      };
    case "NEW_CONVERSATION":
      return { ...state, activeConversationId: null, messages: [] };
    case "SENDING":
      return { ...state, sending: action.sending };
    case "MESSAGE_SENT": {
      const newMessages = [
        ...state.messages,
        action.userMessage,
        action.assistantMessage,
      ];

      let conversations = state.conversations;
      if (action.isNew) {
        // Add the new conversation to the top
        const newConv: Conversation = {
          id: action.conversationId,
          title: action.userMessage.content.substring(0, 60),
          createdAt: action.userMessage.createdAt,
          updatedAt: action.userMessage.createdAt,
        };
        conversations = [newConv, ...conversations];
      } else {
        // Move conversation to top
        conversations = conversations
          .map((c) =>
            c.id === action.conversationId
              ? { ...c, updatedAt: new Date().toISOString() }
              : c,
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime(),
          );
      }

      return {
        ...state,
        activeConversationId: action.conversationId,
        messages: newMessages,
        conversations,
        sending: false,
      };
    }
    case "REMOVE_CONVERSATION": {
      const conversations = state.conversations.filter(
        (c) => c.id !== action.id,
      );
      const isActive = state.activeConversationId === action.id;
      return {
        ...state,
        conversations,
        activeConversationId: isActive ? null : state.activeConversationId,
        messages: isActive ? [] : state.messages,
      };
    }
    case "LOADED":
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([
      api.get("/api/user/me") as Promise<UserInfo>,
      api.get("/api/conversations") as Promise<{
        conversations: Conversation[];
      }>,
    ])
      .then(([userInfo, convData]) => {
        dispatch({ type: "SET_USER_INFO", userInfo });
        dispatch({
          type: "SET_CONVERSATIONS",
          conversations: convData.conversations,
        });
        dispatch({ type: "LOADED" });
      })
      .catch(() => {
        dispatch({ type: "LOADED" });
      });
  }, []);

  const selectConversation = useCallback(async (id: string) => {
    try {
      const data = (await api.get(
        `/api/conversations/${id}/messages`,
      )) as { messages: Message[] };
      dispatch({ type: "SET_ACTIVE", id, messages: data.messages });
    } catch {
      // conversation may have been deleted
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      dispatch({ type: "SENDING", sending: true });

      try {
        const data = (await api.post("/api/chat", {
          message: text,
          conversationId: state.activeConversationId ?? undefined,
        })) as ChatResponse;

        dispatch({
          type: "MESSAGE_SENT",
          conversationId: data.conversationId,
          userMessage: data.userMessage,
          assistantMessage: data.assistantMessage,
          isNew: !state.activeConversationId,
        });
      } catch {
        dispatch({ type: "SENDING", sending: false });
      }
    },
    [state.activeConversationId],
  );

  const deleteConversation = useCallback(async (id: string) => {
    try {
      await api.delete(`/api/conversations/${id}`);
      dispatch({ type: "REMOVE_CONVERSATION", id });
    } catch {
      // ignore
    }
  }, []);

  const newConversation = useCallback(() => {
    dispatch({ type: "NEW_CONVERSATION" });
  }, []);

  return {
    ...state,
    selectConversation,
    sendMessage,
    deleteConversation,
    newConversation,
  };
}

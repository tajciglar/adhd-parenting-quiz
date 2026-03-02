export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export interface UserInfo {
  id: string;
  email: string;
  role: string;
  profile: {
    childName: string;
    onboardingCompleted: boolean;
  };
}

export interface ChatResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
}

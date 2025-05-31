export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  isLoading?: boolean;
}

export interface StoredChat {
  chatId: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

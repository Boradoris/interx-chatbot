import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import ChatArea from "@/components/chat/chatArea";
import ChatForm from "@/components/chat/chatForm";
import ChatError from "@/components/chat/chatError";
import { Message } from "@/types/chat";
import { sendMessage } from "@/api/chat/chatApi";

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [input, setInput] = useState("");
  const [lastUserText, setLastUserText] = useState("");

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleRetry = useCallback(() => {
    if (lastUserText) {
      onSend(lastUserText, true);
    }
  }, [lastUserText]);

  const onSend = useCallback(
    async (overrideText?: string, isRetry = false) => {
      const text = (overrideText ?? input).trim();
      if (!text) return;

      setLastUserText(text);
      setInput("");
      setErrorMessage("");

      let firstChunk = true;

      if (!isRetry) {
        const userMsg: Message = { id: nanoid(), text, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
      }

      try {
        await sendMessage(text, (streamId, delta) => {
          if (firstChunk) {
            /* 첫 번째 스트림 데이터 수신 시 Bot 메시지 추가 */
            setMessages(prev => [
              ...prev,
              { id: streamId, text: delta ?? "", sender: "bot", isLoading: false },
            ]);
            firstChunk = false;
          } else if (delta) {
            /* 이후 델타 수신 시 기존 Bot 메시지 업데이트 */
            setMessages(prev =>
              prev.map(msg => (msg.id === streamId ? { ...msg, text: msg.text + delta } : msg))
            );
          }
        });
      } catch (e: any) {
        setErrorMessage(e.message ?? "An error occurred");
      }
    },
    [input]
  );

  return (
    <div className="flex flex-col h-screen w-full max-w-[1100px] p-6 mx-auto">
      <ChatArea messages={messages} />
      {errorMessage && <ChatError message={errorMessage} onRetry={handleRetry} />}
      <ChatForm input={input} onInputChange={handleInputChange} onSend={onSend} />
    </div>
  );
};

export default Home;

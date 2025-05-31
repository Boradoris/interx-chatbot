import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import ChatArea from "@/components/chat/chatArea";
import ChatForm from "@/components/chat/chatForm";
import { Message } from "@/types/chat";
import { sendMessage } from "@/api/chat/chatApi";
import ChatError from "@/components/chat/chatError";

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

      let botId = "";
      let firstChunk = true;

      if (!isRetry) {
        // 최초 전송: 사용자 메시지 추가
        const userMsg: Message = { id: nanoid(), text, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
      }

      try {
        await sendMessage(text, (streamId, delta) => {
          if (firstChunk) {
            // 첫 델타: bot 메시지 추가
            botId = streamId;
            const botMsg: Message = { id: botId, text: delta, sender: "bot" };
            setMessages(prev => [...prev, botMsg]);
            firstChunk = false;
          } else if (delta) {
            // 이후 델타: 이어붙이기
            setMessages(prev =>
              prev.map(msg => (msg.id === botId ? { ...msg, text: msg.text + delta } : msg))
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

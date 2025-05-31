import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import ChatArea from "@/components/chat/chatArea";
import ChatForm from "@/components/chat/chatForm";
import { Message } from "@/types/chat";
import { sendMessage } from "@/api/chat/chatApi";

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [input, setInput] = useState("");

  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    const res = await sendMessageApi(text);
    if (!res) return;

    setMessages(prev => {
      const userMsg: Message = { id: nanoid(), text, sender: "user" };
      const botMsg: Message = {
        id: res.id,
        text: res.choices[0].message.content,
        sender: "bot",
      };
      return [...prev, userMsg, botMsg];
    });

    setInput("");
  }, [input]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const sendMessageApi = useCallback(async (mesg: string) => {
    setErrorMessage("");

    try {
      const res = await sendMessage(mesg);
      return res;
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-full max-w-[1100px] p-6 mx-auto">
      <ChatArea messages={messages} />
      {errorMessage && <p>{errorMessage}</p>}
      <ChatForm input={input} onInputChange={handleInputChange} onSend={onSend} />
    </div>
  );
};

export default Home;

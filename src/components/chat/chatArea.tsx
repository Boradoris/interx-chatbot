import { Message } from "@/types/chat";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatAreaProps {
  messages: Message[];
}

export default function ChatArea({ messages }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-2 overflow-scroll [&::-webkit-scrollbar]:hidden">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.sender === "user" ? (
            <div className="max-w-xs p-2 rounded-lg bg-[#FF8000] text-white whitespace-pre-wrap">
              {msg.text}
            </div>
          ) : (
            msg?.text && (
              <div className="w-full p-4 rounded-lg  text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>
            )
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

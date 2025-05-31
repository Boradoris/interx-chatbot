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
    <div className="flex-1 overflow-y-auto mb-4 space-y-2 [&::-webkit-scrollbar]:hidden">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.sender === "user" ? (
            <div className="max-w-xs p-2 rounded-lg bg-[#FF8000] text-white whitespace-pre-wrap">
              {msg.text}
            </div>
          ) : msg.isLoading ? (
            <div className="w-full py-4">
              <div className="h-14 p-4 rounded-lg bg-gray-100 animate-pulse"></div>
            </div>
          ) : (
            msg.text && (
              <div className="w-full py-4">
                <div className="p-4 rounded-lg bg-gray-100 text-gray-800 whitespace-pre-wrap">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
              </div>
            )
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

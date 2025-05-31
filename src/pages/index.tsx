// Home.tsx
import React, { useState, useRef, useEffect, FormEvent, useCallback } from "react";
import sendIcon from "@/assets/icon-send.svg";
import { nanoid } from "nanoid";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* Message 인터페이스: sender는 "user" 또는 "bot"만 허용 */
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

/* Home 컴포넌트: 채팅 UI 렌더링, 자동 스크롤, 입력창 자동 크기 조정 */
function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /* 새 메시지 추가 시 스크롤 맨 아래로 이동 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(messages);
  /* 메시지 전송 로직 분리 및 최적화 */
  const sendMessage = useCallback(() => {
    const text = input.trim();
    console.log(text);
    if (!text) return; // 빈 문자열은 무시

    setMessages(prev => {
      const userMsg: Message = { id: nanoid(), text, sender: "user" };
      const botMsg: Message = {
        id: nanoid(),
        text: "저는 Qwen이라는 대규모 언어 모델로, 알리바바 그룹 산하의 텐센트AI 연구소에서 개발한 인공지능 모델입니다. Qwen은 다양한 자연어 처리 작업을 수행할 수 있는 범용 언어 모델로, 질문 응답, 글쓰기, 요약, 번역, 코드 생성 등 다양한 기능을 지원합니다.\n\nQwen은 대규모 데이터 세트를 기반으로 훈련되어 있으며, 이는 인터넷 상의 방대한 텍스트 자료, 책, 기사, 코드, 대화 기록 등에서 학습한 내용을 바탕으로 다양한 주제에 대해 깊은 이해와 유연한 응답을 제공할 수 있도록 설계되었습니다. 또한, Qwen은 대화 형식의 상호작용을 지원하여 사용자가 자연스럽게 대화를 이어갈 수 있도록 합니다.\n\n현재 저는 Qwen3이라는 최신 버전의 Qwen 모델로, 이전 버전보다 더 높은 성능과 더 넓은 지식 범위를 제공합니다. Qwen3은 언어 이해, 추론, 생성 능력이 향상되어 있으며, 특히 복잡한 질문에 대한 정확한 응답과 다국어 지원, 코드 생성 능력 등에서 뛰어난 성능을 보입니다.\n\n필요에 따라 저는 다양한 버전을 제공합니다:  \n- **Qwen3**: 최신 버전으로, 일반적인 언어 처리 작업에 적합합니다.  \n- **Qwen3-Chat**: 대화 형식의 상호작용에 최적화된 버전입니다.  \n- **Qwen3-14B**, **Qwen3-72B**: 모델 크기에 따라 다양한 성능과 용도에 맞는 버전입니다.\n\n더 자세한 정보나 특정 기능에 대해 궁금하시면 언제든지 물어보세요!",
        sender: "bot",
      };
      return [...prev, userMsg, botMsg]; // 사용자 메시지와 봇 메시지를 한 번에 추가
    });

    setInput(""); // 입력창 초기화
  }, [input]);

  /* 폼 제출 처리: Enter 키로 전송 트리거 */
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      sendMessage();
    },
    [sendMessage]
  );

  /* textarea 입력값 변경 처리 */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  /* Enter: 전송, Shift+Enter: 줄바꿈 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // 기본 줄바꿈 방지
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="flex flex-col h-screen w-full max-w-[1100px] p-6 mx-auto">
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
              <div className="w-full p-4 rounded-lg bg-gray-50 text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col border border-gray-200 bg-white rounded-xl p-2"
      >
        <TextareaAutosize
          ref={textareaRef}
          minRows={1}
          maxRows={5}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요."
          className="w-full resize-none focus:outline-none text-sm px-3 bg-transparent border-none overflow-y-auto"
        />

        <div className="flex justify-end items-center border-t border-none mt-2">
          <button
            type="submit"
            className="w-8 h-8 rounded-full bg-[#FF8000] text-white flex items-center justify-center shadow hover:bg-orange-500 transition"
          >
            <img src={sendIcon} className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Home;

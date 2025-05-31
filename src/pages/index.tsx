import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { nanoid } from "nanoid";
import ChatArea from "@/components/chat/chatArea";
import ChatForm from "@/components/chat/chatForm";
import ChatError from "@/components/chat/chatError";
import { Message } from "@/types/chat";
import { sendMessage } from "@/api/chat/chatApi";
import { StoredChat } from "@/components/layout/sideMenu";

const Home = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialId = queryParams.get("chatId") || nanoid();

  const [chatId, setChatId] = useState<string>(initialId);
  const [title, setTitle] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [lastUserText, setLastUserText] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // URL 쿼리스트링(chatId)이 바뀔 때마다 상태 초기화 / 세션 복원
  useEffect(() => {
    const newId = queryParams.get("chatId") || nanoid();
    setChatId(newId);

    const storedRaw = sessionStorage.getItem(`chatData_${newId}`);
    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw) as StoredChat;
        setTitle(parsed.title);
        setMessages(parsed.messages);
      } catch {
        // 파싱 오류 시 빈 상태로 초기화
        setTitle("");
        setMessages([]);
      }
    } else {
      // 저장된 세션이 없으면 빈 상태로 초기화
      setTitle("");
      setMessages([]);
    }
  }, [search]);

  /**
   * messages 또는 title이 변경될 때마다 sessionStorage에 저장
   */
  useEffect(() => {
    if (messages.length === 0 && !title) return;

    const payload: StoredChat = {
      chatId,
      title,
      messages,
      lastUpdated: Date.now(),
    };

    try {
      sessionStorage.setItem(`chatData_${chatId}`, JSON.stringify(payload));

      // 세션스토리지에 새로운 데이터가 저장되었음을 알리는 이벤트 발행
      window.dispatchEvent(new Event("chatDataChanged"));
    } catch {}
  }, [chatId, title, messages]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  // 오류 발생 시 재시도 핸들러
  const handleRetry = useCallback(() => {
    if (lastUserText) {
      onSend(lastUserText, true);
    }
  }, [lastUserText]);

  // 메시지 전송 (스트리밍 포함) 로직
  const onSend = useCallback(
    async (overrideText?: string, isRetry: boolean = false) => {
      const rawText = overrideText ?? input;
      const text = rawText.trim();
      if (!text) return;

      // 첫 메시지를 제목으로 설정(재시도가 아닐 때만)
      if (!title && !isRetry) {
        setTitle(text);
      }

      setLastUserText(text);
      setInput("");
      setErrorMessage("");

      let firstChunk = true;

      // 재시도가 아닐 경우, 사용자 메시지 먼저 추가
      if (!isRetry) {
        const userMsg: Message = {
          id: nanoid(),
          text,
          sender: "user",
        };
        setMessages(prev => [...prev, userMsg]);
      }

      try {
        await sendMessage(text, (streamId: string, delta: string | undefined) => {
          setIsStreaming(true);

          if (firstChunk) {
            setMessages(prev => [
              ...prev,
              { id: streamId, text: delta ?? "", sender: "bot", isLoading: false },
            ]);
            firstChunk = false;
          } else if (delta) {
            setMessages(prev =>
              prev.map(msg => (msg.id === streamId ? { ...msg, text: msg.text + delta } : msg))
            );
          }
        });
      } catch (e: any) {
        setErrorMessage(e.message ?? "An error occurred");
      } finally {
        setIsStreaming(false);
      }
    },
    [input, title]
  );

  return (
    <div className="flex flex-col h-screen w-full max-w-[1100px] p-6 mx-auto">
      <ChatArea messages={messages} />

      {errorMessage && <ChatError message={errorMessage} onRetry={handleRetry} />}

      <ChatForm
        input={input}
        onInputChange={handleInputChange}
        onSend={onSend}
        isStreaming={isStreaming}
      />
    </div>
  );
};

export default Home;

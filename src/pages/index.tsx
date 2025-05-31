import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import ChatArea from "@/components/chat/chatArea";
import ChatForm from "@/components/chat/chatForm";
import { Message } from "@/types/chat";

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    setMessages(prev => {
      const userMsg: Message = { id: nanoid(), text, sender: "user" };
      const botMsg: Message = {
        id: nanoid(),
        text: 'API에서 앞전의 대화 내용을 기억하는 방식은 **API 제공업체에 따라 달라질 수 있습니다**. 일반적으로 대화 기록을 기억하기 위해 사용하는 **Key 값**은 다음과 같은 형태로 제공됩니다:\n\n### 1. **Session ID (세션 ID)**\n- 대부분의 대화형 API(예: ChatGPT, Dialogflow, Google Dialogflow, Microsoft Bot Framework 등)는 **세션 ID**나 **대화 ID**를 사용해 사용자의 대화 흐름을 관리합니다.\n- 이 세션 ID는 서버 측에서 사용자와의 대화를 식별하고, 해당 세션에 대한 이전 대화 기록을 참조할 수 있도록 합니다.\n- 예: `"session_id": "abc123xyz"`\n\n### 2. **Conversation ID (대화 ID)**\n- 대화 기록을 유지하기 위해 **대화를 고유하게 식별하는 ID**를 사용하는 경우도 있습니다.\n- 이는 API 요청 시 클라이언트에서 전달되거나, 서버에서 자동으로 생성됩니다.\n\n### 3. **User ID (사용자 ID)**\n- 사용자가 로그인 상태일 경우, **사용자 고유 식별자**를 Key로 사용하여 이전 대화 기록을 불러올 수 있습니다.\n- 예: `"user_id": "user_12345"`\n\n### 4. **Token 또는 Context 정보**\n- 일부 API는 **토큰**이나 **컨텍스트 정보**를 통해 대화 흐름을 관리합니다. 예를 들어, `context`라는 키를 사용하여 이전 대화 내용을 전달할 수 있습니다.\n- 예: `"context": "previous_conversation_data"`\n\n---\n\n### 예시: OpenAI의 ChatGPT API\nOpenAI의 ChatGPT API는 **대화를 유지하는 기능**이 **내부적으로 세션 관리**를 기반으로 합니다. 하지만 OpenAI API 자체는 **세션 ID나 사용자 ID를 명시적으로 제공하지 않으며**, 대화 기록은 **모델이 내부적으로 유지**합니다. 즉, API 요청 시 이전 대화를 포함하여 전달해야 하며, 이는 다음과 같은 방식으로 이루어집니다:\n\n```json\n{\n  "messages": [\n    {"role": "user", "content": "안녕, 어떻게 지내?"},\n    {"role": "assistant", "content": "좋습니다. 어떻게 도와드릴까요?"}\n  ],\n  "model": "gpt-3.5-turbo"\n}\n```\n\n이 `messages` 배열이 **대화 기록을 유지하는 \'Key\' 역할**을 합니다. 즉, **API는 대화를 유지하는 데 \'messages\'라는 키를 사용**합니다.\n\n---\n\n### 요약\n- **세션 ID, 대화 ID, 사용자 ID** 등의 키로 대화를 식별할 수 있습니다.\n- **OpenAI, Google, Microsoft 등 주요 API**는 일반적으로 `messages` 키를 통해 대화 기록을 전달합니다.\n- 구체적인 Key 값은 사용하는 **API 문서**에 따라 다릅니다.\n\n필요하다면 어떤 API를 사용 중인지 알려주시면, 그에 맞는 구체적인 Key 값도 알려드릴 수 있습니다!'.trim(),
        sender: "bot",
      };
      return [...prev, userMsg, botMsg];
    });

    setInput("");
  }, [input]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full max-w-[1100px] p-6 mx-auto">
      <ChatArea messages={messages} />
      <ChatForm input={input} onInputChange={handleInputChange} onSend={sendMessage} />
    </div>
  );
};

export default Home;

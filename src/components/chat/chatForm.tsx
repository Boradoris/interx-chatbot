import React, { useRef, useEffect, useCallback, FormEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";
import sendIcon from "@/assets/icon-send.svg";
import { useLocation } from "react-router-dom";

interface ChatFormProps {
  input: string;
  isStreaming: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatForm({ input, isStreaming, onInputChange, onSend }: ChatFormProps) {
  const { search } = useLocation();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [search]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSend();
    },
    [onSend]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onInputChange(e.target.value);
    },
    [onInputChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isStreaming) {
        return; // 스트리밍 중에는 키 입력 무시
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // 줄바꿈 방지
        onSend();
      }
    },
    [onSend, isStreaming]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col border border-gray-200 bg-white rounded-xl p-2 hover:cursor-text"
      onClick={() => {
        textareaRef.current?.focus();
      }}
    >
      <TextareaAutosize
        ref={textareaRef}
        minRows={1}
        maxRows={5}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요."
        className="w-full resize-none focus:outline-none text-sm py-2 px-3 bg-transparent border-none overflow-y-auto"
      />

      <div className="flex justify-end items-center border-t border-none">
        <button
          type="submit"
          disabled={isStreaming || input.trim() === ""}
          className={`w-8 h-8 rounded-full bg-[#FF8000] text-white flex items-center justify-center shadow transition 
            ${isStreaming || input.trim() === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-500"}
          `}
        >
          <img src={sendIcon} className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}

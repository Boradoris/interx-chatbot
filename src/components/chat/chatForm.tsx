import React, { useRef, FormEvent, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import sendIcon from "@/assets/icon-send.svg";

interface ChatFormProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatForm({ input, onInputChange, onSend }: ChatFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // 기본 줄바꿈 방지
        onSend();
      }
    },
    [onSend]
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
  );
}

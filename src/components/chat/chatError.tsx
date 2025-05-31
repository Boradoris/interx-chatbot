interface ChatErrorProps {
  message: string;
  onRetry: () => void;
}

const ChatError = ({ message, onRetry }: ChatErrorProps) => {
  return (
    <div className="flex items-center justify-between bg-red-100 text-red-700 p-3 rounded-lg mb-2">
      <span>{message}</span>
      <button
        onClick={onRetry}
        className="ml-4 px-3 py-1 bg-white text-gray-800 rounded-full  hover:bg-red-50 transition hover:cursor-pointer"
      >
        다시 시도
      </button>
    </div>
  );
};

export default ChatError;

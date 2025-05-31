import { useState, useEffect, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { nanoid } from "nanoid";
import addIcon from "@/assets/icon-add.svg";
import Logo from "../ui/logo";
import { Message } from "@/types/chat";

export interface StoredChat {
  chatId: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

const SideMenu = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<StoredChat[]>([]);

  /**
   * 세션 로드 함수: sessionStorage에 저장된 데이터 로드
   */
  const loadSessions = useCallback(() => {
    const loaded: StoredChat[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith("chatData_")) {
        const raw = sessionStorage.getItem(key);
        if (!raw) continue;
        loaded.push(JSON.parse(raw));
      }
    }

    loaded.sort((a, b) => b.lastUpdated - a.lastUpdated);
    setSessions(loaded);
  }, []);

  // 마운트 시와 커스텀 이벤트 발생 시 loadSessions 실행
  useEffect(() => {
    loadSessions();

    window.addEventListener("chatDataChanged", loadSessions);
    return () => {
      window.removeEventListener("chatDataChanged", loadSessions);
    };
  }, [loadSessions]);

  const handleNewChat = useCallback(() => {
    const newId = nanoid();
    navigate(`/?chatId=${newId}`);
  }, [navigate]);

  return (
    <aside className="w-[260px] h-full border-r border-gray-200 flex-shrink-0 relative">
      {/* 로고 영역 */}
      <h2 className="p-6 w-full border-b border-gray-50">
        <NavLink to="/">
          <div className="w-[129px] h-[24px]">
            <Logo />
          </div>
        </NavLink>
      </h2>

      {/* 새 채팅 버튼 */}
      <div
        className="my-4 mx-3 cursor-pointer hover:bg-gray-100 rounded-md"
        onClick={handleNewChat}
      >
        <div className="flex items-center px-2 py-2">
          <img src={addIcon} alt="추가 아이콘" className="w-5 h-5" />
          <span className="ml-2 text-sm font-medium text-gray-800">새 채팅</span>
        </div>
      </div>

      {/* 이전 채팅 목록 (최신순 순서대로 렌더링) */}
      {sessions.length > 0 && (
        <div className="mt-4 mx-3">
          <h3 className="px-2 py-1 text-xs font-semibold text-gray-600">이전 채팅</h3>
          <hr className="border-gray-200 my-1" />
          <ul className="max-h-[500px] overflow-y-auto">
            {sessions.map(({ chatId, title }) => (
              <li key={chatId}>
                <NavLink
                  to={`/?chatId=${chatId}`}
                  className="block px-2 py-1 text-sm text-gray-700 truncate hover:bg-gray-100"
                  title={title}
                >
                  {title || "제목 없음"}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default SideMenu;

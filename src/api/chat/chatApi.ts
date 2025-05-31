import { handleError } from "@/utils/error";

interface StreamPayload {
  model: string;
  messages: { role: string; content: string }[];
  stream: boolean;
}

type OnDeltaCallback = (botId: string, delta: string) => void;

/**
 * 스트리밍 API 호출 함수
 * - msg: 사용자 입력 텍스트
 * - onDelta: 스트리밍된 델타가 도착할 때마다 호출되며,
 *            첫 호출 시 id를 전달하여 botId로 사용하도록 함
 */
export async function sendMessage(msg: string, onDelta: OnDeltaCallback): Promise<void> {
  const payload: StreamPayload = {
    model: "Qwen/Qwen3-30B-A3B-GPTQ-Int4",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: msg },
    ],
    stream: true,
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_CHAT_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_CHAT_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return handleError({ response: { status: response.status, data: errorData } });
    }

    if (!response.body) {
      return handleError(new Error("No response body"));
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    let buffer = "";
    let botIdEmitted = false;
    let currentBotId = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      buffer += decoder.decode(value || new Uint8Array(), { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payloadStr = trimmed.replace(/^data:\s*/, "");
        if (payloadStr === "[DONE]") {
          done = true;
          break;
        }
        try {
          const parsed = JSON.parse(payloadStr);
          const id = parsed.id;
          const hexId = id.startsWith("chatcmpl-") ? id.slice(10) : id;
          const delta = parsed.choices[0].delta.content;
          if (!botIdEmitted) {
            currentBotId = hexId;
            botIdEmitted = true;
          }
          if (delta !== undefined) {
            onDelta(currentBotId, delta);
          }
        } catch {}
      }
    }
  } catch (e: any) {
    return handleError(e);
  }
}

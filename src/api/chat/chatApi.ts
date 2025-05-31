import { SendMessageRes } from "@/types/api/chat";
import { Post } from ".";

export async function sendMessage(msg: string): Promise<SendMessageRes> {
  const payload = {
    model: "Qwen/Qwen3-30B-A3B-GPTQ-Int4",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: msg },
    ],
  };

  try {
    const data = await Post<SendMessageRes>("/v1/chat/completions", payload);

    return data;
  } catch (e: any) {
    return Promise.reject(e);
  }
}

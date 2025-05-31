export interface SendMessageRes {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  prompt_logprobs: null | any;
}

export interface Choice {
  index: number;
  message: AssistantMessage;
  logprobs: null | any;
  finish_reason: string;
  stop_reason: null | string;
}

export interface AssistantMessage {
  role: string;
  reasoning_content: null | string;
  content: string;
  tool_calls: any[];
}

export interface Usage {
  prompt_tokens: number;
  total_tokens: number;
  completion_tokens: number;
  prompt_tokens_details: null | any;
}

import { generateOpenAIResponse } from "./llm-services";
import { generateAnthropicResponse } from "./llm-services";
import { generateXAIResponse } from "./llm-services";
import { AIResponse } from "./type";

export async function processParallelRequests(
  prompt: string
): Promise<AIResponse[]> {
  const promises = [
    executeWithRetry(() => generateOpenAIResponse(prompt)),
    executeWithRetry(() => generateAnthropicResponse(prompt)),
    executeWithRetry(() => generateXAIResponse(prompt)),
  ];

  const results = await Promise.allSettled(promises);

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      const providers = ["OpenAI", "Anthropic", "XAI"];
      const models = ["gpt-4o", "claude-3-sonnet-20240229", "grok-beta"];

      return {
        provider: providers[index],
        model: models[index],
        response: "",
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        estimatedCost: 0,
        latency: 0,
        success: false,
        error:
          result.reason instanceof Error
            ? result.reason.message
            : "Unknown error",
      };
    }
  });
}

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");

      if (
        lastError.message.includes("rate limit") ||
        lastError.message.includes("429")
      ) {
        if (attempt < maxRetries) {
          await delay(Math.pow(2, attempt) * 1000);
          continue;
        }
      }

      throw lastError;
    }
  }

  throw lastError;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

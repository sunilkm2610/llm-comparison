import OpenAI from "openai";
import { AIResponse } from "./type";
import Anthropic from "@anthropic-ai/sdk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateOpenAIResponse(
  prompt: string
): Promise<AIResponse> {
  const startTime = Date.now();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const usage = completion.usage || {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    const inputCost = (usage.prompt_tokens / 1000000) * 5.0;
    const outputCost = (usage.completion_tokens / 1000000) * 15.0;
    const estimatedCost = inputCost + outputCost;

    return {
      provider: "OpenAI",
      model: "gpt-4o",
      response: completion.choices[0]?.message?.content || "",
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      },
      estimatedCost,
      latency: Date.now() - startTime,
      success: true,
    };
  } catch (error) {
    return {
      provider: "OpenAI",
      model: "gpt-4o",
      response: "",
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      estimatedCost: 0,
      latency: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAnthropicResponse(
  prompt: string
): Promise<AIResponse> {
  const startTime = Date.now();

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const usage = message.usage;

    const inputCost = (usage.input_tokens / 1000000) * 3.0;
    const outputCost = (usage.output_tokens / 1000000) * 15.0;
    const estimatedCost = inputCost + outputCost;

    return {
      provider: "Anthropic",
      model: "claude-sonnet-4-20250514",
      response:
        message.content[0]?.type === "text" ? message.content[0].text : "",
      usage: {
        promptTokens: usage.input_tokens,
        completionTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens,
      },
      estimatedCost,
      latency: Date.now() - startTime,
      success: true,
    };
  } catch (error) {
    return {
      provider: "Anthropic",
      model: "claude-sonnet-4-20250514",
      response: "",
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      estimatedCost: 0,
      latency: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export async function generateXAIResponse(prompt: string): Promise<AIResponse> {
  const startTime = Date.now();

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "grok-2",
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `XAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    const promptTokens = data.usage?.prompt_tokens || estimateTokens(prompt);
    const completionTokens =
      data.usage?.completion_tokens ||
      estimateTokens(data.choices[0]?.message?.content || "");
    const totalTokens = promptTokens + completionTokens;

    const inputCost = (promptTokens / 1000000) * 2.0;
    const outputCost = (completionTokens / 1000000) * 10.0;
    const estimatedCost = inputCost + outputCost;

    return {
      provider: "XAI",
      model: "grok-beta",
      response: data.choices[0]?.message?.content || "",
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
      },
      estimatedCost,
      latency: Date.now() - startTime,
      success: true,
    };
  } catch (error) {
    return {
      provider: "XAI",
      model: "grok-beta",
      response: "",
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      estimatedCost: 0,
      latency: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

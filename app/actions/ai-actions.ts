"use server";

import { processParallelRequests } from "@/lib/ai-providers/parallel-processor";
import {
  saveComparison,
  getComparisonHistory,
  getComparisonById,
} from "@/lib/database-operations";
import { AIResponse, ComparisonRecord } from "@/lib/ai-providers/type";

export interface AIComparisonResult {
  id: number;
  responses: AIResponse[];
  summary: {
    totalTokens: number;
    totalCost: number;
    successfulResponses: number;
    averageLatency: number;
    providerStats: Record<
      string,
      {
        tokens: number;
        cost: number;
        success: boolean;
        latency: number;
      }
    >;
  };
  timestamp: string;
}

export async function generateAIResponses(
  prompt: string
): Promise<AIComparisonResult> {
  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new Error("Prompt cannot be empty");
    }

    if (prompt.length > 10000) {
      throw new Error("Prompt too long (max 10,000 characters)");
    }

    // Generate responses from all providers in parallel
    const responses = await processParallelRequests(prompt.trim());

    // Save to database
    const comparisonId = await saveComparison(prompt.trim(), responses);

    // Generate summary statistics
    const successful = responses.filter((r) => r.success);
    const totalTokens = responses.reduce(
      (sum, r) => sum + r.usage.totalTokens,
      0
    );
    const totalCost = responses.reduce((sum, r) => sum + r.estimatedCost, 0);
    const averageLatency =
      successful.length > 0
        ? successful.reduce((sum, r) => sum + r.latency, 0) / successful.length
        : 0;

    const providerStats: Record<
      string,
      {
        tokens: number;
        cost: number;
        success: boolean;
        latency: number;
      }
    > = {};
    responses.forEach((response) => {
      providerStats[response.provider] = {
        tokens: response.usage.totalTokens,
        cost: response.estimatedCost,
        success: response.success,
        latency: response.latency,
      };
    });

    return {
      id: comparisonId,
      responses,
      summary: {
        totalTokens,
        totalCost,
        successfulResponses: successful.length,
        averageLatency,
        providerStats,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error in generateAIResponses:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to generate AI responses: ${error.message}`
        : "Failed to generate AI responses: Unknown error"
    );
  }
}

export async function getComparisonHistoryAction(): Promise<
  ComparisonRecord[]
> {
  try {
    return await getComparisonHistory(20);
  } catch (error) {
    console.error("Error fetching comparison history:", error);
    throw new Error("Failed to fetch comparison history");
  }
}

export async function getComparisonByIdAction(
  id: number
): Promise<ComparisonRecord | null> {
  try {
    return await getComparisonById(id);
  } catch (error) {
    console.error("Error fetching comparison:", error);
    throw new Error("Failed to fetch comparison");
  }
}

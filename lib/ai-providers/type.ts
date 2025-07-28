export interface AIResponse {
  provider: string;
  model: string;
  response: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  estimatedCost: number;
  latency: number;
  success: boolean;
  error?: string;
}

export interface ComparisonRecord {
  id: number;
  prompt: string;
  createdAt: string;
  totalTokens: number;
  totalCost: number;
  successfulResponses: number;
  averageLatency: number;
  responses: AIResponse[];
}

export interface AIProvider {
  name: string;
  model: string;
  generateResponse(prompt: string): Promise<AIResponse>;
}

export interface UIAIComparisonResult {
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

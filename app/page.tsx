"use client";

import { useState } from "react";
import {
  generateAIResponses,
  getComparisonHistoryAction,
} from "@/app/actions/ai-actions";
import { useInput } from "@/context/input-provider";
import {
  ComparisonRecord,
  UIAIComparisonResult,
} from "@/lib/ai-providers/type";
import ResponseLoadingCard from "@/components/app/loading-card";
import ResultCard from "@/components/app/result-card";
import HistorySection from "@/components/app/history-section";
import HomeTextfield from "@/components/app/home-textfield";
import TrySection from "@/components/app/try-section";
import LLMSection from "@/components/app/llm-section";
import SummarySection from "@/components/app/summary-section";

export default function AIComparison() {
  const { setInput, input } = useInput();
  const [results, setResults] = useState<UIAIComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [individualLoading, setIndividualLoading] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ComparisonRecord[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const providers = [
    { name: "OpenAI", model: "gpt-4o" },
    { name: "Anthropic", model: "claude-sonnet-4-20250514" },
    { name: "XAI", model: "grok-beta" },
  ];

  const loadHistory = async () => {
    if (historyLoaded) return;
    try {
      const historyData = await getComparisonHistoryAction();
      setHistory(historyData);
      setHistoryLoaded(true);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    setIndividualLoading([true, true, true]);

    try {
      const result = await generateAIResponses(input);
      setResults(result);

      setHistoryLoaded(false);
      if (historyOpen) {
        loadHistory();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setIndividualLoading([false, false, false]);
    }
  };

  const handleSelectComparison = (comparison: ComparisonRecord) => {
    const transformedResult: UIAIComparisonResult = {
      id: comparison.id,
      responses: comparison.responses,
      summary: {
        totalTokens: comparison.totalTokens,
        totalCost: comparison.totalCost,
        successfulResponses: comparison.successfulResponses,
        averageLatency: comparison.averageLatency,
        providerStats: comparison.responses.reduce(
          (acc, response) => {
            acc[response.provider] = {
              tokens: response.usage.totalTokens,
              cost: response.estimatedCost,
              success: response.success,
              latency: response.latency,
            };
            return acc;
          },
          {} as Record<
            string,
            {
              tokens: number;
              cost: number;
              success: boolean;
              latency: number;
            }
          >
        ),
      },
      timestamp: comparison.createdAt,
    };

    setResults(transformedResult);
    setInput(comparison.prompt);
  };

  const handleHistoryToggle = () => {
    if (!historyOpen) {
      loadHistory();
    }
    setHistoryOpen(!historyOpen);
  };

  return (
    <>
      <HistorySection
        history={history}
        onSelectComparison={handleSelectComparison}
        isOpen={historyOpen}
        onToggle={handleHistoryToggle}
      />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <HomeTextfield
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
          resetClientClick={() => {
            setResults(null);
            setInput("");
          }}
        />
        {!results && !loading && <TrySection />}
        {(results || loading) && (
          <SummarySection
            loading={loading}
            results={results as UIAIComparisonResult}
          />
        )}
        {(results || loading) && (
          <div className="grid md:grid-cols-3 gap-6">
            {providers.map((provider, index) => {
              const response = results?.responses.find(
                (r) => r.provider === provider.name
              );
              const isLoading = individualLoading[index];

              if (isLoading || (!response && loading)) {
                return (
                  <ResponseLoadingCard
                    key={provider.name}
                    provider={provider.name}
                    model={provider.model}
                  />
                );
              }

              if (!response) return null;

              return (
                <LLMSection
                  key={provider.model}
                  modelName={provider.model}
                  response={response}
                />
              );
            })}
          </div>
        )}
        {results && <ResultCard results={results} />}
      </div>
    </>
  );
}

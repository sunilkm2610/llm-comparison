import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatCost } from "@/lib/utils";
import { formatLatency } from "@/lib/utils";
import { UIAIComparisonResult } from "@/lib/ai-providers/type";

const ResultCard = ({ results }: { results: UIAIComparisonResult }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left">Provider</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Tokens</th>
                  <th className="px-4 py-2 text-left">Cost</th>
                  <th className="px-4 py-2 text-left">Latency</th>
                  <th className="px-4 py-2 text-left">Speed</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results.summary.providerStats).map(
                  ([provider, stats]) => (
                    <tr key={provider} className="border-t">
                      <td className="px-4 py-2 font-medium">{provider}</td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={stats.success ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {stats.success ? "Success" : "Failed"}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        {stats.tokens.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{formatCost(stats.cost)}</td>
                      <td className="px-4 py-2">
                        {formatLatency(stats.latency)}
                      </td>
                      <td className="px-4 py-2">
                        {stats.latency > 0 && stats.success
                          ? `${Math.round(
                              stats.tokens / (stats.latency / 1000)
                            )} tok/s`
                          : "N/A"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultCard;

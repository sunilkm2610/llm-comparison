import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { formatCost, formatLatency } from "@/lib/utils";
import { UIAIComparisonResult } from "@/lib/ai-providers/type";

const SummarySection = ({
  loading,
  results,
}: {
  loading: boolean;
  results: UIAIComparisonResult;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Summary Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                results?.summary.totalTokens.toLocaleString()
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Tokens</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                formatCost(results?.summary.totalCost || 0)
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Cost</div>
          </div>
          <div className="bg-accent p-4 rounded-lg">
            <div className="text-2xl font-bold text-accent-foreground">
              {loading ? (
                <Skeleton className="h-8 w-10" />
              ) : (
                `${results?.summary.successfulResponses || 0}/3`
              )}
            </div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                formatLatency(Math.round(results?.summary.averageLatency || 0))
              )}
            </div>
            <div className="text-sm text-muted-foreground">Avg Latency</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;

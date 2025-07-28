import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, DollarSign } from "lucide-react";
import { AIResponse } from "@/lib/ai-providers/type";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { formatCost, formatLatency } from "@/lib/utils";
import { Alert, AlertDescription } from "../ui/alert";

const LLMSection = ({
  key,
  modelName,
  response,
}: {
  key: string;
  modelName: string;
  response: AIResponse;
}) => {
  return (
    <Card
      key={key}
      className={`${
        !response.success
          ? "border-l-4 border-destructive"
          : "border-l-4 border-green-500"
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{response.provider}</CardTitle>
          <Badge
            variant={response.success ? "default" : "destructive"}
            className="text-xs"
          >
            {response.success ? "Success" : "Failed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">Model:</div>
          <div className="font-mono text-sm bg-muted p-2 rounded">
            {response.model}
          </div>
        </div>

        {response.success ? (
          <>
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-2">
                Response:
              </div>
              <div className="bg-muted p-3 rounded-md text-sm max-h-64 overflow-y-auto">
                {response.response || "No response content"}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Total Tokens
                </div>
                <div className="font-semibold">
                  {response.usage.totalTokens.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {response.usage.promptTokens} +{" "}
                  {response.usage.completionTokens}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Cost
                </div>
                <div className="font-semibold">
                  {formatCost(response.estimatedCost)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Prompt Tokens</div>
                <div className="font-semibold">
                  {response.usage.promptTokens}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Completion Tokens</div>
                <div className="font-semibold">
                  {response.usage.completionTokens}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Latency</div>
                <div className="font-semibold">
                  {formatLatency(response.latency)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Speed</div>
                <div className="font-semibold">
                  {response.latency > 0
                    ? `${Math.round(
                        response.usage.totalTokens / (response.latency / 1000)
                      )} tok/s`
                    : "N/A"}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {response.error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default LLMSection;

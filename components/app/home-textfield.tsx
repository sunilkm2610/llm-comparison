"use client";

import React, { FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, AlertCircle } from "lucide-react";
import { useInput } from "@/context/input-provider";
import { Alert, AlertDescription } from "../ui/alert";

const HomeTextfield: React.FC<{
  loading: boolean;
  error: string | null;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  resetClientClick: () => void;
}> = ({ loading, error, handleSubmit, resetClientClick }) => {
  const { setInput, input } = useInput();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-6 w-6" />
          AI Model Comparison Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Enter your prompt:
            </label>
            <Textarea
              id="prompt"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              placeholder="Ask something to compare responses from OpenAI, Anthropic, and XAI..."
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
              )}
              {loading ? "Generating Responses..." : "Compare AI Models"}
            </Button>
            <Button onClick={resetClientClick}>Reset</Button>
          </div>
        </form>

        {error && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default HomeTextfield;

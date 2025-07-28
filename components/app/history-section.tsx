import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { History, Loader2 } from "lucide-react";
import { ComparisonRecord } from "@/lib/ai-providers/type";

function HistorySection({
  history,
  onSelectComparison,
  isOpen,
  onToggle,
  loading,
}: {
  history: ComparisonRecord[];
  onSelectComparison: (comparison: ComparisonRecord) => void;
  isOpen: boolean;
  onToggle: () => void;
  loading: boolean;
}) {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 right-4 z-50"
      >
        <History className="h-4 w-4 mr-2" />
        History
      </Button>

      {isOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-xl z-40 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Comparison History</h3>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                ×
              </Button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                history.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      onSelectComparison(item);
                      onToggle();
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="text-sm font-medium mb-2 line-clamp-2">
                        {item.prompt}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex justify-between">
                          <span>{item.successfulResponses}/3 success</span>
                          <span>${item.totalCost.toFixed(4)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-30" onClick={onToggle} />
      )}
    </>
  );
}

export default HistorySection;

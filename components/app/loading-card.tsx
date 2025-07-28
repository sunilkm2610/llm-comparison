import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ResponseLoadingCard({
  key,
  provider,
  model,
}: {
  key: string;
  provider: string;
  model: string;
}) {
  return (
    <Card key={key} className="border-l-4 border-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{provider}</CardTitle>
          <Badge variant="secondary" className="text-xs animate-pulse">
            Processing...
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">Model:</div>
          <div className="font-mono text-sm bg-muted p-2 rounded">{model}</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">Response:</div>
          <div className="bg-muted p-3 rounded-md">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-6 w-12" />
          </div>
          <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Badge } from "@hex-ai/ui/components/badge";
import { Card } from "@hex-ai/ui/components/card";
import { cn } from "@hex-ai/ui/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@hex-ai/ui/components/button";

export interface SessionLike {
  id: string;
  state?: Record<string, any>;
  eventCount: number;
  lastUpdateTime: number;
  createdAt: number;
}

interface SessionCardProps {
  session: SessionLike;
  active?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export function SessionCard({
  session,
  active,
  onClick,
  onDelete,
}: SessionCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <Card
      className={cn(
        "transition-colors hover:bg-muted/50 cursor-pointer p-4",
        active && "bg-primary/5 border-primary/20 border-l-primary border-l-4"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-mono overflow-hidden break-words line-clamp-2 mb-2">
            {session.id}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {session.eventCount} events
            </Badge>
          </div>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-6 w-6 shrink-0"
            aria-label="Delete session"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
        <Clock className="h-3 w-3" />
        <span>
          Created{" "}
          {formatDistanceToNow(new Date(session.createdAt * 1000), {
            addSuffix: true,
          })}
        </span>
      </div>
      {session.state && Object.keys(session.state).length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium mb-1">State:</p>
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
            {JSON.stringify(session.state, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
}

"use client";

import { useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Button } from "@hex-ai/ui/components/button";

interface ExpandableSectionProps {
  children: React.ReactNode;
  maxItems?: number;
  itemCount: number;
}

export function ExpandableSection({
  children,
  maxItems = 3,
  itemCount,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowButton = itemCount > maxItems;

  return (
    <>
      <div className={!isExpanded && shouldShowButton ? "relative" : ""}>
        {children}
        {!isExpanded && shouldShowButton && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        )}
      </div>
      {shouldShowButton && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? (
              <>
                Show Less
                <IconChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show More ({itemCount - maxItems} more)
                <IconChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}

import React from "react";
import { AlertCircle } from "lucide-react";

export const AttentionBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-xs animate-pulse">
      <AlertCircle
        className="w-3.5 h-3.5 text-rose-600 shrink-0"
        aria-hidden="true"
      />
      <span>Needs Attention</span>
    </span>
  );
};

"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-alt", className)}
      {...props}
    />
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted font-medium">Loading...</p>
      </div>
    </div>
  );
}

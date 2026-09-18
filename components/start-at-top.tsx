"use client";

import { useEffect } from "react";

export function StartAtTop() {
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type !== "reload") return;
    window.scrollTo(0, 0);
    const id = window.setTimeout(() => window.scrollTo(0, 0), 0);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}

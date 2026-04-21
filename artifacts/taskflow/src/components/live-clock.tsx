import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex items-center gap-2 bg-secondary/60 px-3 py-1.5 rounded-full border border-border/50 text-xs sm:text-sm font-semibold text-muted-foreground tabular-nums">
      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
      <span className="hidden md:inline">{date}</span>
      <span className="hidden md:inline text-border">•</span>
      <span className="text-foreground">{time}</span>
    </div>
  );
}

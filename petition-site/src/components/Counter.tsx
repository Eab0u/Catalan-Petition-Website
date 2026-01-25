import { useEffect, useState } from "react";
import CountUp from "./CountUp";
import ProgressBar from "./ProgressBar";

interface CounterProps {
  goal?: number;
  refreshInterval?: number;
}

export default function Counter({
  goal = 50000,
  refreshInterval = 15000,
}: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const API_BASE = import.meta.env.DEV
      ? import.meta.env.VITE_API_BASE
      : "";

    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/counter`);
        if (!res.ok) return;

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return;

        const json = await res.json();
        if (!mounted) return;

        if (json?.success === true && typeof json.totalSignatures === "number") {
          setCount(json.totalSignatures);
        }
      } catch {
        // fallada silenciosa: no es mostra cap error a la UI
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, refreshInterval);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [refreshInterval, goal]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <ProgressBar value={count} goal={goal} />

        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-base md:text-lg font-semibold text-black dark:text-white flex items-baseline gap-1">
            <CountUp
              from={0}
              to={count}
              separator=","
              duration={1.5}
              className="text-base md:text-lg font-semibold text-black dark:text-white"
            />
            <span className="text-base md:text-lg font-semibold text-black dark:text-white">
              / {goal.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

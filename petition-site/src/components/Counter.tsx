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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let fakeCount = 0;

    const API_BASE = import.meta.env.DEV
      ? import.meta.env.VITE_API_BASE
      : "";

    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/counter`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        fakeCount = Math.min(fakeCount + 5000, goal);
        const json = await res.json();
        if (mounted) {
          if (json.success) {
            //setCount(fakeCount)
            setCount(json.totalSignatures);
            setError(null);
          } else {
            setError("No s'ha pogut obtenir el comptador.");
          }
        }
      } catch (err) {
        console.error("Failed to load counter:", err);
        if (mounted) setError("Error carregant el comptador.");
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
      {error && (
        <p className="mb-2 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white">
          {error}
        </p>
      )}

      {/* Progress bar behind numbers */}
      <div className="relative">
        <ProgressBar value={count} goal={goal} />

        {/* Numbers overlayed on top */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-4xl md:text-5xl font-bold text-black flex items-baseline gap-2">
            <CountUp
              from={0}
              to={count}
              separator=","
              duration={1.5}
              className="text-4xl md:text-5xl font-bold text-black"
            />
            <span className="text-4xl md:text-5xl font-bold text-black">
              / {goal.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

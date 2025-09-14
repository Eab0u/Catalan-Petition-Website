import { useEffect, useState } from "react";

interface CounterProps {
  goal?: number; // optional, defaults to 50,000
  refreshInterval?: number; // optional, defaults to 15 seconds
}

export default function Counter({ goal = 50000, refreshInterval = 15000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/counter");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        if (mounted) {
          if (json.success) {
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
  }, [refreshInterval]);

  const percent = Math.min((count / goal) * 100, 100);

  return (
    <div className="w-full max-w-lg mx-auto">
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="mb-2">
        <p className="sr-only" aria-live="polite">
          {count} de {goal.toLocaleString()} signatures registrades
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded overflow-hidden h-6">
        <div
          className="bg-green-600 h-6 transition-all duration-500"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-label={`Progress: ${count} de ${goal} signatures`}
        />
      </div>

      <p className="text-center mt-1 font-medium">
        {count.toLocaleString()} / {goal.toLocaleString()} signatures
      </p>
    </div>
  );
}
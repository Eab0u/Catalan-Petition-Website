import { useState, useEffect } from "react";

interface Item {
  q: string;
  a: string;
}

interface RotatingQAProps {
  items: Item[];
  interval?: number;
  fadeDuration?: number;
}

export default function RotatingQA({
  items,
  interval = 5000,
  fadeDuration = 500
}: RotatingQAProps) {
  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFadeIn(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setFadeIn(true);
      }, fadeDuration);
    }, interval);

    return () => clearInterval(id);
  }, [items.length, interval, fadeDuration]);

  const item = items[index];

  return (
    <div className="h-32 max-w-2xl flex flex-col items-center justify-center text-center">
      <div
        className={`
          transition-opacity duration-700 will-change-opacity
          ${fadeIn ? "opacity-100" : "opacity-0"}
        `}
      >
        <h3 className="text-2xl font-semibold mb-2 select-none">
          {item.q}
        </h3>

        <p className="text-neutral-700 dark:text-gray-300 text-xl leading-relaxed select-none">
          {item.a}
        </p>
      </div>
    </div>
  );
}

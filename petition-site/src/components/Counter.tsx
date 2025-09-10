// src/components/Counter.tsx
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "stats", "global"), (snap) => {
      if (!snap.exists()) {
        setCount(0);
        return;
      }
      const data = snap.data();
      setCount(data?.totalSignatures ?? 0);
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <strong>{count}</strong> / 50.000 signatures
    </div>
  );
}

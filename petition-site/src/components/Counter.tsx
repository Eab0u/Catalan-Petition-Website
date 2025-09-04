import { useState } from "react";

export default function Counter() {
  const [count] = useState(0);
  return <div>{count} / 15,000 signatures</div>;
}
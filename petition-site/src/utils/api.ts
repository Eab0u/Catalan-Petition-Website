export async function fetchCounter(): Promise<number> {
  const res = await fetch("/api/counter");
  if (!res.ok) throw new Error("Failed to fetch counter");
  const { count } = await res.json();
  return count;
}

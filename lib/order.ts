export function moveById<T extends { id: string }>(
  list: T[],
  id: string,
  direction: "up" | "down",
): { found: boolean } {
  const from = list.findIndex((item) => item.id === id);
  if (from < 0) return { found: false };
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= list.length) return { found: true };
  const current = list[from];
  const other = list[to];
  if (!current || !other) return { found: true };
  list[from] = other;
  list[to] = current;
  return { found: true };
}

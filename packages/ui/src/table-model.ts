import type { DataColumn, SortState, RowId } from "./types";
export function paginationState(total: number, page: number, pageSize: number) {
  const rows = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const size =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.max(1, Math.floor(pageSize))
      : 10;
  const count = Math.max(1, Math.ceil(rows / size));
  const current = Number.isFinite(page)
    ? Math.max(1, Math.min(count, Math.floor(page)))
    : 1;
  return { total: rows, size, count, current };
}
export function filterRows<T extends Record<string, unknown>>(
  rows: readonly T[],
  columns: readonly DataColumn<T>[],
  query: string,
): T[] {
  const term = query.trim().toLocaleLowerCase();
  return term
    ? rows.filter((row) =>
        columns.some((column) =>
          String(row[column.key] ?? "")
            .toLocaleLowerCase()
            .includes(term),
        ),
      )
    : [...rows];
}
export function sortRows<T extends Record<string, unknown>>(
  rows: readonly T[],
  columns: readonly DataColumn<T>[],
  sort: SortState,
): T[] {
  const column =
    sort &&
    columns.find((column) => column.key === sort.key && column.sortable);
  if (!sort || !column) return [...rows];
  const collator = new Intl.Collator("zh-CN", {
    numeric: true,
    sensitivity: "base",
  });
  return [...rows].sort((a, b) => {
    const left = a[column.key],
      right = b[column.key];
    if (left == null) return right == null ? 0 : 1;
    if (right == null) return -1;
    const compared =
      typeof left === "number" && typeof right === "number"
        ? left - right
        : collator.compare(String(left), String(right));
    return compared * (sort.direction === "asc" ? 1 : -1);
  });
}
export function toggleSelection(
  selected: readonly RowId[],
  ids: readonly RowId[],
  checked: boolean,
): RowId[] {
  const result = new Set(selected);
  for (const id of ids) {
    if (checked) result.add(id);
    else result.delete(id);
  }
  return [...result];
}

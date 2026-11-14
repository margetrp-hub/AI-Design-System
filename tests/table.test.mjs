import test from "node:test";
import assert from "node:assert/strict";
import {
  filterRows,
  sortRows,
  toggleSelection,
  paginationState,
} from "../packages/ui/src/table-model.ts";
const rows = [
  { id: 1, name: "空间10", amount: 10 },
  { id: 2, name: "空间2", amount: null },
  { id: 3, name: "另一个", amount: 2 },
];
const columns = [
  { key: "name", sortable: true },
  { key: "amount", sortable: true },
];
test("numeric sorting retains missing values as unknown and does not mutate caller data", () => {
  assert.deepEqual(
    sortRows(rows, columns, { key: "amount", direction: "asc" }).map(
      (r) => r.id,
    ),
    [3, 1, 2],
  );
  assert.deepEqual(
    sortRows(rows, columns, { key: "amount", direction: "desc" }).map(
      (r) => r.id,
    ),
    [1, 3, 2],
  );
  assert.deepEqual(
    rows.map((r) => r.id),
    [1, 2, 3],
  );
  assert.deepEqual(
    sortRows(rows, columns, { key: "name", direction: "asc" })
      .filter((r) => r.name.startsWith("空间"))
      .map((r) => r.id),
    [2, 1],
  );
});
test("filter and page selection retain stable IDs outside the current view", () => {
  assert.deepEqual(
    filterRows(rows, columns, " 空间 ").map((r) => r.id),
    [1, 2],
  );
  assert.deepEqual(toggleSelection([1], [2, 3], true), [1, 2, 3]);
  assert.deepEqual(toggleSelection([1, 2, 3], [2, 3], false), [1]);
  assert.deepEqual(toggleSelection([1], [1, 2], true), [1, 2]);
});

test("pagination keeps empty, invalid and shortened result sets inside usable bounds", () => {
  assert.deepEqual(paginationState(0, 8, 10), {
    total: 0,
    size: 10,
    count: 1,
    current: 1,
  });
  assert.deepEqual(paginationState(11, 8, 10), {
    total: 11,
    size: 10,
    count: 2,
    current: 2,
  });
  assert.deepEqual(paginationState(11, NaN, 0), {
    total: 11,
    size: 10,
    count: 2,
    current: 1,
  });
  assert.deepEqual(paginationState(NaN, Infinity, NaN), {
    total: 0,
    size: 10,
    count: 1,
    current: 1,
  });
});

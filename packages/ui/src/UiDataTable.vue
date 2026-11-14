<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, watch } from "vue";
import type { DataColumn, RowId, SortState } from "./types";
import {
  filterRows,
  sortRows,
  toggleSelection,
  paginationState,
} from "./table-model";
import UiTable from "./UiTable.vue";
import UiCheckbox from "./UiCheckbox.vue";
import UiInput from "./UiInput.vue";
import UiButton from "./UiButton.vue";
import UiPagination from "./UiPagination.vue";
import UiAlert from "./UiAlert.vue";
import UiSkeleton from "./UiSkeleton.vue";
import UiEmptyState from "./UiEmptyState.vue";
const props = withDefaults(
  defineProps<{
    rows: readonly T[];
    columns: readonly DataColumn<T>[];
    rowKey: keyof T & string;
    caption: string;
    searchable?: boolean;
    selectable?: boolean;
    loading?: boolean;
    error?: string;
    manual?: boolean;
    total?: number;
  }>(),
  { searchable: true },
);
const query = defineModel<string>("query", { default: "" }),
  page = defineModel<number>("page", { default: 1 }),
  pageSize = defineModel<number>("pageSize", { default: 10 });
const selected = defineModel<RowId[]>("selected", { default: () => [] }),
  sort = defineModel<SortState>("sort", { default: null });
const emit = defineEmits<{ retry: [] }>();
const filtered = computed(() =>
  props.manual
    ? [...props.rows]
    : sortRows(
        filterRows(props.rows, props.columns, query.value),
        props.columns,
        sort.value,
      ),
);
const totalRows = computed(() =>
  props.manual ? (props.total ?? props.rows.length) : filtered.value.length,
);
const pagination = computed(() =>
  paginationState(totalRows.value, page.value, pageSize.value),
);
const visible = computed(() =>
  props.manual
    ? filtered.value
    : filtered.value.slice(
        (pagination.value.current - 1) * pagination.value.size,
        pagination.value.current * pagination.value.size,
      ),
);
const rowIds = computed(() =>
  visible.value.map((row) => row[props.rowKey] as RowId),
);
const allChecked = computed<boolean | "indeterminate">(() => {
  const n = rowIds.value.filter((id) => selected.value.includes(id)).length;
  return n === 0 ? false : n === rowIds.value.length ? true : "indeterminate";
});
watch(query, () => {
  page.value = 1;
});
function changeSort(column: DataColumn<T>) {
  sort.value =
    sort.value?.key === column.key
      ? sort.value.direction === "asc"
        ? { key: column.key, direction: "desc" }
        : null
      : { key: column.key, direction: "asc" };
}
function select(ids: RowId[], checked: boolean | "indeterminate") {
  selected.value = toggleSelection(selected.value, ids, checked === true);
}
</script>
<template>
  <section
    class="ui-data-table"
    :aria-label="caption"
    :aria-busy="loading || undefined"
  >
    <div v-if="searchable || $slots.toolbar" class="ui-data-toolbar">
      <UiInput
        v-if="searchable"
        v-model="query"
        label="搜索"
        placeholder="搜索当前表格"
      />
      <div class="ui-actions"><slot name="toolbar" /></div>
    </div>
    <div v-if="selectable" class="ui-data-selection">
      <span>已选择 {{ selected.length }} 项</span>
      <div class="ui-actions">
        <slot
          name="selection"
          :ids="selected"
          :clear="() => (selected = [])"
        /><UiButton
          size="sm"
          variant="ghost"
          :disabled="!selected.length"
          @click="selected = []"
          >清除选择</UiButton
        >
      </div>
    </div>
    <UiAlert
      v-if="error"
      title="加载未完成"
      :description="error"
      tone="danger"
      live
      ><template #action
        ><UiButton @click="emit('retry')">重试加载</UiButton></template
      ></UiAlert
    >
    <div v-if="loading" class="ui-data-loading" role="status">
      {{ rows.length ? "正在刷新，保留现有数据…" : "正在加载数据…"
      }}<UiSkeleton v-if="!rows.length" :lines="4" />
    </div>
    <UiTable :caption="caption"
      ><template #head
        ><tr>
          <th v-if="selectable" scope="col" class="ui-selection-cell">
            <UiCheckbox
              :model-value="allChecked"
              label="选择本页"
              hide-label
              :disabled="!rowIds.length"
              @update:model-value="select(rowIds, $event)"
            />
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            :class="{ 'ui-number': column.numeric }"
            :aria-sort="
              column.sortable
                ? sort?.key === column.key
                  ? sort.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
                : undefined
            "
          >
            <button
              v-if="column.sortable"
              type="button"
              class="ui-sort-button"
              @click="changeSort(column)"
            >
              {{ column.label
              }}<span aria-hidden="true">{{
                sort?.key === column.key
                  ? sort.direction === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"
              }}</span></button
            ><template v-else>{{ column.label }}</template>
          </th>
        </tr></template
      >
      <tr
        v-for="row in visible"
        :key="row[rowKey] as RowId"
        :data-selected="selected.includes(row[rowKey] as RowId) || undefined"
      >
        <td v-if="selectable" class="ui-selection-cell">
          <UiCheckbox
            :model-value="selected.includes(row[rowKey] as RowId)"
            :label="'选择 ' + String(row[rowKey])"
            hide-label
            @update:model-value="select([row[rowKey] as RowId], $event)"
          />
        </td>
        <td
          v-for="column in columns"
          :key="column.key"
          :class="{ 'ui-number': column.numeric }"
        >
          <slot
            :name="'cell-' + column.key"
            :row="row"
            :value="row[column.key]"
            >{{
              row[column.key] == null
                ? "—"
                : column.format
                  ? column.format(row[column.key], row)
                  : row[column.key]
            }}</slot
          >
        </td>
      </tr></UiTable
    ><UiEmptyState
      v-if="!loading && !error && !visible.length"
      :title="query ? '没有匹配的结果' : '暂无记录'"
      :description="
        query ? '调整搜索条件，或清除搜索。' : '新增数据后会显示在这里。'
      "
      ><UiButton v-if="query" @click="query = ''">清除搜索</UiButton
      ><slot v-else name="empty" /></UiEmptyState
    ><UiPagination
      v-model="page"
      v-model:page-size="pageSize"
      :total="totalRows"
      :disabled="loading"
    />
  </section>
</template>

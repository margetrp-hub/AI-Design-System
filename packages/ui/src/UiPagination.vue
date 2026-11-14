<script setup lang="ts">
import { computed, watch } from "vue";
import UiButton from "./UiButton.vue";
import UiSelect from "./UiSelect.vue";
import { paginationState } from "./table-model";
const model = defineModel<number>({ default: 1 });
const pageSize = defineModel<number>("pageSize", { default: 10 });
const props = withDefaults(
  defineProps<{ total: number; pageSizes?: number[]; disabled?: boolean }>(),
  { pageSizes: () => [10, 20, 50] },
);
const pagination = computed(() =>
  paginationState(props.total, model.value, pageSize.value),
);
const size = computed(() => pagination.value.size);
const count = computed(() => pagination.value.count);
const current = computed(() => pagination.value.current);
watch(
  [count, model],
  () => {
    if (model.value !== current.value) model.value = current.value;
  },
  { immediate: true },
);
</script>
<template>
  <nav class="ui-pagination" aria-label="分页">
    <span class="ui-pagination-summary"
      >{{ pagination.total > 0 ? (current - 1) * size + 1 : 0 }}–{{
        Math.min(current * size, pagination.total)
      }}
      / {{ pagination.total }} 条</span
    ><UiSelect
      v-if="pageSizes.length"
      :model-value="String(size)"
      label="每页"
      :disabled="disabled"
      :options="pageSizes.map((n) => ({ value: String(n), label: String(n) }))"
      @update:model-value="
        pageSize = Number($event);
        model = 1;
      "
    />
    <div class="ui-pagination-actions">
      <UiButton
        size="sm"
        :disabled="disabled || current <= 1"
        aria-label="上一页"
        @click="model = current - 1"
        >‹</UiButton
      ><span aria-live="polite">{{ current }} / {{ count }}</span
      ><UiButton
        size="sm"
        :disabled="disabled || current >= count"
        aria-label="下一页"
        @click="model = current + 1"
        >›</UiButton
      >
    </div>
  </nav>
</template>

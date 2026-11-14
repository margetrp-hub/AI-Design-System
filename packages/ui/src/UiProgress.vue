<script setup lang="ts">
import { computed } from "vue";
import type { CategoryColor } from "@ai-design-system/tokens";
const props = withDefaults(
  defineProps<{
    label: string;
    value?: number | null;
    max?: number;
    color?: CategoryColor;
  }>(),
  { max: 100, value: null },
);
const limit = computed(() =>
  Number.isFinite(props.max) && props.max > 0 ? props.max : undefined,
);
const current = computed(() =>
  limit.value !== undefined &&
  typeof props.value === "number" &&
  Number.isFinite(props.value)
    ? Math.min(limit.value, Math.max(0, props.value))
    : undefined,
);
const percent = computed(() =>
  current.value === undefined || limit.value === undefined
    ? undefined
    : (current.value / limit.value) * 100,
);
</script>
<template>
  <div class="ui-progress" :data-ui-color="color">
    <div class="ui-progress-label">
      <span>{{ label }}</span
      ><span>{{
        percent === undefined ? "处理中" : Math.round(percent) + "%"
      }}</span>
    </div>
    <div
      class="ui-progress-track"
      role="progressbar"
      :aria-label="label"
      :aria-valuenow="current"
      :aria-valuemin="0"
      :aria-valuemax="limit"
      :data-indeterminate="current === undefined || undefined"
    >
      <div
        class="ui-progress-fill"
        :style="percent === undefined ? undefined : { width: percent + '%' }"
      />
    </div>
  </div>
</template>

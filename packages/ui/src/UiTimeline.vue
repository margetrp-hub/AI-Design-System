<script setup lang="ts">
import type { TimelineStep } from "@ai-design-system/effects";
withDefaults(defineProps<{ steps: TimelineStep[]; label?: string }>(), {
  label: "处理过程",
});
const emit = defineEmits<{ action: [id: string] }>();
const statuses = {
  done: "已完成",
  current: "进行中",
  pending: "待处理",
  error: "需要处理",
};
</script>
<template>
  <ol class="ui-timeline" :aria-label="label">
    <li
      v-for="step in steps"
      :key="step.id"
      :data-status="step.status"
      :aria-current="step.status === 'current' ? 'step' : undefined"
    >
      <span class="ui-timeline-marker" aria-hidden="true">{{
        step.status === "done" ? "✓" : step.status === "error" ? "!" : "•"
      }}</span>
      <div>
        <div class="ui-timeline-heading">
          <strong>{{ step.title }}</strong
          ><time v-if="step.time">{{ step.time }}</time>
        </div>
        <small>{{ statuses[step.status] }}</small>
        <p v-if="step.description">{{ step.description }}</p>
        <button
          v-if="step.action"
          type="button"
          class="ui-timeline-action"
          @click="emit('action', step.id)"
        >
          {{ step.action }}
        </button>
      </div>
    </li>
  </ol>
</template>

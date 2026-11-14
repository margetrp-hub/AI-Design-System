<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    status:
      | "running"
      | "success"
      | "error"
      | "approval"
      | "unknown"
      | "paused"
      | "cancelled";
    description?: string;
    detail?: string;
    busy?: boolean;
  }>(),
  { busy: false },
);
const emit = defineEmits<{ retry: []; cancel: []; approve: []; reject: [] }>();
const labels = {
  running: "执行中",
  success: "已完成",
  error: "执行失败",
  approval: "需要确认",
  unknown: "结果待核对",
  paused: "已停止",
  cancelled: "已取消",
};
</script>
<template>
  <section class="ui-tool-activity" :data-status="status" :aria-label="title">
    <div class="ui-tool-status-icon" aria-hidden="true">
      {{
        status === "success"
          ? "✓"
          : status === "running"
            ? "◌"
            : status === "error"
              ? "!"
              : status === "approval"
                ? "?"
                : "·"
      }}
    </div>
    <div class="ui-tool-content">
      <header>
        <strong>{{ title }}</strong><span role="status">{{
          labels[status]
        }}</span>
      </header>
      <p v-if="description">{{ description }}</p>
      <details v-if="detail">
        <summary>查看执行详情</summary>
        <pre>{{ detail }}</pre>
      </details>
      <div class="ui-tool-actions">
        <button
          v-if="status === 'running'"
          type="button"
          :disabled="busy"
          @click="emit('cancel')"
        >
          停止</button
        ><template v-if="status === 'approval'"
          ><button type="button" :disabled="busy" @click="emit('reject')">
            拒绝</button
          ><button type="button" :disabled="busy" @click="emit('approve')">
            允许这次操作
          </button></template
        ><button
          v-if="
            status === 'error' ||
            status === 'unknown' ||
            status === 'paused' ||
            status === 'cancelled'
          "
          type="button"
          :disabled="busy"
          @click="emit('retry')"
        >
          {{
            status === "unknown"
              ? "核对并继续"
              : status === "paused"
                ? "继续"
                : status === "cancelled"
                  ? "重新运行"
                  : "重试"
          }}</button
        ><slot name="actions" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from "vue";
import type {
  TaskLogEntry,
  TaskStatus,
  TaskConnection,
} from "@ai-design-system/stream";
import UiCopyButton from "./UiCopyButton.vue";
const props = withDefaults(
  defineProps<{
    entries: TaskLogEntry[];
    title?: string;
    shell?: "mac" | "windows";
    status?: TaskStatus;
    connection?: TaskConnection;
    runId?: string;
    error?: string;
    discarded?: number;
    cancelling?: boolean;
    canCancel?: boolean;
    canResume?: boolean;
    canPause?: boolean;
    canRetry?: boolean;
    maxVisible?: number;
  }>(),
  {
    title: "任务日志",
    shell: "mac",
    status: "idle",
    connection: "idle",
    discarded: 0,
    maxVisible: 500,
  },
);
const emit = defineEmits<{ cancel: []; resume: []; pause: []; retry: [] }>();
const query = ref(""),
  level = ref("all"),
  viewport = ref<HTMLElement>();
const pinned = shallowRef<{
  runId: string | undefined;
  query: string;
  level: string;
  limit: number;
  rows: TaskLogEntry[];
  hidden: number;
  discarded: number;
  tailId: string | undefined;
}>();
const reading = computed(() => {
  const snapshot = pinned.value;
  return snapshot?.runId === props.runId &&
    snapshot?.query === query.value &&
    snapshot?.level === level.value &&
    snapshot?.limit === props.maxVisible
    ? snapshot
    : undefined;
});
const following = computed(() => !reading.value);
const statuses = {
  idle: "未开始",
  unknown: "结果待确认",
  running: "任务执行中",
  success: "任务完成",
  failed: "任务失败",
  cancelled: "任务已取消",
};
const connections = {
  idle: "",
  connecting: "正在连接",
  live: "实时接收",
  paused: "接收已暂停",
  disconnected: "连接中断",
};
const matching = computed(() =>
  props.entries.filter(
    (e) =>
      (level.value === "all" || e.level === level.value) &&
      (!query.value ||
        e.message.toLowerCase().includes(query.value.toLowerCase())),
  ),
);
const visible = computed(
  () =>
    reading.value?.rows ?? matching.value.slice(-Math.max(1, props.maxVisible)),
);
const hidden = computed(
  () => reading.value?.hidden ?? matching.value.length - visible.value.length,
);
const released = computed(() => reading.value?.discarded ?? props.discarded);
const hasNewLogs = computed(
  () => reading.value && reading.value.tailId !== props.entries.at(-1)?.id,
);
const copyText = computed(() =>
  matching.value
    .map((e) => `${e.time} [${e.level.toUpperCase()}] ${e.message}`)
    .join("\n"),
);
async function latest() {
  pinned.value = undefined;
  await nextTick();
  if (viewport.value) viewport.value.scrollTop = viewport.value.scrollHeight;
}
function pauseFollowing() {
  if (!following.value) return;
  pinned.value = {
    runId: props.runId,
    query: query.value,
    level: level.value,
    limit: props.maxVisible,
    rows: [...visible.value],
    hidden: hidden.value,
    discarded: props.discarded,
    tailId: props.entries.at(-1)?.id,
  };
}
function onScroll() {
  const el = viewport.value;
  if (el && el.scrollHeight - el.scrollTop - el.clientHeight > 32)
    pauseFollowing();
}
watch(
  () => [
    props.entries.length,
    props.entries.at(-1)?.id,
    props.runId,
    query.value,
    level.value,
  ],
  async () => {
    if (!props.entries.length) pinned.value = undefined;
    if (following.value) await latest();
  },
  { flush: "post" },
);
</script>
<template>
  <section
    class="ui-task-log"
    :data-shell="shell"
    :data-status="status"
    :aria-label="title"
  >
    <header class="ui-task-titlebar">
      <span v-if="shell === 'mac'" class="ui-terminal-lights" aria-hidden="true"
        ><i /><i /><i /></span
      ><span v-else class="ui-task-tab-mark" aria-hidden="true">&gt;_</span
      ><strong>{{ title }}</strong
      ><span class="ui-task-shell-name">{{
        shell === "mac" ? "zsh" : "PowerShell"
      }}</span>
    </header>
    <div class="ui-task-toolbar">
      <label
        ><span class="ui-sr-only">筛选日志</span
        ><input v-model="query" placeholder="筛选日志…" type="search" /></label
      ><label
        ><span class="ui-sr-only">日志级别</span
        ><select v-model="level" aria-label="日志级别">
          <option value="all">全部级别</option>
          <option value="debug">DEBUG</option>
          <option value="info">INFO</option>
          <option value="warning">WARN</option>
          <option value="error">ERROR</option>
          <option value="success">SUCCESS</option>
        </select></label
      ><UiCopyButton :text="copyText" label="复制筛选日志" /><button
        type="button"
        :aria-pressed="following"
        @click="following ? pauseFollowing() : latest()"
      >
        {{ following ? "暂停跟随" : "跟随最新 ↓" }}
      </button>
      <span v-if="hasNewLogs" class="ui-task-new">有新日志</span>
    </div>
    <div
      ref="viewport"
      class="ui-task-viewport"
      tabindex="0"
      role="log"
      aria-live="off"
      :aria-label="title + '内容'"
      @scroll="onScroll"
    >
      <p v-if="released || hidden" class="ui-task-notice">
        {{ released ? "客户端已释放 " + released + " 条早期日志。" : ""
        }}{{
          hidden
            ? " 当前仅渲染最近 " +
              visible.length +
              " 条匹配日志；复制包含所有已保留匹配项。"
            : ""
        }}
      </p>
      <p
        v-for="entry in visible"
        :key="entry.id"
        class="ui-task-row"
        :data-level="entry.level"
      >
        <time>{{ entry.time }}</time><span class="ui-task-level">{{
          entry.level === "warning" ? "WARN" : entry.level.toUpperCase()
        }}</span
        ><code>{{ entry.message }}</code>
      </p>
      <p v-if="!visible.length" class="ui-task-empty">
        {{ entries.length ? "没有匹配的日志" : "等待任务日志"
        }}<span
          v-if="connection === 'live'"
          class="ui-task-cursor"
          aria-hidden="true"
          >▍</span
        >
      </p>
    </div>
    <div v-if="error" class="ui-task-error" role="alert">{{ error }}</div>
    <footer class="ui-task-footer">
      <div role="status">
        <span class="ui-task-status-dot" aria-hidden="true" /><strong>{{
          statuses[status]
        }}</strong
        ><span>{{ connections[connection] }}</span>
      </div>
      <span class="ui-task-count">{{ entries.length }} 条</span>
      <div class="ui-task-actions">
        <button v-if="canPause" type="button" @click="emit('pause')">
          暂停接收</button
        ><button v-if="canResume" type="button" @click="emit('resume')">
          继续接收</button
        ><button
          v-if="canCancel"
          type="button"
          :disabled="cancelling"
          @click="emit('cancel')"
        >
          {{ cancelling ? "正在请求取消…" : "取消任务" }}</button
        ><button v-if="canRetry" type="button" @click="emit('retry')">
          重新运行
        </button>
      </div>
    </footer>
    <div v-if="runId" class="ui-task-run-id">任务 {{ runId }}</div>
  </section>
</template>

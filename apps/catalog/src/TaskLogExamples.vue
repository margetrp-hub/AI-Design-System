<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import {
  UiTaskLog,
  UiCommandDock,
  UiButton,
  UiSelect,
  UiBadge,
} from "@ai-design-system/ui";
import {
  createTaskLogSession,
  type TaskLogSnapshot,
} from "@ai-design-system/stream";
import { createDemoTransport } from "../../../examples/shared/demo-stream";
const demo = createDemoTransport();
const shell = ref("mac"),
  fault = ref("none");
const task = ref<TaskLogSnapshot>({
  runId: "",
  status: "idle",
  connection: "idle",
  entries: [],
  cursor: 0,
  discarded: 0,
  error: "",
  cancelling: false,
});
const session = createTaskLogSession({
  fetcher: demo.fetcher,
  url: "/__design-demo/tasks",
  onChange: (value) => (task.value = value),
});
function run() {
  void session.start({ fault: fault.value });
}
onBeforeUnmount(() => { session.destroy(); demo.destroy(); });
</script>
<template>
  <div class="asset-stack">
    <div class="task-demo-intro">
      <div>
        <span class="asset-kicker">LIVE TASK / TERMINAL</span>
        <h2>每一步，都看得见。</h2>
        <p>同一条任务流，两种熟悉的终端。滚动停在你正在阅读的位置。</p>
      </div>
      <UiBadge tone="info">SSE 设计实例 · 浏览器模拟</UiBadge>
    </div>
    <div class="asset-toolbar">
      <UiCommandDock
        v-model="shell"
        label="终端外观"
        :items="[
          { id: 'mac', label: 'macOS Terminal', symbol: '●' },
          { id: 'windows', label: 'Windows Terminal', symbol: '⊞' },
        ]"
      /><UiSelect
        v-model="fault"
        label="恢复场景"
        :disabled="task.status === 'running' || task.status === 'unknown'"
        :options="[
          { value: 'none', label: '正常任务' },
          { value: 'disconnect', label: '中途断开连接' },
          { value: 'failure', label: '任务主动失败' },
        ]"
      /><UiButton
        :disabled="task.status === 'running' || task.status === 'unknown'"
        @click="run"
        >开始检查</UiButton
      >
    </div>
    <UiTaskLog
      :entries="task.entries"
      :shell="shell as 'mac' | 'windows'"
      title="design-assets / inspect"
      :status="task.status"
      :connection="task.connection"
      :run-id="task.runId"
      :error="task.error"
      :discarded="task.discarded"
      :cancelling="task.cancelling"
      :can-cancel="['running', 'unknown'].includes(task.status)"
      :can-resume="['paused', 'disconnected'].includes(task.connection)"
      :can-pause="task.connection === 'live'"
      :can-retry="
        ['success', 'failed', 'cancelled'].includes(task.status) &&
        task.connection === 'idle'
      "
      @cancel="session.cancel"
      @resume="session.resume"
      @pause="session.pause"
      @retry="run"
    />
    <div class="task-demo-notes">
      <div>
        <strong>暂停跟随</strong>
        <p>仅固定阅读位置，日志仍继续到达。</p>
      </div>
      <div>
        <strong>暂停接收 / 继续接收</strong>
        <p>模拟流程继续推进，恢复时补收遗漏日志。</p>
      </div>
      <div>
        <strong>取消任务</strong>
        <p>演示取消请求与完成回执之间的状态变化。</p>
      </div>
    </div>
    <p class="asset-muted">
      所有日志和状态均为浏览器模拟，不执行 Shell、不访问源码、不连接业务任务。刷新页面将清空本次演示。
    </p>
  </div>
</template>
<style scoped>
.task-demo-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.task-demo-intro h2 {
  font: 500 clamp(26px, 3vw, 38px)/1.3 var(--ui-font-heading);
  letter-spacing: -0.04em;
  margin: 12px 0;
}
.task-demo-intro p,
.task-demo-notes p {
  font-size: 12px;
  color: var(--ui-muted);
  line-height: 1.7;
  margin: 0;
}
.task-demo-notes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid var(--ui-border);
}
.task-demo-notes strong {
  font-size: 12px;
  display: block;
  margin-bottom: 8px;
}
@media (max-width: 700px) {
  .task-demo-notes {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import {
  UiAiComposer,
  UiAiSuggestion,
  UiToolActivity,
  UiButton,
  UiTextarea,
  UiSwitch,
  UiBadge,
  UiCopyButton,
  UiTransition,
} from "@ai-design-system/ui";
import { openSse } from "@ai-design-system/stream";
import { createDemoTransport } from "../../../examples/shared/demo-stream";
const demo = createDemoTransport();
const prompt = ref("帮我改善这段介绍的表达"),
  output = ref(""),
  status = ref<"idle" | "running" | "success" | "error" | "unknown" | "paused">(
    "idle",
  ),
  fault = ref(false),
  cursor = ref(0),
  runId = ref(""),
  error = ref(""),
  feed = ref<HTMLElement>(),
  following = ref(true),
  suggestion = ref(false),
  applied = ref(false);
const documentText = ref("这是我们的组件库。可以选择组件和换颜色。"),
  previous = ref(""),
  proposal =
    "一套共享的基础，多种完整的视觉语言。自由组合布局、字体、材质和动态，把好的设计带到每一个项目。";
const busy = computed(() => status.value === "running");
let controller: AbortController | undefined;
const caption = computed(() =>
  status.value === "unknown"
    ? "连接中断，已收到的内容保留。继续将沿同一个 runId 和事件游标恢复。"
    : status.value === "paused"
      ? "你已停止生成。内容与提问保留，可继续接收本次流。"
      : status.value === "success"
        ? "模拟回答已展示完成。"
        : status.value === "error"
          ? error.value
          : "浏览器模拟流式回答；未连接 AI 模型或后台服务。",
);
function scrollState() {
  const el = feed.value;
  if (el)
    following.value = el.scrollHeight - el.clientHeight - el.scrollTop < 40;
}
async function latest() {
  await nextTick();
  if (feed.value) feed.value.scrollTop = feed.value.scrollHeight;
  following.value = true;
}
async function start(resume = false) {
  if (busy.value) return;
  if (!resume) {
    runId.value = crypto.randomUUID();
    cursor.value = 0;
    output.value = "";
  }
  controller = new AbortController();
  const current = controller;
  status.value = "running";
  error.value = "";
  let done = false;
  try {
    for await (const event of openSse("/__design-demo/stream", {
      fetcher: demo.fetcher,
      body: { runId: runId.value, fault: fault.value ? "disconnect" : "none" },
      lastEventId: String(cursor.value),
      signal: current.signal,
    })) {
      if (event.event === "delta") {
        const seq = Number(event.id);
        if (!Number.isSafeInteger(seq) || seq < 1)
          throw Error("无效的事件游标");
        if (seq <= cursor.value) continue;
        if (seq !== cursor.value + 1)
          throw Error("事件序号不连续，需要继续核对");
        const data = JSON.parse(event.data);
        if (typeof data.text !== "string") throw Error("无效的内容事件");
        const follow = following.value;
        output.value += data.text;
        cursor.value = seq;
        if (follow) await latest();
      } else if (event.event === "done") {
        const receipt = JSON.parse(event.data);
        if (receipt.runId !== runId.value)
          throw Error("完成回执不属于本次请求");
        done = true;
        status.value = "success";
      }
    }
    if (!done) status.value = "unknown";
  } catch (e) {
    if (current.signal.aborted) status.value = "paused";
    else {
      status.value = cursor.value ? "unknown" : "error";
      error.value = (e as Error).message;
    }
  } finally {
    if (controller === current) controller = undefined;
  }
}
function stop() {
  controller?.abort();
}
function apply() {
  previous.value = documentText.value;
  documentText.value = proposal;
  suggestion.value = false;
  applied.value = true;
}
onBeforeUnmount(() => { stop(); demo.destroy(); });
</script>
<template>
  <div class="asset-stack">
    <div class="ai-demo-heading">
      <div>
        <span class="asset-kicker">IN-CONTEXT ASSISTANT</span>
        <h2>让 AI，留在你的工作里。</h2>
        <p>当前内容、建议审阅与流式回答，在同一个页面。</p>
      </div>
      <UiBadge tone="info">流式 UI · 浏览器模拟</UiBadge>
    </div>
    <div class="ai-demo-layout">
      <section class="ai-document">
        <header>
          <span>▤</span>
          <div>
            <strong>组件库介绍</strong><small>当前页面 / 本次编辑</small>
          </div>
          <UiButton size="sm" @click="suggestion = !suggestion"
            >✳ 查看改写建议</UiButton
          >
        </header>
        <div class="ai-document-body">
          <span class="asset-kicker">OUR DESIGN SYSTEM</span>
          <h2>好的设计，<br />值得留下来。</h2>
          <UiTextarea v-model="documentText" label="页面介绍" :rows="5" />
          <div v-if="applied" class="ui-actions">
            <span class="integration-muted">建议已应用到本次草稿</span
            ><UiButton
              size="sm"
              @click="
                documentText = previous;
                applied = false;
              "
              >撤销应用</UiButton
            >
          </div>
          <UiTransition preset="slide"
            ><UiAiSuggestion
              v-if="suggestion"
              :before="documentText"
              :after="proposal"
              title="预置文案建议"
              @apply="apply"
              @dismiss="suggestion = false"
          /></UiTransition>
          <div class="ai-document-footnote">
            <span>01 / 上下文</span>
            <p>
              助手知道正在处理哪一段内容。修改前后并排展示，由你决定是否采用。
            </p>
          </div>
        </div>
      </section>
      <aside class="ai-assistant" aria-label="页面助手">
        <header>
          <span class="ui-ai-mark">✳</span><strong>页面助手</strong
          ><span>当前文档</span>
        </header>
        <div
          ref="feed"
          class="ai-stream-feed"
          tabindex="0"
          aria-label="流式回答"
          @scroll="scrollState"
        >
          <div class="ai-assistant-intro">
            <h3>从这里，继续想。</h3>
            <p>试着发送消息，观察真实 SSE 增量、停止与断流恢复。</p>
          </div>
          <article v-if="output" class="ai-stream-message">
            <div>
              <span class="ui-ai-mark">✳</span><strong>演示回答</strong
              ><UiCopyButton :text="output" label="复制回答" />
            </div>
            <p :data-streaming="busy">{{ output }}</p>
          </article>
          <UiToolActivity
            v-if="status !== 'idle'"
            title="接收内容流"
            :status="status"
            :description="caption"
            :detail="
              'runId: ' +
              runId +
              '\nLast-Event-ID: ' +
              cursor +
              (error ? '\n' + error : '')
            "
            @cancel="stop"
            @retry="start(true)"
          />
        </div>
        <UiButton
          v-if="!following && output"
          size="sm"
          class="ai-latest"
          @click="latest"
          >回到最新内容 ↓</UiButton
        >
        <div class="ai-composer-wrap">
          <UiAiComposer
            v-model="prompt"
            context="组件库介绍 · 当前草稿"
            :busy="busy"
            :suggestions="['改善表达', '提炼三个重点']"
            @submit="start(false)"
            @stop="stop"
          />
          <div class="ai-demo-controls">
            <UiSwitch
              v-model="fault"
              label="演示中途断流"
              :disabled="busy"
            /><small>不连接模型，不发送文档内容</small>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
<style scoped>
.ai-demo-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.ai-demo-heading h2 {
  font-family: var(--ui-font-heading);
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.04em;
  margin: 12px 0;
}
.ai-demo-heading p {
  font-size: 13px;
  color: var(--ui-muted);
  margin: 0;
}
.ai-demo-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-panel-radius);
  overflow: hidden;
  background: var(--ui-surface);
}
.ai-document > header,
.ai-assistant > header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 22px;
  min-height: 72px;
  border-bottom: 1px solid var(--ui-border);
}
.ai-document > header > div {
  flex: 1;
}
.ai-document header strong,
.ai-assistant header strong {
  font-size: 13px;
}
.ai-document header small {
  display: block;
  font-size: 10px;
  color: var(--ui-muted);
  margin-top: 4px;
}
.ai-assistant header > span:last-child {
  margin-left: auto;
  font-size: 10px;
  color: var(--ui-muted);
}
.ai-document-body {
  padding: 32px;
  display: grid;
  gap: 24px;
}
.ai-document-body > h2 {
  font: 500 clamp(32px, 3vw, 46px)/1.3 var(--ui-font-heading);
  letter-spacing: -0.04em;
  margin: 0;
}
.ai-document-footnote {
  margin-top: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--ui-border);
  color: var(--ui-muted);
  font-size: 12px;
  line-height: 1.7;
}
.ai-document-footnote > span {
  font-size: 10px;
  letter-spacing: 0.12em;
}
.ai-assistant {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--ui-border);
  background: color-mix(in srgb, var(--ui-soft) 55%, var(--ui-surface));
}
.ai-stream-feed {
  height: 390px;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.ai-assistant-intro h3 {
  font-weight: 500;
  font-size: 21px;
  margin: 0 0 10px;
}
.ai-assistant-intro p {
  font-size: 12px;
  color: var(--ui-muted);
  line-height: 1.7;
  margin: 0;
}
.ai-stream-message > div {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.ai-stream-message > div .ui-button {
  margin-left: auto;
}
.ai-stream-message > p {
  font-size: 14px;
  line-height: 1.9;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 14px 0 0;
}
.ai-stream-message > p[data-streaming="true"]:after {
  content: "";
  display: inline-block;
  width: 5px;
  height: 14px;
  background: var(--ui-accent);
  margin-left: 3px;
  vertical-align: middle;
}
.ai-composer-wrap {
  padding: 18px;
  border-top: 1px solid var(--ui-border);
  margin-top: auto;
}
.ai-demo-controls {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}
.ai-demo-controls small {
  font-size: 10px;
  color: var(--ui-muted);
}
.ai-latest {
  align-self: center;
  margin: -10px 0 8px;
}
@media (max-width: 1000px) {
  .ai-demo-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .ai-assistant {
    border-left: 0;
    border-top: 1px solid var(--ui-border);
  }
  .ai-document-body {
    padding: 24px;
  }
  .ai-stream-feed {
    height: 340px;
  }
}
</style>

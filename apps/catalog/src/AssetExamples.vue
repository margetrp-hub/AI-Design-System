<script setup lang="ts">
import { computed, ref } from "vue";
import {
  UiTheme,
  UiBackdrop,
  UiAuthCharacters,
  UiAuthLayout,
  UiGlowBorder,
  UiSignalOrbit,
  UiTerminal,
  UiCommandDock,
  UiTimeline,
  UiButton,
  UiInput,
  UiSelect,
  UiBadge,
  UiSwitch,
  UiCopyButton,
  UiTransition,
  type BackdropKind,
  type CharacterMode,
  type TimelineStep,
  type TerminalLine,
} from "@ai-design-system/ui";
import DemoCard from "./DemoCard.vue";
const backdrop = ref<BackdropKind>("rays"),
  paused = ref(false),
  name = ref(""),
  password = ref(""),
  revealed = ref(false),
  focus = ref(""),
  selectedNode = ref("web"),
  dock = ref("design"),
  retryKey = ref(0),
  effectState = ref(""),
  step = ref(false);
const characterMode = computed<CharacterMode>(() =>
  revealed.value
    ? "reveal"
    : focus.value === "password"
      ? "password"
      : focus.value === "name"
        ? "typing"
        : "idle",
);
const nodes = [
  { id: "web", label: "网页", symbol: "W" },
  { id: "native", label: "移动端", symbol: "N" },
  { id: "desktop", label: "桌面", symbol: "D" },
  { id: "data", label: "数据", symbol: "◈" },
  { id: "ai", label: "智能体", symbol: "✳" },
];
const steps = computed<TimelineStep[]>(() => [
  {
    id: "read",
    title: "读取本地设计",
    status: "done",
    description: "组件、设计值与样式在同一个工程。",
  },
  {
    id: "review",
    title: "确认页面细节",
    status: step.value ? "done" : "current",
    description: "这是可操作的本地检查清单。",
    action: step.value ? "重新检查" : "标记已检查",
  },
  {
    id: "next",
    title: "接入你的项目",
    status: step.value ? "current" : "pending",
    description: "接入与发布仍由具体项目负责。",
  },
]);
const lines = computed<TerminalLine[]>(() => [
  { id: "scope", text: "ai-design-system / design workspace" },
  { id: "pick", text: "selected node: " + selectedNode.value, tone: "plain" },
  { id: "mode", text: "character mode: " + characterMode.value },
  {
    id: "canvas",
    text: "background: " + backdrop.value + " · " + effectState.value,
    tone: effectState.value === "fallback" ? "warning" : "plain",
  },
]);
const code = `import { UiAuthLayout, UiBackdrop, UiAuthCharacters } from '@ai-design-system/ui'\n\n<UiAuthLayout>\n  <template #visual>\n    <UiBackdrop kind="rays" :paused="paused" />\n    <UiAuthCharacters :mode="focusMode" :paused="paused" />\n  </template>\n  <!-- Your labelled form -->\n</UiAuthLayout>`;
const dockCode = '<UiCommandDock v-model="view" :items="items" />';
</script>
<template>
  <div class="asset-stack">
    <div class="asset-toolbar">
      <UiSelect
        v-model="backdrop"
        label="背景资产"
        :options="[
          { value: 'rays', label: '穿云 · 光束' },
          { value: 'grid', label: '深网 · 管理入口扫描' },
          { value: 'particles', label: '星尘 · 发光粒子' },
          { value: 'nebula', label: '星雾 · 旧登录光晕' },
        ]"
      /><UiSwitch v-model="paused" label="暂停环境动态" /><UiButton
        @click="retryKey++"
        >重新加载动效</UiButton
      ><span class="asset-source-note">{{
        effectState === "fallback"
          ? "当前使用静态背景，可重新加载"
          : effectState === "paused"
            ? "动态已暂停"
            : "移动指针，或聚焦输入框"
      }}</span>
    </div>
    <UiAuthLayout label="代理登录视觉资产"
      ><template #visual
        ><UiBackdrop
          :key="retryKey"
          :kind="backdrop"
          :paused="paused"
          @state="effectState = $event"
        />
        <div class="asset-brand">
          <span>◈</span><strong>STUDIO</strong><small>WORK TOGETHER</small>
        </div>
        <UiAuthCharacters :mode="characterMode" :paused="paused" />
        <div class="asset-visual-caption">
          <span>HELLO, AGAIN.</span>
          <h2>每一次进入，<br />都有人回应。</h2>
          <p>代理登录原有角色与光效。</p>
        </div></template
      >
      <div class="asset-form-heading">
        <span>交互预览</span>
        <h2>欢迎回来</h2>
        <p>输入时靠近，密码时闭眼，显示时转头。</p>
      </div>
      <div class="form-stack">
        <UiInput
          v-model="name"
          label="称呼"
          autocomplete="off"
          placeholder="你的名字"
          @focus="focus = 'name'"
          @blur="focus = ''"
        /><UiInput
          v-model="password"
          label="演示密码"
          autocomplete="off"
          :type="revealed ? 'text' : 'password'"
          placeholder="仅用于观察角色反应"
          @focus="focus = 'password'"
          @blur="focus = ''"
        /><UiSwitch v-model="revealed" label="显示演示密码" /><UiButton
          variant="primary"
          @click="name = '设计伙伴'"
          >填入示例称呼</UiButton
        >
      </div>
      <template #footer
        >纯视觉资产演示 · 不提交、存储或校验密码</template
      ></UiAuthLayout
    >
    <div class="asset-showcase-grid">
      <UiGlowBorder :paused="paused"
        ><span class="asset-kicker">SIGNAL / RELATIONSHIPS</span>
        <h2>让连接被看见。</h2>
        <p class="asset-muted">
          轨道展示与固定操作区配合，选择不会追着运动目标跑。
        </p>
        <UiSignalOrbit
          :nodes="nodes"
          label="平台关系"
          :selected-id="selectedNode"
          :paused="paused"
          center="AI DESIGN"
          @select="selectedNode = $event"
      /></UiGlowBorder>
      <div class="asset-stack">
        <UiTerminal :lines="lines" title="真实预览状态" />
        <div class="ui-surface">
          <h3>处理进度</h3>
          <UiTimeline :steps="steps" @action="step = !step" />
        </div>
      </div>
    </div>
    <DemoCard
      title="跟随选择的快捷导航"
      names="UiCommandDock · UiTransition"
      :code="dockCode"
      ><div class="asset-stack">
        <UiCommandDock
          v-model="dock"
          :items="[
            { id: 'design', label: '设计', symbol: '◇' },
            { id: 'build', label: '构建', symbol: '⌘' },
            { id: 'inspect', label: '检查', symbol: '◎' },
          ]"
        /><UiTransition preset="page" mode="out-in"
          ><div :key="dock" class="asset-dock-detail">
            <strong>{{
              dock === "design"
                ? "从自己的视觉语言开始"
                : dock === "build"
                  ? "组件与布局直接组合"
                  : "检查交互，也检查小细节"
            }}</strong>
            <p>
              {{
                dock === "design"
                  ? "颜色、字体、材料与动态独立搭配。"
                  : dock === "build"
                    ? "使用公开包接口，保留真实业务的状态与动作。"
                    : "键盘切换、输入保留、动画中断和失败恢复都要顺畅。"
              }}
            </p>
          </div></UiTransition
        >
      </div></DemoCard
    >
    <div class="asset-code-row">
      <pre class="code-block"><code>{{code}}</code></pre>
      <UiCopyButton :text="code" label="复制入口布局用法" />
    </div>
  </div>
</template>

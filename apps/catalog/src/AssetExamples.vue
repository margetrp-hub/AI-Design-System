<script setup lang="ts">
import { computed, ref } from "vue";
import {
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
  UiSwitch,
  UiCopyButton,
  UiTransition,
  type BackdropKind,
  type CharacterMode,
  type TimelineStep,
  type TerminalLine,
} from "@ai-design-system/ui";
import DemoCard from "./DemoCard.vue";
const scene = ref<"admin" | "field" | "split">("admin"),
  progress = ref(0),
  adminName = ref(""),
  adminPassword = ref(""),
  adminRevealed = ref(false),
  adminNotice = ref(""),
  backdrop = ref<BackdropKind>("rays"),
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
const shapes = ["流带", "球体", "螺旋", "环阵", "星系"];
const currentBackdrop = computed(() =>
  scene.value === "admin"
    ? "grid"
    : scene.value === "field"
      ? "particle-field"
      : backdrop.value,
);
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
    text: "background: " + currentBackdrop.value + " · " + effectState.value,
    tone: effectState.value === "fallback" ? "warning" : "plain",
  },
]);
const code = computed(() =>
  scene.value === "admin"
    ? `<UiAuthLayout pattern="centered" class="ui-auth-console" label="管理员登录">\n  <template #visual>\n    <UiBackdrop kind="grid" color="#3a82ff" :paused="paused" />\n  </template>\n  <UiGlowBorder class="ui-auth-console-card" color="#60a5fa" :paused="paused">\n    <!-- Form recipe: docs/integration.md -->\n  </UiGlowBorder>\n</UiAuthLayout>\n\n// ui-auth-console-* styles ship in both framework style.css imports.`
    : scene.value === "field"
      ? `<section style="position: relative; isolation: isolate; min-height: 680px">\n  <UiBackdrop kind="particle-field" color="#ffffff"\n    :progress="progress" :paused="paused" />\n  <!-- Foreground content: position: relative -->\n</section>\n\n// progress: 0 = 流带, .25 = 球体, .5 = 螺旋, .75 = 环阵, 1 = 星系\n// Bind progress to your page/scroll state; intermediate values morph continuously.`
      : `<UiAuthLayout>\n  <template #visual>\n    <UiBackdrop kind="rays" :paused="paused" />\n    <UiAuthCharacters :mode="focusMode" :paused="paused" />\n  </template>\n  <!-- Your labelled form -->\n</UiAuthLayout>`,
);
const dockCode = '<UiCommandDock v-model="view" :items="items" />';
</script>
<template>
  <div class="asset-stack">
    <div class="asset-scene-picker" role="group" aria-label="选择场景资产">
      <UiButton
        :aria-pressed="scene === 'admin'"
        :variant="scene === 'admin' ? 'primary' : 'secondary'"
        @click="scene = 'admin'"
        >管理员登录</UiButton
      >
      <UiButton
        :aria-pressed="scene === 'field'"
        :variant="scene === 'field' ? 'primary' : 'secondary'"
        @click="scene = 'field'"
        >企业首页粒子</UiButton
      >
      <UiButton
        :aria-pressed="scene === 'split'"
        :variant="scene === 'split' ? 'primary' : 'secondary'"
        @click="scene = 'split'"
        >左右分屏登录</UiButton
      >
    </div>
    <div class="asset-toolbar">
      <UiSelect
        v-if="scene === 'split'"
        v-model="backdrop"
        label="背景资产"
        :options="[
          { value: 'rays', label: '穿云 · 光束' },
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
            : scene === "admin"
              ? "深网 · 四面透视与往返扫描"
              : scene === "field"
                ? "星序 · OHLAOO 原首页五形态粒子"
                : "移动指针，或聚焦输入框"
      }}</span>
    </div>
    <UiAuthLayout
      v-if="scene === 'admin'"
      pattern="centered"
      label="管理员登录视觉资产"
      class="ui-auth-console"
    >
      <template #visual
        ><UiBackdrop
          :key="retryKey"
          kind="grid"
          color="#3a82ff"
          :paused="paused"
          @state="effectState = $event"
      /></template>
      <span class="ui-auth-console-kicker">安全控制台 · 设计演示</span>
      <UiGlowBorder
        color="#60a5fa"
        :duration="3.8"
        :paused="paused"
        class="ui-auth-console-card"
      >
        <header>
          <h2>管理员登录</h2>
          <p>使用管理员账号密码进入运营控制台</p>
        </header>
        <form
          class="ui-auth-console-form"
          @submit.prevent="
            adminNotice = '这是登录设计演示，不会提交账号或建立会话。'
          "
        >
          <UiInput
            v-model="adminName"
            label="管理员邮箱 / 用户名"
            placeholder="请输入管理员邮箱"
            autocomplete="off"
          />
          <div class="ui-auth-console-password">
            <UiInput
              v-model="adminPassword"
              label="管理员密码"
              :type="adminRevealed ? 'text' : 'password'"
              autocomplete="off"
            />
            <button
              type="button"
              :aria-pressed="adminRevealed"
              :aria-label="adminRevealed ? '隐藏管理员密码' : '显示管理员密码'"
              @click="adminRevealed = !adminRevealed"
            >
              {{ adminRevealed ? "隐藏" : "显示" }}
            </button>
          </div>
          <button
            type="button"
            class="ui-auth-console-forgot"
            @click="adminNotice = '正式接入时，这里连接你项目的密码找回流程。'"
          >
            忘记管理员密码？
          </button>
          <UiButton type="submit" class="ui-auth-console-submit"
            >进入控制台</UiButton
          >
          <p v-if="adminNotice" class="ui-auth-console-notice" role="status">
            {{ adminNotice }}
          </p>
        </form>
        <p class="ui-auth-console-foot">视觉演示 · 不提交账号信息</p>
      </UiGlowBorder>
    </UiAuthLayout>
    <section
      v-else-if="scene === 'field'"
      class="asset-particle-home"
      aria-label="OHLAOO 企业首页粒子背景"
    >
      <UiBackdrop
        :key="retryKey"
        kind="particle-field"
        color="#ffffff"
        :progress="progress"
        :paused="paused"
        @state="effectState = $event"
      />
      <header class="asset-particle-header">
        <strong>OHLAOO<span>®</span></strong
        ><span>DESIGN ARCHIVE / 01</span>
      </header>
      <div class="asset-particle-copy">
        <span>IDEAS INTO REALITY</span>
        <h2>让想象，<br />成为下一种可能。</h2>
        <p>同一片粒子，五种空间形态。</p>
      </div>
      <div class="asset-particle-controls">
        <div role="group" aria-label="粒子形态">
          <button
            v-for="(shape, index) in shapes"
            :key="shape"
            type="button"
            :aria-pressed="progress === index / 4"
            @click="progress = index / 4"
          >
            <span>0{{ index + 1 }}</span
            >{{ shape }}
          </button>
        </div>
        <label
          >形态进度<input
            v-model.number="progress"
            type="range"
            min="0"
            max="1"
            step=".01"
            aria-label="形态进度"
        /></label>
      </div>
    </section>
    <UiAuthLayout v-else label="代理登录视觉资产"
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

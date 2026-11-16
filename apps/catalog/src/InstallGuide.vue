<script setup lang="ts">
import { computed, ref } from "vue";
import { UiCopyButton } from "@ai-design-system/ui";
import vuePackage from "../../../packages/ui/package.json";
import reactPackage from "../../../packages/react/package.json";
import tokensPackage from "../../../packages/tokens/package.json";
import stylesPackage from "../../../packages/styles/package.json";
import effectsPackage from "../../../packages/effects/package.json";
import streamPackage from "../../../packages/stream/package.json";
const framework = ref<"vue" | "react">("vue");
const repo = "https://github.com/margetrp-hub/AI-Design-System";
const install = computed(
  () =>
    "npm install " +
    [
      tokensPackage,
      stylesPackage,
      effectsPackage,
      streamPackage,
      framework.value === "vue" ? vuePackage : reactPackage,
    ]
      .map(
        (pkg) =>
          `./${pkg.name.replace("@", "").replace("/", "-")}-${pkg.version}.tgz`,
      )
      .join(" "),
);
const example = computed(() =>
  framework.value === "vue"
    ? `<script setup lang="ts">\nimport { UiTheme, UiButton } from '@ai-design-system/ui'\nimport '@ai-design-system/ui/style.css'\n<` +
      `/script>\n\n<template>\n  <UiTheme design="industrial" palette="jade" mode="light">\n    <UiButton variant="primary">开始创作</UiButton>\n  </UiTheme>\n</template>`
    : `import { UiTheme, UiButton } from '@ai-design-system/react'\nimport '@ai-design-system/react/style.css'\n\nexport default function App() {\n  return (\n    <UiTheme theme={{ design: 'industrial', palette: 'jade', mode: 'light' }}>\n      <UiButton variant="primary">开始创作</UiButton>\n    </UiTheme>\n  )\n}`,
);
</script>
<template>
  <section class="install-guide">
    <div class="install-frameworks" role="group" aria-label="选择接入框架">
      <button :aria-pressed="framework === 'vue'" @click="framework = 'vue'">
        Vue 3 <span>67 个组件</span></button
      ><button
        :aria-pressed="framework === 'react'"
        @click="framework = 'react'"
      >
        React <span>18 个组件</span>
      </button>
    </div>
    <div class="install-columns">
      <div>
        <section>
          <h2>1. 获取组件包</h2>
          <p>
            从 Releases 下载四个共享包和所选框架包，将这五个 tgz 放到项目目录。
          </p>
          <a
            class="ui-button"
            :href="repo + '/releases/latest'"
            target="_blank"
            rel="noopener"
            >下载发行包 ↗</a
          >
          <p>当前通过 tgz 分发，尚未发布到 npm registry。</p>
        </section>
        <section>
          <div class="install-section-heading">
            <h2>2. 安装依赖</h2>
            <UiCopyButton :text="install" label="复制安装命令" />
          </div>
          <pre class="install-command"><code>{{ install }}</code></pre>
        </section>
        <section>
          <div class="install-section-heading">
            <h2>3. 导入组件与样式</h2>
            <UiCopyButton :text="example" label="复制组件示例" />
          </div>
          <pre><code>{{ example }}</code></pre>
        </section>
      </div>
      <aside>
        <h2>当前支持范围</h2>
        <dl>
          <div>
            <dt>Vue / Vite</dt>
            <dd>
              表单、导航、弹层、十四种骨架、完整案例、动效、AI 与任务日志。
            </dd>
          </div>
          <div>
            <dt>React</dt>
            <dd>
              基础控件、背景、角色、AI 与任务日志。接口与 Vue
              分开；完整案例、UiLayout 和 Vue 浮层未提供 React 对应实现。
            </dd>
          </div>
          <div>
            <dt>Next.js / Electron</dt>
            <dd>
              使用对应 Web 框架包。SSR、hydration
              和桌面宿主能力仍需在实际项目验证。
            </dd>
          </div>
          <div>
            <dt>Uni-app / React Native</dt>
            <dd>
              目前共享设计值，需要目标端组件适配；未提供已验证的原生 UI 包。
            </dd>
          </div>
        </dl>
        <h2>交给 AI 使用</h2>
        <p>
          安装设计 Skill 后调用
          <code>$ai-design-system</code>。先查询框架支持的组件，再组合页面。
        </p>
        <a
          :href="repo + '/tree/main/skills/ai-design-system'"
          target="_blank"
          rel="noopener"
          >获取最新设计 Skill ↗</a
        >
        <pre><code>npm run ui -- doctor
npm run ui -- find --framework {{ framework }} 日志</code></pre>
        <a
          :href="repo + '/blob/main/docs/integration.md'"
          target="_blank"
          rel="noopener"
          >完整接入文档 ↗</a
        >
      </aside>
    </div>
  </section>
</template>
<style>
.install-frameworks {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.install-frameworks button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-surface);
  color: var(--ui-muted);
  cursor: pointer;
}
.install-frameworks [aria-pressed="true"] {
  color: var(--ui-text);
  border-color: var(--ui-text);
}
.install-frameworks span {
  font-size: 12px;
}
.install-columns {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(240px, 1fr);
  gap: 40px;
}
.install-columns > div,
.install-columns aside {
  min-width: 0;
}
.install-columns section {
  margin-bottom: 30px;
}
.install-columns h2 {
  font-size: 16px;
  margin: 0 0 14px;
}
.install-columns p,
.install-columns dd {
  font-size: 13px;
  line-height: 1.85;
  color: var(--ui-muted);
}
.install-columns a {
  font-size: 13px;
}
.install-columns pre {
  padding: 18px;
  overflow: auto;
  background: var(--ui-surface);
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  font: 12px/1.9 var(--ui-font-mono);
}
.install-columns .install-command {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.install-columns dl {
  margin: 0 0 30px;
}
.install-columns dl > div {
  padding: 14px 0;
  border-bottom: 1px solid var(--ui-border);
}
.install-columns dt {
  font-size: 13px;
  font-weight: 600;
}
.install-columns dd {
  margin: 5px 0 0;
}
.install-section-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.install-section-heading h2 {
  margin: 0;
}
.install-section-heading .ui-button {
  font-size: 12px;
}
@media (max-width: 1000px) {
  .install-columns {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
}
</style>

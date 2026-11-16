<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import {
  UiTheme,
  UiLayout,
  UiSurface,
  UiPanel,
  UiButton,
  UiSelect,
  UiInput,
  UiTextarea,
  UiBadge,
  UiSwitch,
  UiProgress,
  UiDialog,
  UiCopyButton,
  UiAlert,
  UiSlider,
  UiSignalOrbit,
  UiCommandDock,
  compositionChoices,
  designRecipes,
  layoutGuides,
  parseDesignRecipe,
  type DesignRecipe,
  type Theme,
  type DesignStyle,
} from "@ai-design-system/ui";
import { palettes } from "./library";
import "./composer.css";
import LanguagePicker from "./LanguagePicker.vue";
import GlassExamples from "./GlassExamples.vue";
import ChoiceExamples from "./ChoiceExamples.vue";
const emit = defineEmits<{ apply: [theme: Theme]; studio: [] }>();
const fresh = () => parseDesignRecipe(JSON.stringify(designRecipes[0]));
const draft = ref<DesignRecipe>(fresh()),
  saved = ref<DesignRecipe[]>([]),
  selected = ref("preset:0"),
  message = ref(""),
  failed = ref(false),
  failureKind = ref(""),
  importText = ref(""),
  focused = ref(false);
const project = ref("春日设计工作室"),
  notes = ref("让每个参考都成为可以选择的细节。"),
  reminder = ref(true),
  dialog = ref(false),
  selectedRecord = ref("品牌更新");
const conversations = ref<
    Record<string, { draft: string; messages: string[] }>
  >(
    Object.fromEntries(
      ["品牌更新", "组件研究", "素材整理"].map((name) => [
        name,
        { draft: "", messages: [] },
      ]),
    ),
  ),
  conversation = ref<HTMLElement>();
const chatDraft = computed({
  get: () => conversations.value[selectedRecord.value].draft,
  set: (value: string) =>
    (conversations.value[selectedRecord.value].draft = value),
});
const localMessages = computed(
  () => conversations.value[selectedRecord.value].messages,
);
const board = ref([
    { id: "identity", title: "视觉语言", stage: 0 },
    { id: "motion", title: "输入与动效", stage: 1 },
    { id: "shell", title: "页面骨架", stage: 1 },
    { id: "type", title: "中文字体", stage: 2 },
  ]),
  boardStages = ["待开始", "制作中", "已审阅"],
  frame = ref("one"),
  node = ref("web");
const orbitNodes = [
  { id: "web", label: "网页", symbol: "W" },
  { id: "desktop", label: "桌面", symbol: "D" },
  { id: "native", label: "移动端", symbol: "N" },
];
const entryLayout = computed(() =>
  ["split", "focused"].includes(draft.value.layout),
);
async function addLocalMessage() {
  const text = chatDraft.value.trim();
  if (text) {
    localMessages.value.push(text);
    chatDraft.value = "";
    await nextTick();
    const scroller = conversation.value?.closest(".ui-layout-content");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }
}
const storageKey = "ai-design-system-compositions-v1";
const options = (key: keyof typeof compositionChoices) =>
  compositionChoices[key].map(([value, label]) => ({ value, label }));
const choices = computed(() => [
  ...designRecipes.map((r, i) => ({ value: "preset:" + i, label: r.name })),
  ...saved.value.map((r, i) => ({
    value: "saved:" + i,
    label: "我的 · " + r.name,
  })),
]);
const guide = computed(() => layoutGuides[draft.value.layout]);
const localStyle = computed({
  get: () => draft.value.override.design ?? "",
  set: (value: string) => {
    if (value) draft.value.override.design = value as DesignStyle;
    else delete draft.value.override.design;
  },
});
const fontScale = computed({
  get: () => String(draft.value.theme.scale),
  set: (value: string) => (draft.value.theme.scale = Number(value)),
});
const transparency = computed({
  get: () => [draft.value.theme.transparency ?? 72],
  set: (value: number[]) => (draft.value.theme.transparency = value[0] ?? 72),
});
const language = computed({
  get: () => draft.value.theme.design ?? "base",
  set: (value: DesignStyle) => {
    const recipe = designRecipes.find((r) => r.theme.design === value);
    if (recipe) {
      const { palette, mode, density, scale } = draft.value.theme;
      draft.value.theme = { ...recipe.theme, palette, mode, density, scale };
    }
  },
});
const json = computed(() => JSON.stringify(draft.value, null, 2));
const code = computed(
  () =>
    `<script setup>\nimport { UiTheme, UiLayout, UiPanel, UiSurface } from '@ai-design-system/ui'\nimport '@ai-design-system/ui/style.css'\nimport '@ai-design-system/ui/fonts.css'\nconst theme = ${JSON.stringify(draft.value.theme, null, 2)}\nconst override = ${JSON.stringify(draft.value.override, null, 2)}\n<\/script>\n<template>\n  <UiTheme v-bind="theme">\n    <UiLayout pattern="${draft.value.layout}">\n      <template #header>你的产品</template>\n      <template #navigation>项目导航</template>\n      <UiSurface><h2>工作区域</h2>你的内容</UiSurface>\n      <UiTheme v-bind="{...theme,...override}">\n        <UiPanel title="局部搭配">你的内容</UiPanel>\n      </UiTheme>\n      <template #aside>属性或详情</template>\n    </UiLayout>\n  </UiTheme>\n</template>`,
);
function choose() {
  const [kind, index] = selected.value.split(":");
  const source =
    kind === "saved"
      ? saved.value[Number(index)]
      : designRecipes[Number(index)];
  if (source) {
    draft.value = parseDesignRecipe(JSON.stringify(source));
    message.value = "";
    failed.value = false;
  }
}
function save() {
  try {
    const next = parseDesignRecipe(draft.value);
    const list = [...saved.value.filter((r) => r.name !== next.name), next];
    localStorage.setItem(
      storageKey,
      JSON.stringify({ active: next, saved: list }),
    );
    saved.value = list;
    draft.value = next;
    selected.value = "saved:" + (list.length - 1);
    failed.value = false;
    message.value = "方案已保存到本机，刷新后可继续使用。";
  } catch (e) {
    failed.value = true;
    failureKind.value = "save";
    message.value =
      "未能保存，当前搭配已保留。可重试或复制配置导出。" +
      (e instanceof Error ? e.message : "");
  }
}
function applyImport() {
  try {
    const next = parseDesignRecipe(importText.value);
    draft.value = next;
    selected.value = "";
    failed.value = false;
    message.value = "配置已载入；保存后可在本机继续使用。";
  } catch (e) {
    failed.value = true;
    failureKind.value = "import";
    message.value =
      "导入失败，当前搭配未改变。" + (e instanceof Error ? e.message : "");
  }
}
function reset() {
  draft.value = fresh();
  selected.value = "preset:0";
  failed.value = false;
  message.value = "当前搭配已重置，已保存的方案保留。";
}
function download() {
  const url = URL.createObjectURL(
    new Blob([json.value], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "ai-design-system.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
onMounted(() => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const data = JSON.parse(raw);
      const active = parseDesignRecipe(data.active);
      if (!Array.isArray(data.saved)) throw Error("保存列表损坏");
      const list = data.saved.map(parseDesignRecipe);
      draft.value = active;
      saved.value = list;
      selected.value =
        "saved:" + list.findIndex((r: DesignRecipe) => r.name === active.name);
    }
  } catch {
    failed.value = true;
    failureKind.value = "load";
    message.value = "本机方案无法读取。可以重新导入配置，当前预览仍可编辑。";
  }
});
</script>
<template>
  <section class="design-composer" aria-label="设计组合器">
    <div class="composer-actions">
      <UiSelect
        v-model="selected"
        label="整套方案"
        :options="[{ value: '', label: '选择一个起点' }, ...choices]"
        @update:model-value="choose"
      />
      <div class="ui-actions">
        <UiButton @click="focused = !focused">{{
          focused ? "显示搭配选项" : "展开预览"
        }}</UiButton><UiButton @click="emit('apply', { ...draft.theme })"
          >应用到全部组件</UiButton
        >
      </div>
    </div>
    <LanguagePicker v-model="language" @studio="emit('studio')" />
    <div class="composer-grid" :data-focused="focused || undefined">
      <div v-show="!focused" class="composer-controls">
        <div class="composer-control-heading">
          <strong>自由搭配</strong
          ><UiButton size="sm" variant="ghost" @click="reset">重置</UiButton>
        </div>
        <UiSelect
          v-model="draft.layout"
          label="页面骨架"
          :options="options('layout')"
        />
        <UiSelect
          v-model="draft.theme.palette"
          label="配色方案"
          :options="palettes"
        />
        <div class="composer-pair">
          <UiSelect
            v-model="draft.theme.material"
            label="表面材质"
            :options="options('material')"
          /><UiSelect
            v-model="draft.theme.decoration"
            label="封面装饰"
            :options="options('decoration')"
          />
        </div>
        <div
          v-if="
            draft.theme.material === 'liquid' ||
            draft.theme.material === 'glass'
          "
          class="composer-glass-control"
        >
          <UiSelect
            v-model="draft.theme.glassVariant"
            label="玻璃质感"
            :options="options('glassVariant')"
          /><UiSlider
            v-model="transparency"
            label="玻璃透明度"
            :min="0"
            :max="100"
            unit="%"
          /><span class="composer-note">0 不透明 / 100 全透明底</span>
        </div>
        <UiSelect
          v-model="draft.theme.font"
          label="正文字体"
          :options="options('font')"
        />
        <UiSelect
          v-model="draft.theme.headingFont"
          label="标题字体"
          :options="options('font')"
        />
        <UiSelect
          v-model="fontScale"
          label="预览字号"
          :options="[
            { value: '1', label: '100%' },
            { value: '1.1', label: '110%' },
            { value: '1.2', label: '120%' },
          ]"
        />
        <div class="composer-pair">
          <UiSelect
            v-model="draft.theme.buttonFeel"
            label="按钮手感"
            :options="options('buttonFeel')"
          /><UiSelect
            v-model="draft.theme.motion"
            label="动效节奏"
            :options="options('motion')"
          />
        </div>
        <div class="composer-pair">
          <UiSelect
            v-model="draft.theme.mode"
            label="预览明暗"
            :options="[
              { value: 'light', label: '浅色' },
              { value: 'dark', label: '深色' },
            ]"
          /><UiSelect
            v-model="draft.theme.density"
            label="预览密度"
            :options="[
              { value: 'comfortable', label: '舒适' },
              { value: 'compact', label: '紧凑' },
            ]"
          />
        </div>
        <UiSelect
          v-model="localStyle"
          label="局部卡片造型"
          :options="[{ value: '', label: '跟随整体' }, ...options('design')]"
        />
        <p class="composer-note">
          局部卡片可独立选造型，其他部分保留当前搭配。
        </p>
      </div>
      <div class="composer-preview-column">
        <div class="composer-scenario">
          <strong>{{
            options("layout").find((o) => o.value === draft.layout)?.label
          }}</strong><span>{{ guide.use }}</span
          ><a :href="guide.url" target="_blank" rel="noreferrer">布局依据 ↗</a>
        </div>
        <UiTheme
          v-bind="draft.theme"
          class="composer-preview"
          data-testid="composition-preview"
        >
          <GlassExamples v-if="draft.theme.material === 'liquid'" />
          <UiLayout :pattern="draft.layout" label="组合预览">
            <template #header
              ><div class="sample-wordmark">
                <span class="sample-logo">同</span><strong>春日工作室</strong>
              </div>
              <UiButton @click="dialog = true">编辑工作室</UiButton></template
            >
            <template #navigation
              ><div class="sample-navigation">
                <button
                  class="ui-nav-link"
                  v-for="(item, index) in ['品牌更新', '组件研究', '素材整理']"
                  :key="item"
                  :aria-current="selectedRecord === item ? 'page' : undefined"
                  @click="selectedRecord = item"
                >
                  <span
                    class="sample-nav-dot"
                    :data-ui-color="['blue', 'violet', 'teal'][index]"
                  />{{ item }}
                </button>
              </div></template
            >
            <div
              v-if="draft.layout === 'conversation'"
              ref="conversation"
              class="sample-conversation"
            >
              <p class="sample-note">本地对话示例 · 不连接 AI 或消息服务</p>
              <h2>{{ selectedRecord }}</h2>
              <div class="sample-chat-message">
                <strong>工作室</strong>
                <p>把参考整理成可以直接使用的布局，保留自己的色彩与字体。</p>
              </div>
              <div class="sample-chat-message" data-author="me">
                <strong>我</strong>
                <p>先比较页面骨架，再搭配视觉语言。</p>
              </div>
              <div
                v-for="(text, index) in localMessages"
                :key="index"
                class="sample-chat-message"
                data-author="me"
              >
                <strong>我 · 本地添加</strong>
                <p>{{ text }}</p>
              </div>
            </div>
            <template v-else-if="draft.layout === 'board'"
              ><section
                v-for="(stage, index) in boardStages"
                :key="stage"
                class="sample-board-column"
              >
                <header>
                  <strong>{{ stage }}</strong><span>{{
                    board.filter((item) => item.stage === index).length
                  }}</span>
                </header>
                <UiSurface
                  v-for="item in board.filter((item) => item.stage === index)"
                  :key="item.id"
                  ><span class="sample-kicker">DESIGN / {{ item.id }}</span>
                  <h3>{{ item.title }}</h3>
                  <p>本次演示的设计事项。</p>
                  <UiButton
                    size="sm"
                    @click="item.stage = (item.stage + 1) % 3"
                    >{{
                      index === 2
                        ? "退回待开始"
                        : "移至" + boardStages[index + 1]
                    }}</UiButton
                  ></UiSurface
                >
                <p
                  v-if="!board.some((item) => item.stage === index)"
                  class="sample-note"
                >
                  此列暂无事项
                </p>
              </section></template
            >
            <div
              v-else-if="draft.layout === 'command-center'"
              class="sample-command"
            >
              <span class="sample-kicker">SYSTEM / OVERVIEW</span>
              <h2>让关系，清晰可见。</h2>
              <UiSignalOrbit
                :nodes="orbitNodes"
                label="设计适配关系"
                center="DESIGN"
                :selected-id="node"
                @select="node = $event"
              />
              <p class="sample-note">
                当前选择：{{
                  orbitNodes.find((item) => item.id === node)?.label
                }}
                · 关系展示示例
              </p>
            </div>
            <div
              v-else-if="draft.layout === 'showcase'"
              class="sample-showcase"
            >
              <span class="sample-kicker">BUILT TO EXPRESS.</span>
              <h2>想象的界面。<br /><em>实现的细节。</em></h2>
              <p>
                从一套可靠的基础开始，把文字、形状、色彩和动态，组合成自己的表达。
              </p>
              <div class="ui-actions">
                <UiButton variant="primary" @click="dialog = true"
                  >创作你的工作室 ↗</UiButton
                >
              </div>
              <div class="sample-showcase-objects" aria-hidden="true">
                <div>同<span>ONE SYSTEM</span></div>
                <div>源<span>MANY EXPRESSIONS</span></div>
              </div>
            </div>
            <div
              v-else-if="draft.layout === 'studio'"
              class="sample-canvas-object"
              :data-frame="frame"
            >
              <span
                >FRAME /
                {{
                  frame === "one" ? "01" : frame === "two" ? "02" : "03"
                }}</span
              >
              <h2>{{ project }}</h2>
              <p>{{ notes }}</p>
            </div>
            <div v-else class="sample-content">
              <div v-if="entryLayout" class="sample-entry-heading">
                <span class="sample-kicker">开始使用 · 工作室</span>
                <h2>把创意放在一起。</h2>
                <p>为你的工作室设置名称与介绍。</p>
              </div>
              <UiSurface v-if="!entryLayout && draft.layout !== 'settings'"
                ><p class="sample-kicker">设计中的项目</p>
                <h2>{{ selectedRecord }}</h2>
                <p>把想法做成可以使用的界面。</p>
                <div class="ui-actions">
                  <UiButton variant="primary" @click="dialog = true"
                    >继续编辑</UiButton
                  ><UiBadge tone="info">进行中</UiBadge>
                </div></UiSurface
              >
              <div class="ui-section">
                <div class="ui-section-heading">
                  <h3>项目设置</h3>
                  <span>切换布局保留输入</span>
                </div>
                <UiInput v-model="project" label="工作室名称" /><UiTextarea
                  v-model="notes"
                  label="设计说明"
                  :rows="3"
                /><UiSwitch v-model="reminder" label="接收更新提醒" />
              </div>
              <div v-if="entryLayout" class="ui-actions">
                <UiButton variant="primary" @click="dialog = true"
                  >预览工作室设置</UiButton
                >
              </div>
              <UiTheme
                v-if="!entryLayout"
                v-bind="{ ...draft.theme, ...draft.override }"
                class="sample-local-override"
                ><UiPanel
                  title="独立搭配的卡片"
                  description="可替换造型，保留同一组内容。"
                  ><div class="sample-local-content">
                    <strong>让细节有出处。</strong>
                    <p>同样的按钮、文字和面板，可以有不同的表达。</p>
                    <UiButton @click="dialog = true">查看详情</UiButton>
                  </div></UiPanel
                ></UiTheme
              >
            </div>
            <template #aside
              ><div v-if="draft.layout === 'studio'" class="sample-aside">
                <h3>画布属性</h3>
                <UiInput v-model="project" label="画布标题" /><UiTextarea
                  v-model="notes"
                  label="画布说明"
                  :rows="3"
                />
                <p class="sample-note">
                  文字直接更新中央画布；底部选择不同构图。
                </p>
              </div>
              <div
                v-else-if="draft.layout === 'split'"
                class="sample-split-story"
              >
                <div class="sample-mini-window" aria-hidden="true">
                  <header><i />春日工作室</header>
                  <div>
                    <nav>项目<br />素材<br />设置</nav>
                    <section>
                      <strong>品牌更新</strong>
                      <p>让想法成为作品</p>
                      <span>设计协作</span>
                      <div class="sample-mini-progress" />
                    </section>
                  </div>
                </div>
                <span class="sample-kicker">一起，把想法变成作品</span>
                <h2>每一个好界面，<br />都有自己的表达。</h2>
                <p>同一套基础组件，适配不同的内容、场景和品牌。</p>
              </div>
              <p
                v-else-if="
                  draft.layout === 'focused' || draft.layout === 'conversation'
                "
                class="sample-note"
              >
                {{ project }} · 输入和局部消息只保留在本次演示中。
              </p>
              <div v-else class="sample-aside">
                <h3>当前项目</h3>
                <UiBadge color="violet">设计协作</UiBadge
                ><UiProgress label="示例进度" :value="72" />
                <div class="sample-reading">
                  <strong>本周安排</strong>
                  <p>确认内容层级</p>
                  <p>制作页面原型</p>
                  <p>验证键盘与窄屏</p>
                </div>
                <p class="sample-note">
                  中文 · Typography<br />Aa Bb 0123456789<br />¥ 1,280.50
                </p>
              </div></template
            >
            <template #footer
              ><div
                v-if="draft.layout === 'studio'"
                class="sample-studio-track"
              >
                <span class="sample-kicker">COMPOSITIONS</span
                ><UiCommandDock
                  v-model="frame"
                  label="画布构图"
                  :items="[
                    { id: 'one', label: '01 · 居中', symbol: '▣' },
                    { id: 'two', label: '02 · 左对齐', symbol: '◧' },
                    { id: 'three', label: '03 · 海报', symbol: '▤' },
                  ]"
                />
              </div>
              <form
                v-else-if="draft.layout === 'conversation'"
                class="sample-chat-composer"
                @submit.prevent="addLocalMessage"
              >
                <UiTextarea
                  v-model="chatDraft"
                  label="对话草稿"
                  :rows="2"
                /><UiButton
                  type="submit"
                  variant="primary"
                  :disabled="!chatDraft.trim()"
                  >添加到本地对话</UiButton
                >
              </form>
              <span v-else class="sample-note"
                >{{ project }} · {{ selectedRecord }}</span
              ></template
            >
          </UiLayout>
          <ChoiceExamples
            v-if="draft.theme.design === 'astryx'"
            class="composer-choice-example"
          />
          <UiDialog
            v-model:open="dialog"
            title="编辑工作室"
            description="切换搭配会保留本次输入；此处是组件演示。"
            ><UiInput v-model="project" label="弹层工作室名称" /><template
              #footer
              ><UiButton @click="dialog = false">完成编辑</UiButton></template
            ></UiDialog
          >
        </UiTheme>
      </div>
    </div>
    <div class="composer-save">
      <UiInput v-model="draft.name" label="方案名称" /><UiButton
        variant="primary"
        @click="save"
        >保存搭配</UiButton
      ><UiButton @click="download">导出 JSON</UiButton
      ><UiCopyButton :text="json" label="复制配置" />
    </div>
    <UiAlert
      v-if="message"
      :title="failed ? '需要处理' : '搭配状态'"
      :description="message"
      :tone="failed ? 'warning' : 'success'"
      live
      ><template v-if="failed && failureKind === 'save'" #action
        ><UiButton @click="save">重试保存</UiButton></template
      ></UiAlert
    >
    <details class="composer-code">
      <summary>导入配置与接入代码</summary>
      <div class="composer-code-grid">
        <div>
          <UiTextarea
            v-model="importText"
            label="导入方案 JSON"
            :rows="7"
          /><UiButton @click="applyImport">应用导入配置</UiButton>
        </div>
        <div>
          <pre><code>{{code}}</code></pre>
          <UiCopyButton :text="code" label="复制接入代码" />
        </div>
      </div>
    </details>
    <p class="composer-note">
      视觉语言可独立搭配字体、布局与配色。玻璃包含边缘折射与指针高光；不支持折射的浏览器使用透明磨砂表面。参考细节和适用范围见设计契约。
    </p>
  </section>
</template>
<style scoped>
.composer-choice-example {
  margin-top: 24px;
  padding: 24px;
  border-radius: var(--ui-panel-radius);
  background: var(--ui-surface);
}
</style>

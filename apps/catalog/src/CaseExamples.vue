<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { ArrowLeft, ArrowUpRight, Search, X } from "@lucide/vue";
import {
  UiDesignCase,
  UiViewportFrame,
  UiButton,
  UiCopyButton,
  designCases,
} from "@ai-design-system/ui";

const categories = [
  "全部",
  ...new Set(designCases.map((item) => item.category)),
];
const filter = ref("全部"),
  query = ref(""),
  selected = ref("");
const panel = ref<"preview" | "use">("preview");
const gallery = ref<HTMLElement>(),
  detail = ref<HTMLElement>();
let galleryScroll = 0;
const results = computed(() => {
  const term = query.value.trim().toLocaleLowerCase();
  return designCases.filter(
    (item) =>
      (filter.value === "全部" || item.category === filter.value) &&
      [
        item.name,
        item.brand,
        item.category,
        item.description,
        item.action,
        ...item.signature,
        ...item.components,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(term),
  );
});
const current = computed(() =>
  designCases.find((item) => item.id === selected.value),
);
const filtered = computed(
  () => filter.value !== "全部" || !!query.value.trim(),
);
function caseHref(id = "") {
  const params = new URLSearchParams();
  if (filter.value !== "全部") params.set("type", filter.value);
  if (query.value) params.set("q", query.value);
  return (
    "#cases" +
    (id ? "/" + id : "") +
    (params.size ? "?" + params.toString() : "")
  );
}
const src = computed(() => {
  const url = new URL(location.pathname, location.origin);
  url.searchParams.set("case", selected.value);
  return url.href;
});
const shareUrl = computed(
  () => new URL(caseHref(selected.value), location.href).href,
);
const code = computed(
  () =>
    `<script setup lang="ts">\nimport { UiDesignCase } from '@ai-design-system/ui'\nimport '@ai-design-system/ui/style.css'\n<` +
    `/script>\n\n<template>\n  <UiDesignCase case-id="${selected.value}" />\n</template>`,
);
const brief = computed(() =>
  current.value
    ? [
        `使用 $ai-design-system，参考「${current.value.name}」：${shareUrl.value}`,
        `设计关系：${current.value.signature.join("；")}。交互参考：${current.value.action}。`,
        `先确认我的项目框架，再查询已有组件：${current.value.components.join("、")}。`,
        "此完整案例目前是 Vue 实现。React 项目查询实际支持的组件组合，不导入 Vue API。",
        "保留项目的业务入口、真实数据与权限；演示数据和计时模拟不能替代真实请求。",
        "按项目内容重新组合，检查窄屏、长译文、键盘、减少动态，以及失败后的恢复路径。",
      ].join("\n")
    : "",
);
function rememberPosition() {
  galleryScroll = window.scrollY;
}
async function readRoute() {
  const previous = selected.value;
  const [path, search = ""] = location.hash.slice(1).split("?");
  if (path.split("/")[0] !== "cases") return;
  const params = new URLSearchParams(search);
  selected.value = path.split("/")[1] || "";
  filter.value = categories.includes(params.get("type") || "")
    ? params.get("type")!
    : "全部";
  query.value = params.get("q") || "";
  if (selected.value === previous) return;
  panel.value = "preview";
  await nextTick();
  if (selected.value) {
    detail.value?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  } else if (previous) {
    gallery.value
      ?.querySelector<HTMLElement>(`[data-open="${previous}"]`)
      ?.focus({ preventScroll: true });
    window.scrollTo({ top: galleryScroll });
  }
}
function reset() {
  query.value = "";
  filter.value = "全部";
}
watch([filter, query], () =>
  history.replaceState(history.state, "", caseHref(selected.value)),
);
onMounted(() => {
  readRoute();
  window.addEventListener("hashchange", readRoute);
});
onUnmounted(() => window.removeEventListener("hashchange", readRoute));
</script>

<template>
  <section
    v-if="selected"
    ref="detail"
    tabindex="-1"
    class="case-library-detail"
  >
    <a class="case-back" :href="caseHref()"
      ><ArrowLeft :size="16" /> 返回案例库</a
    >
    <template v-if="current">
      <div class="case-detail-heading">
        <div>
          <p class="case-meta">
            {{ current.brand }} 设计启发 · {{ current.category }}
          </p>
          <h1>{{ current.name }}</h1>
          <p>{{ current.description }}</p>
        </div>
        <a class="ui-button" :href="src" target="_blank" rel="noopener"
          >独立打开 <ArrowUpRight :size="16"
        /></a>
      </div>
      <div class="case-detail-toolbar">
        <div class="case-view-switch" role="group" aria-label="案例视图">
          <button
            :aria-pressed="panel === 'preview'"
            @click="panel = 'preview'"
          >
            交互预览
          </button>
          <button :aria-pressed="panel === 'use'" @click="panel = 'use'">
            设计与接入
          </button>
        </div>
        <div class="case-quick-actions">
          <UiCopyButton :text="brief" label="复制 AI 指令" /><UiCopyButton
            :text="shareUrl"
            label="复制案例链接"
          />
        </div>
      </div>
      <div v-show="panel === 'preview'">
        <p class="case-try"><span>试一试</span>{{ current.action }}</p>
        <UiViewportFrame :src="src" :title="current.name" />
      </div>
      <div v-show="panel === 'use'" class="case-library-notes">
        <div>
          <h2>设计要点</h2>
          <ul>
            <li v-for="item in current.signature" :key="item">{{ item }}</li>
          </ul>
          <h3>使用的组件</h3>
          <div class="case-component-links">
            <a
              v-for="name in current.components"
              :key="name"
              :href="
                'https://github.com/margetrp-hub/AI-Design-System/blob/main/packages/ui/src/' +
                name +
                '.vue'
              "
              target="_blank"
              rel="noopener"
              >{{ name }} <ArrowUpRight :size="12"
            /></a>
          </div>
          <a :href="current.source" target="_blank" rel="noopener"
            >查看设计参考 ↗</a
          >
          <p class="case-library-source">
            独立设计演绎，使用虚构内容；非品牌官方组件。完整案例目前仅提供 Vue
            实现。
          </p>
        </div>
        <div>
          <div class="case-code-heading">
            <h2>Vue 接入代码</h2>
            <UiCopyButton :text="code" label="复制 Vue 代码" />
          </div>
          <pre><code>{{ code }}</code></pre>
          <a href="#install">安装组件包 →</a>
          <h3>让 AI 继续搭建</h3>
          <p>按当前案例生成设计要求，交给项目中的 AI 使用。</p>
          <pre class="case-ai-brief">{{ brief }}</pre>
          <UiCopyButton :text="brief" label="复制 AI 指令" />
        </div>
      </div>
    </template>
    <div v-else class="case-library-empty">
      <h1>没有找到这个案例</h1>
      <p>可以返回案例库重新选择。</p>
    </div>
  </section>
  <section v-else ref="gallery" class="case-library-gallery">
    <header class="case-gallery-heading">
      <div>
        <h1>
          案例库 <span>{{ designCases.length }}</span>
        </h1>
        <p>按场景挑选，体验交互，再带进你的项目。</p>
      </div>
      <a href="#compose">自由搭配视觉语言 <ArrowUpRight :size="16" /></a>
    </header>
    <div class="case-library-toolbar">
      <label class="case-search"
        ><Search :size="17" aria-hidden="true" /><span class="ui-sr-only"
          >搜索案例</span
        ><input
          v-model="query"
          type="search"
          placeholder="搜索场景、品牌、交互或组件"
          aria-label="搜索案例"
      /></label>
      <span class="case-result-count" role="status">{{
        filtered
          ? `找到 ${results.length} 个案例`
          : `${designCases.length} 个可交互页面`
      }}</span>
      <button v-if="filtered" class="case-clear" @click="reset">
        <X :size="14" />清除筛选
      </button>
      <div class="case-categories" role="group" aria-label="案例类型">
        <button
          v-for="category in categories"
          :key="category"
          :aria-pressed="filter === category"
          @click="filter = category"
        >
          {{ category
          }}<span>{{
            category === "全部"
              ? designCases.length
              : designCases.filter((item) => item.category === category).length
          }}</span>
        </button>
      </div>
    </div>
    <div class="case-library-grid">
      <article v-for="item in results" :key="item.id">
        <div class="case-library-thumbnail" inert aria-hidden="true">
          <UiDesignCase :case-id="item.id" preview />
        </div>
        <div class="case-library-card-body">
          <div class="case-card-meta">
            <span>{{ item.brand }} 设计启发</span
            ><span>{{ item.category }}</span>
          </div>
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <div class="case-card-bottom">
            <span>{{ item.action }}</span
            ><a
              :href="caseHref(item.id)"
              :data-open="item.id"
              :aria-label="'体验案例 · ' + item.name"
              @click="rememberPosition"
              >体验案例 <ArrowUpRight :size="16"
            /></a>
          </div>
        </div>
      </article>
    </div>
    <div v-if="!results.length" class="case-library-empty">
      <h2>没有匹配的案例</h2>
      <p>换个关键词，或清除当前分类和搜索条件。</p>
      <UiButton @click="reset">显示全部案例</UiButton>
    </div>
  </section>
</template>

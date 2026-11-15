<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import {
  UiDesignCase,
  UiViewportFrame,
  UiButton,
  UiCopyButton,
  designCases,
  type DesignCaseId,
} from "@ai-design-system/ui";
const filter = ref("全部"),
  query = ref(""),
  selected = ref<DesignCaseId>();
const gallery = ref<HTMLElement>(),
  detail = ref<HTMLElement>();
const categories = [
  "全部",
  ...new Set(designCases.map((item) => item.category)),
];
const results = computed(() =>
  designCases.filter(
    (item) =>
      (filter.value === "全部" || item.category === filter.value) &&
      (item.name + item.brand + item.description)
        .toLowerCase()
        .includes(query.value.toLowerCase()),
  ),
);
const current = computed(() =>
  designCases.find((item) => item.id === selected.value),
);
const src = computed(() => {
  const url = new URL(location.href);
  url.search = "?case=" + selected.value;
  url.hash = "";
  return url.href;
});
const code = computed(
  () =>
    `<script setup lang="ts">\nimport { UiDesignCase } from '@ai-design-system/ui'\nimport '@ai-design-system/ui/style.css'\n<` +
    `/script>\n\n<template>\n  <UiDesignCase case-id="${selected.value}" />\n</template>`,
);
async function open(id: DesignCaseId) {
  selected.value = id;
  await nextTick();
  detail.value?.focus();
}
async function back() {
  const previous = selected.value;
  selected.value = undefined;
  await nextTick();
  gallery.value
    ?.querySelector<HTMLButtonElement>('[data-open="' + previous + '"]')
    ?.focus();
}
</script>
<template>
  <section
    v-if="current"
    ref="detail"
    tabindex="-1"
    class="case-library-detail"
  >
    <div class="case-library-detail-top">
      <UiButton @click="back">← 全部案例</UiButton>
      <div>
        <h2>{{ current.name }}</h2>
        <p>{{ current.brand }} 设计启发 · {{ current.action }}</p>
      </div>
      <a :href="src" target="_blank" rel="noopener">独立打开 ↗</a>
    </div>
    <UiViewportFrame :src="src" :title="current.name" />
    <div class="case-library-notes">
      <div>
        <h3>这个案例的设计语言</h3>
        <ul>
          <li v-for="item in current.signature" :key="item">{{ item }}</li>
        </ul>
        <p>{{ current.description }}</p>
        <a :href="current.source" target="_blank" rel="noopener"
          >阅读参考来源 ↗</a
        >
        <p class="case-library-source">
          独立实现与虚构内容，不是品牌官方组件。公开案例不分发参考视频或品牌素材。
        </p>
      </div>
      <div>
        <h3>直接带进项目</h3>
        <p>{{ current.components.join(" · ") }}</p>
        <pre><code>{{code}}</code></pre>
        <UiCopyButton :text="code" label="复制接入代码" />
      </div>
    </div>
  </section>
  <section v-else ref="gallery" class="case-library-gallery">
    <div class="case-library-toolbar">
      <div role="group" aria-label="案例类型">
        <button
          v-for="category in categories"
          :key="category"
          :aria-pressed="filter === category"
          @click="filter = category"
        >
          {{ category }}
        </button>
      </div>
      <label
        ><span class="ui-sr-only">搜索案例</span
        ><input
          v-model="query"
          placeholder="搜索设计、品牌或场景"
          aria-label="搜索案例"
      /></label>
    </div>
    <div class="case-library-grid">
      <article v-for="item in results" :key="item.id">
        <div class="case-library-thumbnail" inert aria-hidden="true">
          <UiDesignCase :case-id="item.id" preview />
        </div>
        <div class="case-library-card-body">
          <span
            >{{ item.brand }}<small>{{ item.category }}</small></span
          >
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <button :data-open="item.id" @click="open(item.id)">
            体验案例<span>↗</span
            ><span class="ui-sr-only">{{ item.name }}</span>
          </button>
        </div>
      </article>
    </div>
    <div v-if="!results.length" class="case-library-empty">
      <p>没有匹配案例。</p>
      <UiButton
        @click="
          query = '';
          filter = '全部';
        "
        >清除筛选</UiButton
      >
    </div>
  </section>
</template>

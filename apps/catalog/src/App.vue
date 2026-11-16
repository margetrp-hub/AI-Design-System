<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import {
  UiTheme,
  UiButton,
  UiSelect,
  UiBadge,
  UiPopover,
  UiSwitch,
  UiTable,
  UiBreadcrumbs,
  UiTooltip,
  UiSlider,
  UiDrawer,
  type Skin,
  type Palette,
  type Mode,
  type Density,
  type Theme,
  type DesignStyle,
  compositionChoices,
  designRecipes,
  parseDesignRecipe,
} from "@ai-design-system/ui";
import {
  ArrowUpRight,
  Moon,
  Sun,
  Layers,
  Component,
  TextCursorInput,
  ListFilter,
  PanelRight,
  Bell,
  Table2,
  Code2,
  Waves,
  SlidersHorizontal,
  Menu,
} from "@lucide/vue";
import ComponentExamples from "./ComponentExamples.vue";
import ColorExamples from "./ColorExamples.vue";
import MotionExamples from "./MotionExamples.vue";
import DesignComposer from "./DesignComposer.vue";
import AssetExamples from "./AssetExamples.vue";
import AiExamples from "./AiExamples.vue";
import TaskLogExamples from "./TaskLogExamples.vue";
import "./cases.css";
const CaseExamples = defineAsyncComponent(() => import("./CaseExamples.vue"));
import "./assets.css";
const StudioExamples = defineAsyncComponent(
  () => import("./StudioExamples.vue"),
);
import LanguagePicker from "./LanguagePicker.vue";
import DemoCard from "./DemoCard.vue";
import CatalogNavigation from "./CatalogNavigation.vue";
import InstallGuide from "./InstallGuide.vue";
import { skins } from "./data";
import { components, palettes, groups } from "./library";
const initialView = () => {
  const path = location.hash.slice(1).split(/[/?]/)[0];
  return groups.some((g) => g.id === path) ? path : "overview";
};
const navigationOpen = ref(false);
function focusMain() {
  document.getElementById("main-content")?.focus();
}
const view = ref(initialView()),
  skin = ref<Skin>("console"),
  palette = ref<Palette>("default"),
  mode = ref<Mode>("light"),
  density = ref<Density>("comfortable"),
  scale = ref("1"),
  enabled = ref(true);
const appearance = ref<Partial<Theme>>({
  design: "base",
  font: "geist",
  headingFont: "geist",
  glassVariant: "regular",
});
const visualLanguage = computed({
  get: () => appearance.value.design ?? "base",
  set: (value: DesignStyle) => {
    const recipe = designRecipes.find((r) => r.theme.design === value);
    if (recipe)
      applyAppearance({
        ...recipe.theme,
        palette: palette.value,
        mode: mode.value,
        density: density.value,
        scale: Number(scale.value),
      });
  },
});
const glassTransparency = computed({
  get: () => [appearance.value.transparency ?? 72],
  set: (value: number[]) => (appearance.value.transparency = value[0] ?? 72),
});
const readHash = () => {
  view.value = initialView();
};
onMounted(() => window.addEventListener("hashchange", readHash));
onUnmounted(() => window.removeEventListener("hashchange", readHash));
function applyAppearance(next: Theme) {
  skin.value = next.skin;
  palette.value = next.palette ?? "default";
  mode.value = next.mode;
  density.value = next.density;
  scale.value = String(next.scale);
  const {
    skin: _,
    palette: __,
    mode: ___,
    density: ____,
    scale: _____,
    ...visual
  } = next;
  appearance.value = visual;
}
const icons = {
  cases: Layers,
  overview: Component,
  forms: TextCursorInput,
  navigation: ListFilter,
  overlays: PanelRight,
  feedback: Bell,
  data: Table2,
  themes: Layers,
  install: Code2,
  motion: Waves,
  compose: SlidersHorizontal,
  assets: Waves,
  studio: Layers,
  ai: Component,
  logs: Code2,
};
const groupColors: Record<string, string> = {
  forms: "blue",
  navigation: "violet",
  overlays: "teal",
  feedback: "amber",
  data: "rose",
  themes: "lime",
};
const currentGroup = computed(() => groups.find((g) => g.id === view.value)!);
const currentComponents = computed(() =>
  components.filter((c) => c.group === view.value),
);
const themeCode = computed(
  () =>
    `const theme = ${JSON.stringify({ ...appearance.value, skin: skin.value, palette: palette.value, mode: mode.value, density: density.value, scale: Number(scale.value) }, null, 2)}\n\n<UiTheme v-bind="theme">\n  <UiButton variant="primary">保存设置</UiButton>\n</UiTheme>`,
);
onMounted(() => {
  try {
    const p = JSON.parse(
      localStorage.getItem("ai-design-system-preferences") || "{}",
    );
    if (skins.some((s) => s.id === p.skin)) skin.value = p.skin;
    if (palettes.some((s) => s.value === p.palette)) palette.value = p.palette;
    if (["light", "dark"].includes(p.mode)) mode.value = p.mode;
    if (["comfortable", "compact"].includes(p.density))
      density.value = p.density;
    if (["1", "1.1", "1.2"].includes(p.scale)) scale.value = p.scale;
    if (p.appearance)
      appearance.value = parseDesignRecipe({
        version: 1,
        name: "预览",
        layout: "sidebar",
        theme: p.appearance,
        override: {},
      }).theme;
  } catch {}
});
watch(
  [skin, palette, mode, density, scale, appearance],
  () => {
    try {
      localStorage.setItem(
        "ai-design-system-preferences",
        JSON.stringify({
          skin: skin.value,
          palette: palette.value,
          mode: mode.value,
          density: density.value,
          scale: scale.value,
          appearance: appearance.value,
        }),
      );
    } catch {}
  },
  { deep: true },
);
watch(view, () => {
  if (initialView() !== view.value) location.hash = view.value;
  navigationOpen.value = false;
  window.scrollTo({ top: 0 });
});
</script>
<template>
  <UiTheme skin="console" :mode="mode" class="studio-shell">
    <a href="#main-content" class="catalog-skip" @click.prevent="focusMain"
      >跳至内容</a
    >
    <aside class="studio-sidebar">
      <a class="studio-brand" href="#" @click.prevent="view = 'overview'"
        ><span class="brand-mark">ai</span
        ><span
          ><strong>AI Design System</strong
          ><small>YOUR DESIGN WORKSHOP</small></span
        ></a
      >
      <button
        class="catalog-menu-toggle"
        aria-label="打开导航"
        :aria-expanded="navigationOpen"
        @click="navigationOpen = true"
      >
        <Menu :size="17" />导航
      </button>
      <CatalogNavigation :active="view" :icons="icons" :colors="groupColors" />
      <div class="sidebar-note">
        <span class="sidebar-section">同一个起点</span>
        <p>组件共用，<br />表达自由。</p>
        <div class="sidebar-rule" />
        <small>Vue 3 / 自有 CSS / Reka UI<br />独立包 · 可组合 · 可换肤</small>
      </div>
      <div class="sidebar-bottom">
        <span class="local-indicator" /><span
          >开源设计工坊<small>v0.5.0</small></span
        ><Code2 :size="18" />
      </div>
    </aside>
    <UiDrawer
      v-model:open="navigationOpen"
      title="浏览设计库"
      description="组件、案例与接入指南"
      side="right"
    >
      <CatalogNavigation
        class="catalog-mobile-nav"
        :active="view"
        :icons="icons"
        :colors="groupColors"
        @navigate="navigationOpen = false"
      />
    </UiDrawer>
    <div class="studio-body">
      <header class="studio-topbar">
        <UiBreadcrumbs
          :items="[
            { label: 'AI Design System' },
            { label: currentGroup.label },
          ]"
        />
        <div class="ui-actions">
          <span class="topbar-version">Vue / React · 0.5</span
          ><UiTooltip text="独立切换深浅色"
            ><UiButton
              variant="ghost"
              :aria-label="mode === 'light' ? '切换深色' : '切换浅色'"
              @click="mode = mode === 'light' ? 'dark' : 'light'"
              ><Moon v-if="mode === 'light'" /><Sun
                v-else /></UiButton></UiTooltip
          ><UiButton @click="view = 'install'"
            >接入项目 <ArrowUpRight
          /></UiButton>
        </div>
      </header>
      <main id="main-content" tabindex="-1">
        <div v-if="view !== 'cases'" class="page-heading">
          <div>
            <span class="eyebrow"
              >AI DESIGN SYSTEM / {{ view.toUpperCase() }}</span
            >
            <h1>{{ currentGroup.title }}</h1>
            <p>{{ currentGroup.description }}</p>
          </div>
          <span v-if="view === 'overview'" class="edition-mark"
            >67 VUE · 18 REACT</span
          >
        </div>
        <div
          v-if="!['compose', 'studio', 'cases', 'install'].includes(view)"
          class="theme-toolbar"
          aria-label="演示主题设置"
        >
          <LanguagePicker v-model="visualLanguage" @studio="view = 'studio'" />
          <UiSelect
            v-model="palette"
            label="配色"
            :options="palettes"
          /><UiSelect
            v-model="density"
            label="密度"
            :options="[
              { value: 'comfortable', label: '舒适' },
              { value: 'compact', label: '紧凑' },
            ]"
          /><UiSelect
            v-model="scale"
            label="字号"
            :options="[
              { value: '1', label: '100%' },
              { value: '1.1', label: '110%' },
              { value: '1.2', label: '120%' },
            ]"
          /><UiSelect
            v-model="appearance.font"
            label="正文"
            :options="
              compositionChoices.font.map(([value, label]) => ({
                value,
                label,
              }))
            "
          /><UiSelect
            v-model="appearance.headingFont"
            label="标题"
            :options="
              compositionChoices.font.map(([value, label]) => ({
                value,
                label,
              }))
            "
          /><UiSelect
            v-if="
              appearance.material === 'liquid' ||
              appearance.material === 'glass'
            "
            v-model="appearance.glassVariant"
            label="玻璃质感"
            :options="
              compositionChoices.glassVariant.map(([value, label]) => ({
                value,
                label,
              }))
            "
          /><UiSlider
            v-if="
              appearance.material === 'liquid' ||
              appearance.material === 'glass'
            "
            v-model="glassTransparency"
            label="玻璃透明度"
            unit="%"
          /><span class="theme-toolbar-note"
            ><span class="live-dot" /> 正在使用组件包</span
          >
        </div>
        <UiTheme
          v-bind="appearance"
          :skin="skin"
          :palette="palette"
          :mode="mode"
          :density="density"
          :scale="Number(scale)"
          class="component-stage"
          :class="{ 'ui-scene': view !== 'compose' }"
        >
          <CaseExamples v-if="view === 'cases'" />
          <DesignComposer
            v-else-if="view === 'compose'"
            @apply="applyAppearance"
            @studio="view = 'studio'"
          />
          <StudioExamples v-else-if="view === 'studio'" />
          <AssetExamples v-else-if="view === 'assets'" />
          <AiExamples v-else-if="view === 'ai'" />
          <TaskLogExamples v-else-if="view === 'logs'" />
          <template v-else-if="view === 'themes'"
            ><div class="ui-actions" style="margin-bottom: 24px">
              <UiButton variant="primary" @click="view = 'compose'"
                >选择视觉语言、字体与透明度</UiButton
              >
            </div>
            <ColorExamples />
            <div class="section-heading">
              <div>
                <h2>以前的配色，现在可以直接用</h2>
                <p>配色与组件结构分开，所有控件与浮层共同切换。</p>
              </div>
            </div>
            <div class="palette-grid">
              <UiTheme
                v-for="item in palettes.filter((p) => p.value !== 'default')"
                :key="item.value"
                :skin="skin"
                :palette="item.value as Palette"
                :mode="mode"
                class="palette-sample"
                ><div class="palette-dots"><i /><i /><i /></div>
                <strong>{{ item.label }}</strong>
                <div class="ui-actions">
                  <UiBadge tone="accent">选中态</UiBadge
                  ><UiButton
                    size="sm"
                    variant="primary"
                    :aria-pressed="palette === item.value"
                    @click="palette = item.value as Palette"
                    >{{ palette === item.value ? "使用中" : "应用" }}</UiButton
                  >
                </div></UiTheme
              >
            </div>
            <DemoCard
              title="同一套接口，随项目组合"
              names="UiTheme"
              :code="themeCode"
              ><div class="ui-actions">
                <UiButton variant="primary">主操作</UiButton
                ><UiButton>次操作</UiButton
                ><UiBadge tone="success">状态独立</UiBadge
                ><UiPopover label="主题浮层"
                  ><template #trigger
                    ><UiButton>查看浮层主题</UiButton></template
                  >
                  <div class="form-stack">
                    <strong>主题跟随到浮层</strong
                    ><UiSwitch v-model="enabled" label="活动提醒" /></div
                ></UiPopover></div></DemoCard
          ></template>
          <InstallGuide v-else-if="view === 'install'" />
          <MotionExamples v-else-if="view === 'motion'" />
          <ComponentExamples v-else :view="view" @navigate="view = $event" />
        </UiTheme>
        <div v-if="view === 'overview'" class="category-grid">
          <button
            v-for="group in groups.filter((g) => g.count)"
            :key="group.id"
            class="category-card"
            @click="view = group.id"
          >
            <span
              class="ui-color-icon"
              :data-ui-color="groupColors[group.id]"
              aria-hidden="true"
              ><component :is="icons[group.id as keyof typeof icons]"
            /></span>
            <div>
              <strong>{{ group.label }}</strong>
              <p>{{ group.short }}</p>
            </div>
            <span>{{ group.count }} <ArrowUpRight :size="14" /></span>
          </button>
        </div>
        <div v-if="currentComponents.length" class="api-section">
          <div class="section-heading">
            <div>
              <h2>本组导出与接口</h2>
              <p>演示使用的就是这些组件。</p>
            </div>
          </div>
          <UiTable caption="组件接口"
            ><template #head
              ><tr>
                <th scope="col">导出</th>
                <th scope="col">主要接口</th>
                <th scope="col">可以复用的行为</th>
              </tr></template
            >
            <tr v-for="item in currentComponents" :key="item.name">
              <td>
                <code>{{ item.name }}</code>
              </td>
              <td>{{ item.api }}</td>
              <td>{{ item.detail }}</td>
            </tr></UiTable
          >
        </div>
        <footer class="studio-footer">
          <span>AI Design System / BUILT TO BE USED</span
          ><span>一套代码，多种表达。</span>
        </footer>
      </main>
    </div>
  </UiTheme>
</template>

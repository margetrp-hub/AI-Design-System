<script setup lang="ts">
import { computed, ref } from "vue";
import {
  colorRecipes,
  type ColorRecipe,
  type CategoryColor,
} from "@ai-design-system/tokens";
import {
  UiPanel,
  UiBadge,
  UiAvatar,
  UiProgress,
  UiSelect,
  UiSwitch,
  UiButton,
  UiAlert,
  UiPopover,
} from "@ai-design-system/ui";
import {
  FolderOpen,
  LayoutTemplate,
  Palette,
  BookOpen,
  ArrowUpRight,
  Check,
} from "@lucide/vue";
import DemoCard from "./DemoCard.vue";
const recipe = ref<ColorRecipe>("workbench");
const colorful = ref(true);
const colors = computed(() => colorRecipes[recipe.value].colors);
const color = (index: number) =>
  colorful.value ? colors.value[index] : undefined;
const names: Record<CategoryColor, string> = {
  blue: "湖蓝",
  violet: "鸢尾紫",
  teal: "青绿",
  amber: "琥珀",
  rose: "玫瑰",
  lime: "柠绿",
};
const tasks = [
  {
    id: "forms",
    name: "表单与流程",
    description: "输入、校验与保存",
    icon: LayoutTemplate,
    progress: 72,
    owner: "林晓",
  },
  {
    id: "styles",
    name: "主题与色彩",
    description: "界面表达与视觉层次",
    icon: Palette,
    progress: 48,
    owner: "陈雨",
  },
  {
    id: "docs",
    name: "接入指南",
    description: "示例、约定与复用",
    icon: BookOpen,
    progress: 90,
    owner: "周宁",
  },
];
const code = computed(
  () =>
    `import { colorRecipes } from '@ai-design-system/tokens'\nconst projectColor = colorRecipes.${recipe.value}.colors[0]\n\n<UiPanel :color="projectColor" title="项目">\n  <UiAvatar name="林晓" :color="projectColor" />\n  <UiBadge :color="projectColor">项目分类</UiBadge>\n  <UiProgress :color="projectColor" label="进度" :value="72" />\n  <UiBadge tone="success">已保存</UiBadge>\n</UiPanel>`,
);
</script>
<template>
  <section class="color-examples" aria-label="组件配色实验室">
    <div class="section-heading">
      <div>
        <h2>让颜色有分工，让界面有生气</h2>
        <p>品牌引导操作，分类建立联系，状态表达结果。</p>
      </div>
    </div>
    <div class="color-lab-controls">
      <UiSelect
        v-model="recipe"
        label="组件配色组合"
        :options="
          Object.entries(colorRecipes).map(([value, item]) => ({
            value,
            label: item.label,
          }))
        "
      />
      <UiSwitch v-model="colorful" label="启用组件配色" />
    </div>
    <DemoCard
      title="同一组组件，协调地使用多种颜色"
      names="UiPanel · UiBadge · UiAvatar · UiProgress"
      :code="code"
    >
      <div class="color-project-heading">
        <div class="profile-row">
          <span
            class="ui-color-icon"
            :data-ui-color="color(0)"
            aria-hidden="true"
            ><FolderOpen
          /></span>
          <div>
            <strong>春日工作空间</strong>
            <p class="muted small">三个项目，一起推进 · 演示数据</p>
          </div>
        </div>
        <UiPopover label="组件配色说明"
          ><template #trigger
            ><UiButton>查看配色 <ArrowUpRight /></UiButton
          ></template>
          <div class="form-stack">
            <strong>同一个项目，始终同一种分类色</strong>
            <div class="ui-actions">
              <UiBadge v-for="hue in colors" :key="hue" :color="hue">{{
                names[hue]
              }}</UiBadge>
            </div>
            <p>状态保留独立含义：<UiBadge tone="success">已保存</UiBadge></p>
          </div></UiPopover
        >
      </div>
      <div class="color-project-grid">
        <UiPanel
          v-for="(task, index) in tasks"
          :key="task.id"
          :color="color(index)"
          :title="task.name"
          :description="task.description"
        >
          <div class="form-stack">
            <div class="color-project-meta">
              <span
                class="ui-color-icon"
                :data-ui-color="color(index)"
                aria-hidden="true"
                ><component :is="task.icon" /></span
              ><UiBadge :color="color(index)">项目 {{ index + 1 }}</UiBadge>
            </div>
            <UiProgress
              :label="task.name + '进度'"
              :value="task.progress"
              :color="color(index)"
            />
            <div class="color-project-meta">
              <div class="profile-row">
                <UiAvatar
                  :name="task.owner"
                  :color="color(index)"
                  size="sm"
                /><span>{{ task.owner }}</span>
              </div>
              <UiBadge :tone="index === 1 ? 'info' : 'success'"
                ><Check v-if="index !== 1" :size="12" aria-hidden="true" />{{
                  index === 1 ? "处理中" : "已同步"
                }}</UiBadge
              >
            </div>
          </div>
        </UiPanel>
      </div>
    </DemoCard>
    <div class="color-role-grid">
      <UiPanel
        title="品牌与操作"
        description="主按钮突出行动，次按钮保留安静的边界。"
        ><div class="ui-actions">
          <UiButton variant="primary">主操作样式</UiButton
          ><UiButton>次操作样式</UiButton>
        </div></UiPanel
      >
      <UiPanel
        title="分类与身份"
        description="同色底、同色文字，颜色和名称一起识别对象。"
        ><div class="ui-actions">
          <UiBadge v-for="(name, hue) in names" :key="hue" :color="hue">{{
            name
          }}</UiBadge>
        </div></UiPanel
      >
      <UiPanel
        title="结果与风险"
        description="成功、处理中、提醒与失败的含义保持稳定。"
        ><div class="ui-actions">
          <UiBadge tone="success">✓ 已完成</UiBadge
          ><UiBadge tone="info">处理中</UiBadge
          ><UiBadge tone="warning">! 待处理</UiBadge
          ><UiBadge tone="danger">× 未成功</UiBadge>
        </div></UiPanel
      >
    </div>
    <UiAlert
      tone="info"
      title="色彩丰富，依然容易阅读"
      description="浅色底配深色文字；深色模式使用深色底和柔和亮色。分类色不占用错误提示，名称、图标和状态文字始终保留。"
    />
  </section>
</template>

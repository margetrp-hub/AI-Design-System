<script setup lang="ts">
import { computed, ref } from "vue";
import {
  UiButton,
  UiInput,
  UiSelect,
  UiBadge,
  UiPanel,
  UiSwitch,
  UiDialog,
  UiTable,
  UiEmptyState,
  UiField,
  UiTextarea,
  UiCheckbox,
  UiRadioGroup,
  UiNumberInput,
  UiMetadataList,
  UiCombobox,
  UiTabs,
  UiAccordion,
  UiTooltip,
  UiPopover,
  UiDropdownMenu,
  UiDrawer,
  UiAlert,
  UiSkeleton,
  UiProgress,
  UiAvatar,
  UiSeparator,
  UiBreadcrumbs,
  UiCopyButton,
  UiToastProvider,
  UiPagination,
  UiDataTable,
  type RowId,
} from "@ai-design-system/ui";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Settings2,
  MoreHorizontal,
  PanelRight,
} from "@lucide/vue";
import DemoCard from "./DemoCard.vue";
import AdditionalExamples from "./AdditionalExamples.vue";
import SettingsExamples from "./SettingsExamples.vue";
import ChoiceExamples from "./ChoiceExamples.vue";
defineProps<{ view: string }>();
const emit = defineEmits<{ navigate: [view: string] }>();
const buttonLocale = ref("de"),
  compactActions = ref(false),
  actionFeedback = ref("");
const buttonTranslations: Record<string, { cancel: string; action: string }> = {
  zh: { cancel: "取消", action: "下载全部文件" },
  en: { cancel: "Cancel", action: "Download all files" },
  de: { cancel: "Abbrechen", action: "Alle Dateien herunterladen" },
};
const buttonLabels = computed(() => buttonTranslations[buttonLocale.value]);
const duration = ref<number | undefined>(1.5);
const choiceCode = `<script setup lang="ts">
import { ref } from "vue";
import { UiNumberInput, UiRadioGroup, UiMetadataList } from "@ai-design-system/ui";
const seats = ref<number | undefined>(6), plan = ref("team"), period = ref("month");
const plans = [{ value: "personal", label: "个人", description: "独立创作" }, { value: "team", label: "团队", description: "共享资源" }];
<\/script>
<template>
  <UiRadioGroup v-model="plan" label="方案" :options="plans" variant="cards" />
  <UiRadioGroup v-model="period" label="周期" :options="[{ value: 'month', label: '按月' }, { value: 'year', label: '按年' }]" variant="segment" />
  <UiNumberInput v-model="seats" label="成员席位" :min="1" :max="50" unit="人" :error="seats === undefined ? '请填写席位' : undefined" />
  <UiMetadataList label="配置摘要" :items="[{ id: 'seats', label: '席位', value: seats }, { id: 'fee', label: '服务费', value: 0 }]" />
</template>`;
const name = ref("同源工作空间"),
  bio = ref("把日常使用的细节做好，留给下一个项目。"),
  choice = ref("team"),
  enabled = ref(true),
  agreed = ref<boolean | "indeterminate">(true),
  scope = ref("private"),
  fieldError = ref(""),
  savedMessage = ref(""),
  failNext = ref(false);
const options = [
  {
    value: "personal",
    label: "个人空间",
    description: "适合个人工具与独立项目",
  },
  { value: "team", label: "团队空间", description: "共享资源与协作设置" },
  { value: "archived", label: "归档空间", disabled: true },
];
const selection = ref("team"),
  comboError = ref(false),
  tab = ref("all"),
  segment = ref("month"),
  expanded = ref(["sharing"]),
  menuResult = ref("尚未执行操作");
const dialogOpen = ref(false),
  drawerOpen = ref(false),
  sheetOpen = ref(false),
  popoverOpen = ref(false),
  draft = ref("新的工作空间"),
  draftSaved = ref("新的工作空间"),
  discard = ref(false),
  overlayResult = ref("");
const progress = ref(64),
  paging = ref(1),
  pagingSize = ref(10),
  selected = ref<RowId[]>([]),
  tableState = ref("ready"),
  tableQuery = ref("");
const rows = Array.from({ length: 26 }, (_, i) => ({
  id: "WS-" + String(i + 1).padStart(3, "0"),
  name:
    ["产品设计", "研发工作台", "运营后台", "客户支持", "资源中心"][i % 5] +
    " " +
    (i + 1),
  owner: ["林晓", "陈默", "周禾"][i % 3],
  status: i % 4 === 0 ? "待处理" : "使用中",
  usage: i === 5 ? null : Math.round((i + 1) * 124.35),
}));
const columns = [
  { key: "name", label: "空间名称", sortable: true },
  { key: "owner", label: "负责人", sortable: true },
  { key: "status", label: "状态", sortable: true },
  { key: "usage", label: "用量", sortable: true, numeric: true },
  { key: "id", label: "操作" },
] as const;
const menus = [
  { id: "edit", label: "编辑名称", shortcut: "↵" },
  { id: "duplicate", label: "创建副本" },
  { id: "export", label: "导出数据", disabled: true },
  { id: "archive", label: "归档此空间", danger: true, separator: true },
];
const accordionItems = [
  {
    value: "sharing",
    title: "组件如何跨项目共享？",
    description:
      "安装同一个包，在项目中组合组件；业务权限、请求和数据归项目管理。",
  },
  {
    value: "theme",
    title: "改主题需要改页面吗？",
    description:
      "切换 UiTheme 上的风格、配色与深浅色，菜单和弹窗继承相同主题。",
  },
  {
    value: "platform",
    title: "哪些平台现在可以直接用？",
    description:
      "Vue 和 React 分别提供组件包，覆盖范围不同。Next.js、Electron 需验证宿主；Uni-app、React Native 目前共享设计值。",
  },
];
const badgeTones = [
  "neutral",
  "accent",
  "success",
  "warning",
  "danger",
] as const;
function saveSettings() {
  fieldError.value = "";
  savedMessage.value = "";
  if (!name.value.trim()) {
    fieldError.value = "请输入工作空间名称";
    return;
  }
  if (failNext.value) {
    failNext.value = false;
    savedMessage.value = "保存失败，输入已保留，可再次保存。";
    return;
  }
  try {
    localStorage.setItem(
      "ai-design-system-demo-settings",
      JSON.stringify({
        name: name.value,
        bio: bio.value,
        scope: scope.value,
        enabled: enabled.value,
      }),
    );
    savedMessage.value = "已保存到本机演示设置。";
  } catch {
    savedMessage.value = "本地存储不可用，输入已保留，可再次保存。";
  }
}
function openDialog() {
  discard.value = false;
  dialogOpen.value = true;
}
function applyDraft() {
  if (!draft.value.trim()) return;
  draftSaved.value = draft.value;
  dialogOpen.value = false;
  overlayResult.value = "已应用名称：" + draft.value;
}
</script>
<template>
  <UiToastProvider v-slot="toast">
    <div v-if="view === 'overview'" class="overview-grid">
      <UiPanel
        color="blue"
        title="每个细节，都能带走"
        description="表单、导航和反馈，来自同一个组件包。"
        ><div class="form-stack">
          <UiInput v-model="name" label="工作空间名称" :error="fieldError" />
          <div class="two-fields">
            <UiCombobox
              v-model="selection"
              label="空间类型"
              :options="options"
            /><UiSelect
              v-model="scope"
              label="访问范围"
              :options="[
                { value: 'private', label: '仅成员' },
                { value: 'public', label: '公开可见' },
              ]"
            />
          </div>
          <UiSwitch v-model="enabled" label="启用活动提醒" /><UiSeparator />
          <div class="ui-actions">
            <UiButton variant="primary" @click="saveSettings"
              >保存设置 <ArrowRight /></UiButton
            ><UiButton @click="emit('navigate', 'forms')"
              >查看表单组件</UiButton
            >
          </div>
          <p v-if="savedMessage" class="demo-result" role="status">
            {{ savedMessage }}
          </p>
        </div></UiPanel
      ><UiPanel color="violet"
        ><div class="profile-row">
          <UiAvatar name="林晓" size="lg" color="violet" />
          <div>
            <strong>设计工作空间</strong>
            <p class="muted small">让界面跟随任务，而不是模板。</p>
          </div>
          <UiDropdownMenu
            :items="menus"
            label="空间操作"
            @select="toast.notify({ title: '已选择：' + $event })"
            ><UiButton variant="ghost" aria-label="空间操作"
              ><MoreHorizontal /></UiButton
          ></UiDropdownMenu>
        </div>
        <div class="metric-row">
          <span class="metric-number">69<span>个</span></span>
          <div>
            <UiBadge tone="success">Vue 导出</UiBadge>
            <p class="muted small">包含主题与通知提供器</p>
          </div>
        </div>
        <UiProgress
          label="演示用量"
          :value="progress"
          color="blue" /><UiSeparator /><UiTabs
          v-model="segment"
          label="用量时段"
          variant="segment"
          :items="[
            { value: 'week', label: '本周' },
            { value: 'month', label: '本月' },
            { value: 'year', label: '本年' },
          ]"
          ><template #default="{ value }"
            ><p class="muted small">
              {{
                value === "week" ? "本周" : value === "month" ? "本月" : "本年"
              }}视图 · 组件交互示例
            </p></template
          ></UiTabs
        >
        <div class="ui-actions">
          <UiButton
            @click="
              toast.notify({
                title: '通知示例',
                description: '重要结果仍应保留在页面中。',
                tone: 'success',
              })
            "
            >显示通知</UiButton
          ><UiButton variant="ghost" @click="emit('navigate', 'overlays')"
            >试试弹层 <ArrowUpRight
          /></UiButton></div
      ></UiPanel>
    </div>
    <div v-else-if="view === 'forms'" class="demo-grid">
      <DemoCard
        class="settings-demo-card"
        title="数量与方案选择"
        names="UiNumberInput · UiRadioGroup · UiMetadataList"
        :code="choiceCode"
        ><ChoiceExamples
      /></DemoCard>
      <DemoCard
        title="数值输入的状态"
        names="UiNumberInput"
        code='<UiNumberInput v-model="hours" label="预计时长" :min="0" :max="4" :step="0.25" locale="de-DE" unit="小时" />'
      >
        <div class="form-stack">
          <UiNumberInput
            v-model="duration"
            label="预计时长"
            :min="0"
            :max="4"
            :step="0.25"
            locale="de-DE"
            unit="小时"
            hint="德语小数格式；每步 0.25，范围 0–4"
          />
          <UiNumberInput
            :model-value="12"
            label="已分配席位"
            unit="人"
            readonly
            hint="只读；可聚焦并复制"
          />
          <UiNumberInput
            :model-value="0"
            label="追加席位"
            unit="人"
            disabled
            hint="当前方案不可追加"
          />
        </div>
      </DemoCard>
      <DemoCard
        class="settings-demo-card"
        title="分组设置：对齐、去框、留白"
        names="UiSettingsSection"
        code='<UiSettingsSection title="阅读" description="常用阅读偏好"><UiSelect v-model="font" label="字体" :options="fonts" /><UiSwitch v-model="sync" label="同步标注" /></UiSettingsSection>'
        ><SettingsExamples
      /></DemoCard>
      <DemoCard
        title="输入与表单"
        names="UiInput · UiTextarea · UiField"
        :code="`<UiInput v-model=&quot;name&quot; label=&quot;名称&quot; :error=&quot;error&quot; />\n<UiTextarea v-model=&quot;description&quot; label=&quot;说明&quot; />\n<UiField label=&quot;日期&quot; v-slot=&quot;field&quot;>\n  <input :id=&quot;field.id&quot; type=&quot;date&quot; class=&quot;ui-input&quot; />\n</UiField>`"
        ><form class="form-stack" @submit.prevent="saveSettings">
          <UiInput
            v-model="name"
            label="空间名称"
            :error="fieldError"
            hint="清空后保存，可查看校验状态。"
          /><UiTextarea
            v-model="bio"
            label="说明"
            hint="输入不会因保存失败而丢失。"
          /><UiField label="开始日期" v-slot="field"
            ><input
              :id="field.id"
              class="ui-input"
              type="date"
              :aria-describedby="field.describedby" /></UiField
          ><UiButton type="submit" variant="primary">保存表单</UiButton
          ><UiSwitch v-model="failNext" label="模拟下次保存失败" /><UiAlert
            v-if="savedMessage"
            :title="savedMessage"
            :tone="savedMessage.includes('失败') ? 'danger' : 'success'"
            live
          /></form
      ></DemoCard>
      <DemoCard
        title="动作与轻重"
        names="UiButton · UiCopyButton"
        :code="`<UiButton variant=&quot;primary&quot; :loading=&quot;saving&quot;>保存</UiButton>\n<UiCopyButton :text=&quot;value&quot; />`"
        ><div class="form-stack">
          <div class="ui-actions">
            <UiButton
              variant="primary"
              @click="toast.notify({ title: '主要动作已触发' })"
              ><Plus />新建空间</UiButton
            ><UiButton @click="toast.notify({ title: '次要动作已触发' })"
              >次要动作</UiButton
            ><UiButton
              variant="ghost"
              @click="toast.notify({ title: '轻量动作已触发' })"
              >轻量动作</UiButton
            >
          </div>
          <div class="ui-actions">
            <UiButton variant="danger" @click="openDialog">需要确认</UiButton
            ><UiButton disabled>不可用</UiButton
            ><UiButton loading>加载态</UiButton>
          </div>
          <UiSeparator label="复制成功后才显示反馈" />
          <div class="copy-example">
            <code>@ai-design-system/ui</code
            ><UiCopyButton text="@ai-design-system/ui" />
          </div>
          <UiSeparator label="长译文与窄容器" />
          <UiSelect
            v-model="buttonLocale"
            label="按钮文案语言"
            :options="[
              { value: 'zh', label: '中文' },
              { value: 'en', label: 'English' },
              { value: 'de', label: 'Deutsch' },
            ]"
          />
          <UiSwitch v-model="compactActions" label="窄容器预览" />
          <div
            class="translation-example"
            :class="{ 'is-narrow': compactActions }"
            :lang="buttonLocale"
          >
            <div class="translation-actions">
              <UiButton @click="actionFeedback = '已取消演示操作'">{{
                buttonLabels.cancel
              }}</UiButton><UiButton
                variant="primary"
                @click="actionFeedback = '已触发演示操作，不下载文件'"
                >{{ buttonLabels.action }}</UiButton
              >
            </div>
          </div>
          <span v-if="actionFeedback" class="small muted" role="status">{{
            actionFeedback
          }}</span>
        </div></DemoCard
      >
      <DemoCard
        title="勾选与偏好"
        names="UiCheckbox · UiSwitch"
        :code="`<UiCheckbox v-model=&quot;checked&quot; label=&quot;共享组件&quot; />\n<UiSwitch v-model=&quot;enabled&quot; label=&quot;活动提醒&quot; />`"
        ><div class="form-stack">
          <UiCheckbox
            v-model="agreed"
            label="允许团队成员复用组件"
          /><UiCheckbox
            model-value="indeterminate"
            label="部分成员已选择"
          /><UiCheckbox
            :model-value="false"
            label="由管理员管理"
            disabled
          /><UiSeparator /><UiSwitch
            v-model="enabled"
            label="接收活动提醒"
          /><span class="muted small"
            >当前：{{ enabled ? "开启" : "关闭" }} ·
            {{ agreed ? "已勾选" : "未勾选" }}</span
          >
        </div></DemoCard
      >
      <DemoCard
        title="明确选择一个值"
        names="UiRadioGroup · UiSelect"
        :code="`<UiRadioGroup v-model=&quot;type&quot; label=&quot;空间类型&quot; :options=&quot;options&quot; />\n<UiSelect v-model=&quot;scope&quot; label=&quot;访问范围&quot; :options=&quot;scopes&quot; />`"
        ><div class="form-stack">
          <UiRadioGroup
            v-model="choice"
            label="空间类型"
            :options="options"
          /><UiSeparator /><UiSelect
            v-model="scope"
            label="访问范围"
            :options="[
              { value: 'private', label: '仅成员' },
              { value: 'public', label: '公开可见' },
            ]"
          /></div
      ></DemoCard>
    </div>
    <div v-else-if="view === 'navigation'" class="demo-grid">
      <DemoCard
        title="搜索选择器"
        names="UiCombobox"
        :code="`<UiCombobox v-model=&quot;selected&quot; label=&quot;空间&quot; :options=&quot;options&quot;\n  :error=&quot;error&quot; @retry=&quot;reload&quot; />`"
        ><div class="form-stack">
          <UiCombobox
            v-model="selection"
            label="选择空间"
            :options="options"
            :error="comboError ? '示例请求失败，保留当前选择。' : undefined"
            @retry="comboError = false"
          /><span class="muted small">选择值：{{ selection || "未选择" }}</span
          ><UiSwitch v-model="comboError" label="模拟选项加载失败" />
          <p class="muted small">
            输入搜索；方向键移动，Enter 选择，Escape 关闭。无匹配时显示空结果。
          </p>
        </div></DemoCard
      >
      <DemoCard
        title="命令菜单"
        names="UiDropdownMenu"
        :code="`<UiDropdownMenu :items=&quot;actions&quot; @select=&quot;runAction&quot;>\n  <UiButton>更多操作</UiButton>\n</UiDropdownMenu>`"
        ><div class="form-stack">
          <UiDropdownMenu
            :items="menus"
            label="当前空间"
            @select="menuResult = '已选择：' + $event"
            ><UiButton>更多操作 <MoreHorizontal /></UiButton
          ></UiDropdownMenu>
          <p class="demo-result" role="status">{{ menuResult }}</p>
          <p class="muted small">
            菜单触发动作。导出为禁用项，危险动作有分隔；示例仅回传动作 ID。
          </p>
        </div></DemoCard
      >
      <DemoCard
        title="页签与分段选择"
        names="UiTabs"
        :code="`<UiTabs v-model=&quot;tab&quot; label=&quot;资源状态&quot; :items=&quot;tabs&quot;>\n  <template #all>全部内容</template>\n</UiTabs>`"
        ><UiTabs
          v-model="tab"
          label="资源状态"
          :items="[
            { value: 'all', label: '全部资源' },
            { value: 'active', label: '使用中' },
            { value: 'disabled', label: '未开放', disabled: true },
          ]"
          ><template #all><p>全部资源 · 26 个空间</p></template
          ><template #active><p>使用中 · 19 个空间</p></template></UiTabs
        ><UiSeparator /><UiTabs
          v-model="segment"
          variant="segment"
          label="统计时段"
          :items="[
            { value: 'week', label: '本周' },
            { value: 'month', label: '本月' },
            { value: 'year', label: '本年' },
          ]"
          ><template #default="{ value }"
            ><span class="muted small">当前时段：{{ value }}</span></template
          ></UiTabs
        ></DemoCard
      >
      <DemoCard
        title="逐层展开"
        names="UiAccordion · UiBreadcrumbs · UiSeparator"
        :code="`<UiAccordion v-model=&quot;expanded&quot; :items=&quot;items&quot; />\n<UiBreadcrumbs :items=&quot;[{label:'项目'},{label:'设置'}]&quot; />`"
        ><UiBreadcrumbs
          :items="[
            { label: '工作空间' },
            { label: '项目设置' },
            { label: '共享组件' },
          ]" /><UiSeparator /><UiAccordion
          v-model="expanded"
          :items="accordionItems"
      /></DemoCard>
    </div>
    <div v-else-if="view === 'overlays'" class="demo-grid">
      <DemoCard
        title="贴近触发点"
        names="UiTooltip · UiPopover"
        :code="`<UiTooltip text=&quot;辅助说明&quot;><UiButton>帮助</UiButton></UiTooltip>\n<UiPopover label=&quot;快速设置&quot;>\n  <template #trigger><UiButton>设置</UiButton></template>\n  <UiSwitch v-model=&quot;enabled&quot; label=&quot;提醒&quot; />\n</UiPopover>`"
        ><div class="ui-actions">
          <UiTooltip text="键盘聚焦也能看到这条说明。"
            ><UiButton>查看提示</UiButton></UiTooltip
          ><UiPopover v-model:open="popoverOpen" label="快速设置"
            ><template #trigger
              ><UiButton><Settings2 />快速设置</UiButton></template
            >
            <div class="form-stack">
              <strong>空间显示</strong
              ><UiSwitch v-model="enabled" label="显示活动提醒" /><UiSelect
                v-model="scope"
                label="访问范围"
                :options="[
                  { value: 'private', label: '仅成员' },
                  { value: 'public', label: '公开可见' },
                ]"
              /><UiButton @click="popoverOpen = false">完成设置</UiButton>
            </div></UiPopover
          >
        </div>
        <p class="muted small">
          交互浮层可以聚焦、关闭并回到触发点。
        </p></DemoCard
      >
      <DemoCard
        title="短编辑与草稿保护"
        names="UiDialog"
        :code="`<UiDialog v-model:open=&quot;open&quot; title=&quot;编辑空间&quot;\n  description=&quot;修改名称&quot; :prevent-close=&quot;dirty&quot;\n  @close-request=&quot;confirmDiscard&quot;>…</UiDialog>`"
        ><UiButton variant="primary" @click="openDialog">编辑空间</UiButton>
        <p class="muted small">
          修改后按 Escape 或点遮罩，先处理草稿。取消与保存后焦点返回。
        </p>
        <p v-if="overlayResult" class="demo-result" role="status">
          {{ overlayResult }}
        </p></DemoCard
      >
      <DemoCard
        title="保留上下文的侧面板"
        names="UiDrawer"
        :code="`<UiDrawer v-model:open=&quot;open&quot; title=&quot;空间详情&quot; description=&quot;当前记录&quot;>\n  <template #trigger><UiButton>查看详情</UiButton></template>\n  …\n</UiDrawer>`"
        ><UiDrawer
          v-model:open="drawerOpen"
          title="空间详情"
          description="侧面板使用同一套焦点、关闭和主题行为。"
          ><template #trigger
            ><UiButton>打开右侧面板 <PanelRight /></UiButton
          ></template>
          <div class="form-stack">
            <div class="profile-row">
              <UiAvatar name="林晓" /><strong>{{ name }}</strong>
            </div>
            <UiSeparator />
            <p>{{ bio }}</p>
            <UiProgress label="演示用量" :value="progress" />
          </div>
          <template #footer
            ><UiButton @click="drawerOpen = false">关闭详情</UiButton></template
          ></UiDrawer
        ></DemoCard
      >
      <DemoCard
        title="从底部展开"
        names="UiDrawer / bottom"
        :code="`<UiDrawer side=&quot;bottom&quot; v-model:open=&quot;open&quot;\n  title=&quot;显示选项&quot; description=&quot;移动端短设置&quot;>…</UiDrawer>`"
        ><UiDrawer
          v-model:open="sheetOpen"
          side="bottom"
          title="显示选项"
          description="底部面板适应屏幕与安全区域。"
          ><template #trigger><UiButton>打开底部面板</UiButton></template
          ><UiRadioGroup
            v-model="choice"
            label="空间类型"
            :options="options"
          /><template #footer
            ><UiButton variant="primary" @click="sheetOpen = false"
              >完成选择</UiButton
            ></template
          ></UiDrawer
        ></DemoCard
      >
    </div>
    <div v-else-if="view === 'feedback'" class="demo-grid">
      <DemoCard
        title="状态与结果"
        names="UiBadge · UiAlert"
        :code="`<UiBadge tone=&quot;success&quot;>已完成</UiBadge>\n<UiAlert title=&quot;保存未完成&quot; tone=&quot;danger&quot; live>\n  <template #action><UiButton @click=&quot;retry&quot;>重试</UiButton></template>\n</UiAlert>`"
        ><div class="form-stack">
          <div class="ui-actions">
            <UiBadge v-for="(tone, i) in badgeTones" :key="tone" :tone="tone">{{
              ["未评估", "进行中", "已完成", "待确认", "未成功"][i]
            }}</UiBadge>
          </div>
          <UiAlert
            title="保持关键结果可见"
            description="重要说明与恢复操作留在所属页面。"
          /><UiAlert
            :title="comboError ? '同步未完成（示例）' : '同步完成（示例）'"
            :tone="comboError ? 'danger' : 'success'"
            ><template #action
              ><UiButton @click="comboError = !comboError">{{
                comboError ? "重试演示" : "查看失败态"
              }}</UiButton></template
            ></UiAlert
          >
        </div></DemoCard
      >
      <DemoCard
        title="轻量通知"
        names="UiToastProvider · useToast"
        :code="`<UiToastProvider><App /></UiToastProvider>\n\nconst { notify } = useToast()\nnotify({title:'已保存',tone:'success'})`"
        ><div class="form-stack">
          <div class="ui-actions">
            <UiButton
              @click="
                toast.notify({
                  title: '成功通知示例',
                  description: '等待真实保存结果后再触发。',
                  tone: 'success',
                })
              "
              >成功通知</UiButton
            ><UiButton
              @click="
                toast.notify({
                  title: '失败通知示例',
                  description: '实际错误还应保留在表单旁。',
                  tone: 'danger',
                })
              "
              >失败通知</UiButton
            ><UiButton variant="ghost" @click="toast.clear()"
              >清除通知</UiButton
            >
          </div>
          <p class="muted small">悬停或聚焦暂停消失，支持关闭与滑动。</p>
        </div></DemoCard
      >
      <DemoCard
        title="加载与进度"
        names="UiSkeleton · UiProgress"
        :code="`<UiSkeleton :lines=&quot;3&quot; avatar />\n<UiProgress label=&quot;上传&quot; :value=&quot;completed&quot; :max=&quot;total&quot; />\n<UiProgress label=&quot;正在处理&quot; />`"
        ><div class="form-stack">
          <UiSkeleton avatar /><UiSeparator /><UiProgress
            label="可调节的进度示例"
            :value="progress"
          /><label class="ui-field"
            >演示进度<input
              v-model.number="progress"
              type="range"
              min="0"
              max="100"
              aria-label="演示进度" /></label
          ><UiProgress label="未知总量示例" /><UiProgress
            label="零总量示例"
            :value="0"
            :max="0"
          /></div
      ></DemoCard>
      <DemoCard
        title="身份与空结果"
        names="UiAvatar · UiEmptyState"
        :code="`<UiAvatar name=&quot;林晓&quot; :src=&quot;avatarUrl&quot; />\n<UiEmptyState title=&quot;没有匹配结果&quot; description=&quot;试试清除筛选&quot;>\n  <UiButton @click=&quot;reset&quot;>清除筛选</UiButton>\n</UiEmptyState>`"
        ><div class="ui-actions">
          <UiAvatar name="林晓" size="sm" /><UiAvatar name="林晓" /><UiAvatar
            name="TY"
            size="lg"
          /><span class="muted small">缺少图片时显示姓名缩写</span>
        </div>
        <UiEmptyState
          title="这里还没有记录"
          description="为空结果提供可达的下一步。"
          ><UiButton @click="emit('navigate', 'data')"
            >试试数据表格 <ArrowRight /></UiButton></UiEmptyState
      ></DemoCard>
    </div>
    <template v-else-if="view === 'data'">
      <DemoCard
        title="信息摘要"
        names="UiMetadataList"
        code='<UiMetadataList label="任务信息" :items="facts"><template #status><UiBadge tone="success">已完成</UiBadge></template></UiMetadataList>'
      >
        <UiMetadataList
          label="任务信息"
          :items="[
            {
              id: 'name',
              label: '任务',
              value: '跨团队的设计组件与多语言界面可用性检查',
            },
            { id: 'status', label: '状态', value: '已完成' },
            { id: 'errors', label: '错误', value: 0 },
            { id: 'owner', label: '复核人', value: null },
          ]"
        >
          <template #status><UiBadge tone="success">已完成</UiBadge></template>
        </UiMetadataList>
      </DemoCard>
      <DemoCard
        title="一张可工作的表格"
        names="UiDataTable · UiTable · UiPagination"
        :code="`<UiDataTable :rows=&quot;rows&quot; :columns=&quot;columns&quot; row-key=&quot;id&quot;\n  caption=&quot;空间列表&quot; selectable v-model:selected=&quot;selected&quot;\n  :loading=&quot;loading&quot; :error=&quot;error&quot; @retry=&quot;loadRows&quot;>\n  <template #cell-status=&quot;{value}&quot;><UiBadge>{{ value }}</UiBadge></template>\n</UiDataTable>`"
        ><UiDataTable
          v-model:selected="selected"
          v-model:query="tableQuery"
          :rows="tableState === 'empty' ? [] : rows"
          :columns="columns"
          row-key="id"
          caption="演示空间列表"
          selectable
          :loading="tableState === 'refreshing'"
          :error="
            tableState === 'error'
              ? '失败状态演示。已有记录和选择保持可见。'
              : undefined
          "
          @retry="tableState = 'ready'"
          ><template #toolbar
            ><UiSelect
              v-model="tableState"
              label="状态演示"
              :options="[
                { value: 'ready', label: '正常数据' },
                { value: 'refreshing', label: '刷新中' },
                { value: 'error', label: '加载失败' },
                { value: 'empty', label: '空记录' },
              ]" /></template
          ><template #cell-status="{ value }"
            ><UiBadge :tone="value === '使用中' ? 'success' : 'warning'">{{
              value
            }}</UiBadge></template
          ><template #cell-id="{ row }"
            ><UiButton
              size="sm"
              variant="ghost"
              @click="
                toast.notify({
                  title: String(row.name),
                  description: '记录 ID：' + String(row.id),
                })
              "
              >查看</UiButton
            ></template
          ><template #selection="{ ids }"
            ><UiButton
              size="sm"
              :disabled="!ids.length"
              @click="
                toast.notify({
                  title: '已读取 ' + ids.length + ' 项选择',
                  description: ids.join('、'),
                })
              "
              >读取选中项</UiButton
            ></template
          ></UiDataTable
        ></DemoCard
      >
      <div class="demo-grid supplementary">
        <DemoCard
          title="分页可以独立使用"
          names="UiPagination"
          :code="`<UiPagination v-model=&quot;page&quot; v-model:page-size=&quot;pageSize&quot; :total=&quot;126&quot; />`"
          ><UiPagination
            v-model="paging"
            v-model:page-size="pagingSize"
            :total="126" /></DemoCard
        ><DemoCard
          title="只需要表面时"
          names="UiTable · UiPanel"
          :code="`<UiTable caption=&quot;计量单位&quot;>\n  <template #head><tr><th>项目</th><th>单位</th></tr></template>\n  <tr><td>用量</td><td>次</td></tr>\n</UiTable>`"
          ><UiTable caption="示例计量单位"
            ><template #head
              ><tr>
                <th scope="col">项目</th>
                <th scope="col">单位</th>
              </tr></template
            >
            <tr>
              <td>空间容量</td>
              <td>GB</td>
            </tr>
            <tr>
              <td>请求用量</td>
              <td>次</td>
            </tr></UiTable
          ></DemoCard
        >
      </div>
    </template>
    <UiDialog
      v-model:open="dialogOpen"
      title="编辑空间"
      description="修改名称后，可以应用或明确放弃草稿。"
      :prevent-close="draft !== draftSaved"
      @close-request="discard = true"
      ><div class="form-stack">
        <UiInput
          v-model="draft"
          label="空间显示名称"
          :error="!draft.trim() ? '名称不能为空' : undefined"
        /><UiPopover label="命名帮助"
          ><template #trigger
            ><UiButton variant="ghost">打开嵌套浮层</UiButton></template
          >
          <p>按 Escape 先关闭这个浮层，再返回编辑。</p></UiPopover
        ><UiAlert
          v-if="discard"
          title="修改尚未应用"
          description="继续编辑，或者放弃本次修改。"
          tone="warning"
          ><div class="ui-actions">
            <UiButton @click="discard = false">继续编辑</UiButton
            ><UiButton
              variant="danger"
              @click="
                draft = draftSaved;
                dialogOpen = false;
              "
              >放弃修改</UiButton
            >
          </div></UiAlert
        >
      </div>
      <template #footer
        ><UiButton
          @click="
            draft !== draftSaved ? (discard = true) : (dialogOpen = false)
          "
          >取消</UiButton
        ><UiButton
          variant="primary"
          :disabled="!draft.trim()"
          @click="applyDraft"
          >应用名称</UiButton
        ></template
      ></UiDialog
    >
    <AdditionalExamples :view="view" />
  </UiToastProvider>
</template>

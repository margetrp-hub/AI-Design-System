<script setup lang="ts">
import { ref } from "vue";
import {
  UiButton,
  UiInput,
  UiSlider,
  UiPinInput,
  UiTagsInput,
  UiCommand,
  UiFilePicker,
  UiResizable,
} from "@ai-design-system/ui";
import DemoCard from "./DemoCard.vue";
defineProps<{ view: string }>();
const amount = ref([40]),
  range = ref([20, 80]),
  pin = ref<string[]>([]),
  pinResult = ref(""),
  tags = ref(["设计", "前端"]),
  files = ref<File[]>([]),
  command = ref(false),
  commandResult = ref(""),
  splitTitle = ref("保留在面板内的草稿");
const commands = [
  { id: "create", label: "新建空间" },
  { id: "settings", label: "打开设置" },
  { id: "export", label: "导出记录", disabled: true },
  { id: "search", label: "搜索组件" },
];
const codes = {
  slider: '<UiSlider v-model="range" label="预算范围" :min="0" :max="100" />',
  pin: '<UiPinInput v-model="digits" label="验证码" :length="6" @complete="onComplete" />',
  tags: '<UiTagsInput v-model="tags" label="标签" :max="5" />',
  files:
    '<UiFilePicker v-model="files" label="附件" accept=".pdf,.txt,image/*"\n  :max-files="3" :max-bytes="5 * 1024 * 1024" />',
  command:
    '<UiCommand v-model:open="open" :items="commands" @select="run">\n  <template #trigger><UiButton>快捷命令</UiButton></template>\n</UiCommand>',
  split:
    '<UiResizable label="编辑与预览" :default-size="40">\n  <template #first>编辑区</template>\n  <template #second>预览区</template>\n</UiResizable>',
};
</script>
<template>
  <div v-if="view === 'forms'" class="demo-grid supplementary">
    <DemoCard title="连续数值与区间" names="UiSlider" :code="codes.slider"
      ><div class="form-stack">
        <UiSlider v-model="amount" label="音量" unit="%" /><UiSlider
          v-model="range"
          label="预算范围"
          :step="5"
          unit="元"
        />
        <p class="muted small">
          单个或多个滑块；方向键微调，Home / End 到边界。
        </p>
      </div></DemoCard
    >
    <DemoCard title="验证码输入" names="UiPinInput" :code="codes.pin"
      ><div class="form-stack">
        <UiPinInput
          v-model="pin"
          label="验证码"
          @complete="
            pinResult = '已填满 ' + $event.length + ' 位，等待业务校验。'
          "
        />
        <p class="muted small" role="status">
          {{ pinResult || "可连续输入或粘贴，允许以 0 开头。" }}
        </p>
        <UiButton
          @click="
            pin = [];
            pinResult = '';
          "
          >清空验证码</UiButton
        >
      </div></DemoCard
    >
    <DemoCard title="多个标签与去重" names="UiTagsInput" :code="codes.tags"
      ><div class="form-stack">
        <UiTagsInput v-model="tags" label="项目标签" :max="5" />
        <p class="muted small">当前 {{ tags.length }} / 5 个标签</p>
      </div></DemoCard
    >
    <DemoCard title="文件选择与校验" names="UiFilePicker" :code="codes.files"
      ><UiFilePicker
        v-model="files"
        label="项目附件"
        accept=".pdf,.txt,image/*"
        :max-files="3"
        :max-bytes="5 * 1024 * 1024"
    /></DemoCard>
  </div>
  <div v-else-if="view === 'navigation'" class="supplementary">
    <DemoCard title="搜索后执行命令" names="UiCommand" :code="codes.command"
      ><UiCommand
        v-model:open="command"
        :items="commands"
        @select="commandResult = '已选择命令：' + $event"
        ><template #trigger
          ><UiButton>打开快捷命令</UiButton></template
        ></UiCommand
      >
      <p class="muted small" role="status">
        {{
          commandResult ||
          "输入关键词，用方向键与 Enter 选择。快捷键由消费项目绑定。"
        }}
      </p></DemoCard
    >
  </div>
  <div v-else-if="view === 'data'" class="supplementary">
    <DemoCard title="可以调整的工作面" names="UiResizable" :code="codes.split"
      ><UiResizable label="编辑与预览"
        ><template #first
          ><div class="form-stack">
            <strong>编辑区</strong
            ><UiInput v-model="splitTitle" label="分栏草稿" />
            <p class="muted small">
              拖动分隔线或用方向键调整；双击或按钮重置。
            </p>
          </div></template
        ><template #second
          ><div class="form-stack">
            <strong>预览区</strong>
            <p>{{ splitTitle }}</p>
            <p class="muted small">
              窄容器自动上下排列，草稿不因重新布局而丢失。
            </p>
          </div></template
        ></UiResizable
      ></DemoCard
    >
  </div>
</template>

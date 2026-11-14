<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  UiTheme,
  UiInput,
  UiTextarea,
  UiButton,
  UiDialog,
  UiAuthLayout,
  UiBackdrop,
  UiAuthCharacters,
  UiCommandDock,
} from "@ai-design-system/ui";
import { defaults, readSettings, saveSettings } from "../shared/settings";
const key = "ai-design-system-integration-vue-v1",
  draft = ref({ ...defaults }),
  status = ref("idle"),
  message = ref(""),
  dark = ref(false),
  dialog = ref(false),
  focus = ref(false),
  view = ref("profile");
function load() {
  try {
    draft.value = readSettings(key);
    status.value = "idle";
    message.value = "";
  } catch (error) {
    status.value = "read-error";
    message.value =
      "无法读取本机设置，当前输入已保留。" + (error as Error).message;
  }
}
async function save() {
  if (status.value === "saving") return;
  status.value = "saving";
  try {
    const receipt = await saveSettings(key, draft.value);
    status.value = "saved";
    message.value = "已保存到本机：" + receipt.name;
  } catch (error) {
    status.value = "error";
    message.value = "保存失败，草稿已保留。" + (error as Error).message;
  }
}
onMounted(load);
</script>
<template>
  <UiTheme
    skin="console"
    design="geist"
    palette="cobalt"
    :mode="dark ? 'dark' : 'light'"
    class="integration-page"
    ><header class="integration-header">
      <h1>Vue · 真实包接入</h1>
      <UiButton @click="dark = !dark">{{
        dark ? "切换浅色" : "切换深色"
      }}</UiButton>
    </header>
    <UiAuthLayout label="Vue 设置示例"
      ><template #visual
        ><UiBackdrop kind="rays" /><strong>AI Design System / VUE</strong
        ><UiAuthCharacters :mode="focus ? 'typing' : 'idle'" />
        <h2 class="integration-visual-title">
          让组件回应你，<br />也记住你的输入。
        </h2></template
      ><UiCommandDock
        v-model="view"
        :items="[
          { id: 'profile', label: '资料', symbol: '◇' },
          { id: 'about', label: '说明', symbol: '◎' },
        ]"
      />
      <form
        v-show="view === 'profile'"
        class="integration-stack"
        @submit.prevent="save"
      >
        <UiInput
          v-model="draft.name"
          label="工作室名称"
          required
          @focus="focus = true"
          @blur="focus = false"
        /><UiTextarea v-model="draft.note" label="介绍" :rows="3" />
        <div class="integration-actions">
          <UiButton
            type="submit"
            variant="primary"
            :disabled="status === 'saving'"
            :loading="status === 'saving'"
            >{{ status === "saving" ? "保存中" : "保存到本机" }}</UiButton
          ><UiButton type="button" @click="dialog = true">查看预览</UiButton>
        </div>
      </form>
      <p v-show="view === 'about'" class="integration-muted">
        此示例导入构建后的 @ai-design-system/ui。切换导航保留草稿；保存写入独立
        localStorage 键，刷新后恢复。
      </p>
      <div
        v-if="message"
        class="integration-message"
        :data-error="status === 'error' || status === 'read-error'"
        role="status"
      >
        {{ message }}
        <div class="integration-actions">
          <UiButton v-if="status === 'error'" @click="save">重试保存</UiButton
          ><UiButton v-if="status === 'read-error'" @click="load"
            >重试读取</UiButton
          >
        </div>
      </div>
      <UiDialog
        v-model:open="dialog"
        title="工作室预览"
        description="查看当前草稿，关闭后继续编辑。"
        ><strong>{{ draft.name }}</strong>
        <p>{{ draft.note }}</p>
        <template #footer
          ><UiButton @click="dialog = false">继续编辑</UiButton></template
        ></UiDialog
      ><template #footer
        >本地演示 · 保存结果来自实际写入回执</template
      ></UiAuthLayout
    ></UiTheme
  >
</template>

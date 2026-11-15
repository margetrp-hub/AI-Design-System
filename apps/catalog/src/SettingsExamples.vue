<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import "./settings.css";
import {
  UiSettingsSection,
  UiButton,
  UiInput,
  UiSelect,
  UiSwitch,
} from "@ai-design-system/ui";
const section = ref("阅读体验");
const initial = {
  name: "我的阅读空间",
  font: "sans",
  size: "18",
  sync: true,
  wifi: true,
  reminder: false,
  digest: "weekly",
  retention: "30",
};
const saved = ref({ ...initial }),
  draft = ref({ ...initial });
const dirty = computed(
  () => JSON.stringify(draft.value) !== JSON.stringify(saved.value),
);
const status = ref<"idle" | "saving" | "saved" | "error">("idle");
const invalid = ref(false),
  failNext = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
function save() {
  invalid.value = !draft.value.name.trim();
  if (invalid.value) {
    section.value = "阅读体验";
    return;
  }
  const submitted = { ...draft.value };
  status.value = "saving";
  timer = setTimeout(() => {
    if (failNext.value) {
      status.value = "error";
      failNext.value = false;
    } else {
      saved.value = submitted;
      status.value = "saved";
    }
  }, 650);
}
function discard() {
  draft.value = { ...saved.value };
  status.value = "idle";
  invalid.value = false;
}
watch(
  draft,
  () => {
    if (status.value === "saved") status.value = "idle";
  },
  { deep: true },
);
onUnmounted(() => clearTimeout(timer));
</script>
<template>
  <div class="case-settings-shell">
    <header class="case-settings-top">
      <strong>分组设置</strong
      ><span>名称与控件对齐 · 组间留白 · 草稿与保存</span>
    </header>
    <div class="case-settings-layout">
      <nav aria-label="设置分类">
        <small>偏好设置</small
        ><button
          v-for="(item, i) in ['阅读体验', '通知与同步', '高级选项']"
          :key="item"
          :aria-current="section === item ? 'page' : undefined"
          @click="section = item"
        >
          <span>0{{ i + 1 }}</span
          >{{ item }}
        </button>
        <p>给阅读，<br />留一点安静。</p>
      </nav>
      <form class="case-settings-form" @submit.prevent="save" novalidate>
        <div class="case-settings-intro">
          <span class="case-kicker">MAKE ROOM FOR READING</span>
          <h2>{{ section }}</h2>
          <p>让这个空间，适合自己的节奏。</p>
        </div>
        <fieldset :disabled="status === 'saving'">
          <template v-if="section === '阅读体验'">
            <UiSettingsSection
              title="空间"
              description="给你的阅读角落起个名字。"
              ><UiInput
                v-model="draft.name"
                label="阅读空间名称"
                :error="
                  invalid && !draft.name.trim() ? '请输入空间名称' : undefined
                "
                maxlength="60"
                required
            /></UiSettingsSection>
            <UiSettingsSection
              title="文字与排版"
              description="舒服的字号，让长文也读得轻松。"
            >
              <UiSelect
                v-model="draft.font"
                label="正文字体"
                :options="[
                  { value: 'sans', label: '简洁黑体' },
                  { value: 'serif', label: '经典宋体' },
                  { value: 'wenkai', label: '温润文楷' },
                ]"
              />
              <UiSelect
                v-model="draft.size"
                label="阅读字号"
                :options="
                  ['16', '18', '20', '22'].map((value) => ({
                    value,
                    label: value + ' px',
                  }))
                "
              />
              <div
                class="case-reading-sample"
                :data-font="draft.font"
                :style="{ fontSize: draft.size + 'px' }"
              >
                <small>阅读预览</small>
                <p>在日常的缝隙里，<br />为一个好故事停留。</p>
              </div>
            </UiSettingsSection>
          </template>
          <template v-else-if="section === '通知与同步'">
            <UiSettingsSection
              title="同步与下载"
              description="保持内容一致，也照顾流量。"
              ><UiSwitch v-model="draft.sync" label="同步阅读标注" /><UiSwitch
                v-model="draft.wifi"
                label="仅在 Wi-Fi 下下载"
            /></UiSettingsSection>
            <UiSettingsSection
              title="提醒"
              description="只有你愿意时，我们才打扰。"
              ><UiSwitch
                v-model="draft.reminder"
                label="接收阅读提醒" /><UiSelect
                v-if="draft.reminder"
                v-model="draft.digest"
                label="提醒频率"
                :options="[
                  { value: 'daily', label: '每天一次' },
                  { value: 'weekly', label: '每周一次' },
                ]"
            /></UiSettingsSection>
          </template>
          <template v-else>
            <UiSettingsSection
              title="离线内容"
              description="仅影响本设备的下载副本。"
              ><UiSelect
                v-model="draft.retention"
                label="离线保留时间"
                :options="[
                  { value: '7', label: '7 天' },
                  { value: '30', label: '30 天' },
                  { value: 'forever', label: '长期保留' },
                ]"
            /></UiSettingsSection>
            <details class="case-settings-detail">
              <summary>查看同步细节</summary>
              <p>
                标注按内容合并；关闭同步不会清除本页已有草稿。这里是本地交互演示，没有连接账户服务。
              </p>
            </details>
          </template>
        </fieldset>
        <footer class="case-settings-save">
          <div aria-live="polite">
            <strong v-if="status === 'error'" class="ui-error"
              >保存失败，修改仍保留。请重试。</strong
            ><span v-else-if="status === 'saving'">正在保存演示设置…</span
            ><span v-else-if="status === 'saved'">已保存到本次演示</span
            ><span v-else>{{
              dirty ? "有未保存的修改" : "所有设置均为本地演示"
            }}</span>
          </div>
          <div>
            <UiButton
              type="button"
              :disabled="!dirty || status === 'saving'"
              @click="discard"
              >撤销修改</UiButton
            ><UiButton
              variant="primary"
              type="submit"
              :disabled="!dirty || status === 'saving'"
              >{{
                status === "saving"
                  ? "保存中…"
                  : status === "error"
                    ? "重试保存"
                    : "保存修改"
              }}</UiButton
            >
          </div>
        </footer>
        <details class="case-settings-demo">
          <summary>体验失败与恢复</summary>
          <UiSwitch
            v-model="failNext"
            label="让下一次保存失败"
            :disabled="status === 'saving'"
          />
          <p>
            用于检查失败后草稿、错误和重试是否都留在原位。刷新页面会重置演示。
          </p>
        </details>
      </form>
    </div>
  </div>
</template>

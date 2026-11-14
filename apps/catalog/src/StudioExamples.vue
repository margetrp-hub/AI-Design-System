<script setup lang="ts">
import { computed, ref } from "vue";
import {
  UiStudioScene,
  UiStudioAvatar,
  UiStudioWorkbench,
  UiWordSwitch,
  UiFoldedNote,
  UiButton,
  UiCopyButton,
  type StudioMember,
} from "@ai-design-system/ui";
const members: StudioMember[] = [
  {
    id: "fern",
    name: "小苔",
    role: "整理灵感",
    color: "sage",
    state: "working",
  },
  { id: "clay", name: "陶陶", role: "打磨细节", color: "coral", state: "idle" },
  {
    id: "cloud",
    name: "云仔",
    role: "观察变化",
    color: "sky",
    state: "working",
  },
  {
    id: "grain",
    name: "麦粒",
    role: "午后小憩",
    color: "sand",
    state: "resting",
  },
];
const selectedId = ref("fern"),
  paused = ref(false),
  notes = ref<Record<string, string>>({}),
  notice = ref("");
const selected = computed(() =>
  members.find((m) => m.id === selectedId.value)!,
);
const code = `import { UiStudioScene, UiStudioAvatar } from '@ai-design-system/ui'\nimport '@ai-design-system/ui/style.css'\n\n<UiStudioScene :members="members" :selected-id="selectedId"\n  @select="selectedId = $event.id" />`;
</script>
<template>
  <div class="asset-stack">
    <div class="studio-intro">
      <div>
        <span class="asset-kicker">A SMALL PLACE FOR BIG IDEAS</span>
        <h2>栖间 <span>Studio</span></h2>
        <p>
          给<UiWordSwitch
            :words="['灵感', '专注', '好奇心']"
            :paused="paused"
          />留一个位置。
        </p>
      </div>
      <UiButton size="sm" @click="paused = !paused">{{
        paused ? "播放文字" : "暂停文字"
      }}</UiButton>
    </div>
    <UiStudioWorkbench title="栖间创作室">
      <template #header
        ><div class="studio-wordmark">
          <span>⌑</span><strong>栖间 / Studio 01</strong>
        </div>
        <small class="asset-muted">4 位伙伴 · 原创空间组件</small></template
      >
      <UiStudioScene
        :members="members"
        :selected-id="selectedId"
        @select="
          selectedId = $event.id;
          notice = '';
        "
      />
      <template #inspector
        ><div class="studio-inspector">
          <UiStudioAvatar
            :name="selected.name"
            :color="selected.color"
            :state="selected.state"
            :size="110"
          /><span class="asset-kicker">YOUR CREATIVE COMPANION</span>
          <h3>{{ selected.name }}</h3>
          <p>{{ selected.role }}</p>
          <hr />
          <label
            >给{{ selected.name }}的便签<textarea
              v-model="notes[selected.id]"
              rows="3"
              placeholder="切换伙伴，便签仍保留"
            /></label
          ><UiButton @click="notice = '已保留在本次预览，刷新后清空。'"
            >保留便签</UiButton
          >
          <p role="status" class="asset-muted">{{ notice }}</p>
        </div></template
      >
      <template #footer
        >柔和日光、木质工作位与几何伙伴。角色、场景、详情骨架可分别使用。</template
      >
    </UiStudioWorkbench>
    <div class="studio-notes">
      <UiFoldedNote title="形状先于配色" label="DESIGN NOTE / 01"
        >拱窗、开放空间、柔软边缘和适量留白，共同构成气质。<template #detail
          >保留同一配色比较视觉语言：导航、文字、组件几何和材质仍应有区别。颜色只是其中一个维度。</template
        ></UiFoldedNote
      ><UiFoldedNote title="细节可以有回应" label="INTERACTION / 02"
        >选择工作位，旁边的人物与便签一起变化。<template #detail
          >整个工作位都是键盘可达的按钮。编辑按角色保留，缩窄后详情自然排到下方；减少动态偏好会停止信号动画。</template
        ></UiFoldedNote
      >
    </div>
    <div class="asset-code-row">
      <pre class="code-block"><code>{{ code }}</code></pre>
      <UiCopyButton :text="code" label="复制场景用法" />
    </div>
  </div>
</template>
<style scoped>
.studio-intro {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  padding: 12px 0 20px;
}
.studio-intro h2 {
  font: 500 clamp(38px, 4vw, 54px)/1.1 var(--ui-font-heading);
  letter-spacing: -0.05em;
  margin: 14px 0;
}
.studio-intro h2 span {
  font-weight: 350;
  color: var(--ui-muted);
}
.studio-intro p {
  font-size: 16px;
  color: var(--ui-muted);
}
.studio-wordmark {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}
.studio-wordmark > span {
  font-size: 30px;
  color: #6d8975;
}
.studio-inspector {
  display: grid;
  gap: 12px;
  justify-items: start;
}
.studio-inspector h3 {
  font-size: 28px;
  font-weight: 500;
  margin: 0;
}
.studio-inspector p {
  margin: 0;
  font-size: 13px;
  color: var(--ui-muted);
}
.studio-inspector hr {
  width: 100%;
  border: 0;
  border-top: 1px solid var(--ui-border);
  margin: 12px 0;
}
.studio-inspector label {
  display: grid;
  gap: 10px;
  font-size: 12px;
  width: 100%;
}
.studio-inspector textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background: var(--ui-surface);
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  color: var(--ui-text);
  font: inherit;
  resize: vertical;
}
.studio-notes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}
@media (max-width: 650px) {
  .studio-notes {
    grid-template-columns: 1fr;
  }
}
</style>

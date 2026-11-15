<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
defineProps<{ src: string; title: string }>();
const presets = [
  { label: "手机", width: 390, height: 844 },
  { label: "平板", width: 768, height: 1024 },
  { label: "笔记本", width: 1366, height: 768 },
  { label: "桌面", width: 1440, height: 900 },
  { label: "宽屏", width: 1920, height: 1080 },
];
const width = ref(1440),
  height = ref(900),
  fit = ref(true),
  grid = ref(false);
const available = ref(1000),
  stage = ref<HTMLElement>();
const scale = computed(() =>
  fit.value ? Math.min(1, available.value / width.value) : 1,
);
let observer: ResizeObserver | undefined;
function dimension(event: Event, axis: "width" | "height", commit = false) {
  const input = event.target as HTMLInputElement;
  const min = 320;
  const max = 2560;
  const value = input.valueAsNumber;
  const target = axis === "width" ? width : height;
  if (!commit && (!Number.isFinite(value) || value < min || value > max)) return;
  if (Number.isFinite(value))
    target.value = Math.max(min, Math.min(max, Math.round(value)));
  input.value = String(target.value);
}
onMounted(() => {
  observer = new ResizeObserver(
    (entries) =>
      (available.value = Math.max(1, entries[0].contentRect.width - 32)),
  );
  observer.observe(stage.value!);
});
onUnmounted(() => observer?.disconnect());
</script>
<template>
  <section class="ui-viewport-frame" :aria-label="title + '分辨率预览'">
    <div class="ui-viewport-toolbar">
      <div class="ui-viewport-presets" role="group" aria-label="预览尺寸">
        <button
          type="button"
          v-for="preset in presets"
          :key="preset.label"
          :aria-pressed="width === preset.width && height === preset.height"
          @click="
            width = preset.width;
            height = preset.height;
          "
        >
          {{ preset.label }}<small>{{ preset.width }}</small>
        </button>
      </div>
      <div class="ui-viewport-inputs">
        <label
          >宽<input
            type="number"
            aria-label="预览宽度"
            :value="width"
            min="320"
            max="2560"
            @input="dimension($event, 'width')"
            @change="dimension($event, 'width', true)" /></label
        ><span>×</span
        ><label
          >高<input
            type="number"
            aria-label="预览高度"
            :value="height"
            min="320"
            max="2560"
            @input="dimension($event, 'height')"
            @change="dimension($event, 'height', true)" /></label
        ><button
          type="button"
          @click="[width, height] = [height, width]"
          aria-label="旋转预览方向"
        >
          ⇄</button
        ><button type="button" :aria-pressed="fit" @click="fit = !fit">
          {{ fit ? "适应画布" : "100% 原尺寸" }}</button
        ><button type="button" :aria-pressed="grid" @click="grid = !grid">
          网格
        </button>
      </div>
    </div>
    <label class="ui-viewport-range"
      ><span>连续调节</span
      ><input
        type="range"
        min="320"
        max="2560"
        step="1"
        v-model.number="width"
        aria-label="连续调节预览宽度"
      /><span>{{ width }} px</span></label
    >
    <div ref="stage" class="ui-viewport-stage">
      <div
        class="ui-viewport-sized"
        :style="{ width: width * scale + 'px', height: height * scale + 'px' }"
      >
        <div
          class="ui-viewport-content"
          :style="{
            width: width + 'px',
            height: height + 'px',
            transform: 'scale(' + scale + ')',
          }"
        >
          <iframe :src="src" :title="title" :width="width" :height="height" />
          <div v-if="grid" class="ui-viewport-grid" aria-hidden="true">
            <i v-for="i in 12" :key="i" />
          </div>
        </div>
      </div>
    </div>
    <div class="ui-viewport-caption">
      <output
        >{{ width }} × {{ height }} CSS px · 显示比例
        {{ Math.round(scale * 100) }}%</output
      ><span>切换尺寸保留当前操作；网格仅为辅助线。</span>
    </div>
  </section>
</template>

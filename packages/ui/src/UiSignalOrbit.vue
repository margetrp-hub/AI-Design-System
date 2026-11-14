<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { observeActivity, type OrbitNode } from "@ai-design-system/effects";
withDefaults(
  defineProps<{
    nodes: OrbitNode[];
    label: string;
    center?: string;
    selectedId?: string;
    paused?: boolean;
    duration?: number;
  }>(),
  { center: "CORE", paused: false, duration: 32 },
);
const emit = defineEmits<{ select: [id: string] }>(),
  host = ref<HTMLElement>(),
  active = ref(false),
  localPaused = ref(false);
let stop: (() => void) | undefined;
onMounted(() => {
  stop = observeActivity(host.value!, (value) => (active.value = value));
});
onBeforeUnmount(() => stop?.());
</script>
<template>
  <section
    ref="host"
    class="ui-signal-orbit"
    :aria-label="label"
    :data-paused="paused || localPaused || !active"
    :style="{ '--orbit-duration': Math.max(10, duration) + 's' }"
  >
    <div class="ui-orbit-art" aria-hidden="true">
      <div class="ui-orbit-rings" />
      <div class="ui-orbit-center">
        <span>◈</span><strong>{{ center }}</strong>
      </div>
      <div class="ui-orbit-track">
        <div
          v-for="(node, i) in nodes.slice(0, 8)"
          :key="node.id"
          class="ui-orbit-satellite"
          :style="{
            left:
              50 +
              50 * Math.cos((i * 2 * Math.PI) / Math.min(nodes.length, 8)) +
              '%',
            top:
              50 +
              50 * Math.sin((i * 2 * Math.PI) / Math.min(nodes.length, 8)) +
              '%',
          }"
        >
          <span :data-selected="selectedId === node.id">{{
            node.symbol ?? node.label.slice(0, 2)
          }}</span>
        </div>
      </div>
    </div>
    <div class="ui-orbit-legend">
      <button
        v-for="node in nodes"
        :key="node.id"
        type="button"
        :aria-pressed="selectedId === node.id"
        @click="emit('select', node.id)"
      >
        <span>{{ node.symbol ?? "◈" }}</span
        >{{ node.label }}</button
      ><button
        type="button"
        :aria-pressed="localPaused"
        @click="localPaused = !localPaused"
      >
        {{ localPaused ? "播放动效" : "暂停动效" }}
      </button>
    </div>
  </section>
</template>

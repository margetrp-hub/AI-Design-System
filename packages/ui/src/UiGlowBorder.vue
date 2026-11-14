<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { observeActivity } from "@ai-design-system/effects";
withDefaults(
  defineProps<{ paused?: boolean; color?: string; duration?: number }>(),
  { paused: false, duration: 6 },
);
const host = ref<HTMLElement>(),
  active = ref(false);
let stop: (() => void) | undefined;
onMounted(() => {
  stop = observeActivity(host.value!, (value) => (active.value = value));
});
onBeforeUnmount(() => stop?.());
</script>
<template>
  <div
    ref="host"
    class="ui-glow-border"
    :data-paused="paused || !active"
    :style="{
      '--ui-glow-color': color,
      '--ui-glow-duration': Math.max(1, duration) + 's',
    }"
  >
    <slot />
  </div>
</template>

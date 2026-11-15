<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useReducedMotion } from "./motion-preference";
const props = withDefaults(
  defineProps<{ text: string; replay?: number; duration?: number }>(),
  { replay: 0, duration: 550 },
);
const reduced = useReducedMotion();
const display = ref(props.text);
let frame = 0;
function finish() {
  cancelAnimationFrame(frame);
  display.value = props.text;
}
function run() {
  finish();
  if (reduced.value || document.hidden || props.duration <= 0) return;
  const segments = Array.from(
    new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
      props.text,
    ),
    (part) => part.segment,
  );
  const started = performance.now();
  const duration = Math.min(props.duration, 1600);
  const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const tick = (now: number) => {
    const progress = Math.min(1, (now - started) / duration);
    display.value = segments
      .map((part, index) =>
        index / segments.length < progress || /\s/.test(part)
          ? part
          : symbols[(Math.floor(now / 45) + index * 7) % symbols.length],
      )
      .join("");
    if (progress < 1) frame = requestAnimationFrame(tick);
    else display.value = props.text;
  };
  frame = requestAnimationFrame(tick);
}
watch([() => props.text, () => props.replay, reduced], run);
onMounted(() => {
  run();
  document.addEventListener("visibilitychange", finish);
});
onUnmounted(() => {
  cancelAnimationFrame(frame);
  document.removeEventListener("visibilitychange", finish);
});
</script>
<template>
  <span class="ui-text-scramble"
    ><span class="ui-text-scramble-source">{{ text }}</span
    ><span class="ui-text-scramble-visual" aria-hidden="true">{{
      display
    }}</span></span
  >
</template>

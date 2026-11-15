<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useReducedMotion } from "./motion-preference";
const props = withDefaults(
  defineProps<{
    effect?: "tilt" | "magnetic" | "reveal";
    disabled?: boolean;
  }>(),
  { effect: "tilt" },
);
const reduced = useReducedMotion();
const root = ref<HTMLElement>();
const seen = ref(true);
const position = ref({ "--ui-pointer-x": "0", "--ui-pointer-y": "0" });
let observer: IntersectionObserver | undefined;
function reset() {
  position.value = { "--ui-pointer-x": "0", "--ui-pointer-y": "0" };
}
function move(event: PointerEvent) {
  if (
    reduced.value ||
    props.disabled ||
    event.pointerType !== "mouse" ||
    props.effect === "reveal"
  )
    return;
  const box = root.value!.getBoundingClientRect();
  position.value = {
    "--ui-pointer-x": String((event.clientX - box.left) / box.width - 0.5),
    "--ui-pointer-y": String((event.clientY - box.top) / box.height - 0.5),
  };
}
function observe() {
  observer?.disconnect();
  reset();
  seen.value = true;
  if (
    !root.value ||
    props.effect !== "reveal" ||
    reduced.value ||
    props.disabled
  )
    return;
  seen.value = false;
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        seen.value = true;
        observer?.disconnect();
      }
    },
    { threshold: 0.08 },
  );
  observer.observe(root.value);
}
watch([reduced, () => props.effect, () => props.disabled], observe);
onMounted(() => {
  observe();
  document.addEventListener("visibilitychange", reset);
});
onUnmounted(() => {
  observer?.disconnect();
  document.removeEventListener("visibilitychange", reset);
});
</script>
<template>
  <div
    ref="root"
    class="ui-motion-surface"
    :data-effect="effect"
    :data-seen="seen"
    :data-reduced="reduced || disabled"
    :style="position"
    @pointermove="move"
    @pointerleave="reset"
    @pointercancel="reset"
    @focusin="seen = true"
  >
    <div class="ui-motion-surface-inner"><slot /></div>
  </div>
</template>

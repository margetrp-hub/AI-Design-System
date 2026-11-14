<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
const props = withDefaults(
  defineProps<{
    words: string[];
    interval?: number;
    paused?: boolean;
    label?: string;
  }>(),
  { interval: 2400, paused: false },
);
const index = ref(0),
  reduced = ref(false),
  hidden = ref(false);
const current = computed(
  () => props.words[index.value % Math.max(1, props.words.length)] || "",
);
let timer: ReturnType<typeof setInterval> | undefined,
  media: MediaQueryList | undefined;
function schedule() {
  clearInterval(timer);
  if (
    !props.paused &&
    !reduced.value &&
    !hidden.value &&
    props.words.length > 1
  )
    timer = setInterval(
      () => {
        index.value++;
      },
      Math.max(500, props.interval),
    );
}
function sync() {
  reduced.value = !!media?.matches;
  hidden.value = document.hidden;
  schedule();
}
watch(() => [props.paused, props.interval, props.words], schedule);
onMounted(() => {
  media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  sync();
});
onBeforeUnmount(() => {
  clearInterval(timer);
  media?.removeEventListener("change", sync);
  document.removeEventListener("visibilitychange", sync);
});
</script>
<template>
  <span class="ui-word-switch" :aria-label="label || words.join('、')"
    ><span class="ui-word-measure" aria-hidden="true"
      ><span v-for="word in words" :key="word">{{ word }}</span></span
    ><Transition name="ui-word" mode="out-in"
      ><span :key="current" class="ui-word-current" aria-hidden="true">{{
        current
      }}</span></Transition
    ></span
  >
</template>

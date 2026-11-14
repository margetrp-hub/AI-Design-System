<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import UiButton from "./UiButton.vue";
const props = withDefaults(defineProps<{ text: string; label?: string }>(), {
  label: "复制",
});
const emit = defineEmits<{ copied: []; error: [error: unknown] }>();
const state = ref<"idle" | "copying" | "copied" | "error">("idle");
let timer: ReturnType<typeof setTimeout> | undefined,
  revision = 0,
  mounted = true;
watch(
  () => props.text,
  () => {
    revision++;
    clearTimeout(timer);
    state.value = "idle";
  },
);
onBeforeUnmount(() => {
  mounted = false;
  clearTimeout(timer);
});
async function copy() {
  if (state.value === "copying") return;
  const current = ++revision;
  clearTimeout(timer);
  state.value = "copying";
  try {
    await navigator.clipboard.writeText(props.text);
    if (!mounted || current !== revision) return;
    state.value = "copied";
    emit("copied");
    timer = setTimeout(() => {
      state.value = "idle";
    }, 2000);
  } catch (error) {
    if (mounted && current === revision) {
      state.value = "error";
      emit("error", error);
    }
  }
}
</script>
<template>
  <span class="ui-copy"
    ><UiButton :loading="state === 'copying'" @click="copy">{{
      state === "copied" ? "已复制" : state === "error" ? "重试复制" : label
    }}</UiButton
    ><span class="ui-sr-only" role="status">{{
      state === "copied"
        ? "复制成功"
        : state === "error"
          ? "复制失败，请重试或手动复制"
          : ""
    }}</span></span
  >
</template>

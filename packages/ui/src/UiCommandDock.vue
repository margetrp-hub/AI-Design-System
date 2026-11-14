<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { trackIndicator, type DockItem } from "@ai-design-system/effects";
const props = withDefaults(
  defineProps<{ items: DockItem[]; label?: string }>(),
  { label: "快捷导航" },
);
const value = defineModel<string>({ default: "" }),
  host = ref<HTMLElement>();
let stop: (() => void) | undefined;
onMounted(() => {
  stop = trackIndicator(host.value!);
});
onBeforeUnmount(() => stop?.());
function navigate(event: KeyboardEvent) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const buttons = Array.from(
    host.value!.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
  );
  const i = buttons.indexOf(event.target as HTMLButtonElement);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? buttons.length - 1
        : (i + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) %
          buttons.length;
  event.preventDefault();
  buttons[next]?.focus();
}
</script>
<template>
  <nav
    ref="host"
    class="ui-command-dock"
    :aria-label="label"
    @keydown="navigate"
  >
    <span class="ui-dock-indicator" aria-hidden="true" /><button
      v-for="item in props.items"
      :key="item.id"
      type="button"
      :disabled="item.disabled"
      :aria-current="value === item.id ? 'page' : undefined"
      @click="value = item.id"
    >
      <span aria-hidden="true">{{ item.symbol ?? "◇" }}</span
      ><span>{{ item.label }}</span>
    </button>
  </nav>
</template>

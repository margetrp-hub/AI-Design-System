<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { mountCharacters, type CharacterMode } from "@ai-design-system/effects";
const props = withDefaults(
  defineProps<{ mode?: CharacterMode; paused?: boolean }>(),
  { mode: "idle", paused: false },
);
const host = ref<HTMLElement>();
let effect: ReturnType<typeof mountCharacters> | undefined;
onMounted(() => {
  effect = mountCharacters(host.value!, props);
});
watch(
  () => ({ ...props }),
  (value) => effect?.update(value),
);
onBeforeUnmount(() => effect?.destroy());
</script>
<template>
  <div
    ref="host"
    class="ui-auth-characters"
    :data-mode="mode"
    aria-hidden="true"
  />
</template>

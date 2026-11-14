<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import {
  mountBackdrop,
  type BackdropKind,
  type EffectHandle,
  type EffectState,
} from "@ai-design-system/effects";
const props = withDefaults(
  defineProps<{
    kind?: BackdropKind;
    paused?: boolean;
    intensity?: number;
    speed?: number;
    color?: string;
  }>(),
  { kind: "rays", paused: false, intensity: 1, speed: 1, color: "#579eff" },
);
const emit = defineEmits<{ state: [state: EffectState] }>();
const host = ref<HTMLElement>();
let effect: EffectHandle | undefined;
onMounted(() => {
  effect = mountBackdrop(host.value!, {
    ...props,
    onState: (value) => emit("state", value),
  });
});
watch(
  () => ({ ...props }),
  (value) => effect?.update(value),
);
onBeforeUnmount(() => effect?.destroy());
defineExpose({ retry: () => effect?.retry() });
</script>
<template>
  <div ref="host" class="ui-backdrop" :data-kind="kind" aria-hidden="true" />
</template>

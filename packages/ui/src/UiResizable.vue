<script setup lang="ts">
import { computed, ref } from "vue";
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";
import UiButton from "./UiButton.vue";
const props = withDefaults(
  defineProps<{
    label: string;
    defaultSize?: number;
    minSize?: number;
    direction?: "horizontal" | "vertical";
  }>(),
  { defaultSize: 40, minSize: 20, direction: "horizontal" },
);
const emit = defineEmits<{ resize: [sizes: number[]] }>();
const panel = ref<{
  resize: (size: number) => void;
  getSize: () => number;
} | null>(null);
const minimum = computed(() => Math.max(5, Math.min(45, props.minSize)));
const initial = computed(() =>
  Math.max(minimum.value, Math.min(100 - minimum.value, props.defaultSize)),
);
function reset() {
  panel.value?.resize(initial.value);
}
defineExpose({ reset });
</script>
<template>
  <div class="ui-resizable">
    <div class="ui-resizable-heading">
      <span>{{ label }}</span
      ><UiButton size="sm" variant="ghost" @click="reset">重置分栏</UiButton>
    </div>
    <SplitterGroup
      :direction="direction"
      :keyboard-resize-by="5"
      class="ui-split-group"
      @layout="emit('resize', $event)"
      ><SplitterPanel
        ref="panel"
        :default-size="initial"
        :min-size="minimum"
        :max-size="100 - minimum"
        class="ui-split-panel"
        ><slot name="first" /></SplitterPanel
      ><SplitterResizeHandle
        :aria-label="'调整' + label"
        class="ui-resize-handle"
        @dblclick="reset"
        ><span /></SplitterResizeHandle
      ><SplitterPanel
        :default-size="100 - initial"
        :min-size="minimum"
        class="ui-split-panel"
        ><slot name="second" /></SplitterPanel
    ></SplitterGroup>
  </div>
</template>

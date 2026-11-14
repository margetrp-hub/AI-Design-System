<script setup lang="ts">
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from "reka-ui";
const model = defineModel<number[]>({ default: () => [50] });
withDefaults(
  defineProps<{
    label: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    name?: string;
    unit?: string;
  }>(),
  { min: 0, max: 100, step: 1, unit: "" },
);
const emit = defineEmits<{ commit: [value: number[]] }>();
</script>
<template>
  <div class="ui-field">
    <div class="ui-progress-label">
      <span>{{ label }}</span
      ><output>{{ model.map((value) => value + unit).join(" – ") }}</output>
    </div>
    <SliderRoot
      :model-value="model"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :name="name"
      class="ui-slider"
      @update:model-value="model = $event || []"
      @value-commit="emit('commit', $event)"
      ><SliderTrack class="ui-slider-track"
        ><SliderRange class="ui-slider-range" /></SliderTrack
      ><SliderThumb
        v-for="(_, i) in model"
        :key="i"
        class="ui-slider-thumb"
        :aria-label="
          model.length > 2
            ? label + ' 第' + (i + 1) + '个值'
            : model.length > 1
              ? label + ' ' + (i === 0 ? '下限' : '上限')
              : label
        "
    /></SliderRoot>
  </div>
</template>

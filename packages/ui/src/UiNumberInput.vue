<script setup lang="ts">
import {
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from "reka-ui";
import UiField from "./UiField.vue";
defineOptions({ inheritAttrs: false });
const model = defineModel<number | undefined>();
withDefaults(
  defineProps<{
    label: string;
    hint?: string;
    error?: string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    locale?: string;
    formatOptions?: Intl.NumberFormatOptions;
    name?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
  }>(),
  { step: 1, locale: "zh-CN" },
);
</script>
<template>
  <UiField
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    v-slot="field"
  >
    <NumberFieldRoot
      v-model="model"
      :id="field.id"
      :min="min"
      :max="max"
      :step="step"
      :locale="locale"
      :format-options="formatOptions"
      :name="name"
      :disabled="disabled"
      :readonly="readonly"
      :disable-wheel-change="true"
      class="ui-number-input"
      :data-invalid="field.invalid || undefined"
    >
      <NumberFieldDecrement class="ui-number-step" :aria-label="'减少' + label"
        >−</NumberFieldDecrement
      >
      <NumberFieldInput
        v-bind="$attrs"
        class="ui-number-value"
        :required="required"
        :aria-invalid="field.invalid"
        :aria-describedby="
          [field.describedby, unit ? field.id + '-unit' : undefined]
            .filter(Boolean)
            .join(' ') || undefined
        "
        :aria-required="required"
      />
      <span v-if="unit" :id="field.id + '-unit'" class="ui-number-unit">{{
        unit
      }}</span>
      <NumberFieldIncrement class="ui-number-step" :aria-label="'增加' + label"
        >+</NumberFieldIncrement
      >
    </NumberFieldRoot>
  </UiField>
</template>

<script setup lang="ts">
import UiField from "./UiField.vue";
defineOptions({ inheritAttrs: false });
const model = defineModel<string>({ default: "" });
withDefaults(
  defineProps<{
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    rows?: number;
  }>(),
  { rows: 3 },
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
    <textarea
      v-bind="$attrs"
      :id="field.id"
      v-model="model"
      class="ui-input ui-textarea"
      :rows="rows"
      :required="required"
      :aria-invalid="field.invalid"
      :aria-describedby="field.describedby"
    />
  </UiField>
</template>

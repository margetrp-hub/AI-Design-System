<script setup lang="ts">
import { useId } from "vue";
import { CheckboxRoot, CheckboxIndicator } from "reka-ui";
defineOptions({ inheritAttrs: false });
const model = defineModel<boolean | "indeterminate">({ default: false });
defineProps<{
  label: string;
  hideLabel?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
}>();
const id = useId();
</script>
<template>
  <div class="ui-check-field">
    <CheckboxRoot
      v-bind="$attrs"
      :id="id"
      v-model="model"
      class="ui-checkbox"
      :disabled="disabled"
      :name="name"
      :value="value"
      :required="required"
      ><CheckboxIndicator aria-hidden="true">{{
        model === "indeterminate" ? "−" : "✓"
      }}</CheckboxIndicator></CheckboxRoot
    ><label :for="id" :class="{ 'ui-sr-only': hideLabel }">{{ label }}</label>
  </div>
</template>

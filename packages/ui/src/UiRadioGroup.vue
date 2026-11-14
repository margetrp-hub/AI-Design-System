<script setup lang="ts">
import { useId } from "vue";
import type { UiOption } from "./types";
const model = defineModel<string>({ default: "" });
defineProps<{
  label: string;
  options: ReadonlyArray<UiOption>;
  name?: string;
  disabled?: boolean;
  required?: boolean;
}>();
const id = useId();
</script>
<template>
  <fieldset class="ui-fieldset" :disabled="disabled">
    <legend>{{ label }}</legend>
    <div class="ui-radio-group">
      <div
        v-for="(option, index) in options"
        :key="option.value"
        class="ui-radio-option"
      >
        <input
          :id="id + '-' + index"
          v-model="model"
          type="radio"
          :name="name || id"
          :value="option.value"
          :disabled="disabled || option.disabled"
          :required="required"
          class="ui-radio"
        /><label :for="id + '-' + index"
          ><span>{{ option.label }}</span
          ><small v-if="option.description">{{
            option.description
          }}</small></label
        >
      </div>
    </div>
  </fieldset>
</template>

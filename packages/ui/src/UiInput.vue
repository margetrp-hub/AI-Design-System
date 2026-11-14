<script setup lang="ts">
defineOptions({ inheritAttrs: false });
const model = defineModel<string>({ default: "" });
withDefaults(
  defineProps<{
    label: string;
    hint?: string;
    error?: string;
    type?: string;
    required?: boolean;
  }>(),
  { type: "text" },
);
import { useId } from "vue";
const id = useId();
</script>
<template>
  <div class="ui-field">
    <label :for="id"
      >{{ label }}<span v-if="required" aria-hidden="true"> *</span></label
    ><input
      v-bind="$attrs"
      :id="id"
      v-model="model"
      class="ui-input"
      :type="type"
      :required="required"
      :aria-invalid="!!error"
      :aria-describedby="error || hint ? id + '-help' : undefined"
    /><small
      v-if="error || hint"
      :id="id + '-help'"
      :class="{ 'ui-error': error }"
      >{{ error || hint }}</small
    >
  </div>
</template>

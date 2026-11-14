<script setup lang="ts">
import { useId } from "vue";
defineProps<{
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}>();
const id = useId();
</script>
<template>
  <div class="ui-field">
    <label :for="id"
      >{{ label }}<span v-if="required" aria-hidden="true"> *</span></label
    ><slot
      :id="id"
      :describedby="error || hint ? id + '-help' : undefined"
      :invalid="!!error"
    /><small
      v-if="error || hint"
      :id="id + '-help'"
      :class="{ 'ui-error': error }"
      >{{ error || hint }}</small
    >
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ default: false });
defineProps<{ label: string; disabled?: boolean }>();
</script>
<template>
  <label class="ui-switch"
    ><input
      type="checkbox"
      role="switch"
      v-model="model"
      :disabled="disabled"
    /><span class="ui-switch-track" aria-hidden="true"><span /></span
    ><span>{{ label }}</span></label
  >
</template>

<script setup lang="ts">
defineProps<{ label?: string }>();
</script>
<template>
  <div class="ui-divider" :role="label ? undefined : 'separator'">
    <span v-if="label">{{ label }}</span>
  </div>
</template>

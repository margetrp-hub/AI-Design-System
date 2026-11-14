<script setup lang="ts">
defineProps<{ title: string; description: string }>();
</script>
<template>
  <div class="ui-empty">
    <strong>{{ title }}</strong>
    <p>{{ description }}</p>
    <slot />
  </div>
</template>

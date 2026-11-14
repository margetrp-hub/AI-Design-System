<script setup lang="ts">
withDefaults(defineProps<{ lines?: number; avatar?: boolean }>(), { lines: 3 });
</script>
<template>
  <div class="ui-skeleton-group" aria-hidden="true">
    <span v-if="avatar" class="ui-skeleton ui-skeleton-avatar" />
    <div class="ui-skeleton-lines">
      <span v-for="i in lines" :key="i" class="ui-skeleton" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryColor } from "@ai-design-system/tokens";
defineProps<{ title?: string; description?: string; color?: CategoryColor }>();
</script>
<template>
  <section class="ui-panel" :data-ui-color="color">
    <header v-if="title || $slots.actions" class="ui-panel-header">
      <div>
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="ui-actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="ui-panel-body"><slot /></div>
  </section>
</template>

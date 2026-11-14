<script setup lang="ts">
import type { CategoryColor } from "@ai-design-system/tokens";
withDefaults(
  defineProps<{
    tone?: "neutral" | "accent" | "info" | "success" | "warning" | "danger";
    color?: CategoryColor;
  }>(),
  { tone: "neutral" },
);
</script>
<template>
  <span
    class="ui-badge"
    :data-tone="tone"
    :data-ui-color="tone === 'neutral' ? color : undefined"
    ><slot
  /></span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    tone?: "neutral" | "info" | "success" | "warning" | "danger";
    live?: boolean;
  }>(),
  { tone: "neutral" },
);
</script>
<template>
  <div
    class="ui-alert"
    :data-tone="tone"
    :role="live ? (tone === 'danger' ? 'alert' : 'status') : undefined"
  >
    <span class="ui-alert-marker" aria-hidden="true">{{
      tone === "success"
        ? "✓"
        : tone === "neutral" || tone === "info"
          ? "i"
          : "!"
    }}</span>
    <div class="ui-alert-copy">
      <strong>{{ title }}</strong>
      <p v-if="description">{{ description }}</p>
      <slot />
    </div>
    <div v-if="$slots.action" class="ui-alert-action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md";
    loading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
  }>(),
  { variant: "secondary", size: "md", type: "button" },
);
</script>
<template>
  <button
    class="ui-button"
    :data-variant="variant"
    :data-size="size"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="ui-spinner" aria-hidden="true" /><slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ visualSide?: "left" | "right"; label?: string }>(), {
  visualSide: "left",
  label: "双栏入口",
});
</script>
<template>
  <section class="ui-auth-layout" :data-side="visualSide" :aria-label="label">
    <div class="ui-auth-layout-grid">
      <div class="ui-auth-visual"><slot name="visual" /></div>
      <div class="ui-auth-form">
        <slot />
        <footer v-if="$slots.footer"><slot name="footer" /></footer>
      </div>
    </div>
  </section>
</template>

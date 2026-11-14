<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: "创作工作室" });
</script>
<template>
  <section class="ui-studio-workbench" :aria-label="title">
    <header>
      <slot name="header"
        ><strong>{{ title }}</strong></slot
      >
    </header>
    <div class="studio-workbench-body">
      <div class="studio-workbench-main"><slot /></div>
      <aside v-if="$slots.inspector"><slot name="inspector" /></aside>
    </div>
    <footer v-if="$slots.footer"><slot name="footer" /></footer>
  </section>
</template>

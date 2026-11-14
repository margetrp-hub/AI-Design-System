<script setup lang="ts">
defineProps<{ caption: string }>();
</script>
<template>
  <div class="ui-table-scroll" tabindex="0" role="region" :aria-label="caption">
    <table class="ui-table">
      <caption class="ui-sr-only">
        {{
          caption
        }}
      </caption>
      <thead>
        <slot name="head" />
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

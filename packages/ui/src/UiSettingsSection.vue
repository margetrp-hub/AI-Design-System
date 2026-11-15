<script setup lang="ts">
import { useId } from "vue";
defineProps<{ title: string; description?: string }>();
const id = useId();
</script>
<template>
  <section class="ui-settings-section" :aria-labelledby="id">
    <div class="ui-settings-section-heading">
      <h3 :id="id">{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
    </div>
    <div class="ui-settings-section-fields"><slot /></div>
  </section>
</template>

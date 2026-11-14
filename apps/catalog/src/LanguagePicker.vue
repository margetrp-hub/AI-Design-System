<script setup lang="ts">
import {
  UiButton,
  compositionChoices,
  type DesignStyle,
} from "@ai-design-system/ui";
const value = defineModel<DesignStyle>({ default: "base" });
const emit = defineEmits<{ studio: [] }>();
</script>
<template>
  <div class="language-picker" role="group" aria-label="视觉语言">
    <span class="language-picker-label">视觉语言</span>
    <div class="language-picker-options">
      <UiButton
        v-for="[id, label] in compositionChoices.design"
        :key="id"
        size="sm"
        :variant="value === id ? 'primary' : 'secondary'"
        :aria-pressed="value === id"
        @click="value = id"
        >{{ label }}</UiButton
      ><UiButton size="sm" variant="secondary" @click="emit('studio')"
        >栖间 · 空间极简</UiButton
      >
    </div>
  </div>
</template>

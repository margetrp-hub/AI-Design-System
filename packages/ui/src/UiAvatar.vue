<script setup lang="ts">
import { AvatarRoot, AvatarImage, AvatarFallback } from "reka-ui";
import type { CategoryColor } from "@ai-design-system/tokens";
withDefaults(
  defineProps<{
    name: string;
    src?: string;
    size?: "sm" | "md" | "lg";
    color?: CategoryColor;
  }>(),
  { size: "md" },
);
</script>
<template>
  <AvatarRoot class="ui-avatar" :data-size="size" :data-ui-color="color"
    ><AvatarImage
      v-if="src"
      :src="src"
      :alt="name"
      class="ui-avatar-image"
    /><AvatarFallback :aria-label="name" role="img">{{
      Array.from(name.trim()).slice(0, 2).join("") || "?"
    }}</AvatarFallback></AvatarRoot
  >
</template>

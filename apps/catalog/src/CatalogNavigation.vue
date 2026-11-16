<script setup lang="ts">
import type { Component } from "vue";
import { groups, navigationSections } from "./library";
defineProps<{
  active: string;
  icons: Record<string, Component>;
  colors: Record<string, string>;
}>();
defineEmits<{ navigate: [] }>();
</script>
<template>
  <nav class="catalog-navigation" aria-label="组件库导航">
    <div
      v-for="section in navigationSections"
      :key="section.label"
      class="catalog-nav-group"
    >
      <span>{{ section.label }}</span>
      <a
        v-for="group in section.ids.map((id) =>
          groups.find((item) => item.id === id)!,
        )"
        :key="group.id"
        :href="'#' + group.id"
        :aria-current="active === group.id ? 'page' : undefined"
        @click="$emit('navigate')"
      >
        <component
          :is="icons[group.id]"
          :data-ui-color="colors[group.id]"
          aria-hidden="true"
        /><span>{{ group.label }}</span
        ><small v-if="group.count">{{ group.count }}</small>
      </a>
    </div>
  </nav>
</template>

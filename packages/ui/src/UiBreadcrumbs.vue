<script setup lang="ts">
defineProps<{
  items: ReadonlyArray<{ label: string; href?: string }>;
  label?: string;
}>();
</script>
<template>
  <nav :aria-label="label || '当前位置'" class="ui-breadcrumbs">
    <ol>
      <li v-for="(item, index) in items" :key="index">
        <span v-if="index" aria-hidden="true" class="ui-breadcrumb-separator"
          >/</span
        ><a v-if="item.href && index < items.length - 1" :href="item.href">{{
          item.label
        }}</a
        ><span
          v-else
          :aria-current="index === items.length - 1 ? 'page' : undefined"
          >{{ item.label }}</span
        >
      </li>
    </ol>
  </nav>
</template>

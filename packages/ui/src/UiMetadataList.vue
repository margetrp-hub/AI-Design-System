<script setup lang="ts">
export interface MetadataItem {
  id: string;
  label: string;
  value: string | number | null | undefined;
}
withDefaults(
  defineProps<{
    items: ReadonlyArray<MetadataItem>;
    label: string;
    emptyText?: string;
  }>(),
  { emptyText: "未提供" },
);
</script>
<template>
  <dl class="ui-metadata-list" :aria-label="label">
    <div v-for="item in items" :key="item.id">
      <dt>{{ item.label }}</dt>
      <dd>
        <slot :name="item.id" :item="item">{{
          item.value === null || item.value === undefined || item.value === ""
            ? emptyText
            : item.value
        }}</slot>
      </dd>
    </div>
  </dl>
</template>

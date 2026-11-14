<script setup lang="ts">
import { useId } from "vue";
withDefaults(defineProps<{ title: string; label?: string }>(), {
  label: "设计札记",
});
const open = defineModel<boolean>("open", { default: false });
const id = useId();
</script>
<template>
  <article class="ui-folded-note" :data-open="open">
    <small>{{ label }}</small>
    <h3>{{ title }}</h3>
    <div class="ui-folded-summary"><slot /></div>
    <button
      type="button"
      :aria-expanded="open"
      :aria-controls="id"
      @click="open = !open"
    >
      {{ open ? "收起细节" : "展开细节" }}<span aria-hidden="true">↗</span>
    </button>
    <div :id="id" v-show="open" class="ui-folded-detail">
      <slot name="detail" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  ListboxRoot,
  ListboxFilter,
  ListboxContent,
  ListboxItem,
} from "reka-ui";
import UiDialog from "./UiDialog.vue";
import type { UiMenuItem } from "./types";
const open = defineModel<boolean>("open", { default: false });
const props = withDefaults(
  defineProps<{
    items: ReadonlyArray<UiMenuItem>;
    title?: string;
    description?: string;
  }>(),
  {
    title: "快捷命令",
    description: "搜索并执行一个操作，使用方向键与 Enter 选择。",
  },
);
const emit = defineEmits<{ select: [id: string] }>();
const query = ref("");
const results = computed(() =>
  props.items.filter((item) =>
    item.label
      .toLocaleLowerCase()
      .includes(query.value.trim().toLocaleLowerCase()),
  ),
);
watch(open, (value) => {
  if (value) query.value = "";
});
function select(value: unknown) {
  if (
    typeof value !== "string" ||
    !props.items.some((item) => item.id === value && !item.disabled)
  )
    return;
  open.value = false;
  emit("select", value);
}
</script>
<template>
  <UiDialog v-model:open="open" :title="title" :description="description"
    ><template v-if="$slots.trigger" #trigger><slot name="trigger" /></template
    ><ListboxRoot
      :model-value="undefined"
      highlight-on-hover
      @update:model-value="select"
      ><ListboxFilter
        v-model="query"
        class="ui-input"
        aria-label="搜索命令"
        placeholder="搜索命令…"
      /><ListboxContent class="ui-command-list" aria-label="命令结果"
        ><ListboxItem
          v-for="item in results"
          :key="item.id"
          :value="item.id"
          :disabled="item.disabled"
          class="ui-menu-item"
          :data-danger="item.danger || undefined"
          ><span>{{ item.label }}</span
          ><kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></ListboxItem
        ></ListboxContent
      >
      <p v-if="!results.length" class="ui-menu-message" role="status">
        没有匹配的命令
      </p></ListboxRoot
    ></UiDialog
  >
</template>

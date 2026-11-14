<script setup lang="ts">
import { ref, useId, watch } from "vue";
import {
  TagsInputRoot,
  TagsInputItem,
  TagsInputItemText,
  TagsInputItemDelete,
  TagsInputInput,
} from "reka-ui";
const model = defineModel<string[]>({ default: () => [] });
withDefaults(
  defineProps<{
    label: string;
    placeholder?: string;
    max?: number;
    disabled?: boolean;
    name?: string;
  }>(),
  { placeholder: "输入后按 Enter", max: 8 },
);
const id = useId(),
  invalid = ref(false);
watch(
  model,
  () => {
    invalid.value = false;
  },
  { deep: true },
);
</script>
<template>
  <div class="ui-field">
    <label :for="id">{{ label }}</label
    ><TagsInputRoot
      v-model="model"
      :name="name"
      :max="max"
      :disabled="disabled"
      :duplicate="false"
      add-on-paste
      class="ui-tags"
      @invalid="invalid = true"
      @add-tag="invalid = false"
      ><TagsInputItem
        v-for="tag in model"
        :key="tag"
        :value="tag"
        class="ui-tag"
        ><TagsInputItemText /><TagsInputItemDelete
          aria-labelledby=""
          :aria-label="'删除标签 ' + tag"
          class="ui-tag-delete"
          >×</TagsInputItemDelete
        ></TagsInputItem
      ><TagsInputInput
        :id="id"
        :placeholder="placeholder"
        :aria-describedby="id + '-hint'"
        class="ui-tags-editor"
        @input="invalid = false" /></TagsInputRoot
    ><small
      :id="id + '-hint'"
      :class="{ 'ui-error': invalid }"
      :role="invalid ? 'alert' : undefined"
      >{{
        invalid
          ? "标签重复或已达数量上限，请修改后重试。"
          : "Enter 添加，逗号分隔；空输入时可用方向键和 Backspace 删除标签。"
      }}</small
    >
  </div>
</template>

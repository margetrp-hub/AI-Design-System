<script setup lang="ts">
import { ref, useId } from "vue";
import UiButton from "./UiButton.vue";
import { fileKey, validateFileBatch } from "./files";
const model = defineModel<File[]>({ default: () => [] });
const props = withDefaults(
  defineProps<{
    label: string;
    accept?: string;
    maxBytes?: number;
    maxFiles?: number;
    multiple?: boolean;
    disabled?: boolean;
  }>(),
  { accept: "", maxBytes: 10 * 1024 * 1024, maxFiles: 5, multiple: true },
);
const emit = defineEmits<{ reject: [errors: string[]] }>();
const input = ref<HTMLInputElement | null>(null),
  errors = ref<string[]>([]),
  dragDepth = ref(0),
  id = useId();
function add(files: File[]) {
  if (props.disabled || !files.length) return;
  const result = validateFileBatch(model.value, files, props);
  errors.value = result.errors;
  if (result.errors.length) emit("reject", result.errors);
  else model.value = result.files;
}
function pick(event: Event) {
  const element = event.target as HTMLInputElement;
  add(Array.from(element.files || []));
  element.value = "";
}
function drop(event: DragEvent) {
  dragDepth.value = 0;
  add(Array.from(event.dataTransfer?.files || []));
}
</script>
<template>
  <div
    class="ui-field"
    role="group"
    :aria-labelledby="id"
    :aria-describedby="id + '-status'"
  >
    <span :id="id">{{ label }}</span>
    <div
      class="ui-file-drop"
      :data-dragging="(dragDepth > 0 && !disabled) || undefined"
      :data-disabled="disabled || undefined"
      @dragenter.prevent="dragDepth++"
      @dragleave.prevent="dragDepth = Math.max(0, dragDepth - 1)"
      @dragover.prevent
      @drop.prevent="drop"
    >
      <input
        ref="input"
        type="file"
        class="ui-sr-only"
        tabindex="-1"
        :aria-labelledby="id"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="pick"
      /><strong>拖入文件，或点击选择</strong>
      <p>
        最多 {{ multiple ? maxFiles : 1 }} 个 · 每个不超过
        {{ Math.round((maxBytes / 1024 / 1024) * 10) / 10 }} MB
      </p>
      <UiButton :disabled="disabled" @click="input?.click()">选择文件</UiButton>
    </div>
    <ul v-if="model.length" class="ui-file-list">
      <li v-for="file in model" :key="fileKey(file)">
        <span class="ui-file-name" :title="file.name">{{ file.name }}</span
        ><span class="ui-file-size">{{ (file.size / 1024).toFixed(1) }} KB</span
        ><UiButton
          size="sm"
          variant="ghost"
          :disabled="disabled"
          :aria-label="'移除文件 ' + file.name"
          @click="
            model = model.filter((item) => item !== file);
            errors = [];
          "
          >×</UiButton
        >
      </li>
    </ul>
    <div
      v-if="errors.length"
      :id="id + '-status'"
      class="ui-error"
      role="alert"
    >
      <p v-for="error in errors" :key="error">{{ error }}</p>
      <small>原选择已保留，请重新选择文件。</small>
    </div>
    <small v-else :id="id + '-status'">{{
      model.length ? "已选择 " + model.length + " 个文件" : "尚未选择文件"
    }}</small>
  </div>
</template>

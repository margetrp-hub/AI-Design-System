<script setup lang="ts">
import { ref, useId } from "vue";
const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    context?: string;
    busy?: boolean;
    disabled?: boolean;
    suggestions?: string[];
  }>(),
  {
    label: "向助手提问",
    placeholder: "描述你想完成的事…",
    busy: false,
    disabled: false,
    suggestions: () => [],
  },
);
const value = defineModel<string>({ default: "" }),
  emit = defineEmits<{ submit: [text: string]; stop: [] }>(),
  composing = ref(false),
  id = useId();
function submit() {
  if (!composing.value && !props.busy && !props.disabled && value.value.trim())
    emit("submit", value.value.trim());
}
function keydown(event: KeyboardEvent) {
  if (
    event.key === "Enter" &&
    !event.shiftKey &&
    !event.isComposing &&
    !composing.value &&
    event.keyCode !== 229
  ) {
    event.preventDefault();
    submit();
  }
}
</script>
<template>
  <div class="ui-ai-composer">
    <div
      v-if="suggestions.length"
      class="ui-ai-suggestions"
      aria-label="可选提示词"
    >
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        type="button"
        :disabled="disabled || busy"
        @click="value = suggestion"
      >
        {{ suggestion }} <span aria-hidden="true">↗</span>
      </button>
    </div>
    <form class="ui-ai-input-surface" @submit.prevent="submit">
      <div v-if="context || $slots.context" class="ui-ai-context">
        <span aria-hidden="true">▤</span
        ><slot name="context">{{ context }}</slot>
      </div>
      <label class="ui-sr-only" :for="id">{{ label }}</label
      ><textarea
        :id="id"
        v-model="value"
        :placeholder="placeholder"
        :disabled="disabled"
        rows="3"
        @compositionstart="composing = true"
        @compositionend="composing = false"
        @keydown="keydown"
      />
      <div v-if="$slots.attachments" class="ui-ai-attachments">
        <slot name="attachments" />
      </div>
      <div class="ui-ai-input-footer">
        <div>
          <slot name="tools"
            ><span class="ui-ai-mark" aria-hidden="true">✳</span
            ><small>Shift + Enter 换行</small></slot
          >
        </div>
        <button
          v-if="busy"
          type="button"
          class="ui-ai-send"
          aria-label="停止生成"
          @click="emit('stop')"
        >
          ■</button
        ><button
          v-else
          type="submit"
          class="ui-ai-send"
          :disabled="disabled || !value.trim()"
          aria-label="发送消息"
        >
          ↑
        </button>
      </div>
    </form>
  </div>
</template>

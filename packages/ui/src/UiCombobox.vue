<script setup lang="ts">
import { computed, ref, useId } from "vue";
import {
  ComboboxRoot,
  ComboboxAnchor,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxPortal,
  ComboboxContent,
  ComboboxViewport,
  ComboboxItem,
  ComboboxItemIndicator,
} from "reka-ui";
import { themeAttrs, useUiTheme } from "./theme";
import type { UiOption } from "./types";
import UiButton from "./UiButton.vue";
const model = defineModel<string>({ default: "" });
const props = withDefaults(
  defineProps<{
    label: string;
    options: ReadonlyArray<UiOption>;
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    error?: string;
    remote?: boolean;
    name?: string;
  }>(),
  { placeholder: "搜索或选择…" },
);
const emit = defineEmits<{ search: [query: string]; retry: [] }>();
const theme = useUiTheme(),
  id = useId(),
  query = ref(""),
  composing = ref(false);
const filtered = computed(() =>
  props.remote
    ? props.options
    : props.options.filter((o) =>
        (o.label + " " + (o.description || ""))
          .toLocaleLowerCase()
          .includes(query.value.toLocaleLowerCase()),
      ),
);
function search(event: Event) {
  if (composing.value || (event as InputEvent).isComposing) return;
  const value = (event.target as HTMLInputElement).value;
  query.value = value;
  emit("search", value);
}
function display(value: unknown) {
  return (
    props.options.find((o) => o.value === value)?.label ?? String(value || "")
  );
}
</script>
<template>
  <div class="ui-field">
    <label :for="id">{{ label }}</label
    ><ComboboxRoot
      v-model="model"
      :disabled="disabled"
      :name="name"
      :ignore-filter="true"
      @update:open="
        (value) => {
          if (!value) query = '';
        }
      "
      ><ComboboxAnchor class="ui-combobox-anchor"
        ><ComboboxInput
          :id="id"
          class="ui-input"
          :display-value="display"
          :placeholder="placeholder"
          :aria-invalid="!!error"
          :aria-describedby="error ? id + '-error' : undefined"
          @input="search"
          @compositionstart="composing = true"
          @compositionend="
            composing = false;
            search($event);
          "
        /><ComboboxTrigger
          class="ui-combobox-trigger"
          :aria-label="'展开' + label"
          ><span aria-hidden="true">⌄</span></ComboboxTrigger
        ></ComboboxAnchor
      ><ComboboxPortal
        ><ComboboxContent
          class="ui-theme ui-menu ui-combobox-menu"
          v-bind="themeAttrs(theme)"
          position="popper"
          :side-offset="6"
          :collision-padding="12"
          ><ComboboxViewport
            ><p v-if="loading" class="ui-menu-message" role="status">
              正在加载…
            </p>
            <p v-if="error" class="ui-menu-message">
              选项加载失败，请在字段下方重试。
            </p>
            <p
              v-if="!loading && !error && !filtered.length"
              class="ui-menu-message"
              role="status"
            >
              没有匹配的选项
            </p>
            <ComboboxItem
              v-for="option in filtered"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled || loading || !!error"
              class="ui-menu-item"
              ><span
                >{{ option.label
                }}<small v-if="option.description">{{
                  option.description
                }}</small></span
              ><ComboboxItemIndicator aria-hidden="true"
                >✓</ComboboxItemIndicator
              ></ComboboxItem
            ></ComboboxViewport
          ></ComboboxContent
        ></ComboboxPortal
      ></ComboboxRoot
    >
    <div
      v-if="error"
      :id="id + '-error'"
      class="ui-actions ui-error"
      role="alert"
    >
      <small class="ui-error">{{ error }}</small
      ><UiButton size="sm" @click="emit('retry')">重试</UiButton>
    </div>
  </div>
</template>

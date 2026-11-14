<script setup lang="ts">
import { provide, ref } from "vue";
import {
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "reka-ui";
import { themeAttrs, useUiTheme } from "./theme";
import { toastKey, type ToastOptions, type ToastApi } from "./toast";
withDefaults(defineProps<{ duration?: number; label?: string }>(), {
  duration: 5000,
  label: "通知",
});
const theme = useUiTheme();
const items = ref<Array<ToastOptions & { id: string }>>([]);
let sequence = 0;
const api: ToastApi = {
  notify(options) {
    const id = "toast-" + ++sequence;
    items.value.push({ ...options, id });
    return id;
  },
  dismiss(id) {
    items.value = items.value.filter((item) => item.id !== id);
  },
  clear() {
    items.value = [];
  },
};
provide(toastKey, api);
defineExpose(api);
</script>
<template>
  <ToastProvider :duration="duration" :label="label" swipe-direction="right"
    ><slot
      :notify="api.notify"
      :dismiss="api.dismiss"
      :clear="api.clear" /><Teleport to="body"
      ><div class="ui-theme ui-portal" v-bind="themeAttrs(theme)">
        <ToastRoot
          v-for="item in items"
          :key="item.id"
          class="ui-toast"
          :data-tone="item.tone || 'neutral'"
          :duration="item.duration"
          @update:open="
            (open) => {
              if (!open) api.dismiss(item.id);
            }
          "
          ><div>
            <ToastTitle class="ui-toast-title">{{ item.title }}</ToastTitle
            ><ToastDescription
              v-if="item.description"
              class="ui-toast-description"
              >{{ item.description }}</ToastDescription
            >
          </div>
          <ToastClose class="ui-toast-close" aria-label="关闭通知"
            >×</ToastClose
          ></ToastRoot
        ><ToastViewport
          class="ui-toast-viewport"
          :label="label + ' ({hotkey})'"
        /></div></Teleport
  ></ToastProvider>
</template>

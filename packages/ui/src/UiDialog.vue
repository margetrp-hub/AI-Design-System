<script setup lang="ts">
import { computed, watch } from "vue";
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "reka-ui";
import { themeAttrs, useUiTheme } from "./theme";
import UiButton from "./UiButton.vue";
const open = defineModel<boolean>("open", { default: false });
const props = defineProps<{
  title: string;
  description: string;
  preventClose?: boolean;
  returnFocus?: HTMLElement | null;
  placement?: "center" | "right" | "bottom";
}>();
const emit = defineEmits<{ closeRequest: [] }>();
const theme = useUiTheme();
const attrs = computed(() => themeAttrs(theme?.value));
let opener: HTMLElement | null = null;
watch(
  open,
  (value) => {
    if (value && typeof document !== "undefined")
      opener = document.activeElement as HTMLElement | null;
  },
  { flush: "sync" },
);
function setOpen(value: boolean) {
  if (!value && props.preventClose) {
    emit("closeRequest");
    return;
  }
  open.value = value;
}
function restoreFocus(event: Event) {
  const target = props.returnFocus ?? opener;
  if (target?.isConnected) {
    event.preventDefault();
    target.focus();
  }
}
</script>
<template>
  <DialogRoot :open="open" @update:open="setOpen">
    <DialogTrigger v-if="$slots.trigger" as-child
      ><slot name="trigger"
    /></DialogTrigger>
    <DialogPortal>
      <div class="ui-theme ui-portal" v-bind="attrs">
        <DialogOverlay class="ui-overlay" />
        <DialogContent
          class="ui-dialog"
          :data-placement="placement || 'center'"
          @close-auto-focus="restoreFocus"
        >
          <div class="ui-dialog-heading">
            <div>
              <DialogTitle class="ui-dialog-title">{{ title }}</DialogTitle
              ><DialogDescription class="ui-dialog-description">{{
                description
              }}</DialogDescription>
            </div>
            <DialogClose as-child
              ><UiButton variant="ghost" aria-label="关闭对话框"
                >×</UiButton
              ></DialogClose
            >
          </div>
          <slot />
          <div v-if="$slots.footer" class="ui-dialog-footer">
            <slot name="footer" />
          </div>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>

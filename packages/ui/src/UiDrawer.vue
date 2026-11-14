<script setup lang="ts">
import UiDialog from "./UiDialog.vue";
const open = defineModel<boolean>("open", { default: false });
withDefaults(
  defineProps<{
    title: string;
    description: string;
    side?: "right" | "bottom";
    preventClose?: boolean;
    returnFocus?: HTMLElement | null;
  }>(),
  { side: "right" },
);
const emit = defineEmits<{ closeRequest: [] }>();
</script>
<template>
  <UiDialog
    v-model:open="open"
    :title="title"
    :description="description"
    :placement="side"
    :prevent-close="preventClose"
    :return-focus="returnFocus"
    @close-request="emit('closeRequest')"
    ><template v-if="$slots.trigger" #trigger><slot name="trigger" /></template
    ><slot /><template v-if="$slots.footer" #footer
      ><slot name="footer" /></template
  ></UiDialog>
</template>

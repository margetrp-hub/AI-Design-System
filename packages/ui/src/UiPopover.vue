<script setup lang="ts">
import { useId } from "vue";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverClose,
} from "reka-ui";
import { themeAttrs, useUiTheme } from "./theme";
const open = defineModel<boolean>("open", { default: false });
withDefaults(
  defineProps<{
    label: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
  }>(),
  { side: "bottom", align: "start" },
);
const theme = useUiTheme();
const titleId = useId();
</script>
<template>
  <PopoverRoot v-model:open="open"
    ><PopoverTrigger as-child><slot name="trigger" /></PopoverTrigger
    ><PopoverPortal
      ><PopoverContent
        as-child
        :side="side"
        :align="align"
        :side-offset="8"
        :collision-padding="12"
        ><div
          class="ui-theme ui-popover"
          v-bind="themeAttrs(theme)"
          :aria-labelledby="titleId"
        >
          <span :id="titleId" class="ui-sr-only">{{ label }}</span
          ><slot :close="() => (open = false)" /><PopoverClose
            v-if="$slots.close"
            as-child
            ><slot name="close"
          /></PopoverClose></div></PopoverContent></PopoverPortal
  ></PopoverRoot>
</template>

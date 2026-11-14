<script setup lang="ts">
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
} from "reka-ui";
import { themeAttrs, useUiTheme } from "./theme";
withDefaults(
  defineProps<{
    text: string;
    side?: "top" | "right" | "bottom" | "left";
    delay?: number;
  }>(),
  { side: "top", delay: 350 },
);
const theme = useUiTheme();
</script>
<template>
  <TooltipProvider :delay-duration="delay"
    ><TooltipRoot
      ><TooltipTrigger as-child><slot /></TooltipTrigger
      ><TooltipPortal
        ><TooltipContent
          class="ui-theme ui-tooltip"
          v-bind="themeAttrs(theme)"
          :side="side"
          :side-offset="7"
          :collision-padding="12"
          >{{ text }}</TooltipContent
        ></TooltipPortal
      ></TooltipRoot
    ></TooltipProvider
  >
</template>

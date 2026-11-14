<script setup lang="ts">
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "reka-ui";
import { themeAttrs, useUiTheme } from "./theme";
import type { UiMenuItem } from "./types";
defineProps<{ items: ReadonlyArray<UiMenuItem>; label?: string }>();
const emit = defineEmits<{ select: [id: string] }>();
const theme = useUiTheme();
</script>
<template>
  <DropdownMenuRoot
    ><DropdownMenuTrigger as-child><slot /></DropdownMenuTrigger
    ><DropdownMenuPortal
      ><DropdownMenuContent
        class="ui-theme ui-menu"
        v-bind="themeAttrs(theme)"
        :side-offset="6"
        :collision-padding="12"
        align="end"
        ><DropdownMenuLabel v-if="label" class="ui-menu-label">{{
          label
        }}</DropdownMenuLabel
        ><template v-for="item in items" :key="item.id"
          ><DropdownMenuSeparator
            v-if="item.separator"
            class="ui-separator"
          /><DropdownMenuItem
            class="ui-menu-item"
            :data-danger="item.danger || undefined"
            :disabled="item.disabled"
            @select="emit('select', item.id)"
            ><span>{{ item.label }}</span
            ><kbd v-if="item.shortcut">{{
              item.shortcut
            }}</kbd></DropdownMenuItem
          ></template
        ></DropdownMenuContent
      ></DropdownMenuPortal
    ></DropdownMenuRoot
  >
</template>

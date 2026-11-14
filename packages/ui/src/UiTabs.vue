<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";
import type { UiTab } from "./types";
const model = defineModel<string>();
withDefaults(
  defineProps<{
    items: ReadonlyArray<UiTab>;
    label: string;
    variant?: "line" | "segment";
    activationMode?: "automatic" | "manual";
  }>(),
  { variant: "line", activationMode: "automatic" },
);
</script>
<template>
  <TabsRoot
    v-model="model"
    :default-value="items[0]?.value"
    :activation-mode="activationMode"
    class="ui-tabs"
    :data-variant="variant"
    ><TabsList class="ui-tabs-list" :aria-label="label"
      ><TabsTrigger
        v-for="item in items"
        :key="item.value"
        class="ui-tab"
        :value="item.value"
        :disabled="item.disabled"
        >{{ item.label }}</TabsTrigger
      ></TabsList
    ><TabsContent
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      class="ui-tab-content"
      ><slot :name="item.value" :value="item.value"
        ><slot :value="item.value" /></slot></TabsContent
  ></TabsRoot>
</template>

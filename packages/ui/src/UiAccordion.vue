<script setup lang="ts">
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "reka-ui";
import type { UiAccordionItem } from "./types";
const model = defineModel<string[]>({ default: () => [] });
defineProps<{ items: ReadonlyArray<UiAccordionItem> }>();
</script>
<template>
  <AccordionRoot v-model="model" type="multiple" class="ui-accordion"
    ><AccordionItem
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      :disabled="item.disabled"
      class="ui-accordion-item"
      ><AccordionHeader class="ui-accordion-header"
        ><AccordionTrigger class="ui-accordion-trigger"
          >{{ item.title
          }}<span aria-hidden="true" class="ui-chevron"
            >⌄</span
          ></AccordionTrigger
        ></AccordionHeader
      ><AccordionContent class="ui-accordion-content"
        ><div>
          <slot :name="item.value" :item="item">{{ item.description }}</slot>
        </div></AccordionContent
      ></AccordionItem
    ></AccordionRoot
  >
</template>

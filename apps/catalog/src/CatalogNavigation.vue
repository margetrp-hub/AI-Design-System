<script setup lang="ts">
import { ref, useId, watch, type Component } from "vue";
import { ChevronDown } from "@lucide/vue";
import { groups, navigationSections } from "./library";
const props = defineProps<{
  active: string;
  icons: Record<string, Component>;
  colors: Record<string, string>;
}>();
defineEmits<{ navigate: [] }>();
const install = groups.find((group) => group.id === "install")!;
const navId = useId();
const expanded = ref(
  new Set([
    navigationSections.find((section) => section.ids.includes(props.active))
      ?.label || "通用组件",
  ]),
);
watch(
  () => props.active,
  (active) => {
    const label = navigationSections.find((section) =>
      section.ids.includes(active),
    )?.label;
    if (label) expanded.value.add(label);
  },
);
function toggle(label: string) {
  if (expanded.value.has(label)) expanded.value.delete(label);
  else expanded.value.add(label);
}
</script>
<template>
  <nav class="catalog-navigation" aria-label="组件库导航">
    <div class="catalog-nav-scroll">
      <div
        v-for="(section, index) in navigationSections"
        :key="section.label || 'entry'"
        class="catalog-nav-group"
        :class="{ 'catalog-nav-entry': !section.label }"
        role="group"
        :aria-label="section.label || '浏览入口'"
      >
        <h2 v-if="section.label">
          <button
            type="button"
            class="catalog-group-toggle"
            :aria-expanded="expanded.has(section.label)"
            :aria-controls="navId + '-' + index"
            :data-active="section.ids.includes(active) || undefined"
            @click="toggle(section.label)"
          >
            <span>{{ section.label }}</span>
            <small
              v-if="
                section.ids.includes(active) && !expanded.has(section.label)
              "
              >当前</small
            >
            <ChevronDown aria-hidden="true" />
          </button>
        </h2>
        <div
          :id="navId + '-' + index"
          v-show="!section.label || expanded.has(section.label)"
          class="catalog-nav-links"
        >
          <a
            v-for="group in section.ids.map((id) =>
              groups.find((item) => item.id === id)!,
            )"
            :key="group.id"
            :href="'#' + group.id"
            :aria-current="active === group.id ? 'page' : undefined"
            @click="$emit('navigate')"
          >
            <component
              :is="icons[group.id]"
              :data-ui-color="colors[group.id]"
              aria-hidden="true"
            /><span>{{ group.label }}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="catalog-nav-footer">
      <a
        :href="'#' + install.id"
        :aria-current="active === install.id ? 'page' : undefined"
        @click="$emit('navigate')"
        ><component :is="icons.install" aria-hidden="true" /><span>{{
          install.label
        }}</span></a
      >
      <p>Vue · React · AI Skill</p>
    </div>
  </nav>
</template>

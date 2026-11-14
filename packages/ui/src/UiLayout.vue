<script setup lang="ts">
import type { LayoutPattern } from './composition'
import UiLens from './UiLens.vue'
import { useUiTheme } from './theme'
const theme=useUiTheme()
withDefaults(defineProps<{pattern?:LayoutPattern;label?:string}>(),{pattern:'sidebar',label:'应用布局'})
</script>
<template>
 <div class="ui-layout-frame"><section class="ui-layout" :data-layout="pattern" :data-language="theme?.design" :data-navigation="!!$slots.navigation" :aria-label="label">
  <header class="ui-layout-header"><UiLens v-if="theme?.material==='liquid'"/><slot name="header" /></header>
  <nav v-if="$slots.navigation" class="ui-layout-navigation" :aria-label="label+'导航'"><UiLens v-if="theme?.material==='liquid'"/><slot name="navigation" /></nav>
  <div class="ui-layout-content" :tabindex="pattern==='conversation'?0:undefined" :aria-label="pattern==='conversation'?label+'内容':undefined"><slot /></div>
  <aside v-if="$slots.aside" class="ui-layout-aside"><slot name="aside" /></aside>
  <footer v-if="$slots.footer" class="ui-layout-footer"><slot name="footer" /></footer>
 </section></div>
</template>

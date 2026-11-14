<script setup lang="ts">
import type { Decoration, Material } from '@ai-design-system/tokens'
import { computed, ref } from 'vue'
import { useUiTheme } from './theme'
import UiLens from './UiLens.vue'
const props=defineProps<{decoration?:Decoration;material?:Material;glassVariant?:'clear'|'regular'}>()
const theme=useUiTheme()
const activeMaterial=computed(()=>props.material??theme?.value.material??'solid')
const activeDecoration=computed(()=>props.decoration??theme?.value.decoration??'none')
const activeGlass=computed(()=>props.glassVariant??theme?.value.glassVariant??'regular')
const light=ref({x:'35%',y:'0%'})
function move(event:PointerEvent){if(activeMaterial.value!=='liquid'||event.pointerType==='touch'||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const box=(event.currentTarget as HTMLElement).getBoundingClientRect();light.value={x:`${(event.clientX-box.left)/box.width*100}%`,y:`${(event.clientY-box.top)/box.height*100}%`}}
</script>
<template><div class="ui-surface" :data-decoration="activeDecoration" :data-material="activeMaterial" :data-ui-glass="activeGlass" :style="{'--ui-light-x':light.x,'--ui-light-y':light.y}" @pointermove="move" @pointerleave="light={x:'35%',y:'0%'}"><UiLens v-if="activeMaterial==='liquid'"/><div class="ui-surface-content"><slot /></div></div></template>

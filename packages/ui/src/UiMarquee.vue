<script setup lang="ts">
import { computed } from 'vue'
import UiButton from './UiButton.vue'
import { useReducedMotion } from './motion-preference'
const props=withDefaults(defineProps<{items:readonly string[];label:string;duration?:number;reverse?:boolean}>(),{duration:24,reverse:false})
const paused=defineModel<boolean>('paused',{default:true})
const reduced=useReducedMotion()
const seconds=computed(()=>Math.min(120,Math.max(8,props.duration)))
</script>
<template><section class="ui-marquee" :aria-label="label" :data-paused="paused||reduced" :data-reduced="reduced" :data-reverse="reverse" :style="{'--ui-marquee-duration':seconds+'s'}"><div class="ui-marquee-window"><div class="ui-marquee-track"><ul><li v-for="(item,i) in items" :key="i">{{item}}</li></ul><ul aria-hidden="true" inert><li v-for="(item,i) in items" :key="i">{{item}}</li></ul></div></div><UiButton size="sm" :disabled="reduced" :aria-pressed="!paused&&!reduced" @click="paused=!paused">{{reduced?'已减少动态':paused?'播放流动内容':'暂停流动内容'}}</UiButton></section></template>

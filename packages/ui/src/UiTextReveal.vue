<script setup lang="ts">
import { computed } from 'vue'
import { useReducedMotion } from './motion-preference'
const props=withDefaults(defineProps<{text:string;effect?:'fade'|'rise'|'blur';by?:'word'|'character'|'line';replay?:number;duration?:number}>(),{effect:'rise',by:'word',replay:0,duration:500})
const reduced=useReducedMotion()
const segments=computed(()=>props.by==='line'?props.text.split('\n'):props.by==='character'?Array.from(props.text):props.text.split(/(\s+)/))
const duration=computed(()=>Math.min(1500,Math.max(0,props.duration)))
</script>
<template><span class="ui-text-reveal" :data-effect="effect" :data-by="by" :data-reduced="reduced"><span class="ui-sr-only">{{text}}</span><span :key="text+replay" aria-hidden="true"><span v-for="(part,index) in segments" :key="index" class="ui-text-segment" :style="{'--ui-reveal-delay':`${Math.min(index*35,500)}ms`,'--ui-reveal-duration':`${duration}ms`}">{{part}}</span></span></span></template>

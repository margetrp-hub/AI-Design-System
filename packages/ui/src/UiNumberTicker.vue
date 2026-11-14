<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useReducedMotion } from './motion-preference'
const props=withDefaults(defineProps<{value:number;duration?:number;decimals?:number;locale?:string;label?:string}>(),{duration:650,decimals:0,locale:'zh-CN'})
const reduced=useReducedMotion(),display=ref(props.value)
let frame=0
const format=(n:number)=>Number.isFinite(n)?new Intl.NumberFormat(props.locale,{minimumFractionDigits:Math.max(0,Math.min(6,props.decimals)),maximumFractionDigits:Math.max(0,Math.min(6,props.decimals))}).format(n):'—'
const target=computed(()=>format(props.value))
watch([()=>props.value,()=>props.duration,reduced],()=>{
 cancelAnimationFrame(frame)
 if(reduced.value||!Number.isFinite(props.value)||!Number.isFinite(display.value)||props.duration<=0){display.value=props.value;return}
 const start=display.value,end=props.value,time=performance.now(),duration=Math.min(2000,props.duration)
 const tick=(now:number)=>{const p=Math.min(1,(now-time)/duration);display.value=start+(end-start)*(1-(1-p)**3);if(p<1)frame=requestAnimationFrame(tick)}
 frame=requestAnimationFrame(tick)
},{flush:'post'})
onUnmounted(()=>cancelAnimationFrame(frame))
</script>
<template><span class="ui-number-ticker" role="img" :aria-label="`${label??''}${target}`"><span aria-hidden="true">{{format(display)}}</span></span></template>

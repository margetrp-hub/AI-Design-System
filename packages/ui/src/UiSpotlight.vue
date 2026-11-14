<script setup lang="ts">
import { ref } from 'vue'
import { useReducedMotion } from './motion-preference'
withDefaults(defineProps<{label?:string;disabled?:boolean}>(),{label:'互动表面'})
const reduced=useReducedMotion(),position=ref({x:'50%',y:'50%'})
function move(e:PointerEvent){if(reduced.value||e.pointerType==='touch')return;const r=(e.currentTarget as HTMLElement).getBoundingClientRect();position.value={x:`${e.clientX-r.left}px`,y:`${e.clientY-r.top}px`}}
</script>
<template><section class="ui-spotlight" :aria-label="label" :data-disabled="disabled||reduced" :style="{'--ui-spot-x':position.x,'--ui-spot-y':position.y}" @pointermove="move"><div><slot/></div></section></template>

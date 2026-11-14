<script setup lang="ts">
// Internal optical layer. Foreground content never enters the displacement filter.
import { ref, useId, watch, onMounted, onUnmounted } from 'vue'
import { useUiTheme } from './theme'
const theme=useUiTheme()
const element=ref<HTMLElement>(),map=ref(''),enabled=ref(false),bounds=ref({width:1,height:1})
const id='ui-lens-'+useId().replace(/[^a-zA-Z0-9_-]/g,'')
let observer:ResizeObserver|undefined
let frame=0
function measure(){
 const el=element.value;if(!el)return
 const {width,height}=el.getBoundingClientRect();if(!width||!height)return
 bounds.value={width,height}
 const ratio=Math.min(1,640/width,400/height),w=Math.max(2,Math.round(width*ratio)),h=Math.max(2,Math.round(height*ratio))
 const radius=Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius)||0,width/2,height/2)*ratio
 const rim=Math.max(1,Math.min(14*ratio,Math.max(radius*.75,4*ratio),w/4,h/4))
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h
 const ctx=canvas.getContext('2d');if(!ctx)return
 const pixels=ctx.createImageData(w,h)
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const px=x+.5-w/2,py=y+.5-h/2,qx=Math.abs(px)-w/2+radius,qy=Math.abs(py)-h/2+radius
  const ox=Math.max(qx,0),oy=Math.max(qy,0),length=Math.hypot(ox,oy)
  const distance=length+Math.min(Math.max(qx,qy),0)-radius
  // A smooth convex bevel: the flat centre is neutral, refraction increases
  // towards the rim. Unlike a sine ring this does not fold back on itself.
  const depth=Math.max(0,Math.min(1,-distance/rim))
  const strength=distance<=0&&distance>-rim?Math.pow(1-depth,2)*.65:0
  const nx=length?ox/length:qx>qy?1:0,ny=length?oy/length:qx>qy?0:1,index=(y*w+x)*4
  pixels.data[index]=Math.round(128-127*nx*Math.sign(px)*strength)
  pixels.data[index+1]=Math.round(128-127*ny*Math.sign(py)*strength)
  pixels.data[index+2]=128;pixels.data[index+3]=255
 }
 ctx.putImageData(pixels,0,0);map.value=canvas.toDataURL()
}
onMounted(()=>{
 // Chromium implements SVG backdrop displacement. Other engines retain CSS glass.
 enabled.value=/Chrome|Chromium|Edg\//.test(navigator.userAgent)
 if(enabled.value){observer=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure)});if(element.value)observer.observe(element.value)}
})
watch(()=>theme?.value.design,()=>{if(enabled.value){cancelAnimationFrame(frame);frame=requestAnimationFrame(measure)}},{flush:'post'})
onUnmounted(()=>{observer?.disconnect();cancelAnimationFrame(frame)})
</script>
<template>
 <span ref="element" aria-hidden="true" class="ui-lens" :data-refraction="enabled&&!!map" :style="enabled&&map?{'--ui-refraction':`url(#${id})`}:undefined">
  <svg v-if="enabled&&map" class="ui-lens-definition" width="0" height="0" focusable="false"><defs><filter :id="id" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="0" y="0" :width="bounds.width" :height="bounds.height" color-interpolation-filters="sRGB"><feImage :href="map" x="0" y="0" :width="bounds.width" :height="bounds.height" preserveAspectRatio="none" result="lens-map"/><feDisplacementMap in="SourceGraphic" in2="lens-map" scale="28" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>
 </span>
</template>

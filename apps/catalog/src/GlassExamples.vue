<script setup lang="ts">
import { ref } from 'vue'
import { UiSurface, UiButton, UiSlider } from '@ai-design-system/ui'
const offset=ref([36]),tab=ref('概览')
</script>
<template>
 <section class="glass-study" aria-label="液态玻璃材质预览">
  <div class="glass-study-heading"><div><strong>看见玻璃后的细节</strong><p>移动底图，观察弧边折射。文字与操作保持清晰。</p></div><UiSlider v-model="offset" label="背景位置" unit="%"/></div>
  <div class="glass-study-scene" :style="{'--glass-position':offset[0]+'%'}">
   <div class="glass-study-art" aria-hidden="true"><span class="glass-art-ring"/><span class="glass-art-orbit"/><span class="glass-art-caption">FORM<br/>&amp; LIGHT</span></div>
   <UiSurface material="liquid" class="glass-study-toolbar"><div class="glass-study-tabs" role="group" aria-label="玻璃导航示例"><UiButton v-for="name in ['概览','作品','动态']" :key="name" :variant="tab===name?'secondary':'ghost'" :aria-pressed="tab===name" @click="tab=name">{{name}}</UiButton></div></UiSurface>
   <UiSurface material="liquid" class="glass-study-caption"><span>正在浏览</span><strong>{{tab}}<small> 光与形状的交叠</small></strong></UiSurface>
  </div>
 </section>
</template>
<style>
.glass-study {margin-bottom:28px;}
.glass-study-heading {display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;padding:6px 4px 16px;}
.glass-study-heading p {margin:6px 0 0;font-size:.82em;color:var(--ui-muted);}
.glass-study-heading .ui-field {width:180px;}
.glass-study-scene {position:relative;overflow:hidden;min-height:340px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:32px 24px;border-radius:28px;background:#b9cbd4;color:#172a36;}
.glass-study-art {position:absolute;inset:-25% -40%;transform:translateX(calc((var(--glass-position) - 50%) * .3));background:radial-gradient(ellipse at 28% 30%,#e6ecdc,transparent 48%),linear-gradient(130deg,#acc4d5 15%,#c4d7e2 36%,#417494 36.2%,#163e59 55%,#d29859 55.2%,#f4dbb4 74%,#c5d7d9 74.2%);}
.glass-art-ring {position:absolute;left:38%;top:4%;width:400px;height:400px;border:48px solid #f0c19c;border-radius:50%;box-shadow:inset 0 2px 3px #fff7,0 25px 45px #193c5c38;}
.glass-art-orbit {position:absolute;left:30%;top:28%;width:500px;height:220px;border:2px solid #f5eee6b0;border-radius:50%;transform:rotate(-25deg);}
.glass-art-caption {position:absolute;left:37%;top:22%;font:700 66px/.98 Georgia,serif;letter-spacing:-.06em;color:#fff8;}
.glass-study .glass-study-toolbar {padding:6px;border-radius:99px;min-height:0;overflow:visible;}
.glass-study-tabs {display:flex;gap:4px;}
.glass-study-tabs .ui-button {min-width:70px;box-shadow:none;border-color:transparent;background:transparent;color:#172a36;}
.glass-study-tabs .ui-button[aria-pressed="true"] {background:#fff8;box-shadow:0 1px 4px #1d354b15;}
.glass-study .glass-study-caption {padding:17px 24px;border-radius:24px;max-width:100%;width:300px;min-height:0;align-self:flex-end;}
.glass-study-caption span {font-size:11px;display:block;margin-bottom:5px;color:inherit;}
.glass-study-caption strong {font-size:19px;}
.glass-study-caption small {font-size:13px;font-weight:400;}
.glass-study-scene .ui-surface {--ui-surface:#f1f5f7;--ui-glass-fill:color-mix(in srgb,#f1f5f7 var(--ui-glass-tint,12%),transparent);}
@media(max-width:600px) {.glass-study-scene {padding:24px 12px;min-height:300px;}.glass-study-heading .ui-field {width:100%;}.glass-study-caption small {display:block;margin-top:5px;}.glass-study-tabs .ui-button {min-width:56px;}}
</style>

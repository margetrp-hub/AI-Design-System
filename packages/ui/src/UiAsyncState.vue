<script setup lang="ts">
import UiButton from './UiButton.vue'
import UiProgress from './UiProgress.vue'
import UiSkeleton from './UiSkeleton.vue'
withDefaults(defineProps<{status:'idle'|'pending'|'refreshing'|'success'|'error'|'cancelled';label:string;message?:string;progress?:number;retainContent?:boolean;cancellable?:boolean}>(),{retainContent:false,cancellable:false})
defineEmits<{retry:[];cancel:[]}>()
</script>
<template><section class="ui-async-state" :aria-label="label" :aria-busy="status==='pending'||status==='refreshing'">
 <div v-if="status!=='idle'" class="ui-async-status"><p role="status">{{message||(status==='pending'?'正在加载…':status==='refreshing'?'正在更新，保留已有内容…':status==='error'?'加载未完成，可重试。':status==='cancelled'?'已取消，可重新开始。':'内容已更新。')}}</p><UiButton v-if="['pending','refreshing'].includes(status)&&cancellable" @click="$emit('cancel')">取消等待</UiButton><UiButton v-if="status==='error'||status==='cancelled'" @click="$emit('retry')">重试加载</UiButton></div>
 <UiProgress v-if="status==='pending'||status==='refreshing'" :label="label+'进度'" :value="progress"/>
 <slot v-if="retainContent||status==='success'||status==='idle'"/>
 <slot v-else-if="status==='pending'" name="loading"><UiSkeleton :lines="3"/></slot>
 <slot v-if="status==='error'" name="error"/>
 </section></template>

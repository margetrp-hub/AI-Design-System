<script setup lang="ts">
import { computed, ref } from 'vue'
import { UiPanel, UiBadge, UiButton, UiInput, UiTable, UiDialog, UiSwitch, UiEmptyState } from '@ai-design-system/ui'
import { ArrowUpRight, ArrowRight, Search, Copy, Check } from '@lucide/vue'
defineProps<{kind:'list'|'workbench'|'settings'}>()
const query=ref(''), selected=ref('a'), detail=ref(false), detailTrigger=ref<HTMLElement|null>(null), displayName=ref('我的工作空间'), email=ref(''), alerts=ref(true), copied=ref('')
const records=[
  {id:'a',name:'共享组件接口',owner:'基础组件',status:'已整理',tone:'success',date:'11月13日',description:'统一按钮、输入、表格表面与弹层接口。项目领域组件继续保留自己的语义。'},
  {id:'b',name:'示例 工作站风格',owner:'工作站',status:'迁移中',tone:'accent',date:'11月13日',description:'记录当前医疗灰白蓝方向。临床风险、权限和迁移结果仍由项目负责。'},
  {id:'c',name:'Pearl 金额与层级',owner:'账户用量',status:'待复核',tone:'warning',date:'11月12日',description:'在黑金与独立深色表面中保持金额可读，单位与辅助说明分层。'}
] as const
const visible=computed(()=>records.filter(item=>item.name.includes(query.value)||item.owner.includes(query.value)))
const current=computed(()=>records.find(item=>item.id===selected.value)!)
function show(id:string,event:Event) {selected.value=id;detailTrigger.value=event.currentTarget as HTMLElement;detail.value=true}
async function copySettings() {try {await navigator.clipboard.writeText(JSON.stringify({name:displayName.value,email:email.value,alerts:alerts.value},null,2));copied.value='配置已复制'} catch {copied.value='未能复制，请允许剪贴板访问后重试'}}
</script>
<template>
  <div class="pattern-wrap">
    <div class="pattern-topline"><span class="pattern-wordmark"><span class="pattern-symbol">同</span> 设计工作室</span><UiBadge>布局示例 · 合成记录</UiBadge></div>
    <template v-if="kind==='list'">
      <div class="pattern-heading"><div><span class="eyebrow">WORKSPACE / ASSETS</span><h3>资产整理</h3><p>清楚的状态，连续的操作面。</p></div><span class="pattern-counter">03 <small>条示例</small></span></div>
      <div class="pattern-filter"><UiInput v-model="query" label="搜索资产" placeholder="名称或分类"/><span class="muted small">筛选后查看详情，保留当前条件</span></div>
      <UiTable v-if="visible.length" caption="示例资产列表"><template #head><tr><th scope="col">资产名称</th><th scope="col">分类</th><th scope="col">状态</th><th scope="col">更新</th><th scope="col"><span class="ui-sr-only">操作</span></th></tr></template><tr v-for="item in visible" :key="item.id"><td class="record-name">{{item.name}}</td><td class="nowrap">{{item.owner}}</td><td><UiBadge :tone="item.tone">{{item.status}}</UiBadge></td><td class="muted nowrap">{{item.date}}</td><td><UiButton size="sm" variant="ghost" :aria-label="'查看'+item.name" @click="show(item.id,$event)">查看 <ArrowUpRight/></UiButton></td></tr></UiTable>
      <UiEmptyState v-else title="没有匹配的资产" description="可以更换关键词，或清除条件查看全部示例。"><UiButton @click="query=''">清除搜索</UiButton></UiEmptyState>
      <div class="pattern-foot"><span>{{visible.length}} / 3 条示例</span><span>表格内横滚 · 页面不横滚</span></div>
    </template>
    <template v-else-if="kind==='workbench'">
      <div class="pattern-heading"><div><span class="eyebrow">WORKSPACE / REVIEW</span><h3>上下文工作台</h3><p>左侧定位，右侧阅读，身份始终明确。</p></div></div>
      <div class="workbench-grid"><nav aria-label="示例任务" class="workbench-list"><button v-for="item in records" :key="item.id" :aria-current="selected===item.id ? 'true':undefined" @click="selected=item.id"><span>{{item.name}}</span><UiBadge :tone="item.tone">{{item.status}}</UiBadge></button></nav><UiPanel :title="current.name" :description="current.owner"><UiBadge :tone="current.tone">{{current.status}}</UiBadge><p class="reading-copy">{{current.description}}</p><div class="facts-row"><span>最近更新</span><strong>{{current.date}}</strong></div><div class="facts-row"><span>数据范围</span><strong>布局示例</strong></div><div class="workbench-action"><UiButton @click="show(current.id,$event)">查看示例说明 <ArrowRight/></UiButton></div></UiPanel></div>
    </template>
    <template v-else>
      <div class="pattern-heading"><div><span class="eyebrow">WORKSPACE / PREFERENCES</span><h3>分组设置</h3><p>围绕一个决定组织字段，输入和反馈放在一起。</p></div></div>
      <form class="settings-grid" @submit.prevent="copySettings"><div><h4>基本信息</h4><p class="muted">仅编辑当前示例，可复制配置使用。</p></div><div class="form-stack"><UiInput v-model="displayName" label="工作空间名称" required maxlength="80"/><UiInput v-model="email" label="通知邮箱" type="email" placeholder="name@example.com" hint="此示例不会发送邮件"/><UiSwitch v-model="alerts" label="启用更新提醒"/><div class="ui-actions"><UiButton type="submit" variant="primary"><Copy/> 复制配置</UiButton><span role="status" class="small">{{copied}}</span></div></div></form>
    </template>
    <UiDialog v-model:open="detail" :title="current.name" description="本地布局样例，不连接项目业务接口。" :return-focus="detailTrigger"><UiBadge :tone="current.tone">{{current.status}}</UiBadge><p class="reading-copy">{{current.description}}</p><div class="notice">列表搜索与所选记录会在关闭后保留。</div><template #footer><UiButton @click="detail=false">返回示例</UiButton></template></UiDialog>
  </div>
</template>

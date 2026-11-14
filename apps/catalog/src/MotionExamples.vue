<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import {
  UiTransition,
  UiButton,
  UiSelect,
  UiInput,
  UiPanel,
  UiBadge,
  UiAccordion,
  UiDialog,
  UiProgress,
  UiTextReveal,UiNumberTicker,UiSpotlight,UiMarquee,UiAsyncState,
} from "@ai-design-system/ui";
import DemoCard from "./DemoCard.vue";
const preset = ref<"fade" | "slide" | "scale">("slide"),
  shown = ref(true),
  draft = ref("切换和收起后，这段草稿还在"),
  dialog = ref(false),
  accordion = ref<string[]>([]);
const toggle = ref<{ $el: HTMLElement } | null>(null);
const code =
  '<UiButton ref="toggle" @click="shown = !shown">显示 / 收起</UiButton>\n<UiTransition preset="slide" :return-focus="toggle?.$el">\n  <section v-show="shown"><UiInput v-model="draft" label="草稿" /></section>\n</UiTransition>';
const accordionCode = '<UiAccordion v-model="expanded" :items="items" />';
const textEffect=ref<'fade'|'rise'|'blur'>('blur'),replay=ref(0),number=ref(1280),marqueePaused=ref(true)
const route=ref('edit'),routeDraft=ref('页面来回切换，输入仍保留'),routeButton=ref<{$el:HTMLElement}|null>(null)
const status=ref<'idle'|'pending'|'refreshing'|'success'|'error'|'cancelled'>('idle'),loaded=ref(false),receipt=ref(0)
let request:AbortController|undefined
async function load(fail=false){
 request?.abort();const controller=new AbortController();request=controller
 status.value=loaded.value?'refreshing':'pending'
 try {
  await new Promise<void>((resolve,reject)=>{const timer=setTimeout(resolve,1400);controller.signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new DOMException('取消','AbortError'))},{once:true})})
  if(fail)throw new Error('演示失败')
  if(request!==controller)return
  receipt.value++;loaded.value=true;status.value='success'
 } catch(error){if(request===controller)status.value=controller.signal.aborted?'cancelled':'error'}
}
onUnmounted(()=>request?.abort())
</script>
<template>
  <section class="motion-examples" aria-label="动效演示">
    <div class="demo-grid">
      <DemoCard title="文字显现" names="UiTextReveal" code='<UiTextReveal text="让细节自然出现" effect="blur" by="character" :replay="replay" />'>
       <div class="form-stack"><UiSelect v-model="textEffect" label="文字动画" :options="[{value:'blur',label:'模糊渐显'},{value:'rise',label:'逐字上浮'},{value:'fade',label:'逐字淡入'}]"/><h2 class="motion-display"><UiTextReveal text="让细节自然出现。" :effect="textEffect" by="character" :replay="replay"/></h2><UiButton @click="replay++">重播文字动画</UiButton><p class="muted small">整段文字始终可读屏；切换、重播和减少动态不会丢字。</p></div>
      </DemoCard>
      <DemoCard title="数字更新" names="UiNumberTicker" code='<UiNumberTicker :value="amount" :decimals="2" label="示例数值" />'>
       <div class="form-stack"><div class="motion-display"><UiNumberTicker :value="number" :decimals="2" label="示例数值"/></div><div class="ui-actions"><UiButton @click="number+=238.5">增加示例数值</UiButton><UiButton @click="number=1280">还原示例数值</UiButton></div><p class="muted small">连续更新从当前显示值衔接；准确终值直接提供给读屏，不用动画判断业务成功。</p></div>
      </DemoCard>
      <DemoCard title="指针与焦点光斑" names="UiSpotlight" code='<UiSpotlight label="功能介绍"><UiButton>查看功能</UiButton></UiSpotlight>'><UiSpotlight label="光斑预览"><h3>光跟着你的注意力。</h3><p>移动指针，或用键盘聚焦按钮。</p><UiButton @click="dialog=true">打开光斑示例详情</UiButton></UiSpotlight></DemoCard>
      <DemoCard title="可暂停的流动内容" names="UiMarquee" code='<UiMarquee v-model:paused="paused" label="能力展示" :items="items" />'><UiMarquee v-model:paused="marqueePaused" label="组件能力展示" :items="['Typography · 字体','Material · 材质','Layout · 布局','Motion · 动效','Color · 配色']"/><p class="muted small">默认暂停；悬停或键盘进入时暂停。减少动态时展开为静态内容。</p></DemoCard>
      <DemoCard title="页面切换与返回" names="UiTransition" code='<UiTransition preset="page" mode="out-in"><section :key="route">页面内容</section></UiTransition>'>
       <div class="form-stack"><div class="ui-actions"><UiButton ref="routeButton" :aria-pressed="route==='edit'" @click="route='edit'">编辑页</UiButton><UiButton :aria-pressed="route==='preview'" @click="route='preview'">预览页</UiButton></div><div class="motion-page-slot"><UiTransition preset="page" mode="out-in" :return-focus="routeButton?.$el"><section v-if="route==='edit'" key="edit" aria-label="页面编辑"><UiInput v-model="routeDraft" label="页面草稿"/></section><section v-else key="preview" aria-label="页面预览"><h3>预览内容</h3><p>{{routeDraft}}</p><UiButton @click="route='edit'">返回继续编辑</UiButton></section></UiTransition></div></div>
      </DemoCard>
      <DemoCard title="加载、刷新、取消与重试" names="UiAsyncState" code='<UiAsyncState :status="status" label="内容加载" :retain-content="hasData" cancellable @cancel="abort" @retry="load"><YourContent /></UiAsyncState>'>
       <div class="form-stack"><div class="ui-actions"><UiButton @click="load()">{{loaded?'刷新演示内容':'开始演示加载'}}</UiButton><UiButton @click="load(true)">演示失败</UiButton></div><UiAsyncState :status="status" label="演示内容加载" :retain-content="loaded" cancellable @cancel="request?.abort()" @retry="load()"><div v-if="loaded" class="motion-result">已完成 {{receipt}} 次演示加载，刷新期间保留这份内容。</div><p v-else>开始后显示骨架和未知时长进度。</p></UiAsyncState><p class="muted small">本地延迟演示；结果由任务回执触发。重新发起会取消上一次，过期回执不会覆盖结果。</p></div>
      </DemoCard>
    </div>
    <div class="demo-grid">
      <DemoCard
        title="内容出现、退出与反向操作"
        names="UiTransition"
        :code="code"
      >
        <div class="form-stack">
          <UiSelect
            v-model="preset"
            label="过渡方式"
            :options="[
              { value: 'fade', label: '淡入淡出' },
              { value: 'slide', label: '轻移出现' },
              { value: 'scale', label: '轻量缩放' },
            ]"
          />
          <div class="ui-actions">
            <UiButton
              ref="toggle"
              :aria-expanded="shown"
              aria-controls="motion-content"
              @click="shown = !shown"
              >{{ shown ? "收起内容" : "显示内容" }}</UiButton
            ><UiBadge>{{ shown ? "当前显示" : "当前收起" }}</UiBadge>
          </div>
          <div class="motion-content-slot">
            <UiTransition :preset="preset" :return-focus="toggle?.$el">
              <section
                v-show="shown"
                id="motion-content"
                aria-label="可切换内容"
              >
                <UiPanel color="blue" title="保留上下文"
                  ><div class="form-stack">
                    <UiInput v-model="draft" label="过渡中的草稿" /><UiButton
                      @click="shown = false"
                      >从内容内收起</UiButton
                    >
                  </div></UiPanel
                >
              </section>
            </UiTransition>
          </div>
          <p class="muted small">
            可以快速反复切换。收起内容会退出键盘焦点顺序，草稿保留。
          </p>
        </div>
      </DemoCard>
      <DemoCard
        title="高度展开与弹层过渡"
        names="UiAccordion · UiDialog"
        :code="accordionCode"
      >
        <div class="form-stack">
          <UiAccordion
            v-model="accordion"
            :items="[
              {
                value: 'detail',
                title: '展开详情',
                description: '高度随内容变化；图标同步表示展开状态。',
              },
              {
                value: 'notes',
                title: '使用建议',
                description: '频繁操作保持轻快，减少动态时直接切换。',
              },
            ]"
          />
          <UiDialog
            v-model:open="dialog"
            title="动效与焦点一起完成"
            description="打开、关闭和快速重开使用同一个生命周期。"
            ><template #trigger><UiButton>打开动效对话框</UiButton></template
            ><UiInput v-model="draft" label="弹层中的草稿" /><template #footer
              ><UiButton @click="dialog = false">完成查看</UiButton></template
            ></UiDialog
          >
          <UiProgress label="未知时长的工作" />
          <p class="muted small">
            系统开启“减少动态”后，位移、缩放和循环动效自动停止；操作照常可用。
          </p>
        </div>
      </DemoCard>
    </div>
    <UiPanel
      title="一套节奏，覆盖常用交互"
      description="时长来自当前主题 token；动画不延迟提交，不制造完成状态。"
    >
      <dl class="motion-rules">
        <div>
          <dt>即时反馈</dt>
          <dd>按下、悬停、焦点、开关</dd>
          <code>--ui-fast · 默认 120ms</code>
        </div>
        <div>
          <dt>内容切换</dt>
          <dd>内容出现、折叠、进度更新</dd>
          <code>--ui-normal · 默认 200ms</code>
        </div>
        <div>
          <dt>进入工作面</dt>
          <dd>对话框、抽屉与底部面板</dd>
          <code>--ui-enter · 默认 240ms</code>
        </div>
      </dl>
    </UiPanel>
  </section>
</template>

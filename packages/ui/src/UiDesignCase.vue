<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { designCases, type DesignCaseId } from "./design-cases";
import type { Theme } from "./theme";
import UiTheme from "./UiTheme.vue";
import UiButton from "./UiButton.vue";
import UiInput from "./UiInput.vue";
import UiTextarea from "./UiTextarea.vue";
import UiBadge from "./UiBadge.vue";
import UiCheckbox from "./UiCheckbox.vue";
import UiProgress from "./UiProgress.vue";
import UiDialog from "./UiDialog.vue";
import UiNumberTicker from "./UiNumberTicker.vue";
import UiMotionSurface from "./UiMotionSurface.vue";
const props = withDefaults(
  defineProps<{
    caseId: DesignCaseId;
    preview?: boolean;
    theme?: Partial<Theme>;
  }>(),
  { preview: false },
);
const definition = computed(() =>
  designCases.find((item) => item.id === props.caseId)!,
);
const emit = defineEmits<{ action: [name: string] }>();
const submittedPrompt = ref("");
const previousMove = ref<{ task: number; stage: number }>();
const choice = ref(0),
  search = ref(""),
  detail = ref(false),
  message = ref(""),
  playing = ref(false),
  annual = ref(false);
const completed = ref<boolean[]>([true, false, false]),
  stages = ref([0, 1, 1]),
  channel = ref("design");
const drafts = ref<Record<string, string>>({
  design: "",
  general: "",
  notes: "",
});
const messages = ref<Record<string, string[]>>({
  design: [],
  general: [],
  notes: [],
});
const draft = computed({
  get: () => drafts.value[channel.value],
  set: (value: string) => (drafts.value[channel.value] = value),
});
const notes = ref(["把想法画出来", "先完成一条路径", "保留一点惊喜"]);
const state = ref<"idle" | "pending" | "success" | "error">("idle");
let timer: ReturnType<typeof setTimeout> | undefined;
const resources = [
  { name: "studio-api", region: "上海", status: "运行中", load: "42%" },
  { name: "image-worker", region: "东京", status: "待检查", load: "—" },
  { name: "media-store", region: "新加坡", status: "运行中", load: "18%" },
];
const filteredResources = computed(() =>
  resources.filter((item) => item.name.includes(search.value.toLowerCase())),
);
const places = [
  { name: "山间小屋", area: "山野", tone: "forest" },
  { name: "海边的房间", area: "海岸", tone: "coast" },
  { name: "城市阁楼", area: "城市", tone: "city" },
];
const filteredPlaces = computed(() =>
  places.filter(
    (item) => !search.value || (item.name + item.area).includes(search.value),
  ),
);
const favorites = ref<string[]>([]);
const selectedPlace = ref("山间小屋");
function say(text: string) {
  message.value = text;
  emit("action", text);
}
function favorite(name: string) {
  favorites.value = favorites.value.includes(name)
    ? favorites.value.filter((item) => item !== name)
    : [...favorites.value, name];
}
function simulate(fail = false) {
  clearTimeout(timer);
  state.value = "pending";
  message.value = "";
  timer = setTimeout(() => {
    state.value = fail ? "error" : "success";
    say(
      fail
        ? "模拟构建失败：缺少入口文件。可以重试。"
        : "模拟已完成，未发送外部请求。",
    );
  }, 1000);
}
function stop() {
  clearTimeout(timer);
  state.value = "idle";
  say("已停止模拟，输入已保留。");
}
function send() {
  const value = draft.value.trim();
  if (!value) return;
  messages.value[channel.value].push(value);
  draft.value = "";
  say("消息已加入本次演示。");
}
function submitAi() {
  if (!draft.value.trim()) return;
  submittedPrompt.value = draft.value.trim();
  simulate();
}
function moveTask(task: number) {
  previousMove.value = { task, stage: stages.value[task] };
  stages.value[task] = (stages.value[task] + 1) % 3;
  say("任务已移动，可撤销本次移动。");
}
function undoMove() {
  if (!previousMove.value) return;
  stages.value[previousMove.value.task] = previousMove.value.stage;
  previousMove.value = undefined;
  say("已撤销本次移动。");
}
function selectTable(index: number) {
  stop();
  choice.value = index;
  message.value = "";
}
function reset() {
  clearTimeout(timer);
  choice.value = 0;
  search.value = "";
  detail.value = false;
  message.value = "";
  state.value = "idle";
  playing.value = false;
  completed.value = [true, false, false];
  stages.value = [0, 1, 1];
  channel.value = "design";
  drafts.value = { design: "", general: "", notes: "" };
  messages.value = { design: [], general: [], notes: [] };
  notes.value = ["把想法画出来", "先完成一条路径", "保留一点惊喜"];
  favorites.value = [];
  annual.value = false;
  previousMove.value = undefined;
}
watch(() => props.caseId, reset);
onUnmounted(() => clearTimeout(timer));
</script>
<template>
  <UiTheme
    v-bind="{ ...definition.theme, ...theme }"
    class="ui-design-case"
    :data-case="caseId"
    :data-preview="preview"
    :aria-label="definition.name"
  >
    <div class="case-demo-label" v-if="!preview">
      原创设计演绎 · 交互仅在本页模拟
    </div>
    <template v-if="caseId === 'apple'">
      <header class="case-product-nav">
        <strong>FORMA</strong><span>轻一点，世界大一点。</span
        ><UiButton size="sm" @click="detail = true">技术规格</UiButton>
      </header>
      <section class="case-apple-stage">
        <span class="case-kicker">FORM / 01</span>
        <h2>安静地，<br />惊艳每一天。</h2>
        <p>为专注而设计的桌面音响。</p>
        <UiMotionSurface effect="tilt"
          ><div class="case-speaker" :data-color="choice">
            <div class="speaker-mesh" />
            <i /><span>f o r m a</span>
          </div></UiMotionSurface
        >
        <div class="case-swatch-bar" role="group" aria-label="产品外观">
          <button
            v-for="(color, i) in ['月白', '石墨', '浅雾蓝']"
            :key="color"
            :aria-pressed="choice === i"
            @click="choice = i"
          >
            <i :data-color="i" />{{ color }}
          </button>
        </div>
      </section>
      <UiDialog
        v-model:open="detail"
        title="FORMA / 01"
        description="虚构产品，用于体验规格披露。"
        ><dl class="case-specs">
          <div>
            <dt>尺寸</dt>
            <dd>160 × 160 × 84 mm</dd>
          </div>
          <div>
            <dt>外观</dt>
            <dd>{{ ["月白", "石墨", "浅雾蓝"][choice] }}</dd>
          </div>
          <div>
            <dt>控制方式</dt>
            <dd>触摸与旋钮</dd>
          </div>
        </dl></UiDialog
      >
    </template>
    <template v-else-if="caseId === 'vercel'">
      <header class="case-tech-nav">
        <strong>／ deploy.studio</strong><span>团队 / 创作工坊</span
        ><UiBadge>Hobby</UiBadge>
      </header>
      <section class="case-deploy">
        <span class="case-kicker">YOUR NEXT SHIP</span>
        <h2>从想法，到上线。</h2>
        <p>每一次交付，都有清晰的来路。</p>
        <div class="case-deploy-actions">
          <UiButton
            variant="primary"
            :disabled="state === 'pending'"
            @click="simulate()"
            >{{
              state === "pending" ? "构建中…" : "模拟部署 →"
            }}</UiButton><UiButton
            :disabled="state === 'pending'"
            @click="simulate(true)"
            >体验失败</UiButton
          >
        </div>
        <div class="case-deploy-box">
          <div class="case-line">
            <strong>design-workshop</strong
            ><UiBadge
              :tone="
                state === 'error'
                  ? 'danger'
                  : state === 'pending'
                    ? 'warning'
                    : 'success'
              "
              >{{
                state === "error"
                  ? "Failed"
                  : state === "pending"
                    ? "Building"
                    : "Ready"
              }}</UiBadge
            >
          </div>
          <code
            >main ·
            {{
              state === "pending"
                ? "正在准备演示"
                : "a8f2c61 · improve interaction"
            }}</code
          >
          <div class="case-build-tracks">
            <span>01 / 源码</span><span>02 / 构建</span><span>03 / 预览</span>
          </div>
          <UiButton v-if="state === 'error'" @click="simulate()"
            >重试构建</UiButton
          >
        </div>
      </section>
    </template>
    <template v-else-if="caseId === 'ibm'">
      <header class="case-carbon-bar">
        <strong>ATLAS / Cloud</strong><span>资源管理</span
        ><span>CN / 上海</span>
      </header>
      <section class="case-carbon-main">
        <span class="case-kicker">基础设施 / 实例</span>
        <h2>你的资源，<br />一目了然。</h2>
        <div class="case-carbon-metrics">
          <div><span>运行实例</span><strong>02</strong></div>
          <div><span>需要关注</span><strong>01</strong></div>
          <div><span>可用区域</span><strong>03</strong></div>
        </div>
        <UiInput v-model="search" label="搜索资源" placeholder="搜索实例名称" />
        <div class="case-table-wrap">
          <table>
            <thead>
              <tr>
                <th>实例名称</th>
                <th>区域</th>
                <th>状态</th>
                <th>负载</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredResources" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.region }}</td>
                <td>
                  <UiBadge :tone="item.load === '—' ? 'warning' : 'success'">{{
                    item.status
                  }}</UiBadge>
                </td>
                <td>{{ item.load }}</td>
                <td>
                  <UiButton
                    size="sm"
                    @click="
                      selectedPlace = item.name;
                      detail = true;
                    "
                    >详情 →</UiButton
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="!filteredResources.length">
          没有匹配实例。<UiButton @click="search = ''">清除搜索</UiButton>
        </p>
      </section>
      <UiDialog
        v-model:open="detail"
        :title="selectedPlace"
        description="实例详情演示，保留了原列表与搜索条件。"
        ><p>所有示例数据均为虚构；当前没有执行运维操作。</p></UiDialog
      >
    </template>
    <template v-else-if="caseId === 'stripe'">
      <header class="case-product-nav">
        <strong>weave.</strong><span>为每一种想法，建立生意。</span>
      </header>
      <section class="case-stripe-scene">
        <div class="case-stripe-mesh" aria-hidden="true" />
        <div class="case-stripe-copy">
          <span class="case-kicker">THE BUSINESS OF IDEAS</span>
          <h2>让好想法，<br />成为好生意。</h2>
          <p>
            从一个创作者，到一支团队。<br />在同一个空间里，完成下一次交付。
          </p>
          <UiButton
            variant="primary"
            @click="say('已选择 Studio 方案，未创建订阅。')"
            >选择 Studio →</UiButton
          >
        </div>
        <div class="case-stripe-pricing">
          <span>STUDIO MEMBERSHIP</span>
          <h3>创作，有自己的节奏。</h3>
          <div class="case-price">
            <small>¥</small><UiNumberTicker :value="annual ? 29 : 39" /><small
              >/ 月 · 演示价格</small
            >
          </div>
          <div class="case-segment" role="group" aria-label="计费周期">
            <button :aria-pressed="!annual" @click="annual = false">月付</button
            ><button :aria-pressed="annual" @click="annual = true">年付</button>
          </div>
          <ul>
            <li>共享作品空间</li>
            <li>可组合设计资产</li>
            <li>每一步，保留版本</li>
          </ul>
          <div class="case-mini-receipt">
            <span>下次创作</span><strong>从今天开始 ↗</strong>
          </div>
        </div>
      </section>
    </template>
    <template v-else-if="caseId === 'spotify'">
      <header class="case-music-top">
        <strong>sonora</strong><span>为今天留一点声音</span
        ><UiBadge>私人唱片室</UiBadge>
      </header>
      <section class="case-music-main">
        <span class="case-kicker">MADE FOR YOUR MOMENT</span>
        <h2>周日，不着急。</h2>
        <div class="case-albums">
          <button
            v-for="(title, i) in ['日光之间', '蓝色时刻', '缓慢发生']"
            :key="title"
            class="case-album"
            :aria-pressed="choice === i"
            @click="
              choice = i;
              playing = true;
            "
          >
            <div class="case-album-art" :data-art="i">
              <i /><span>{{ ["SLOW", "AFTER", "FLOW"][i] }}</span>
            </div>
            <strong>{{ title }}</strong><small>{{
              ["Ambient / 12 首", "Jazz / 08 首", "Electronic / 16 首"][i]
            }}</small>
          </button>
        </div>
      </section>
      <footer class="case-player">
        <div class="case-mini-cover" :data-art="choice" />
        <div>
          <strong>{{
            ["日光之间", "蓝色时刻", "缓慢发生"][choice]
          }}</strong><small>本地播放状态演示 · 无音频</small>
        </div>
        <UiButton
          :aria-label="playing ? '暂停播放' : '开始播放'"
          @click="playing = !playing"
          >{{ playing ? "Ⅱ" : "▶" }}</UiButton
        >
        <div class="case-wave" :data-playing="playing" aria-hidden="true">
          <i v-for="i in 20" :key="i" :style="{ '--i': i }" />
        </div>
      </footer>
    </template>
    <template v-else-if="caseId === 'notion'">
      <header class="case-doc-top">
        <strong>页间 / 工作室</strong
        ><span
          >团队手册 / {{ ["开始之前", "我们的原则", "本周计划"][choice] }}</span
        >
      </header>
      <section class="case-doc-grid">
        <nav aria-label="文档章节">
          <button
            v-for="(chapter, i) in ['开始之前', '我们的原则', '本周计划']"
            :key="chapter"
            :aria-current="choice === i ? 'page' : undefined"
            @click="choice = i"
          >
            {{ String(i + 1).padStart(2, "0") }}　{{ chapter }}
          </button>
        </nav>
        <article>
          <span class="case-bookmark" aria-hidden="true">✳</span>
          <h2>
            {{
              ["给好想法，一个家。", "做少一点，做好一点。", "让进展看得见。"][
                choice
              ]
            }}
          </h2>
          <p class="case-doc-lead">一个记录、讨论、慢慢打磨的地方。</p>
          <blockquote>
            保持清晰，保持好奇。让每一次小小的进步，都能被下一次创作接住。
          </blockquote>
          <h3>{{ ["你的第一天", "我们如何协作", "本周的小目标"][choice] }}</h3>
          <div class="case-checklist">
            <UiCheckbox
              v-for="(label, i) in [
                '认识工作室',
                '写下一个想法',
                '完成第一次分享',
              ]"
              :key="label"
              v-model="completed[i]"
              :label="label"
            />
          </div>
          <UiProgress
            :value="(completed.filter(Boolean).length / 3) * 100"
            label="手册完成度"
          />
          <p class="case-doc-foot">页面中的修改只保留在本次演示。</p>
        </article>
      </section>
    </template>
    <template v-else-if="caseId === 'linear'">
      <header class="case-linear-top">
        <strong>◒ ORBIT</strong><span>工作室 / 下一次发布</span
        ><UiBadge>周期 04</UiBadge>
      </header>
      <section class="case-board-main">
        <span class="case-kicker">BUILD SOMETHING THAT MATTERS</span>
        <h2>一点一点，<span>走向完成。</span></h2>
        <div class="case-board">
          <section
            v-for="(stage, i) in ['计划', '进行中', '已完成']"
            :key="stage"
          >
            <h3>
              <i :data-stage="i" />{{ stage }}
              <small>{{ stages.filter((s) => s === i).length }}</small>
            </h3>
            <article
              v-for="task in [0, 1, 2].filter((t) => stages[t] === i)"
              :key="task"
            >
              <small>ORB-{{ 120 + task }}</small>
              <h4>
                {{ ["重做空状态", "打磨切换手感", "整理设计词汇"][task] }}
              </h4>
              <div class="case-line">
                <UiBadge>{{ ["体验", "动效", "系统"][task] }}</UiBadge><UiButton
                  size="sm"
                  @click="moveTask(task)"
                  >{{ i === 2 ? "重新开始" : "推进 →" }}</UiButton
                >
              </div>
            </article>
          </section>
        </div>
      </section>
    </template>
    <template v-else-if="caseId === 'figma'">
      <header class="case-figma-top">
        <strong>shape / 探索文件</strong><span>DESIGN PLAYGROUND</span
        ><UiBadge>本地草稿</UiBadge>
      </header>
      <section class="case-figma-workspace">
        <nav aria-label="画布对象">
          <span>图层</span
          ><button
            v-for="(layer, i) in ['标题', '主视觉', '标签']"
            :key="layer"
            :aria-pressed="choice === i"
            @click="choice = i"
          >
            ◇ {{ layer }}
          </button>
        </nav>
        <div class="case-artboard">
          <div
            class="case-artboard-title"
            :data-selected="choice === 0"
            @click="choice = 0"
          >
            <small>IDEAS TAKE SHAPE</small>
            <h2>有想法，<br />就有形状。</h2>
          </div>
          <button
            class="case-figma-shape"
            :data-shape="annual ? 'circle' : 'square'"
            :data-selected="choice === 1"
            aria-label="选择主视觉"
            @click="choice = 1"
          >
            <i /><i /><i /></button
          ><button
            class="case-artboard-tag"
            :data-selected="choice === 2"
            @click="choice = 2"
          >
            MAKE IT YOURS ↗
          </button>
        </div>
        <aside>
          <strong>属性</strong><span>当前对象</span>
          <p>{{ ["标题", "主视觉", "标签"][choice] }}</p>
          <UiButton @click="annual = !annual">{{
            annual ? "切换方形" : "切换圆形"
          }}</UiButton><small>点击图层或画面选择对象</small>
        </aside>
      </section>
    </template>
    <template v-else-if="caseId === 'airbnb'">
      <header class="case-travel-top">
        <strong>远屿 / away</strong><span>住进另一种日常</span
        ><UiBadge>{{ favorites.length }} 个收藏</UiBadge>
      </header>
      <section class="case-travel-main">
        <h2>这周末，去哪里。</h2>
        <div class="case-travel-search">
          <UiInput
            v-model="search"
            label="搜索目的地"
            placeholder="试试山野、海岸、城市"
          /><UiButton @click="search = ''">全部目的地</UiButton>
        </div>
        <div class="case-travel-grid">
          <article v-for="place in filteredPlaces" :key="place.name">
            <div class="case-landscape" :data-place="place.tone">
              <i /><i /><i /><button
                :aria-label="'收藏' + place.name"
                :aria-pressed="favorites.includes(place.name)"
                @click="favorite(place.name)"
              >
                {{ favorites.includes(place.name) ? "♥" : "♡" }}
              </button>
            </div>
            <div class="case-line">
              <h3>{{ place.name }}</h3>
              <span>★ 4.9</span>
            </div>
            <p>{{ place.area }} · 适合放空的地方</p>
            <UiButton
              size="sm"
              @click="
                selectedPlace = place.name;
                detail = true;
              "
              >看看这里 ↗</UiButton
            >
          </article>
        </div>
        <p v-if="!filteredPlaces.length">暂时没有匹配的目的地。试试“海岸”。</p>
      </section>
      <UiDialog
        v-model:open="detail"
        :title="selectedPlace"
        description="虚构目的地，仅展示详情与收藏交互。"
        ><p>把周末留给自己。当前没有预订或付款行为。</p>
        <UiButton @click="favorite(selectedPlace)">{{
          favorites.includes(selectedPlace) ? "取消收藏" : "加入收藏"
        }}</UiButton></UiDialog
      >
    </template>
    <template v-else-if="caseId === 'shopify'">
      <header class="case-shop-top">
        <strong>芽集 / merchant</strong><span>店铺准备中</span
        ><UiBadge>演示店铺</UiBadge>
      </header>
      <section class="case-shop-main">
        <div class="case-shop-welcome">
          <span class="case-kicker">SMALL BEGINNINGS. REAL POSSIBILITIES.</span>
          <h2>你的第一家店，<br />从这里长出来。</h2>
          <div class="case-shop-sculpture" aria-hidden="true">
            <i /><i /><i />
          </div>
        </div>
        <section class="case-shop-setup">
          <div class="case-line">
            <h3>开店准备</h3>
            <strong>{{ completed.filter(Boolean).length }} / 3</strong>
          </div>
          <UiProgress
            :value="(completed.filter(Boolean).length / 3) * 100"
            label="开店准备进度"
          />
          <div
            v-for="(label, i) in [
              '为店铺起一个名字',
              '添加第一件作品',
              '预览开店页面',
            ]"
            :key="label"
            class="case-setup-step"
          >
            <UiCheckbox v-model="completed[i]" :label="label" /><small>{{
              [
                "用你自己的方式被记住",
                "让好作品遇到合适的人",
                "准备好了，再让世界看见",
              ][i]
            }}</small>
          </div>
          <UiBadge :tone="completed.every(Boolean) ? 'success' : 'neutral'">{{
            completed.every(Boolean) ? "演示准备完成" : "继续下一步"
          }}</UiBadge>
        </section>
      </section>
    </template>
    <template v-else-if="caseId === 'claude'">
      <header class="case-ai-top">
        <strong>纸语</strong><UiBadge>浏览器模拟</UiBadge>
      </header>
      <section class="case-ai-main">
        <span class="case-ai-symbol" aria-hidden="true">✳</span>
        <h2>一起，把想法想清楚。</h2>
        <p>不急着给答案。先从一个好问题开始。</p>
        <form class="case-ai-composer" @submit.prevent="submitAi">
          <UiTextarea
            v-model="draft"
            label="想和助手讨论什么"
            placeholder="今天想探索什么？"
          />
          <div class="case-line">
            <small>创作伙伴 · 本地演示</small
            ><UiButton v-if="state === 'pending'" @click="stop">停止</UiButton
            ><UiButton
              v-else
              type="submit"
              :disabled="!draft.trim()"
              variant="primary"
              >发送 ↑</UiButton
            >
          </div>
        </form>
        <div class="case-ai-prompts">
          <UiButton
            v-for="prompt in ['为产品梳理方向', '打磨一段文字', '寻找新的可能']"
            :key="prompt"
            @click="draft = prompt"
            >{{ prompt }}</UiButton
          >
        </div>
        <div v-if="state === 'success'" class="case-ai-answer">
          <strong>从这里开始</strong>
          <p>
            我们可以先明确“{{
              submittedPrompt
            }}”服务谁、下一步是什么，再选择合适的页面结构与视觉表达。
          </p>
        </div>
      </section>
    </template>
    <template v-else-if="caseId === 'supabase'">
      <header class="case-db-top">
        <strong>翠栈 / studio</strong><span>workspace / public</span
        ><UiBadge tone="success">本地模拟</UiBadge>
      </header>
      <section class="case-db-grid">
        <nav aria-label="数据表">
          <small>TABLES</small
          ><button
            v-for="(table, i) in ['projects', 'assets', 'members']"
            :key="table"
            :aria-current="choice === i ? 'page' : undefined"
            @click="selectTable(i)"
          >
            ▦ {{ table }}
          </button>
        </nav>
        <div class="case-db-main">
          <div class="case-line">
            <h2>SQL Editor</h2>
            <UiButton
              :disabled="state === 'pending'"
              variant="primary"
              @click="simulate()"
              >{{ state === "pending" ? "执行中…" : "运行演示 ▷" }}</UiButton
            >
          </div>
          <pre class="case-query"><span>SELECT</span> *
<span>FROM</span> public.{{['projects','assets','members'][choice]}}
<span>LIMIT</span> 3;</pre>
          <div class="case-line">
            <h3>结果预览</h3>
            <small>READ ONLY / {{ state === "success" ? 3 : 0 }} rows</small>
          </div>
          <div class="case-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>id / uuid</th>
                  <th>name / text</th>
                  <th>updated_at</th>
                </tr>
              </thead>
              <tbody v-if="state === 'success'">
                <tr
                  v-for="(name, i) in [
                    ['设计工坊', '周末企划', '发布清单'],
                    ['动效组件', '设计骨架', '字体组合'],
                    ['小林', '阿青', '冬木'],
                  ][choice]"
                  :key="name"
                >
                  <td>0{{ i + 1 }}a8f</td>
                  <td>{{ name }}</td>
                  <td>2026-11-15</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="state !== 'success'" class="case-query-hint">
            运行演示后查看虚构结果，不连接数据库。
          </p>
        </div>
      </section>
    </template>
    <template v-else-if="caseId === 'nvidia'">
      <header class="case-compute-top">
        <strong>FIELD / COMPUTE</strong><span>算力 · 想象力</span>
      </header>
      <section class="case-compute-main">
        <div>
          <span class="case-kicker">ENGINEERED FOR WHAT'S NEXT</span>
          <h2>想象，<br />全速运行。</h2>
          <p>从创意，到下一次突破。</p>
          <div class="case-compute-options" role="group" aria-label="算力方案">
            <UiButton
              v-for="(name, i) in ['探索', '创造', '扩展']"
              :key="name"
              :variant="choice === i ? 'primary' : 'secondary'"
              :aria-pressed="choice === i"
              @click="choice = i"
              >{{ name }} ↗</UiButton
            >
          </div>
          <div class="case-compute-stat">
            <UiNumberTicker :value="[8, 32, 128][choice]" /><span
              >虚构计算单元<br />DESIGN STUDY ONLY</span
            >
          </div>
        </div>
        <div class="case-compute-array" aria-hidden="true">
          <i v-for="i in 15" :key="i" :data-on="i <= [5, 10, 15][choice]"
            ><span /><span /><span
          /></i>
        </div>
      </section>
    </template>
    <template v-else-if="caseId === 'nike'">
      <header class="case-sport-top">
        <strong>BEYOND / 越界</strong><span>MOVE AT YOUR OWN PACE</span>
      </header>
      <section class="case-sport-main">
        <div class="case-sport-poster">
          <span class="case-kicker">EVERYDAY / ANYWHERE</span>
          <h2>MOVE.<br />YOUR WAY.</h2>
          <div class="case-running-object" aria-hidden="true">
            <i /><i /><i />
          </div>
          <span>向前。不必有理由。</span>
        </div>
        <aside>
          <small>FORM 01 / 运动概念</small>
          <h3>为下一步而生。</h3>
          <p>原创抽象产品造型<br />无真实商品售卖</p>
          <div class="case-size-picker" role="group" aria-label="选择尺码">
            <button
              v-for="(size, i) in ['S', 'M', 'L', 'XL']"
              :key="size"
              :aria-pressed="choice === i"
              @click="choice = i"
            >
              {{ size }}
            </button>
          </div>
          <UiButton
            variant="primary"
            @click="
              say(
                '已加入本次清单：' +
                  ['S', 'M', 'L', 'XL'][choice] +
                  ' 码。未创建订单。',
              )
            "
            >加入清单 →</UiButton
          >
        </aside>
      </section>
    </template>
    <template v-else-if="caseId === 'miro'">
      <header class="case-board-top">
        <strong>共想 / board</strong><span>一个值得继续的想法</span
        ><UiButton
          size="sm"
          @click="
            notes.push('新的想法');
            choice = notes.length - 1;
            say('已添加便笺。');
          "
          >＋ 添加便笺</UiButton
        >
      </header>
      <section class="case-whiteboard">
        <svg
          viewBox="0 0 800 360"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M100 150 C220 50 260 270 400 170 S600 80 730 210" /></svg
        ><button
          v-for="(note, i) in notes"
          :key="i"
          class="case-sticky"
          :data-note="i % 3"
          :aria-pressed="choice === i"
          @click="choice = i"
        >
          <small>IDEA / {{ String(i + 1).padStart(2, "0") }}</small
          ><strong>{{ note }}</strong
          ><span>↗</span>
        </button>
      </section>
      <footer class="case-whiteboard-tools">
        <span>编辑选中的便笺</span
        ><UiInput v-model="notes[choice]" label="便笺内容" /><UiBadge
          >100%</UiBadge
        >
      </footer>
    </template>
    <template v-else-if="caseId === 'slack'">
      <header class="case-chat-top">
        <strong>同频</strong><span>一起，让好想法发生。</span>
      </header>
      <section class="case-chat-grid">
        <nav aria-label="讨论频道">
          <strong>创作工作室</strong><small>频道</small
          ><button
            v-for="(name, key) in {
              design: '设计讨论',
              general: '日常分享',
              notes: '灵感便笺',
            }"
            :key="key"
            :aria-current="channel === key ? 'page' : undefined"
            @click="channel = key"
          >
            # {{ name }}
          </button>
        </nav>
        <div class="case-chat-main">
          <h2>
            #
            {{
              { design: "设计讨论", general: "日常分享", notes: "灵感便笺" }[
                channel as "design" | "general" | "notes"
              ]
            }}
          </h2>
          <div class="case-chat-messages">
            <article>
              <span class="case-person">林</span>
              <div>
                <strong>小林 <small>09:41</small></strong>
                <p>这里的好想法，值得认真对待。</p>
              </div>
            </article>
            <article v-for="(msg, i) in messages[channel]" :key="i">
              <span class="case-person">我</span>
              <div>
                <strong>我 <small>刚刚</small></strong>
                <p>{{ msg }}</p>
              </div>
            </article>
          </div>
          <form @submit.prevent="send">
            <UiTextarea
              v-model="draft"
              label="频道消息"
              placeholder="分享一个想法…"
            />
            <div class="case-line">
              <small>切换频道会保留各自草稿</small
              ><UiButton
                type="submit"
                :disabled="!draft.trim()"
                variant="primary"
                >发送 ↑</UiButton
              >
            </div>
          </form>
        </div>
      </section>
    </template>
    <UiButton
      v-if="caseId === 'linear' && previousMove && !preview"
      @click="undoMove"
      >撤销移动</UiButton
    >
    <p v-if="message && !preview" role="status" class="case-receipt">
      {{ message }}
    </p>
  </UiTheme>
</template>

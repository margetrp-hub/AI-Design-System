# AI Design System 组件接口 · 0.4

Vue 入口 `@ai-design-system/ui`，React 入口 `@ai-design-system/react`，分别导入包的 `style.css`。当前67个Vue、18个React组件导出，共用 `@ai-design-system/styles`；API表和可操作示例见[在线工坊](https://margetrp-hub.github.io/AI-Design-System/)。源码维护在 `packages/ui/src` 与 `packages/react/src`，示例直接使用包组件。React只支持其实际导出，下面早期Vue控件不自动成为React接口。

## 0.3 布局、材质、文字与等待

### 新增可复用组件

| 导出 | 接口与边界 |
| --- | --- |
| UiDesignCase | `caseId` 为 `designCases` 的16种ID，`theme` 可覆写主题，`preview` 为缩略呈现；`action` 事件。虚构内容和浏览器模拟，用于设计研究，不包含业务后端。 |
| UiViewportFrame | `src`、`title`；独立 iframe 保留页面状态，支持390/768/1366/1440/1920预设、自定义宽高、连续宽度、方向、网格和适应/原尺寸。消费方传可信演示URL；不是DPR或原生设备模拟器。 |
| UiSettingsSection | `title`、可选 `description`、默认插槽；短设置行对齐、分组和留白。宿主负责字段、保存、错误与草稿。 |
| UiMotionSurface | `effect: tilt / magnetic / reveal`、`disabled`、默认插槽；稳定外层命中范围，内部展示层变化，支持减少动态及清理。 |
| UiTextScramble | `text`、`replay`、`duration`；字素分段、短时解码、完整无障碍文本，减少动态直接显示最终值。不要用于金额、错误或日志正文。 |

`UiLayout` 导航插槽的链接/按钮可加 `ui-nav-link`，按语言选择方形连续行、药丸分组或等宽工具导航。不附带业务路由。

### 既有布局与动效

| 导出 / 契约 | 关键接口 | 已实现行为 |
| --- | --- | --- |
| UiLayout | pattern: sidebar / topbar / master-detail / workbench / editorial / bento / settings / split / focused / conversation；label；header/navigation/default/aside/footer slots | 容器响应布局；插槽内容保持挂载，aside 不隐藏；conversation 独立滚动、底部输入slot；不提供路由或业务数据 |
| UiSurface | decoration: none / gradient / fluted / grid；material: solid / frosted / glass / liquid；glassVariant: clear / regular | 参考装饰表面；未传值时跟随主题；液态层只折射背景，不移动文字 |
| UiTextReveal | text；effect: fade / rise / blur；by: word / character / line；replay；duration | 字词行错峰；重播/替换文本不留下旧内容；完整文字只读屏一次 |
| UiNumberTicker | value；duration；decimals；locale；label | 有限数字更新可中断衔接；非有限值显示横线；读屏获取准确终值 |
| UiSpotlight | label；disabled；default slot | 指针光斑和 focus-within 反馈；减少动态禁用移动光斑；内容保留交互 |
| UiMarquee | items: readonly string[]；label；v-model:paused（默认true）；duration；reverse | 播放/暂停、悬停/聚焦暂停；重复轨道隐藏读屏且 inert；减少动态展开静态文本 |
| UiAsyncState | status: idle / pending / refreshing / success / error / cancelled；label；message；progress；retainContent；cancellable；@cancel / @retry；default/loading/error slots | 等待骨架和未知/已知进度，刷新保留内容，失败/取消提供重试；宿主拥有请求和回执 |

UiTheme 新增 `design`、`font`、`headingFont`、`material`、`glassVariant`（clear清透 / regular柔透，默认regular）、`transparency`（0–100）、`decoration`、`buttonFeel`、`motion`，全部通过注入与 portal 外壳传播。`design` 当前十二种视觉语言取值见 `compositionChoices`；可独立组合，完整初始方案由 `designRecipes` 导出。旧 `skin` 仅兼容，工作台不再提供项目预设选择。

`DesignRecipe = {version:1,name,layout,theme,override}`；`parseDesignRecipe(objectOrJson)`验证字段、枚举、字号1–1.2、透明度0–100与名称，返回规范配置，出错抛异常，不接受任意CSS/HTML。局部使用 `<UiTheme v-bind="{...recipe.theme,...recipe.override}">`。`layoutGuides` 给出任务建议和来源。

库CSS还提供 `.ui-section` / `.ui-section-heading`（连续编辑区）和 `.ui-scene`（整页背景），这些类依赖最近UiTheme的视觉语言；无须复制预览页CSS。字体需另导入 `@ai-design-system/ui/fonts.css` 或具体Fontsource家族，详见接入文档。

conversation 的默认桌面高度为680px，可在布局元素覆盖 `--ui-layout-height`；输入放footer，消息放默认slot，列表放navigation，辅助状态放aside。手机改成自然高度，消息区有480px滚动上限；宿主持有每个会话的消息/草稿并决定滚动、发送和请求状态。聚焦入口可省略navigation与aside；split省略navigation时仍保持双栏。

## 基础输入接口

| 导出 | 关键接口 | 行为 |
| --- | --- | --- |
| UiButton | variant: primary / secondary / ghost / danger；size: sm / md；loading；disabled | 默认 type=button；加载防重复 |
| UiInput | v-model: string；label；hint；error；required | 原生 input 属性透传，关联标签与错误 |
| UiTextarea | 同上；rows | 原生多行输入、保留调整高度能力 |
| UiField | label；hint；error；required；slot {id, describedby, invalid} | 复用字段外壳，宿主将 slot 属性传入自定义控件 |
| UiSelect | v-model: string；label；options: {value,label}[] | 原生 select；其他原生属性透传 |
| UiCheckbox | v-model: boolean / indeterminate；label；hideLabel；name；value；required；disabled | 半选、键盘、表单隐藏输入 |
| UiRadioGroup | v-model: string；label；options: UiOption[]；name；required；disabled | 原生同组 radio，方向键、禁用跳过、表单提交 |
| UiSwitch | v-model: boolean；label；disabled | 布尔选择；保存策略由宿主决定 |
| UiCopyButton | text；label；@copied；@error | 成功回执后反馈、错误重试、切换内容或卸载清理过时结果 |

## 选择与导航

| 导出 | 关键接口 | 行为 |
| --- | --- | --- |
| UiCombobox | v-model: string；label；options；loading；error；remote；@search；@retry | 本地按 label/description 筛选；remote 时仅展示宿主结果；搜索不直接保存业务 |
| UiDropdownMenu | items: UiMenuItem[]；label；@select(id)；默认 slot 为触发器 | 禁用、分隔、危险项、键盘与焦点返回；shortcut 仅展示，不注册全局快捷键 |
| UiTabs | v-model: string；items: UiTab[]；label；variant: line / segment；activationMode | 具名 slot 对应 value；默认 slot 收到 {value}；隐藏面板退出焦点顺序 |
| UiAccordion | v-model: string[]；items: UiAccordionItem[] | 多项展开，具名 slot 对应 value；展开高度与减少动态 |
| UiBreadcrumbs | items: {label,href?}[]；label | 前级原生链接，末级 aria-current；路由拦截由宿主维护 |
| UiSeparator | label? | 普通分隔或带文字分隔 |

`UiOption = {value,label,description?,disabled?}`。`UiMenuItem = {id,label,shortcut?,disabled?,danger?,separator?}`。`separator` 在该项之前插入分隔。

## 浮层与反馈

| 导出 | 关键接口 | 行为 |
| --- | --- | --- |
| UiTooltip | text；side；delay；默认 slot 为触发器 | hover / focus 说明，非交互内容 |
| UiPopover | v-model:open；label；side；align；trigger / default / close slots | 交互弹出层，碰撞、主题继承；default slot 提供 close() |
| UiDialog | v-model:open；title；description；preventClose；returnFocus；@closeRequest | 草稿保护，焦点约束与返回；trigger / footer slots |
| UiDrawer | 同 Dialog；side: right / bottom | 复用 Dialog 生命周期；不是拖拽手势式移动端 sheet |
| UiBadge | tone: neutral / accent / info / success / warning / danger；color?: CategoryColor | color 用于分类；非 neutral 的 tone 优先，必须提供文字 |
| UiAlert | title；description；tone: neutral / info / success / warning / danger；live；action slot | 持续消息；live 时宣读，危险错误用 alert |
| UiToastProvider | duration；label；scoped slot / useToast | 隔离通知队列；暂停、滑动、关闭与清空 |
| UiSkeleton | lines；avatar | 仅装饰占位，加载所属区域自行设置 aria-busy |
| UiProgress | label；value: number / null；max；color?: CategoryColor | 数值夹在 0..max；null/非有限数值、总量≤0 表示未知，无伪造百分比 |
| UiAvatar | name；src；size: sm / md / lg；color?: CategoryColor | 图片失败或缺失回退姓名缩写 |
| UiEmptyState | title；description；default slot | 放入真实下一步动作 |

`UiToastProvider` 包在会调用通知的子组件之外：

```vue
<UiTheme skin="console" palette="iris">
  <UiToastProvider><YourPage /></UiToastProvider>
</UiTheme>
```

在 `YourPage` 中 `const {notify,dismiss,clear}=useToast()`；`notify({title,description?,tone?,duration?})` 返回 ID。只能在真实操作回执后显示成功。长时间错误保留在表单或任务旁；不只依靠会消失的通知。

## 追加的可复用控件

| 导出 | 接口 | 已实现边界 |
| --- | --- | --- |
| UiSlider | v-model: number[]；label；min / max / step；unit；@commit | 单值或区间，键盘、指针与提交事件；支持数组中的多个滑块 |
| UiPinInput | v-model: string[]；label；length；mask；disabled；name；error；@complete(string) | 数字分格、粘贴、前导零与中间空位；填满只发 complete，验证请求归宿主 |
| UiTagsInput | v-model: string[]；label；max；disabled；name | Enter/逗号添加，粘贴、去重、删除与数量限制；重复/超量显示错误 |
| UiCommand | v-model:open；items: UiMenuItem[]；title；description；@select(id) | 搜索、空结果、键盘与焦点返回；宿主绑定快捷键与执行动作 |
| UiFilePicker | v-model: File[]；label；accept；maxBytes；maxFiles；multiple；disabled；@reject | 选择/拖放/移除、类型与大小/数量校验、去重；整个失败批次保留原选择，可重选；不调用上传接口 |
| UiResizable | label；defaultSize；minSize；direction；@resize；first / second slots；ref.reset() | 双栏拖动、键盘调整、按钮/双击重置；窄容器上下堆叠且保留内容；非虚拟布局引擎 |

文件类型校验是前端用户体验，上传服务仍须独立检查内容与权限。`File[]` 只驻留当前组件状态，不自动上传或保存磁盘。验证码不记录到日志或存储；示例只显示输入位数。

追加选型核对：官方 [shadcn-vue Command](https://www.shadcn-vue.com/docs/components/command)、[Pin Input](https://www.shadcn-vue.com/docs/components/pin-input)、[Reka Tags Input](https://reka-ui.com/docs/components/tags-input)、[Splitter](https://reka-ui.com/docs/components/splitter)，并核对本地 Reka 2.11.0 实际 API。使用官方依赖和自有适配/CSS，没有复制付费模板或受限组件包。

## 数据与主题接口

### UiTransition

`preset: fade / slide / scale / page`；`mode: default / out-in / in-out`；`appear`；`returnFocus?: HTMLElement`；`afterEnter / afterLeave`。基于 Vue Transition，slot 必须是单个 DOM 根或单根组件。`v-show` 保留草稿实例，`v-if` 卸载时数据须由宿主持有。退出开始即置 inert/aria-hidden，退出取消时恢复原属性；关闭包含焦点的内容时传 returnFocus，让焦点回到触发器。

采用当前主题的 normal 进入、fast 退出和 ease；slide 位移 8px，scale 为 0.98，prefers-reduced-motion 下关闭移动与过渡。不增加业务延迟或完成计时器。不包裹已有 Reka 弹层再竞争其生命周期；Dialog/Drawer/Popover 继续使用自己的存在与焦点机制。示例见工作台“动效与过渡”。

| 导出 | 关键接口 | 行为 |
| --- | --- | --- |
| UiTable | caption；head / default slots | 原生比较表面、局部横滚 |
| UiPagination | v-model: number；v-model:pageSize；total；pageSizes；disabled | 页码从 1 开始；总量变化时夹取有效页；每页变化回第一页 |
| UiDataTable | rows；columns；rowKey；caption；searchable；selectable；loading；error；@retry | 本地搜索、排序、分页、稳定 ID 跨页选择、错误恢复 |
| UiPanel | title；description；color?: CategoryColor；actions / default slots | 连续工作面、统一内边距；可选分类色顶线与标题底色 |
| UiTheme | skin；palette；mode；density；scale | 局部主题及浮层继承；不污染宿主全局 reset |

### DataTable 接入

```vue
<UiDataTable :rows="rows" :columns="columns" row-key="id" caption="空间列表"
  v-model:query="query" v-model:sort="sort" v-model:page="page"
  v-model:page-size="pageSize" v-model:selected="selected" selectable
  :loading="loading" :error="error" @retry="loadRows">
  <template #cell-status="{value}"><UiBadge>{{value}}</UiBadge></template>
  <template #toolbar><UiButton @click="create">新建</UiButton></template>
  <template #selection="{ids,clear}"><UiButton @click="process(ids)">处理选中项</UiButton></template>
</UiDataTable>
```

`columns: DataColumn<Row>[]`：key、label、sortable?、numeric?、format?。格式函数接收原值和行；排序使用原值，不使用格式化字符串。null/undefined 显示“—”并排在排序末尾。rowKey 必须是唯一稳定的 string/number，不能是当前行序号。

服务端分页使用 `manual` 与 `:total="serverTotal"`，传当前页 rows；库不重复进行本地筛选/排序/分页。宿主监听 query/sort/page/pageSize，控制请求、过期响应和真实总量。失败传 error、保留上次 rows，retry 重新请求；loading 不会抹掉已读数据。

选中 ID 在换页和搜索后保留；“选择本页”只影响当前可见行。切换账号/租户/数据域或删除记录后，由宿主清理 selected，避免旧作用域选择。库不执行删除、权限或计费。未实现列虚拟化、列拖拽、编辑单元格、分组透视。

### 主题组合

结构：console / clinical / pearl。配色：default / cobalt / iris / dream-pink / powder-blue / yellow-violet / jade / black-gold / neutral-black。配色覆盖颜色，结构保留圆角、间距、字号、阴影。三套结构与八套指定配色不是 24 套不同设计系统。

`mode: light / dark`；`density: comfortable / compact`；`scale: 1..1.2`。CSS 使用 `--ui-*`，允许在主题作用域覆写。浮层由 provider 继承参数；自定义 CSS 变量覆盖还需同步到 portal 或使用正式 token。

框架边界见 platforms.md。验收范围见 component-qa.md，实际通过记录见 verification.md。

### 组件色彩搭配

`CategoryColor = blue | violet | teal | amber | rose | lime`。通过 `@ai-design-system/tokens` 的 `colorRecipes.workbench / soft / garden` 获得预设搭配（label 与 colors），再按稳定对象 ID 分配颜色。`resolveTokens` 和 `getNativeTokens` 都返回 `category-颜色-soft/ink/solid`，Web 对应 `--ui-category-*`。同对象使用一致分类色，状态用 tone；具体应用见 [DESIGN.md](../DESIGN.md)。

## 0.4 新增可复用组件

0.4 的基线为62个Vue、18个React；0.5 增至67个Vue。同名接口有框架差异，完整props/events/slots由 [机器索引](../registry/manifest.json) 提取；先用 `npm run ui -- show --framework vue UiTaskLog` 查询，不能把Vue的字段直接传给React。

| 组件 | 用途 / 重要入口 |
| --- | --- |
| UiBackdrop | kind=rays/grid/particles/nebula；paused/intensity/speed/color；Vue expose retry、React retryKey |
| UiAuthCharacters | mode=idle/typing/password/reveal；paused；只接收状态，不读取密码 |
| UiAuthLayout | visual/default/footer分区；响应式左右入口；认证业务由宿主处理 |
| UiGlowBorder | paused/color/duration；可暂停流光边框 |
| UiSignalOrbit | nodes/selectedId/paused；固定位置选择与装饰轨道分离 |
| UiCommandDock | Vue v-model，React value/onValueChange；键盘定位与移动指示器 |
| UiTerminal | lines/title/live；轻量静态或宿主日志文本 |
| UiTimeline | steps 与当前/失败状态；动作由宿主执行 |
| UiAiComposer | 上下文、提示词、附件/工具插槽；IME、发送与停止；宿主拥有请求 |
| UiAiSuggestion | before/after/busy/error；应用/放弃/重试，草稿和保存归宿主 |
| UiToolActivity | running/success/error/approval/unknown/paused/cancelled；paused 继续同一流，cancelled 重新运行，unknown 先核对 |
| UiTaskLog | entries、shell=mac/windows、status/connection；时间/级别、筛选/复制、跟随与取消/续接动作 |

任务日志的Vue动作用 canCancel/canResume/canPause/canRetry 控制并监听事件；React使用可选onCancel/onResume/onPause/onRetry。maxVisible默认500，entries是宿主保留的日志；复制涵盖所有保留的匹配项而非只有可见的500条。每条都有稳定id、time、level、message；HTML和ANSI不会被执行。详见 [传输协议与保留策略](../packages/stream/README.md)。

新增的原创 Vue 组件：UiStudioAvatar（name/color/state/size）、UiStudioScene（members/selectedId/select）、UiStudioWorkbench（header/default/inspector/footer）、UiWordSwitch（words/interval/paused）、UiFoldedNote（title/label/v-model:open/default/detail）。均在基础 UI 包中，示例见 apps/catalog/src/StudioExamples.vue。旧非商业复刻包已移除。

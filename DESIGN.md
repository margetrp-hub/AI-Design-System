# AI Design System · 设计契约

版本：0.6，2026-11-17。设计值以 [tokens.json](packages/tokens/tokens.json) 为唯一事实源；组件接口以 [components.md](docs/components.md) 为准。支持自由组合的完整视觉语言，颜色变化或几个圆角参数不等于新风格。实际支持平台及验证见 [verification.md](docs/verification.md)。

## 完整视觉语言与独立搭配

视觉语言按钮选择协调的构图处理、材质、层级、字体与反馈默认值，保留当前配色、明暗、字号和密度。整套方案还带推荐页面骨架；用户可随后独立更换任一维度。console/clinical/pearl 只是历史项目外观种子，已从界面删除选择入口，兼容API仍保留。

| 语言 | 结构、组件与文字 | 适用场景 / 吸收依据 |
| --- | --- | --- |
| 精简工作台 | 连续导航、克制边界、实体读写区、小幅反馈 | 密集后台、设置；Linear、shadcn 与用户工作台视频 |
| 新粗犷 | 独立硬框、错位实影、重标题、方形标签、压入式按钮 | 品牌工具、作品/活动；[NeoBrutalism Button](https://www.neobrutalism.com/docs/components/button) |
| 工业 / 仪器 | 无缝分区、方角、双线分隔、网格工作面、读数等宽字体、凹槽控件 | 编辑、监控、参数面板；用户 scaffold-master 与 Carbon |
| 液态玻璃 | 连续背景、悬浮胶囊导航、透明卡片/表单、透底输入、边缘折射、高光和柔和反馈 | 有背景层次的空间、媒体、个人工作台；Apple Materials 与 Web liquid-glass 机制 |
| 编辑排版 | 居中阅读宽度、较大衬线标题、开放留白、细线分章、平面操作 | Wiki、文章、长编辑；用户视频的长表单与阅读层级 |
| 柔塑拟物 | 软圆角、凸起表面、内陷输入、柔和外影、立体按压、几何人文字体 | 个人工具与轻创作；LeiBox tactile-push-button 的按压层次，独立组合实现 |
| 数字光场 | 点阵工作底、精密薄框、边缘光晕、紧凑几何标题、清楚的操作轴线 | AI/开发工具与功能展示；Aceternity Card Spotlight、Magic UI 展示手法，独立组合实现 |

以上七种基础方向加上墨界、格构、声场、织光、彩阶和素构，共十三种语言，必须在相同内容、相同配色下仍能区分。颜色、材质、装饰与语言分别有接口；渐变封面是一种装饰，不单独算视觉语言。上述组合是自有实现，不声称各参考站点官方提供这些整套主题。

### 素构 · Astryx 启发

吸收 [Astryx Neutral](https://astryx.atmeta.com/themes) 的关系：灰色内嵌底与实体工作面、平实强字重、胶囊主操作、紧凑圆角分段和整面选择反馈。与静序的连续细边界、彩阶的有色容器区别在于底面/内容面关系与动作造型；不会靠固定黑白配色识别。`design="astryx"` 使用共享 tokens/styles，完整起点选 topbar 和 Manrope，可独立更换配色、字体、材质或骨架。

从官方控件体验吸收数量步进、可选择卡片、分段选择与 metadata 摘要：复用 Reka 和原生输入语义，组件自有实现，未引入 Astryx/StyleX、品牌素材或其源码。清空数值不变成 0；摘要的 0 不变成缺失；滚动表单不意外改数值。选择和预览保持同一组数据，演示不创建订单。接口与范围见 [组件文档](docs/components.md#06-数值选择与摘要)。

### 玻璃和透明度

`material="liquid"` 使用透底填充、边缘位移层与指针高光，`transparency` 为0–100：0实体底，100完全透明填充（仍保留轮廓和高光）。导航、卡片、表单、输入与弹层继承同一透明度。`glass` 使用透明模糊材质；`frosted` 为较实的磨砂表面；`solid` 为实体表面。

UiSurface 和 UiLayout 导航内部的 UiLens 独立生成圆角矩形法向位移图，SVG 只处理背景，文字不进入位移滤镜。使用按实际尺寸计算的滤镜坐标，内采样的弧形边缘，先采背景再画薄高光，避免折射自身白边产生尖角。`glassVariant="clear"`保留背景细节，`regular`柔化背景以便阅读；玻璃方案默认为clear、透明度88。透明度与模糊是独立选择。

依据[Apple Materials](https://developer.apple.com/design/human-interface-guidelines/materials)，悬浮导航与控件是重点使用位置；长正文适合普通材质。工作台另用原创几何底图展示光学层，移动背景可检查折射与文字稳定。没有复制Apple壁纸或系统图像。Chromium启用边缘折射，其他引擎采用CSS回退；减少透明/不支持backdrop-filter时使用实体背景，强制颜色模式保留轮廓。高透明度没有全背景对比度保证，实际页面需检查读写区域；此为Web近似，不声称macOS原生光学或系统自动亮度适应。

### 字体是可用资源

正文和标题分别由 `font` / `headingFont` 选择：系统、Geist、Noto 中文黑体、Noto 中文宋体、IBM Plex Mono、Manrope、Space Grotesk、Fraunces、霞鹜文楷。前四种拉丁展示字体用 Noto 中文补齐；Fraunces 配中文宋体。中文显示不是英文家族字体本身的能力。

Geist 适合界面，Manrope 适合轻工具，Space Grotesk 适合科技标题，Fraunces 适合展示衬线，Plex Mono 适合数字/代码，Noto 适合长中文，文楷适合书写气质标题/阅读。这些是选用建议，不强加给每个页面。固定依赖和OFL许可在包声明；`fonts.css`可选导入，生产按需加载。文楷完整字重较大，不能为了字体数量把所有资源预加载。

### 可消费的十种页面骨架

`UiLayout` 的 header/navigation/default/aside/footer 插槽由宿主管内容，切换布局不重建这些输入。布局基于容器宽度降为上下排列，所有 aside 内容保持可达。

| 骨架 | 适合什么任务 | 主要关系 |
| --- | --- | --- |
| sidebar | 管理后台、设置、资源 | 稳定侧导航 + 连续工作区 |
| topbar | 模块较少的门户、服务入口 | 横向导航 + 宽内容 |
| master-detail | 工单、客户、消息、资产审阅 | 较宽列表 + 详情和补充上下文 |
| workbench | AI创作、编辑器、分析 | 资源 / 主任务 / 属性或证据三栏 |
| editorial | 知识库、文章、长编辑 | 有上限的阅读宽度 + 章节导航 |
| bento | 概览、产品展示 | 主内容大区域 + 次级事实，分区留白 |
| settings | 账户、偏好和配置 | 分组导航 + 限宽表单 + 连续说明与操作 |
| split | 开户、邀请、首次设置 | 短任务与产品说明并列；窄屏按顺序阅读 |
| focused | 登录、验证、单项提交 | 单列聚焦，缩短阅读和操作路径 |
| conversation | AI、客服和项目讨论 | 独立会话列表、限宽消息与固定底部输入 |

骨架不自带业务路由、数据或权限。十种是已实现布局，不等于十套业务应用。scaffold-master、用户V2视频和[Carbon 2x Grid](https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview)提供关系参考；引用网站的页面不作为可分发模板复制。

### 新增开源设计吸收（2026-11-13）

`VERIFIED-SOURCE / IMPLEMENTED-LOCALLY`：以下源码与许可证已读，布局关系用自有Vue/CSS实现；不引入React运行时，不复制品牌图像或认证/AI业务。

| 来源与固定修订 | 吸收成什么 | 适用边界 |
| --- | --- | --- |
| [Shadcn Admin](https://github.com/satnaing/shadcn-admin/tree/e16c87f213a5ba5e45964e9b67c792105ec74d26)，MIT | settings分组设置、split分屏入口；读取settings/index.tsx及auth/sign-in/sign-in-2.tsx | 自有插槽/断点；对原仓库认证不作接入承诺 |
| [Tailark Blocks](https://github.com/tailark/blocks/tree/8139698115c1341bfd2e3e286c04bb4d8146f472)，MIT | focused聚焦入口；读取Veil login/two.tsx的窄表单与层级 | 不复制商标、第三方登录图标或Pro内容 |
| [assistant-ui Thread](https://github.com/assistant-ui/assistant-ui/blob/7854908de003619397e9e30c578eb926246d2068/packages/ui/src/components/react/assistant-ui/elements/thread.aui.tsx)，MIT | conversation限宽消息、独立滚动与底部输入 | 示例按会话保留草稿/本地消息；无AI、附件或外部发送实现 |

Square UI核对时使用自定义ln-dev许可，明确限制独立组件库/模板分发，本库没有纳入其代码或模板。开源名义、免费演示与可作为组件库分发必须分别核对。

## 气质与任务

稳定、清晰、有亲和力。工作台用中性底承载信息，让局部色彩帮助分组和识别。界面可以丰富，主要动作仍清楚；密集操作页保留可比较的行列、可见的字段边界和错误恢复。营销页与空间场景可另选构图，不能把其大标题、整屏色块和装饰动画变成所有项目的默认。

用户提供的 teacher 工作台截图说明了一个有用的关系：灰白空间统一，蓝色教学屏建立焦点，人物、书本、班级、状态提供小面积色彩。我们吸收局部色彩与对象身份的联系，不复制人物资产，也不把截图中的低对比小字当作可读性标准。此项是视觉评估，不是对原项目的无障碍认证。

## 颜色的四种分工

| 角色 | 对应实现 | 使用方式 |
| --- | --- | --- |
| 中性底 | canvas / surface / raised / soft / text / muted | 页面、输入与连续工作面；正文保持稳定对比 |
| 品牌与行动 | accent / on-accent / accent-soft，UiTheme.palette | 主按钮、选中控件等；按钮主次由操作优先级决定 |
| 结果与风险 | info / success / warning / danger 及各自 soft | Badge、Alert、Toast；配合“处理中/已保存/失败”等文字，不因项目配色而改含义 |
| 分类与身份 | category-{blue,violet,teal,amber,rose,lime}-{soft,ink,solid} | 项目、团队、资源类型；同一对象在头像、标签、面板、进度和列表中保持对应关系 |

分类色每组包含浅/深模式各自的底色 soft、文字 ink、强调线/进度 solid。图标和文字用 ink 配 soft，不把同一个十六进制色同时当底色和文字。一般文字对实际背景至少 4.5:1；进度填充与轨道至少 3:1。小色块、文字、图标共同承担识别；分类色不是图表色盲可辨认性的保证，图表仍需直接标签或线型。

## 已实现的配色组合

从 `@ai-design-system/tokens` 导入 `colorRecipes`，选定组合后给稳定对象分配 `color`，不要用排序后的行索引决定对象颜色。

| 组合 | 分组色 | 适合的表达 |
| --- | --- | --- |
| workbench | 蓝 / 琥珀 / 青绿 / 紫 | 操作工作台，冷暖对照、小面积强调 |
| soft | 紫 / 玫瑰 / 蓝 / 青绿 | 设计协作、个人空间、柔和彩纸 |
| garden | 青绿 / 柠绿 / 琥珀 / 玫瑰 | 内容与资源空间，自然、温暖 |

一页选一个主组合，颜色数量按实际分类决定；没有固定的“60/30/10”达标公式。颜色优先对应对象、图像、分类或动作；装饰来自指定参考及用户选择。此前自动给卡片加顶线和标题色块没有具体来源，已移除，不能再作为默认“丰富化”手法。视觉语言、全局配色和对象分类色是不同维度。

## 组件配对

```vue
<UiPanel color="blue" title="资料整理" description="同一项目的身份保持一致">
  <UiAvatar name="林晓" color="blue" />
  <UiBadge color="blue">资料项目</UiBadge>
  <UiProgress color="blue" label="整理进度" :value="72" />
  <UiBadge tone="success">已保存</UiBadge>
</UiPanel>
```

`UiPanel.color` 保留分类属性兼容，不再自动绘制彩色顶线或标题底；`UiAvatar.color` 为回退头像上色；`UiProgress.color` 同步轨道与填充；`UiBadge.color` 标记类别。Badge 同时收到非 neutral 的 `tone` 与 `color` 时，状态语义优先。

图标底座可复用 `.ui-color-icon[data-ui-color="blue"]`，其中 SVG 来自同一图标集，装饰图标用 aria-hidden，实际名称由邻近文本提供。交互状态仍保留边界、焦点和标签，不用改色代替真实选择行为。

## 文字、几何与动效

沿用组件包的系统/CJK 字体、tabular-nums、间距和圆角层级。正文常规权重，数值与标题适当突出；不要用极浅小字制造“高级感”。字号缩放独立于密度；无论风格如何，触摸目标、焦点、弹层恢复和失败状态保持可用。

历史 skin 仅作兼容种子。新视觉语言由前述完整组合定义；分类色不决定页面布局。动效可包含明确选用的展示性效果，持续运动有暂停方式，尊重 reduced motion。

### 可复用动效

| 关系 | 实现 | 节奏与边界 |
| --- | --- | --- |
| 直接操作反馈 | Button、Switch、选择态与焦点 | fast，默认120ms；事件立即执行，边界不跳动 |
| 内容出现/退出 | UiTransition: fade / slide / scale | normal进入、fast退出；默认200/120ms，8px轻移或0.98缩放；可快速反向 |
| 展开与收起 | Accordion | 高度跟随内容；隐藏内容离开键盘顺序 |
| 聚焦工作面 | Dialog / Drawer | enter，默认240ms；从实际方向进入，焦点与草稿保护同步 |
| 菜单与轻浮层 | Tooltip / Popover / DropdownMenu | 短入场，关闭及时释放最上层事件，连续 Escape 正确逐层退出 |
| 加载与结果 | Progress / Skeleton / Toast / CopyButton | 完成来自真实回执；未知总量不生成百分比；减少动态仍可用 |

`--ui-ease` 来自 token。窗口或页面切换不应重放整张表的入场动画；没有业务需要的循环装饰不加入默认风格。内容过渡由 Vue 管理存在，已有 Reka 浮层不再叠加第二套动画所有者。退出内容及时 inert；若关闭时焦点在其中，调用者提供 returnFocus。减少动态在系统设置改变时实时生效，不依赖 animationend 清理。

## 吸收依据与边界

- `EXTRACTED`：[Atlassian 颜色角色](https://atlassian.design/foundations/color/)与[分类强调色](https://atlassian.design/foundations/color/accents/)区分品牌、状态、类别及强调强弱；据此采用分开的接口。
- `EXTRACTED`：[Radix 色阶用途](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)区分背景、交互、边界、实色和文字；本库采用自己校验过的角色值，没有直接复制其完整色阶。
- `EXTRACTED`：[W3C Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)要求不能只凭颜色传达必要信息；本库的分类与状态同时保留文字/符号。
- `EXTRACTED / THIRD-PARTY-ANALYSIS`：用户给出的 [awesome-design-md](https://github.com/voltagent/awesome-design-md/tree/fcc70284932276d085f01ef9f83edde90b1258cb)，本次检查 Airtable、Figma、Miro、Shopify 的 DESIGN.md。它们启发了把设计决策写成可调用契约，以及中性框架配局部色块的表达。它们是第三方网站分析，部分明确针对营销页，不是对应品牌官方组件规范。
- `IMPLEMENTED / LOCAL-ONLY`：此处的六组分类色、三组配色组合与组件接口为本库自己的实现；不引入品牌专属字体、人物、商标或整页模板。官网分析数值不替代当前库的对比度与浏览器检查。

配色实验位于本地工作台“主题与配色”。可以关闭/开启组件配色、选择组合，再切换深浅色和字体大小比较。

## 追加的动态组件与等待

实际导出：UiTextReveal（淡入/逐字上浮/模糊显现，支持逐字/词/行）、UiNumberTicker（可中断数字插值）、UiSpotlight（指针/焦点光斑）、UiMarquee（播放/暂停、hover/focus暂停、减少动态静态展开）、UiAsyncState（首次加载/刷新保留/成功/失败/取消）。UiTransition 新增 `page` 横向轻移与 out-in 切页。所有示例见 [动效工作台](http://127.0.0.1:4318/#motion)。

参考：[Magic UI Number Ticker](https://magicui.design/docs/components/number-ticker)、[Marquee](https://magicui.design/docs/components/marquee)、[Blur Fade](https://magicui.design/docs/components/blur-fade)、[Aceternity Text Generate](https://ui.aceternity.com/components/text-generate-effect)、[Card Spotlight](https://ui.aceternity.com/components/card-spotlight)。吸收表现机制，Vue实现自行编写，没有复制上游组件代码。

等待状态由真实任务/请求决定，UiAsyncState不自行执行请求、不计时伪造成功；未知时长不显示百分比，刷新保留已有内容，失败/取消提供重试。示例明确是本地延迟演示，可取消与重试，旧回执不覆盖新结果。切页草稿放在存活的宿主状态；动画层不替代路由、缓存或滚动恢复。

玻璃资料：[Apple Materials](https://developer.apple.com/design/human-interface-guidelines/materials)、[rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react)。后者明确提示 Safari/Firefox 位移支持差异；本库未依赖React包，也没有移植其源码。渐变封面、棱纹、立体按压参考用户给出的 LeiBox 对应公开说明，当前前两者为静态表面效果，不冒充原站完整流场动画。

## 0.4 视觉语言与资产增量

新增五种完整方向：墨界（Geist启发）、格构（Carbon启发）、声场（Spotify启发）、织光（Stripe启发）、彩阶（Material启发）。连同原有七种，基础库共有十二种；形状、标题层级、导航和表面关系分别定义在tokens.json与共享CSS，配色/字体仍可独立搭配。栖间是新写的原创空间组件，角色、家具和构图不使用 workstation-teacher 代码或绘制；它是场景组合，不伪装成第十三个全局主题。

新增 board/command-center/showcase/studio 四种骨架，分别承接状态列、关系中心、展示主页、编辑画布；示例有列移动、节点选择、属性修改与构图切换。它们不是已经实现的业务看板或视频编辑服务。

增加登录四角色、光束、星尘、网格/星雾、流光边框与轨道、移动导航、终端/时间线。在线AI/SSE是明确标注的浏览器设计模拟；真实接入由宿主服务确认终态。终端提供macOS与Windows外观；暂停跟随、暂停接收、取消任务分别处理。字体沿用九种可选资源，不加载品牌私有字库。整体组织与新吸收见 [architecture.md](docs/architecture.md)。

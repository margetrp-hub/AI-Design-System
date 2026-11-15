# 设计吸收与来源

本库将机制和经验变成自己的可复用实现。观察日期为2026-11-14 至 2026-11-15，品牌启发不代表品牌授权或官方合作。

## 自有实现

栖间 UiStudioAvatar / Scene / Workbench 是原创 SVG、CSS 家具和空间构图：圆角机器人、拱窗、木质桌面、绿植与成员详情。未使用 workstation-teacher 的绘制、角色、家具或代码。原非商业复刻已从本发行移除。

UiWordSwitch 和 UiFoldedNote 分别吸收文字切换、纸张折角与渐进展开的机制，用自有 Vue/CSS 实现。没有复制 Once UI、Motion Primitives 或 Cult UI 源码。组织方式见 [architecture.md](architecture.md)。

背景光束、登录角色和分屏入口来自维护者自有项目的可复用视觉代码；在此抽离业务，统一生命周期。深网 `grid` 保留自有管理员登录页的四面透视网格和往返扫描；星序 `particle-field` 保留旧 OHLAOO.COM 企业首页的五形态粒子坐标，以无 Three.js 依赖的 WebGL 点渲染实现。它们分别展示为完整居中登录与首页背景，不再与左右分屏人物入口混用。轻量星尘 `particles` 仍是独立资产。未打包 ReactBits 代码或受限素材，未包含原业务登录、风控、域名探测或接口。

## 参考与改编

| 来源 | 用途 / 边界 |
| --- | --- |
| [shadcn/ui](https://github.com/shadcn-ui/ui)、[shadcn-vue](https://github.com/unovue/shadcn-vue) | 源码所有权与语义 token 思路；Vue 使用 Reka，React 有自己的接口 |
| [Magic UI](https://github.com/magicuidesign/magicui/tree/6f7b531e77659855d4bc1bec8e20fdb0c8199b20) | 轨道构图适配；MIT 署名与全文在 styles/THIRD_PARTY_NOTICES.md |
| [awesome-design-md](https://github.com/VoltAgent/awesome-design-md/tree/fcc70284932276d085f01ef9f83edde90b1258cb) | 第三方品牌分析，交叉对照官方设计系统；未复制品牌资产 |
| [Geist](https://vercel.com/geist/introduction)、[Carbon](https://carbondesignsystem.com/)、[Material](https://m3.material.io/) | 墨界、格构、彩阶的层级与形态启发，独立 CSS |
| [Apple Materials](https://developer.apple.com/design/human-interface-guidelines/materials) | 悬浮控件透明度、边缘和阅读分层；Web 近似，不是原生光学 |
| [Shadcn Admin](https://github.com/satnaing/shadcn-admin)、[Tailark](https://github.com/tailark/blocks)、[assistant-ui](https://github.com/assistant-ui/assistant-ui) | 设置、分屏、会话布局关系；独立实现，不复制应用后端或品牌 |
| [ReactBits](https://github.com/DavidHDev/react-bits)、[Aceternity](https://ui.aceternity.com/) | 效果方向参考；不得以“免费演示”推断可作为组件库再分发 |

## 视频经验与技巧吸收（2026-11-15）

视频用于学习交互、排版和小技巧，整合到现有组件、样式和 Skill；不是“一条视频新增一个案例”。原始视频及抽样画面仅保留在维护者本地学习区，不进入公开包。“观察”指实际提链后查看画面与字幕；综合建议不声称是作者原话或全片逐字转写。

| 学习来源 | 观察与吸收位置 |
| --- | --- |
| [小刷AI全栈：16种UI动效](https://v.douyin.com/0G0ww4UcCe8/)（[另一个分享链接](https://v.douyin.com/hv67X-x3hv8/)） | 抽样看到光斑、滚动揭示、磁吸、倾斜、文字解码、骨架流光、数字变化和缓动等。补入 `UiMotionSurface` / `UiTextScramble`，其余复用已有 spotlight、ticker、marquee、loading；不把所有效果叠在一个页面。 |
| [小刷AI全栈：提示组件](https://v.douyin.com/wHXP6wa7SeA/) | Tooltip、Toast、Alert、Modal、Popconfirm 的打扰程度和用途不同；按内容复杂度和上下文选择弹层。复用现有浮层与反馈组件，Skill 强调草稿、恢复、明确动作标签。 |
| [设计碎碎念：商业UI质感](https://v.douyin.com/V8eLesalzTw/) | 深色底、局部高亮和轻微材质服务信息层级；主数值、单位和辅助信息需要不同权重。整合进视觉语言和组件配色指导，保留既有对象分类色接口。 |
| [设计师PPM：运动曲线](https://v.douyin.com/mK5L1Uy1jeQ/) | 线性、缓入、缓出、缓入缓出和自定义曲线对应不同运动过程。补入 Skill 的按动作选曲线规则；教程参数不当成统一常量。 |
| [IT民工贾大兵：UI控件分享](https://v.douyin.com/3Wtk2VuHj6g/) | 抽样包含空气指标、步数和习惯类控件；提炼场景→操作→反馈，复用数字、进度和趋势组件，不新增没有业务用途的整页。 |
| [IT民工贾大兵：动效库](https://v.douyin.com/AhTOfqtWJBw/) | 画面展示 MetalForge 的粒子、流体、玻璃和参数即时预览；吸收材质参数可调的组织方式。未复制或分发该库代码，效果视频不能证明运行性能或许可。 |
| [林逸AIGC：按钮手感](https://v.douyin.com/zukCTWdZtXg/) | 点赞反馈、提交状态形变、弹性开关与长按确认；提炼触发/运动对象/终态/取消路径。技能明确成功依赖回执、长按有释放取消和键盘替代，装饰不替代状态。 |
| [夏夏的AI灵感：视觉风格](https://v.douyin.com/fAihfWOZxfg/) | 玻璃、拟物、极简、编辑排版、粗犷、包豪斯、像素等同时改变构图、字体与材质。强化已有视觉语言的结构差异；没有照搬插画，也没有把每个名称都宣称为已实现。 |
| [宋夏天Dazzle：大屏Skill](https://v.douyin.com/S9llAyhzQKU/) | 展示布局、图表、三维材质和地图的分工。吸收先判断数据与空间任务再选工具，不自动安装推荐 Skill，不把三维装饰视为数据准确性。 |
| [西瓜同学：Dashboard布局](https://v.douyin.com/Xnc9UFoJ0mA/) | 抽样看到主次模块、通栏分层、主区加侧栏、画布加浮动面板。整合到骨架选型指导；比例和间距按内容重算。 |
| [设计师PPM：界面配色](https://v.douyin.com/5ynRkNcXr8k/) | 按主要动作、文字、背景、分隔与错误分配颜色；前景/背景成对检查，暗色不能只把白底变黑。设置演示改用语义色，继续复用配色与对象分类色体系。 |
| [费纸张：设置页三步排版](https://v.douyin.com/65QyRlIq1W8/) | 名称/控件两端对齐，减少重复外框，分组标题与组间留白；注册表单仍采用上下排列。实现为 `UiSettingsSection` 和表单区组件演示；保存策略与失败恢复是本库补充。 |
| [设计师PPM：渐进式披露](https://v.douyin.com/Ou22ciPJ-i8/) | 导出格式、范围、记录数和主动作先展示；编码等低频选项再展开。按目标用户使用频率决定层级。写入 Skill；提醒频率随开关显示。 |
| [SpicyTater：后台菜单交互](https://v.douyin.com/ysJkkszbILY/) | 连续选中底块、就地子菜单、顶部分类面板、Dock、命令面板、真实未读数各有用途；快速切换、中文输入与真实状态不能丢。导航改为任务分组，相关边界进入 Skill。 |
| [设计师PPM：优秀UX的特征](https://v.douyin.com/Nxyet7mZV6w/) | 以实际任务检查用途、可找到、可信、可达、一致和恢复。抽样看到费用说明、可操作错误和备份恢复入口；不把十项口号变成机械评分。 |
| [海归程序员李工：可视化网格](https://v.douyin.com/Pzgvo6AFvJ8/) | 不同宽度的重排、连续调节与可用CSS。吸收到 `UiViewportFrame`：真实CSS视口、预设/连续宽度、方向切换与辅助网格；没有复制视频里的布局编辑器。 |
| [Auroral：不用AE的动效](https://v.douyin.com/NogQOdFtQ2A/) | 聚焦、镜头编排和3D环形相册，介绍 video-shotcraft。它主要是视频镜头资源；提炼先选场景和动作再实现的方法，未安装或复制其 Skill。 |

## 完整页面案例

完整案例是另一类资产：`UiDesignCase` 根据 awesome-design-md 固定修订中 Apple、Vercel、IBM、Stripe、Spotify、Notion、Linear、Figma、Airbnb、Shopify、Claude、Supabase、NVIDIA、Nike、Miro、Slack 的分析，独立实现产品画廊、部署、资源表、商业叙事、媒体、文档、看板、画布等16个页面。营销关系被转译到对应任务，不宣称还原品牌真实产品；Notion等文档场景尤其是本库的任务化演绎。每项保留参考链接与接入代码。

## 分发边界

自有代码与本仓库新写 skill 使用根目录 MIT。Magic UI 改编保留 MIT notice。Vue、React、Reka、Lucide 以及 Fontsource 依赖保留各自声明。字体使用 SIL OFL；分发构建后的字体时仍需保留许可，见 packages/ui/THIRD_PARTY_NOTICES.md。静态站构建自动附带八个字体包的实际版权/OFL全文，可从[在线许可页](https://margetrp-hub.github.io/AI-Design-System/licenses/)查阅。

不包含商标、官方私有字体、付费模板、内部业务数据或用户提供的私有视频。任何后续直接改编，需记录实际文件、版本、许可及修改范围。

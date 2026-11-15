// Human-owned purpose/limits only. Exports and API types come from the built declarations.
export const usage = Object.fromEntries(
  [
    [
      "UiDesignCase",
      "独立页面设计语言与交互演绎，虚构数据",
      "case 案例 Apple Vercel IBM Stripe Spotify Notion Linear Figma Airbnb Shopify Claude Supabase NVIDIA Nike Miro Slack",
    ],
    [
      "UiViewportFrame",
      "按真实 CSS 视口尺寸预览页面，保留内部状态",
      "viewport 分辨率 响应式 iframe 网格 预览 手机 平板",
    ],
    [
      "UiSettingsSection",
      "按决定分组的连续设置表面与自适应对齐",
      "settings 设置 分组 对齐 留白 表单",
    ],
    [
      "UiMotionSurface",
      "指针倾斜、磁吸与进入视野显现",
      "motion tilt magnetic reveal 磁吸 倾斜 动效",
    ],
    [
      "UiTextScramble",
      "短文字解码动效与减少动态支持",
      "text scramble 文字 解码 动效",
    ],
    [
      "UiStudioAvatar",
      "原创圆角机器人角色与状态",
      "avatar 角色 空间 原创 studio",
    ],
    [
      "UiStudioScene",
      "原创家具空间与可选择的成员工作位",
      "scene 场景 家具 成员 空间 studio",
    ],
    [
      "UiStudioWorkbench",
      "空间工作室骨架与成员详情",
      "studio workbench 骨架 工作室",
    ],
    [
      "UiWordSwitch",
      "可暂停的文字轮换与稳定宽度",
      "text 文字 动效 轮换 motion",
    ],
    ["UiFoldedNote", "可展开细节的折页札记", "note paper 折页 札记 卡片"],
    [
      "UiTheme",
      "主题作用域：视觉语言、明暗、配色和字体",
      "theme 主题 风格 配色 字体 暗色",
    ],
    ["UiButton", "执行动作、提交与禁用", "button 按钮 保存 提交 loading"],
    ["UiInput", "带标签的单行输入", "input 输入 表单 设置"],
    ["UiTextarea", "多行文本输入", "textarea 输入 长文本 描述"],
    ["UiSelect", "有限选项的原生下拉选择", "select 选择 下拉 表单"],
    ["UiCheckbox", "复选与半选", "checkbox 复选 多选"],
    ["UiRadioGroup", "一组互斥选项", "radio 单选"],
    ["UiSwitch", "布尔开关", "switch 开关 设置"],
    ["UiField", "自定义输入的标签、描述与错误关联", "field 表单 标签 校验"],
    ["UiCopyButton", "复制文字并处理剪贴板失败", "copy 复制 剪贴板 重试"],
    [
      "UiCombobox",
      "可搜索选择器，支持宿主远程查询与重试",
      "combobox 搜索 选择 远程 重试",
    ],
    ["UiDropdownMenu", "上下文动作菜单", "menu 菜单 操作"],
    ["UiTabs", "同页内容分组与键盘切换", "tabs 页签 导航"],
    ["UiAccordion", "按需展开分组内容", "accordion 折叠 展开"],
    ["UiBreadcrumbs", "层级路径导航", "breadcrumbs 面包屑 导航"],
    ["UiSeparator", "内容分隔", "separator 分隔"],
    ["UiTooltip", "非交互的简短说明", "tooltip 提示"],
    ["UiPopover", "带交互的轻浮层", "popover 浮层 选择"],
    [
      "UiDialog",
      "聚焦任务弹窗、草稿保护与焦点返回",
      "dialog 弹窗 对话框 编辑 焦点",
    ],
    ["UiDrawer", "侧边或底部详情面板", "drawer 抽屉 详情"],
    ["UiPanel", "标题和内容分组面板", "panel 卡片 面板"],
    ["UiBadge", "分类和语义状态标签", "badge 标签 状态 分类"],
    ["UiAlert", "持续展示错误、提示与恢复动作", "alert 提示 错误 重试"],
    ["UiToastProvider", "短消息通知的作用域", "toast 通知 成功 错误"],
    ["UiSkeleton", "加载占位，不代表业务进度", "skeleton 骨架屏 占位 等待"],
    ["UiProgress", "已知进度或未知时长", "progress 进度 等待 加载"],
    ["UiAvatar", "头像与姓名回退", "avatar 头像"],
    ["UiEmptyState", "空结果与下一步动作", "empty 空状态 空结果"],
    ["UiTable", "原生表格表面", "table 表格 列表"],
    [
      "UiDataTable",
      "搜索、排序、分页、选择和失败重试的数据表格",
      "table 数据表格 列表 筛选 搜索 排序 分页 服务端",
    ],
    ["UiPagination", "分页与每页数量", "pagination 分页"],
    ["UiSlider", "单值或区间滑块", "slider 滑块 数值 透明度"],
    ["UiPinInput", "数字验证码输入", "pin otp 验证码"],
    ["UiTagsInput", "可添加、去重和删除的标签输入", "tags 标签 输入"],
    ["UiCommand", "可搜索的命令列表", "command 命令 搜索"],
    ["UiFilePicker", "选择、拖入和校验本地文件", "file 文件 上传 选择"],
    ["UiResizable", "可调整宽度的工作区分栏", "resizable 分栏 工作区"],
    [
      "UiTransition",
      "内容或页面进出，保留草稿与隐藏焦点管理",
      "transition 动画 过渡 切页",
    ],
    [
      "UiLayout",
      "十四种可组合的页面骨架",
      "layout 页面 骨架 设置 settings 对话 conversation 工作台 board 看板 studio 画布 showcase 展示",
    ],
    [
      "UiSurface",
      "内容表面、透明材质与装饰",
      "surface 卡片 表面 玻璃 glass 装饰",
    ],
    ["UiTextReveal", "文字逐字、逐词或逐行显现", "text 文字 动画 显现"],
    ["UiNumberTicker", "可中断的数字变化", "number 数字 动画"],
    ["UiSpotlight", "指针与焦点光斑", "spotlight 光斑 动效"],
    ["UiMarquee", "可播放、暂停的流动内容", "marquee 跑马灯 流动 动画"],
    [
      "UiAsyncState",
      "加载、刷新保留、失败、取消和重试的表达",
      "async 等待 加载 失败 取消 重试",
    ],
    [
      "UiBackdrop",
      "光束、四面扫描隧道、星尘、五形态粒子场和星雾，支持暂停与重载",
      "backdrop 动态 背景 光束 粒子 首页 OHLAOO 登录 隧道 rays grid particles particle-field nebula",
    ],
    [
      "UiAuthCharacters",
      "四个响应输入焦点和密码显示状态的角色",
      "characters 角色 登录 密码 动效",
    ],
    [
      "UiAuthLayout",
      "响应式左右分屏或全幅背景中央表单入口",
      "auth login 登录 管理员 注册 兑换 分屏 居中 split centered",
    ],
    ["UiGlowBorder", "可暂停的流光边框", "glow 流光 边框 动效"],
    [
      "UiSignalOrbit",
      "轨道关系展示与固定位置的选择操作",
      "orbit 轨道 科技 关系 动态",
    ],
    ["UiCommandDock", "跟随当前选择移动的导航底座", "dock 导航 动态 选择 快捷"],
    ["UiTerminal", "宿主日志内容的轻量终端展示", "terminal 终端 日志 复制"],
    ["UiTimeline", "带状态和恢复动作的过程时间线", "timeline 时间线 步骤 进度"],
    [
      "UiAiComposer",
      "支持上下文、IME和停止动作的AI输入器",
      "ai composer AI 助手 输入 SSE 对话",
    ],
    [
      "UiAiSuggestion",
      "修改前后对比与建议应用、放弃和重试",
      "ai suggestion AI 建议 diff 修改 审阅",
    ],
    [
      "UiToolActivity",
      "工具执行、授权、失败和未知结果的处理入口",
      "ai tool AI 工具 执行 状态 审批 重试",
    ],
    [
      "UiTaskLog",
      "macOS和Windows终端任务日志，筛选、跟随和恢复操作",
      "sse SSE terminal mac windows 终端 任务 日志 续接 流式",
    ],
  ].map(([name, purpose, keywords]) => [
    name,
    { purpose, keywords: keywords.split(" ") },
  ]),
);

export const limits = {
  vue: {
    UiTheme: [
      "只提供作用域；页面宿主设置canvas背景。字体另导入fonts.css或所需字体。",
    ],
    UiDialog: [
      "必须提供title/description。草稿保护由preventClose/closeRequest接到宿主动作。",
    ],
    UiDataTable: ["manual模式由宿主请求和维护服务端结果；组件不调用业务API。"],
    UiAsyncState: [
      "宿主拥有请求、成功回执、取消和重试；组件不会自行请求或计时制造成功。",
    ],
    UiFilePicker: ["仅浏览器File对象选择/校验，不会上传文件。"],
    UiSurface: [
      "液态折射是Web近似；Chromium实测，其他引擎与真实背景需单独验证。",
    ],
    UiTaskLog: [
      "受控日志视图，不请求接口、不执行Shell；canCancel/canResume等控制动作可见，事件由宿主接到任务服务。",
      "推荐@ai-design-system/stream的可选任务客户端；协议、保留期限和恢复边界见其README。",
    ],
    UiAiComposer: [
      "不连接模型，不自动清空草稿；submit/stop由宿主拥有，SSE示例使用真实流但固定演示内容。",
    ],
    UiBackdrop: ["WebGL失败保留CSS背景；通过组件暴露的retry重建。"],
  },
  react: {
    UiTheme: [
      "使用theme对象属性。当前只设置实体材质，不提供Vue液态折射运行时。",
      "字体资源由宿主导入。body portal需传播主题属性，参见React示例。",
    ],
    UiButton: [
      "无loading属性；宿主设置disabled/aria-busy和等待文字。",
      '原生button默认提交行为仍存在；非提交按钮明确type="button"。',
    ],
    UiInput: [
      "透传原生input属性；标签、错误关联和受控value/onChange由宿主提供。",
    ],
    UiTextarea: ["透传原生textarea属性；标签和错误关联由宿主提供。"],
    UiSurface: ["仅div表面；无Vue material/decoration属性和折射运行时。"],
    UiTable: ["仅原生table样式；排序、分页、选择和请求由宿主实现。"],
    UiTaskLog: [
      "受控日志视图；以onCancel/onResume/onPause/onRetry是否提供决定动作可见，不使用Vue canCancel属性。",
      "不执行Shell；SSE连接与任务执行是两种状态。",
    ],
    UiAiComposer: ["使用value/onValueChange；不连接模型、不自动清空草稿。"],
    UiBackdrop: ["retryKey变化重建；不是Vue expose retry方法。"],
  },
};

export const nativeElements = {
  UiTheme: "div",
  UiButton: "button",
  UiInput: "input",
  UiTextarea: "textarea",
  UiSurface: "div",
  UiTable: "table",
  UiBackdrop: "div",
  UiAuthCharacters: "div",
  UiAuthLayout: "section",
  UiGlowBorder: "div",
  UiSignalOrbit: "section",
  UiCommandDock: "nav",
  UiTerminal: "section",
  UiTimeline: "ol",
};
export const platforms = {
  vue: {
    implementation: "vue",
    runtime: "Web",
    status: "implemented",
    evidence: "docs/verification.md",
  },
  react: {
    implementation: "react",
    runtime: "Web",
    status: "partial",
    evidence: "packages/react/README.md",
  },
  next: {
    implementation: "react",
    status: "runtime-unverified",
    requires: ["client/server boundary", "SSR/hydration verification"],
  },
  electron: {
    implementation: null,
    status: "host-dependent",
    requires: ["choose Vue or React renderer", "verify window/IPC integration"],
  },
  "uni-app": {
    implementation: null,
    status: "tokens-only",
    requires: ["target-specific controls and runtime checks"],
  },
  "react-native": {
    implementation: null,
    status: "tokens-only",
    requires: ["native controls, fonts, keyboard and safe areas"],
  },
};

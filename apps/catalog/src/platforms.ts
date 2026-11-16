export const platforms = [
  {name:'Vue / Vite',shared:'设计令牌 + CSS + Vue 基础组件',owner:'@ai-design-system/ui',status:'本地实现',boundary:'现有项目保留业务接口，逐组件适配与回归。'},
  {name:'React / Next.js',shared:'设计令牌 + Web CSS + 18 个 React 组件',owner:'@ai-design-system/react',status:'React 已实现',boundary:'React 包已构建和浏览器验证；Next.js SSR / hydration 尚未验收。Vue 完整案例、布局和浮层不能直接导入。'},
  {name:'Electron',shared:'令牌 + 对应 Vue / React 渲染层',owner:'渲染进程与宿主分别维护',status:'设计可复用',boundary:'窗口、IPC、文件系统与系统菜单仍由 Electron 宿主管理。本库目录服务不能直接打包成桌面安全模型。'},
  {name:'Uni-app',shared:'颜色、数字尺寸、状态与设计规则',owner:'后续 Uni-app 组件适配层',status:'令牌可用',boundary:'先明确 H5 / 小程序 / App / uni-app x。view/text、事件、弹层与安全区按目标端实现；不直接复用 DOM / Reka。'},
  {name:'React Native',shared:'getNativeTokens() 数值与颜色',owner:'后续 React Native 组件适配层',status:'令牌可用',boundary:'Text / View / Pressable 原生实现；适配系统字体放大、触摸、读屏、键盘和安全区。不能直接使用 Web CSS。'}
]

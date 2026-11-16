# 多框架与多端边界

目标来自用户在2026-11-13的补充：后续会涉及 Next.js、Electron、Uni-app、React Native；React 与 Vue 都要能吸收已有设计。

| 层级 | 唯一维护位置 | 当前状态 |
| --- | --- | --- |
| 设计值 | `packages/tokens/tokens.json` | 十三种视觉语言、八套指定配色及默认配色、字体/动效、深浅色和密度；CSS / JS 自动生成 |
| Web 基础控件 | `packages/ui` | Vue / 原生控件 / Reka，69个组件导出；实际检查见 verification.md |
| Web 共用 CSS | `packages/styles` | Vue/React 共用组件、组合与动效样式，旧 Vue CSS 路径保留 import 入口 |
| React 控件 | `packages/react` | 0.2.2：18个组件，含角色动效、页面内AI和任务日志；Next.js SSR 尚未运行 |
| 共享传输与动效 | packages/stream、packages/effects | SSE framing / 可选任务客户端、Web动效生命周期；不等于原生组件 |
| Uni-app / RN 控件 | 各端真实组件适配 | 可读 token 值，原生 UI 尚未验证 |
| 页面与领域 | 各项目 owner | 不共享后端、权限、导航与业务状态机 |

## Vue、React 与 Next.js

Vue 项目参考 shadcn-vue/Reka；React 项目参考 shadcn/ui。共享同一套语义色、尺寸和状态命名，保持相近接口，不要求源码通用。Next.js 的交互控件需在明确客户端边界内，传递可序列化 props，验证 SSR 首屏、hydration 与主题初始化。[Next.js 官方边界](https://nextjs.org/docs/app/getting-started/server-and-client-components)（2026-11-13核对）。本库当前未运行 Next.js 工程。

## Electron

渲染层按实际选择使用 Vue 或 React 适配层；窗口管理、IPC、原生菜单、文件权限继续归宿主。文件选择组件使用浏览器 File API，不提供 Electron 主进程文件读写能力。[Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model)（2026-11-13核对）。本库当前未打包 Electron 应用。

## Uni-app

先确认 H5、小程序、App 或 uni-app x，再选组件。共享颜色、数值尺寸、内容层级；组件使用目标端的 view/text/事件与弹层机制，验证安全区、滚动和键盘。不要把浏览器 DOM、Reka Portal 或全部 CSS 假定可用。[官方组件说明](https://uniapp.dcloud.net.cn/component/)（2026-11-13核对）。当前未在这些目标端编译。

## React Native

```js
import { getNativeTokens } from '@ai-design-system/tokens'
const t = getNativeTokens({skin:'clinical',mode:'dark',scale:1.1,reducedMotion:true})
// 交给真实的 View / Text / Pressable；保留系统字体放大。
const panel = {backgroundColor:t.colors.surface,borderRadius:t.radii.panel,padding:t.sizes.inset}
```

样式值映射返回颜色与数字，不返回浏览器选择器、CSS 变量、字体栈、阴影字符串或 DOM 行为。原生端使用自己的阴影、触摸、读屏、焦点、Safe Area、键盘避让；`allowFontScaling` 不应为追求布局而关闭。[React Native Style](https://reactnative.dev/docs/style)（2026-11-13核对）。映射函数已在 Node 验证，**不是**RN 运行验收。

## 新适配层的验收门槛

至少在真实目标端完成：按钮、文字输入、选择、状态、表格/列表、弹层或原生页面；正常与失败重试；文本放大、长中文、触摸/键盘、系统深色和减少动态。版本号与支持平台分别记录，未运行的平台明确写未验证。

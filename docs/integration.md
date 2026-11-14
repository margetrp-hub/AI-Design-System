# 安装与接入

运行 npm ci 和 npm run build:registry。Vue 打包用 npm run pack:ui；React 用 npm run pack:react。生成的 tgz 可放进消费项目的 vendor 目录，随锁文件固定版本。

Vue 需要 tokens/styles 0.4.0、effects/stream 0.1.0、ui 0.4.0 五包；React 将 ui 换为 react 0.2.0。在放有这些包的目录执行：

```sh
npm install ./ai-design-system-tokens-0.4.0.tgz ./ai-design-system-styles-0.4.0.tgz ./ai-design-system-effects-0.1.0.tgz ./ai-design-system-stream-0.1.0.tgz ./ai-design-system-ui-0.4.0.tgz
```

```vue
<script setup lang="ts">
import { UiTheme, UiButton, UiLayout } from '@ai-design-system/ui'
import '@ai-design-system/ui/style.css'
</script>
<template>
  <UiTheme design="glass" material="liquid" :transparency="88" font="geist">
    <UiLayout pattern="sidebar">
      <template #navigation>项目导航</template>
      <UiButton variant="primary">开始</UiButton>
    </UiLayout>
  </UiTheme>
</template>
```

UiTheme 是作用域，不为所有嵌套容器强铺背景；页面根设置 background:var(--ui-canvas) 和 color:var(--ui-text)。弹层必须继承主题属性。不要同时导入两套全局 reset。

React 导入 @ai-design-system/react/style.css，用 UiTheme 或 themeAttributes 设置作用域；原生 dialog 的主题传播见 examples/react/App.tsx。React 的覆盖范围与 Vue 不同。

字体可选：@ai-design-system/ui/fonts.css 引入演示用 Fontsource 字体。实际应用按需导入家族/字重并保留 OFL；不要全量预加载中文字体。标题和正文用 headingFont/font 分别选择。

迁移时保留消费项目原入口，在其内部逐项转用本库；先验证一个真实页面的成功/失败、焦点、窄屏和主题。业务鉴权、支付、路由和任务取消仍归宿主。

```sh
npm run dev:examples
# http://127.0.0.1:4319/vue/
# http://127.0.0.1:4319/react/
npm run check:packages
```

所有演示可静态部署，包括模拟 AI/SSE。stream 包支持 fetcher 注入，默认调用真实 fetch；生产项目不导入 demo-stream。

# 安装与接入

运行 npm ci 和 npm run build:registry。Vue 打包用 npm run pack:ui；React 用 npm run pack:react。生成的 tgz 可放进消费项目的 vendor 目录，随锁文件固定版本。

更新本地 tgz 后，若已经运行的 Vite 仍展示旧接口，用 `vite --force` 重启消费方以刷新依赖预构建；单纯刷新浏览器不会保证清掉旧依赖缓存。打包应在构建完成后执行，避免读取正在生成的声明文件。

Vue 需要 tokens 0.4.0、styles 0.4.1、effects 0.1.1、stream 0.1.0、ui 0.4.1 五包；React 将 ui 换为 react 0.2.1。在放有这些包的目录执行：

```sh
npm install ./ai-design-system-tokens-0.4.0.tgz ./ai-design-system-styles-0.4.1.tgz ./ai-design-system-effects-0.1.1.tgz ./ai-design-system-stream-0.1.0.tgz ./ai-design-system-ui-0.4.1.tgz
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

## 居中管理员入口与五形态粒子

`UiAuthLayout pattern="centered"` 将 visual 铺满背景，表单居中；默认 `split` 保持左右分屏。`--ui-auth-height`、`--ui-auth-width` 可调整场景高度与表单宽度。

管理员页的暗卡、输入、按钮和流光样式随框架 `style.css` 一起分发，使用 `ui-auth-console-*` 类名，不需要复制 Demo CSS。以下 Vue 组合将提交交给宿主；纯演示时宿主只显示演示提示：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UiAuthLayout, UiBackdrop, UiGlowBorder, UiInput, UiButton } from '@ai-design-system/ui'
import '@ai-design-system/ui/style.css'
const emit = defineEmits<{ submit: [credentials: { identifier: string; password: string }]; recover: [] }>()
const identifier = ref(''), password = ref(''), revealed = ref(false)
</script>
<template>
  <UiAuthLayout pattern="centered" class="ui-auth-console" label="管理员登录">
    <template #visual><UiBackdrop kind="grid" color="#3a82ff" /></template>
    <span class="ui-auth-console-kicker">安全控制台</span>
    <UiGlowBorder class="ui-auth-console-card" color="#60a5fa" :duration="3.8">
      <header><h2>管理员登录</h2><p>使用管理员账号密码进入运营控制台</p></header>
      <form class="ui-auth-console-form" @submit.prevent="emit('submit', { identifier, password })">
        <UiInput v-model="identifier" label="管理员邮箱 / 用户名" autocomplete="username" required />
        <div class="ui-auth-console-password">
          <UiInput v-model="password" label="管理员密码" :type="revealed ? 'text' : 'password'" autocomplete="current-password" required />
          <button type="button" :aria-pressed="revealed" @click="revealed = !revealed">{{ revealed ? '隐藏' : '显示' }}</button>
        </div>
        <button type="button" class="ui-auth-console-forgot" @click="emit('recover')">忘记管理员密码？</button>
        <UiButton type="submit" class="ui-auth-console-submit">进入控制台</UiButton>
      </form>
    </UiGlowBorder>
  </UiAuthLayout>
</template>
```

React 同样支持 `pattern="centered"`，背景放在 `visual={<UiBackdrop kind="grid" />}`，相同样式类通过 `className` 使用。`UiInput` 使用原生标签与 `value/onChange`；实际包示例的布局/背景切换见 `examples/react/App.tsx`。

旧企业首页使用 `UiBackdrop kind="particle-field" color="#ffffff"`。宿主保持 `position: relative`、明确高度，前景内容用 `position: relative`。`progress` 的 0、.25、.5、.75、1 分别对应流带、球体、螺旋、环阵、星系，也接受中间值；宿主可绑定滚动/章节进度。`paused` 控制暂停，减少动态时直接到目标形态，WebGL 失败保留静态背景；Vue expose `retry()`，React 改变 `retryKey` 重载。

```sh
npm run dev:examples
# http://127.0.0.1:4319/vue/
# http://127.0.0.1:4319/react/
npm run check:packages
```

所有演示可静态部署，包括模拟 AI/SSE。stream 包支持 fetcher 注入，默认调用真实 fetch；生产项目不导入 demo-stream。

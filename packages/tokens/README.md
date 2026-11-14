# @ai-design-system/tokens

无 Vue、React 或浏览器依赖的基础包。唯一编辑源为 `tokens.json`；CSS 和 definitions.js 由 `npm run build:tokens` 生成。

- Web：导入 `@ai-design-system/tokens/tokens.css`，在容器上使用 `class="ui-theme" data-ui-skin="console" data-ui-palette="iris" data-ui-mode="light"`。
- 任意 JS：`resolveTokens({skin:'pearl',palette:'jade',mode:'dark'})` 返回语义值。
- 原生端：`getNativeTokens({skin:'clinical',palette:'cobalt',mode:'light',reducedMotion:true})` 返回颜色、数字尺寸和时间。原生字号仍尊重系统字体放大；不要关闭 allowFontScaling。

console / clinical / pearl 是旧版兼容种子，工作台不再提供项目预设入口。`design` 为 base / brutalist / industrial / glass / editorial / soft / kinetic / geist / carbon / spectrum / atelier / material；完整视觉语言还需配合UI包的布局和材质实现，不能把几个设计值等同于完整页面。配色为 default / cobalt / iris / dream-pink / powder-blue / yellow-violet / jade / black-gold / neutral-black；仅覆盖语义颜色，密度和文字缩放独立。

`font` / `headingFont` 可选系统、Geist、Noto Sans/Serif SC、Plex Mono、Manrope、Space Grotesk、Fraunces、文楷；本包只提供CSS字体栈，实际字体资源由UI包的可选 fonts.css 或消费方导入。玻璃透明度、clear/regular材质和SVG折射由Web UI层处理，不在原生数值映射中伪造。

`colorRecipes.workbench / soft / garden` 提供可组合的分类色。每组包含 label 和 colors 数组；颜色名为 blue / violet / teal / amber / rose / lime。`resolveTokens` 和原生 colors 同时提供 `category-blue-soft`、`category-blue-ink`、`category-blue-solid` 等值；明暗分别校准。类别颜色不能替代 info / success / warning / danger 的状态含义。

不输出 Web 阴影到 React Native，不携带 CSS 字体栈到原生；平台自行处理字体、阴影、焦点、弹层、安全区和滚动。此包提供值，不是 React Native / Uni-app 组件库。React Native 和各 Uni-app 目标端尚未运行验证。

# 设计工坊的组织方式

每项资产包含实现、演示、可查询接口、适用场景和边界。以下是对实际项目规划的吸收，不是复制它们的组件代码。

| 项目 | 核实的组织方式 | 本库怎样吸收 |
| --- | --- | --- |
| [Once UI](https://github.com/once-ui-system/core) | 核心包、开发沙盒、文档站分层；AI manifest 和 task bundles | packages 维护实现，catalog 直接演示，examples 验证安装；tasks.json 给 AI 场景入口 |
| [Motion Primitives](https://github.com/ibelick/motion-primitives) | 可组合动效原语，CLI 添加组件 | 自写 UiWordSwitch：稳定宽度、暂停、隐藏停机、减少动态；已有文字/数字/过渡共用规则 |
| [Cult UI](https://github.com/nolly-studio/cult-ui) | 动效、卡片、插画、设备共享文档和 registry 分发 | 原创 UiFoldedNote 和栖间拥有真实 props、slots、状态与例子 |
| [shadcn registry](https://ui.shadcn.com/docs/registry) | 分发组件、hooks、页面、规则；不限 React | 框架明确的生成清单与 CLI；当前为 tgz 分发，未声称兼容 shadcn add |

核对于2026-11-14。Origin UI 原地址现跳转 [cosscom/ui](https://github.com/cosscom/ui)。来源描述来自一手文档，“怎样吸收”是本库的设计判断。

| 层 | 职责 | owner |
| --- | --- | --- |
| Foundations | 语义色、尺寸、字体、密度、时间 | packages/tokens |
| Visual languages | 导航、几何、材质、文字层级的成套关系 | styles、ui/composition.ts |
| Components | 交互单元与状态接口 | ui、react |
| Patterns | 页面骨架、登录/助手/任务组合 | UiLayout、AuthLayout、StudioWorkbench、examples |
| Effects & scenes | 背景、角色、空间与文字 | effects、styles、框架包装 |
| Agent contract | 找到实现、查询类型、选择组合 | registry、docs/ai.md、skills |

站点直接展示组件实现；规则用 Markdown，接口从源码提取。新增设计先决定是变体、组合还是独立组件。视觉语言不是配色包，骨架不是业务应用，原生 token 不是原生组件。

吸收外部设计时提取机制，自己重新构图、命名和实现。直接改编代码另行核查许可并留署名。公开可见的品牌页面、付费模板和受限素材不因此进入本库。

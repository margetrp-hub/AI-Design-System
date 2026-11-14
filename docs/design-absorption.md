# 设计吸收与来源

本库将机制和经验变成自己的可复用实现。观察日期为2026-11-14，品牌启发不代表品牌授权或官方合作。

## 自有实现

栖间 UiStudioAvatar / Scene / Workbench 是原创 SVG、CSS 家具和空间构图：圆角机器人、拱窗、木质桌面、绿植与成员详情。未使用 workstation-teacher 的绘制、角色、家具或代码。原非商业复刻已从本发行移除。

UiWordSwitch 和 UiFoldedNote 分别吸收文字切换、纸张折角与渐进展开的机制，用自有 Vue/CSS 实现。没有复制 Once UI、Motion Primitives 或 Cult UI 源码。组织方式见 [architecture.md](architecture.md)。

背景光束、登录角色和分屏入口来自维护者自有项目的可复用视觉代码；在此抽离业务，统一生命周期。网格、粒子为独立实现；未打包 ReactBits 代码或受限素材。

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

## 许可

自有代码与本仓库新写 skill 使用根目录 MIT。Magic UI 改编保留 MIT notice。Vue、React、Reka、Lucide 以及 Fontsource 依赖保留各自声明。字体使用 SIL OFL；分发构建后的字体时仍需保留许可，见 packages/ui/THIRD_PARTY_NOTICES.md。静态站构建自动附带八个字体包的实际版权/OFL全文，可从[在线许可页](https://margetrp-hub.github.io/AI-Design-System/licenses/)查阅。

不包含商标、官方私有字体、付费模板、内部业务数据或用户提供的私有视频。任何后续直接改编，需记录实际文件、版本、许可及修改范围。

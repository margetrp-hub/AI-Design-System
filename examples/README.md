# 实际包接入

`npm run build:ui && npm run build:react`，随后 `npm run dev:examples`。

- Vue: http://127.0.0.1:4319/vue/
- React: http://127.0.0.1:4319/react/

示例 import 指向 package exports/dist；没有源码别名。依赖复用本仓库唯一工作区安装。生产构建 `npm run build:examples`。

两者演示资料草稿、localStorage 保存和读取回执、读取/保存失败后的重试、明暗切换、导航保留草稿及弹层焦点返回。UI 保存只写各自的演示键，不连接业务服务。React 的 dialog 是宿主原生组件，body portal 显式传播主题；库没有虚构的 React UiDialog。消费到独立项目时先安装同版本 tokens/styles/effects 和对应 adapter 包；详见 docs/ai.md。

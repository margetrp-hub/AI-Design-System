# AI 接入

先确定消费方是 Vue 还是 React，再查询实际接口。[Skill](../skills/ai-design-system/SKILL.md) 可以整体复制到支持 skill 的工具，不依赖作者机器路径。

```sh
npm run ui -- doctor
npm run ui -- find --framework vue 日志
npm run ui -- show --framework react UiTaskLog
npm run ui -- list --framework vue
```

registry/manifest.json 从导出和类型声明生成，包含 props、events、slots、v-model、例子、版本、依赖和实现边界。registry/tasks.json 按实际任务组合现有组件。用途关键词在 usage.mjs 维护，接口不手填。

退出码 0 为成功，2 为参数错误，3 为无实现/无匹配，4 为缺少索引或源码指纹过期。stale 时运行 npm run build:registry 再查询。find 按空格分词做 AND 匹配，中文用单个关键词更方便。

Vue 的 UiAiComposer 用 v-model，React 用 value/onValueChange；React UiTaskLog 根据 onCancel 是否存在显示取消操作。React 没有 UiDialog、UiLayout、UiDataTable 或栖间组件，不能从 Vue 同名推断支持。

examples/vue 和 examples/react 从包导入，无源码 alias。npm run check:packages 将 tgz 安装到独立消费环境，逐文件检查，再构建示例。

在线 demo 使用 examples/shared/demo-stream.ts 的浏览器模拟传输。真正的 SSE 可调用 stream 包的 readSse/openSse，保持 runId、事件游标和终态回执；业务状态不由动画推断。

新增资产路径：找到用途 → 查询已有能力 → 增加组件/变体及例子 → 类型/交互验证 → 重建 registry → 更新对应文档。无需建立参考收藏业务或尚未实现的框架包。

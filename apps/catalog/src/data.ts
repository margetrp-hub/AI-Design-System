export const skins = [
  {id:'console',name:'中性控制台',english:'Quiet console',source:'Product workspace',description:'实体工作面，细边框，低噪声。把空间留给连续操作。',radius:'6 / 12',color:'#282828',tags:['运营管理','配置表单','密集列表']},
  {id:'clinical',name:'医疗工作站',english:'Clinical clarity',source:'示例',description:'灰白与蓝色，稳定位序，异常可读。面向专注的工作现场。',radius:'6 / 10',color:'#2b5aed',tags:['任务队列','上下文详情','状态判断']},
  {id:'pearl',name:'Pearl · 黑金',english:'Warm precision',source:'Account workspace',description:'温暖中性色，柔和层次，清楚的金额与信息节奏。',radius:'8 / 14',color:'#826023',tags:['账户用量','资源目录','用户工作台']}
] as const
export const categoryOptions = [{value:'system',label:'设计体系'},{value:'component',label:'基础组件'},{value:'pattern',label:'页面模式'},{value:'motion',label:'动效细节'},{value:'reference',label:'视觉参考'}]
export const stateOptions = [{value:'inbox',label:'待提炼'},{value:'distilled',label:'已提炼'},{value:'archived',label:'暂存历史'}]
export const licenseOptions = [{value:'unknown',label:'尚未核实'},{value:'reference-only',label:'仅作设计参考'},{value:'permitted',label:'具体源码许可已核实'}]
export type Reference = {id:string;title:string;url:string;category:string;status:string;license:string;notes:string;evidence:string;revision:number;createdAt:string;updatedAt:string}
export const componentInfo = [
  ['UiTheme','主题作用域','skin / mode / density / scale','嵌套主题隔离，弹层继承；CSS 不依赖 Tailwind'],
  ['UiButton','动作按钮','variant / size / loading / disabled','原生 button；提交中防重复，默认 type=button'],
  ['UiInput','文字字段','v-model / label / hint / error','标签和提示关联；透传原生 input 属性'],
  ['UiSelect','单项选择','v-model / label / options','原生 select，适合少量有限选项；远程搜索由项目适配'],
  ['UiSwitch','布尔选择','v-model / label / disabled','原生 checkbox 与 switch 语义，不隐含业务保存'],
  ['UiBadge','状态标签','tone','语义色与品牌色分开，必须保留状态文字'],
  ['UiPanel','连续工作面','title / description / actions slot','统一内容边距，允许内容决定高度'],
  ['UiTable','表格表面','caption / head slot / default slot','原生表格、局部横滚；排序分页由业务 owner 管理'],
  ['UiDialog','短编辑弹窗','v-model:open / title / description','Reka 焦点与 Escape；preventClose + closeRequest 保护草稿'],
  ['UiEmptyState','空结果说明','title / description / action slot','明确空结果原因和可达下一步']
]

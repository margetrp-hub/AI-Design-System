import type { Theme } from "./theme";
export type DesignCaseId =
  | "apple"
  | "vercel"
  | "ibm"
  | "stripe"
  | "spotify"
  | "notion"
  | "linear"
  | "figma"
  | "airbnb"
  | "shopify"
  | "claude"
  | "supabase"
  | "nvidia"
  | "nike"
  | "miro"
  | "slack";
export interface DesignCaseDefinition {
  id: DesignCaseId;
  brand: string;
  name: string;
  category: "产品展示" | "工作空间" | "内容与消费" | "AI 与数据";
  description: string;
  signature: string[];
  action: string;
  components: string[];
  theme: Partial<Theme>;
  source: string;
}
const source = (slug: string) =>
  `https://github.com/VoltAgent/awesome-design-md/blob/fcc70284932276d085f01ef9f83edde90b1258cb/design-md/${slug}/DESIGN.md`;
export const designCases: readonly DesignCaseDefinition[] = [
  {
    id: "apple",
    brand: "Apple",
    name: "留白 · 产品画廊",
    category: "产品展示",
    description: "让一个产品成为画面的主角，规格与操作退后。",
    signature: ["居中产品舞台", "大留白与紧标题", "底部悬浮选色器"],
    action: "更换外观、查看规格",
    components: ["UiTheme", "UiMotionSurface", "UiDialog"],
    theme: {
      design: "base",
      palette: "cobalt",
      font: "system",
      headingFont: "system",
      mode: "light",
    },
    source: source("apple"),
  },
  {
    id: "vercel",
    brand: "Vercel",
    name: "坐标 · 部署工作台",
    category: "工作空间",
    description: "精确网格与单色边界，让构建状态成为视觉重点。",
    signature: ["十字坐标与细网格", "紧凑部署记录", "单色主操作"],
    action: "模拟构建、失败后重试",
    components: ["UiTheme", "UiButton", "UiBadge"],
    theme: { design: "geist", palette: "neutral-black", mode: "dark" },
    source: source("vercel"),
  },
  {
    id: "ibm",
    brand: "IBM / Carbon",
    name: "格构 · 资源控制台",
    category: "AI 与数据",
    description: "深色功能顶栏、无圆角分区与连续数据表面。",
    signature: ["方正连续工作面", "轻字重标题", "底线输入与蓝色操作"],
    action: "搜索资源、查看行详情",
    components: ["UiBadge", "UiInput", "UiDialog"],
    theme: { design: "carbon", palette: "cobalt", mode: "light" },
    source: source("ibm"),
  },
  {
    id: "stripe",
    brand: "Stripe",
    name: "织光 · 商业叙事",
    category: "产品展示",
    description: "斜切色场承托轻盈标题，产品能力以可操作面板呈现。",
    signature: ["斜切渐变背景", "大字重心偏左", "层叠账单与轻阴影"],
    action: "切换周期、预览方案",
    components: ["UiButton", "UiNumberTicker"],
    theme: {
      design: "atelier",
      palette: "iris",
      font: "manrope",
      headingFont: "manrope",
      mode: "light",
    },
    source: source("stripe"),
  },
  {
    id: "spotify",
    brand: "Spotify",
    name: "声场 · 私人唱片室",
    category: "内容与消费",
    description: "近黑画布退后，让封面、曲目与播放控制显现。",
    signature: ["封面承担色彩", "圆形播放按钮", "底部持续播放栏"],
    action: "选曲、播放与暂停模拟",
    components: ["UiButton", "UiBadge"],
    theme: {
      design: "spectrum",
      palette: "jade",
      mode: "dark",
      font: "manrope",
    },
    source: source("spotify"),
  },
  {
    id: "notion",
    brand: "Notion",
    name: "页间 · 团队手册",
    category: "工作空间",
    description: "文档优先的工作页，目录、行内任务与引用自然衔接。",
    signature: ["收敛阅读宽度", "文本目录与纸面层级", "行内清单和轻提示"],
    action: "切换章节、完成清单",
    components: ["UiCheckbox", "UiProgress"],
    theme: {
      design: "editorial",
      palette: "neutral-black",
      headingFont: "noto-serif",
      mode: "light",
    },
    source: source("notion"),
  },
  {
    id: "linear",
    brand: "Linear",
    name: "轨序 · 项目推进",
    category: "工作空间",
    description: "低对比工具栏与密集任务轨道，状态变化保持上下文。",
    signature: ["暗色低对比边界", "状态分列与精确行距", "紫色只标记重点"],
    action: "推进任务、撤销移动",
    components: ["UiButton", "UiBadge"],
    theme: { design: "base", palette: "iris", mode: "dark" },
    source: source("linear.app"),
  },
  {
    id: "figma",
    brand: "Figma",
    name: "拼色 · 创作画布",
    category: "工作空间",
    description: "工具、画布和属性各占其位，大色块成为内容。",
    signature: ["三栏编辑器", "大色块与黑色细轮廓", "对象选框与控制点"],
    action: "选择对象、切换形状",
    components: ["UiButton", "UiBadge"],
    theme: { design: "brutalist", palette: "neutral-black", mode: "light" },
    source: source("figma"),
  },
  {
    id: "airbnb",
    brand: "Airbnb",
    name: "远屿 · 周末发现",
    category: "内容与消费",
    description: "胶囊搜索与宽松的内容浏览，收藏与详情各有清晰入口。",
    signature: ["分段胶囊搜索", "内容画面与圆角", "珊瑚色集中在行动"],
    action: "筛选目的地、收藏与详情",
    components: ["UiInput", "UiButton", "UiDialog"],
    theme: {
      design: "base",
      palette: "dream-pink",
      font: "manrope",
      mode: "light",
    },
    source: source("airbnb"),
  },
  {
    id: "shopify",
    brand: "Shopify",
    name: "开店 · 经营起步",
    category: "工作空间",
    description: "薄荷底色与聚焦任务清单，把下一步经营动作说明白。",
    signature: ["薄荷与奶油表面", "紧凑功能顶栏", "任务清单主导层级"],
    action: "完成开店步骤、撤销",
    components: ["UiCheckbox", "UiProgress", "UiBadge"],
    theme: { design: "base", palette: "jade", mode: "light" },
    source: source("shopify"),
  },
  {
    id: "claude",
    brand: "Claude",
    name: "纸语 · 思考伙伴",
    category: "AI 与数据",
    description: "温暖纸面、衬线开场与限宽输入，让交流更从容。",
    signature: ["奶油底与陶土色", "衬线标题", "上下文卡与输入面"],
    action: "选建议、发送与停止模拟",
    components: ["UiTextarea", "UiButton", "UiBadge"],
    theme: {
      design: "editorial",
      palette: "black-gold",
      headingFont: "noto-serif",
      mode: "light",
    },
    source: source("claude"),
  },
  {
    id: "supabase",
    brand: "Supabase",
    name: "翠栈 · 数据浏览器",
    category: "AI 与数据",
    description: "深色技术表面与翠绿动作，字段结构和查询结果连在一起。",
    signature: ["数据库对象树", "等宽查询编辑面", "翠绿执行与结果表"],
    action: "选择数据表、运行只读模拟",
    components: ["UiButton", "UiBadge"],
    theme: {
      design: "industrial",
      palette: "jade",
      headingFont: "plex-mono",
      mode: "dark",
    },
    source: source("supabase"),
  },
  {
    id: "nvidia",
    brand: "NVIDIA",
    name: "算域 · 算力展厅",
    category: "产品展示",
    description: "黑白章节、锋利方角与工程网格，强调技术对象的规模。",
    signature: ["巨型工程标题", "硬边绿色行动", "机架阵列与技术读数"],
    action: "切换算力方案",
    components: ["UiButton", "UiNumberTicker"],
    theme: {
      design: "industrial",
      palette: "jade",
      mode: "dark",
      headingFont: "space-grotesk",
    },
    source: source("nvidia"),
  },
  {
    id: "nike",
    brand: "Nike",
    name: "越界 · 运动企划",
    category: "内容与消费",
    description: "倾斜姿态与超大展示字形成张力，零售选择保持克制。",
    signature: ["超大紧凑标题", "运动轨迹与对角构图", "单色胶囊和尺码选择"],
    action: "选择尺码、加入清单",
    components: ["UiButton", "UiBadge"],
    theme: {
      design: "brutalist",
      palette: "neutral-black",
      headingFont: "space-grotesk",
      mode: "light",
    },
    source: source("nike"),
  },
  {
    id: "miro",
    brand: "Miro",
    name: "共想 · 灵感白板",
    category: "工作空间",
    description: "点阵画布与彩色便笺，空间用来连接观点。",
    signature: ["无边界感点阵", "错位便笺与连接线", "悬浮工具条"],
    action: "新增便笺、选择与编辑",
    components: ["UiButton", "UiInput"],
    theme: { design: "base", palette: "yellow-violet", mode: "light" },
    source: source("miro"),
  },
  {
    id: "slack",
    brand: "Slack",
    name: "同频 · 团队消息",
    category: "工作空间",
    description: "茄紫导航与白色讨论面分工，消息内容保持连续。",
    signature: ["工作区与频道双层导航", "连续消息流", "底部编辑与话题上下文"],
    action: "切换频道、保留草稿并发送",
    components: ["UiTextarea", "UiButton", "UiBadge"],
    theme: { design: "base", palette: "iris", mode: "light" },
    source: source("slack"),
  },
];

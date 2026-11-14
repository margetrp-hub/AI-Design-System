import type { Theme } from "./theme";
export type LayoutPattern =
  | "sidebar"
  | "topbar"
  | "master-detail"
  | "workbench"
  | "editorial"
  | "bento"
  | "settings"
  | "split"
  | "focused"
  | "conversation"
  | "board"
  | "command-center"
  | "showcase"
  | "studio";
export type DesignRecipe = {
  version: 1;
  name: string;
  layout: LayoutPattern;
  theme: Theme;
  override: Partial<Theme>;
};
export const compositionChoices = {
  design: [
    ["base", "静序 · 清晰工作台"],
    ["brutalist", "硬线 · 新粗犷"],
    ["industrial", "工造 · 工业仪器"],
    ["glass", "流璃 · 液态玻璃"],
    ["editorial", "书页 · 编辑排版"],
    ["soft", "云塑 · 柔塑拟物"],
    ["kinetic", "光域 · 数字光场"],
    ["geist", "墨界 · Vercel 启发"],
    ["carbon", "格构 · IBM 启发"],
    ["spectrum", "声场 · Spotify 启发"],
    ["atelier", "织光 · Stripe 启发"],
    ["material", "彩阶 · Material 启发"],
  ],
  material: [
    ["solid", "实体"],
    ["frosted", "磨砂"],
    ["glass", "透明玻璃"],
    ["liquid", "液态折射"],
  ],
  glassVariant: [
    ["clear", "清透 · 背景细节"],
    ["regular", "柔透 · 阅读优先"],
  ],
  decoration: [
    ["none", "无装饰"],
    ["gradient", "渐变封面"],
    ["fluted", "棱纹玻璃"],
    ["grid", "工作网格"],
  ],
  font: [
    ["system", "系统字体"],
    ["geist", "Geist + Noto 中文"],
    ["noto-sans", "Noto 中文黑体"],
    ["noto-serif", "Noto 中文宋体"],
    ["plex-mono", "IBM Plex Mono"],
    ["manrope", "Manrope · 几何人文"],
    ["space-grotesk", "Space Grotesk · 科技"],
    ["fraunces", "Fraunces · 展示衬线"],
    ["wenkai", "霞鹜文楷 · 中文书写"],
  ],
  buttonFeel: [
    ["standard", "轻按"],
    ["tactile", "立体按压"],
    ["flat", "平面"],
  ],
  motion: [
    ["standard", "标准"],
    ["crisp", "利落"],
    ["soft", "柔和"],
    ["none", "关闭动态"],
  ],
  layout: [
    ["sidebar", "侧栏工作台"],
    ["topbar", "顶部导航"],
    ["master-detail", "列表 + 详情"],
    ["workbench", "三栏工作区"],
    ["editorial", "阅读 / 编辑"],
    ["bento", "主次网格"],
    ["settings", "设置中心"],
    ["split", "双栏引导"],
    ["focused", "聚焦入口"],
    ["conversation", "对话工作区"],
    ["board", "横向工作流看板"],
    ["command-center", "指挥中心"],
    ["showcase", "沉浸展示页"],
    ["studio", "画布 + 底部时间线"],
  ],
} as const;
export const layoutGuides: Record<
  LayoutPattern,
  { use: string; source: string; url: string }
> = {
  board: {
    use: "任务、交付与审核；状态分列，窄屏保留横向滚动，操作由宿主处理。",
    source: "Linear 项目看板",
    url: "https://linear.app/docs/board-layout",
  },
  "command-center": {
    use: "监控、资源拓扑与运行态；中央关系图，两侧状态，底部事件。",
    source: "IBM Carbon grid / 设备监控示例",
    url: "https://carbondesignsystem.com/guidelines/2x-grid/overview/",
  },
  showcase: {
    use: "产品首页、作品或模型展示；大幅视觉主角，下一屏承接操作与细节。",
    source: "Vercel / Stripe DESIGN.md",
    url: "https://github.com/voltagent/awesome-design-md",
  },
  studio: {
    use: "图像编辑、视频与设计工具；中央画布，工具侧栏，底部时间线。",
    source: "用户创作工具 / Figma 设计界面",
    url: "https://help.figma.com/hc/en-us/articles/360040529373-Tour-the-Figma-Design-interface",
  },
  sidebar: {
    use: "管理后台、资源与设置；导航稳定，主区域处理连续任务。",
    source: "Linear / ReUI App Shell",
    url: "https://linear.app/now/behind-the-latest-design-refresh",
  },
  topbar: {
    use: "模块较少的门户、客户工作台、服务入口；把横向空间留给内容。",
    source: "shadcn Sidebar / Navbar patterns",
    url: "https://ui.shadcn.com/blocks",
  },
  "master-detail": {
    use: "消息、工单、客户和资产审阅；选中列表项后保留列表上下文。",
    source: "用户 HR 工作台 / ReUI",
    url: "https://github.com/cyberdaddyleo/workstation-HR",
  },
  workbench: {
    use: "AI 创作、编辑器与分析；左侧资源，中间任务，右侧属性或证据。",
    source: "scaffold-master / Carbon grid",
    url: "https://github.com/wbr664393425-lgtm/scaffold-master",
  },
  editorial: {
    use: "知识库、文章、长表单；限制阅读宽度，给正文和编辑留空间。",
    source: "用户视频 V2 约69秒 / Notion",
    url: "https://github.com/VoltAgent/awesome-design-md",
  },
  bento: {
    use: "总览和产品展示；主信息占大面积，辅助事实组成次级网格。",
    source: "用户视频 V2 约34秒 / Carbon",
    url: "https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview",
  },
  settings: {
    use: "账户、通知和产品配置；分组导航 + 限宽表单，辅助说明与操作跟随内容。",
    source: "Shadcn Admin · Settings（MIT）",
    url: "https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/settings/index.tsx",
  },
  split: {
    use: "开户、首次设置和邀请；一侧完成短任务，另一侧解释价值或展示效果，手机按顺序堆叠。",
    source: "Shadcn Admin · Sign In 2（MIT）",
    url: "https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/auth/sign-in/sign-in-2.tsx",
  },
  focused: {
    use: "登录、验证和单项提交；单列聚焦、小步完成，适合没有复杂导航的入口。",
    source: "Tailark · Veil Login（MIT）",
    url: "https://github.com/tailark/blocks/blob/8139698115c1341bfd2e3e286c04bb4d8146f472/registry/bases/radix/veil/blocks/login/two.tsx",
  },
  conversation: {
    use: "AI 对话、客服和审阅；会话导航独立滚动，消息区限宽，输入固定在工作区底部。",
    source: "assistant-ui · Thread（MIT）",
    url: "https://www.assistant-ui.com/elements/thread",
  },
};
const theme: Theme = {
  skin: "console",
  palette: "cobalt",
  mode: "light",
  density: "comfortable",
  scale: 1,
  design: "base",
  font: "geist",
  headingFont: "geist",
  material: "solid",
  glassVariant: "regular",
  decoration: "none",
  buttonFeel: "standard",
  motion: "standard",
};
export const designRecipes: ReadonlyArray<DesignRecipe> = [
  {
    version: 1,
    name: "静序 · 清晰工作台",
    layout: "sidebar",
    theme: { ...theme },
    override: {},
  },
  {
    version: 1,
    name: "硬线 · 新粗犷",
    layout: "bento",
    theme: {
      ...theme,
      design: "brutalist",
      buttonFeel: "standard",
      motion: "crisp",
    },
    override: {},
  },
  {
    version: 1,
    name: "工造 · 工业仪器",
    layout: "workbench",
    theme: {
      ...theme,
      design: "industrial",
      headingFont: "plex-mono",
      decoration: "grid",
      palette: "neutral-black",
      motion: "crisp",
    },
    override: {},
  },
  {
    version: 1,
    name: "流璃 · 液态玻璃",
    layout: "topbar",
    theme: {
      ...theme,
      design: "glass",
      material: "liquid",
      glassVariant: "clear",
      transparency: 88,
      decoration: "none",
      palette: "powder-blue",
      motion: "soft",
    },
    override: {},
  },
  {
    version: 1,
    name: "书页 · 编辑排版",
    layout: "editorial",
    theme: {
      ...theme,
      design: "editorial",
      headingFont: "noto-serif",
      palette: "neutral-black",
      motion: "crisp",
    },
    override: {},
  },
  {
    version: 1,
    name: "渐变 · 创作空间",
    layout: "master-detail",
    theme: {
      ...theme,
      material: "frosted",
      decoration: "gradient",
      palette: "iris",
      buttonFeel: "tactile",
    },
    override: {},
  },
  {
    version: 1,
    name: "云塑 · 柔塑拟物",
    layout: "bento",
    theme: {
      ...theme,
      design: "soft",
      font: "manrope",
      headingFont: "manrope",
      palette: "dream-pink",
      buttonFeel: "tactile",
      motion: "soft",
    },
    override: {},
  },
  {
    version: 1,
    name: "光域 · 数字光场",
    layout: "command-center",
    theme: {
      ...theme,
      design: "kinetic",
      font: "geist",
      headingFont: "space-grotesk",
      palette: "iris",
      mode: "dark",
      decoration: "grid",
      motion: "crisp",
    },
    override: {},
  },
  {
    version: 1,
    name: "墨界 · Vercel 启发",
    layout: "topbar",
    theme: {
      ...theme,
      design: "geist",
      palette: "neutral-black",
      headingFont: "geist",
      decoration: "grid",
      motion: "crisp",
    },
    override: {},
  },
  {
    version: 1,
    name: "格构 · IBM 启发",
    layout: "workbench",
    theme: {
      ...theme,
      design: "carbon",
      palette: "cobalt",
      headingFont: "system",
      motion: "crisp",
    },
    override: {},
  },
  {
    version: 1,
    name: "声场 · Spotify 启发",
    layout: "bento",
    theme: {
      ...theme,
      design: "spectrum",
      palette: "jade",
      mode: "dark",
      font: "manrope",
      headingFont: "manrope",
    },
    override: {},
  },
  {
    version: 1,
    name: "织光 · Stripe 启发",
    layout: "showcase",
    theme: {
      ...theme,
      design: "atelier",
      palette: "iris",
      font: "manrope",
      headingFont: "manrope",
      decoration: "gradient",
      motion: "soft",
    },
    override: {},
  },
  {
    version: 1,
    name: "彩阶 · Material 启发",
    layout: "sidebar",
    theme: {
      ...theme,
      design: "material",
      palette: "iris",
      font: "manrope",
      headingFont: "manrope",
      motion: "soft",
    },
    override: {},
  },
];
const options: Record<string, readonly string[]> = {
  skin: ["console", "clinical", "pearl"],
  palette: [
    "default",
    "cobalt",
    "iris",
    "dream-pink",
    "powder-blue",
    "yellow-violet",
    "jade",
    "black-gold",
    "neutral-black",
  ],
  mode: ["light", "dark"],
  density: ["comfortable", "compact"],
  ...Object.fromEntries(
    Object.entries(compositionChoices)
      .filter(([key]) => key !== "layout")
      .map(([key, items]) => [key, items.map((item) => item[0])]),
  ),
  headingFont: compositionChoices.font.map((item) => item[0]),
};
function parseTheme(input: unknown, partial = false): Partial<Theme> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new TypeError("主题必须是对象");
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === "scale") {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < 1 ||
        value > 1.2
      )
        throw new TypeError("字号范围为 1–1.2");
      result.scale = value;
    } else if (key === "transparency") {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > 100
      )
        throw new TypeError("透明度范围为 0–100");
      result.transparency = value;
    } else if (options[key]?.includes(value as string)) result[key] = value;
    else throw new TypeError("不支持的主题字段或值：" + key);
  }
  return partial ? result : { ...theme, ...result };
}
export function parseDesignRecipe(input: unknown): DesignRecipe {
  const data = typeof input === "string" ? JSON.parse(input) : input;
  if (
    !data ||
    data.version !== 1 ||
    typeof data.name !== "string" ||
    !data.name.trim() ||
    data.name.trim().length > 60
  )
    throw new TypeError("需要版本1及1–60字的方案名称");
  if (!compositionChoices.layout.some(([value]) => value === data.layout))
    throw new TypeError("不支持的页面骨架");
  return {
    version: 1,
    name: data.name.trim(),
    layout: data.layout,
    theme: parseTheme(data.theme) as Theme,
    override: parseTheme(data.override ?? {}, true),
  };
}

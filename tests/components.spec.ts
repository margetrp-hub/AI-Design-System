import { test, expect, type Page } from "@playwright/test";
const nav = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: "组件库导航" })
    .getByRole("button", { name: new RegExp(name) })
    .click();
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "做好一次，复用很多次。" }),
  ).toBeVisible();
});

test("form validation, failed save and retry retain the user draft", async ({
  page,
}) => {
  await nav(page, "输入与表单");
  const name = page.getByRole("textbox", { name: "空间名称", exact: true });
  await name.fill("");
  await page.getByRole("button", { name: "保存表单" }).click();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await name.fill("重试后保存的空间");
  await page
    .getByRole("textbox", { name: "说明", exact: true })
    .fill("失败后保留这段说明");
  await page.getByRole("switch", { name: "模拟下次保存失败" }).check();
  await page.getByRole("button", { name: "保存表单" }).click();
  await expect(
    page.getByText("保存失败，输入已保留，可再次保存。", { exact: true }),
  ).toBeVisible();
  await expect(name).toHaveValue("重试后保存的空间");
  await page.getByRole("button", { name: "保存表单" }).click();
  await expect(
    page.getByText("已保存到本机演示设置。", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("ai-design-system-demo-settings")!).bio,
    ),
  ).toBe("失败后保留这段说明");
  await page.getByRole("checkbox", { name: "允许团队成员复用组件" }).uncheck();
  await page.getByRole("checkbox", { name: "允许团队成员复用组件" }).check();
  const radio = page.getByRole("radio", { name: /个人空间/ });
  await radio.click();
  await radio.press("ArrowDown");
  await expect(page.getByRole("radio", { name: /团队空间/ })).toBeChecked();
  await expect(page.getByRole("radio", { name: "归档空间" })).toBeDisabled();
  await page.getByRole("switch", { name: "接收活动提醒" }).uncheck();
  await page.getByRole("switch", { name: "接收活动提醒" }).check();
});

test("copy reports failure then retries against the clipboard receipt", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await nav(page, "输入与表单");
  await page.evaluate(() => {
    const original = navigator.clipboard.writeText.bind(navigator.clipboard);
    let first = true;
    navigator.clipboard.writeText = async (value) => {
      if (first) {
        first = false;
        throw new Error("test permission denial");
      }
      return original(value);
    };
  });
  await page.getByRole("button", { name: "复制", exact: true }).click();
  await expect(page.getByRole("button", { name: "重试复制" })).toBeVisible();
  await page.getByRole("button", { name: "重试复制" }).click();
  await expect(
    page.getByRole("button", { name: "已复制", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "@ai-design-system/ui",
  );
});

test("combobox restores full choices, supports keyboard, empty results and recovery", async ({
  page,
}) => {
  await nav(page, "选择与导航");
  const input = page.getByRole("combobox", { name: "选择空间", exact: true });
  await page.getByRole("button", { name: "展开选择空间" }).click();
  await expect(page.getByRole("listbox").getByRole("option")).toHaveCount(3);
  await expect(page.getByRole("option", { name: "归档空间" })).toHaveAttribute(
    "data-disabled",
    "",
  );
  await input.fill("不存在");
  await expect(page.getByText("没有匹配的选项", { exact: true })).toBeVisible();
  await input.fill("个人");
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(input).toHaveValue("个人空间");
  await page.getByRole("button", { name: "展开选择空间" }).click();
  await expect(page.getByRole("listbox").getByRole("option")).toHaveCount(3);
  await input.press("Escape");
  await page.getByRole("switch", { name: "模拟选项加载失败" }).check();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await page.getByRole("button", { name: "重试", exact: true }).click();
  await expect(input).toHaveValue("个人空间");
});

test("menu actions, tabs and disclosure remain keyboard operable", async ({
  page,
}) => {
  await nav(page, "选择与导航");
  const menu = page.getByRole("button", { name: "更多操作" });
  await menu.click();
  await expect(
    page.getByRole("menuitem", { name: "导出数据" }),
  ).toHaveAttribute("data-disabled", "");
  await page.getByRole("menuitem", { name: "创建副本" }).click();
  await expect(page.getByText("已选择：duplicate")).toBeVisible();
  await expect(menu).toBeFocused();
  const all = page.getByRole("tab", { name: "全部资源" });
  await all.click();
  await all.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "使用中", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("使用中 · 19 个空间")).toBeVisible();
  await page.getByRole("tab", { name: "全部资源" }).click();
  const accordion = page.getByRole("button", { name: "组件如何跨项目共享？" });
  await accordion.click();
  await expect(accordion).toHaveAttribute("aria-expanded", "false");
  await accordion.click();
  await expect(accordion).toHaveAttribute("aria-expanded", "true");
});

test("dialog protects drafts, closes nested overlay first and restores focus", async ({
  page,
}) => {
  await nav(page, "浮层与面板");
  const trigger = page.getByRole("button", { name: "编辑空间", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "编辑空间", exact: true });
  await dialog
    .getByRole("textbox", { name: "空间显示名称" })
    .fill("保留中的中文草稿");
  await dialog.getByRole("button", { name: "打开嵌套浮层" }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "命名帮助" }),
  ).not.toBeVisible();
  await expect(dialog).toBeVisible();
  await expect(
    page.getByText("修改尚未应用", { exact: true }),
  ).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByText("修改尚未应用", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "继续编辑" }).click();
  await expect(dialog.getByRole("textbox")).toHaveValue("保留中的中文草稿");
  await dialog.getByRole("button", { name: "应用名称" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("textbox").fill("应放弃");
  await dialog.getByRole("button", { name: "关闭对话框" }).click();
  await dialog.getByRole("button", { name: "放弃修改" }).click();
  await trigger.click();
  await expect(dialog.getByRole("textbox")).toHaveValue("保留中的中文草稿");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  for (let i = 0; i < 3; i++) {
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  }
  expect(
    await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).pointerEvents),
  ).not.toBe("none");
});

test("drawer, bottom sheet, popover and tooltip open and return focus", async ({
  page,
}) => {
  await nav(page, "浮层与面板");
  const tip = page.getByRole("button", { name: "查看提示" });
  await tip.focus();
  await expect(page.getByRole("tooltip")).toContainText("键盘聚焦");
  await page.keyboard.press("Escape");
  for (const [trigger, title, close] of [
    ["打开右侧面板", "空间详情", "关闭详情"],
    ["打开底部面板", "显示选项", "完成选择"],
    ["快速设置", "快速设置", "完成设置"],
  ]) {
    const button = page.getByRole("button", { name: trigger, exact: true });
    await button.click();
    const dialog = page.getByRole("dialog", { name: title, exact: true });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: close }).click();
    await expect(dialog).not.toBeVisible();
    await expect(button).toBeFocused();
  }
});

test("data table keeps ID selection through sorting, filtering, pagination and failed refresh", async ({
  page,
}) => {
  await nav(page, "表格与分页");
  const table = page.getByRole("region", { name: "演示空间列表" });
  await table
    .getByRole("checkbox", { name: "选择 WS-001", exact: true })
    .check();
  await expect(
    table.getByRole("checkbox", { name: "选择本页" }),
  ).toHaveAttribute("aria-checked", "mixed");
  await table.getByRole("button", { name: "下一页" }).click();
  await table
    .getByRole("checkbox", { name: "选择 WS-011", exact: true })
    .check();
  await expect(table.getByText("已选择 2 项")).toBeVisible();
  await table.getByRole("button", { name: "用量" }).click();
  await expect(
    table.getByRole("columnheader", { name: "用量" }),
  ).toHaveAttribute("aria-sort", "ascending");
  await table.getByRole("button", { name: "用量" }).click();
  await expect(
    table.getByRole("columnheader", { name: "用量" }),
  ).toHaveAttribute("aria-sort", "descending");
  await table
    .getByRole("textbox", { name: "搜索", exact: true })
    .fill("产品设计");
  await expect(table.getByText("已选择 2 项")).toBeVisible();
  await table.getByRole("combobox", { name: "状态演示" }).selectOption("error");
  await expect(table.getByText("加载未完成")).toBeVisible();
  await table.getByRole("button", { name: "重试加载" }).click();
  await expect(table.getByText("加载未完成")).not.toBeVisible();
  await expect(table.getByText("已选择 2 项")).toBeVisible();
  await table
    .getByRole("textbox", { name: "搜索", exact: true })
    .fill("不存在");
  await expect(table.getByText("没有匹配的结果")).toBeVisible();
  await table.getByRole("button", { name: "清除搜索", exact: true }).click();
  await table.getByRole("button", { name: "清除选择", exact: true }).click();
  await expect(table.getByText("已选择 0 项")).toBeVisible();
  await table.getByRole("combobox", { name: "每页" }).selectOption("20");
  await expect(table.getByRole("row")).toHaveCount(21);
  await table
    .getByRole("combobox", { name: "状态演示" })
    .selectOption("refreshing");
  await expect(table.getByText("正在刷新，保留现有数据…")).toBeVisible();
  await expect(table.getByRole("row")).toHaveCount(21);
});

test("feedback has measured progress, unknown progress and dismissible notifications", async ({
  page,
}) => {
  await nav(page, "状态与反馈");
  await page.getByRole("button", { name: "成功通知", exact: true }).click();
  await expect(page.getByText("成功通知示例", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "关闭通知" }).click();
  await expect(
    page.getByText("成功通知示例", { exact: true }),
  ).not.toBeVisible();
  await page.getByRole("button", { name: "失败通知", exact: true }).click();
  await page.getByRole("button", { name: "清除通知" }).click();
  await expect(
    page.getByText("失败通知示例", { exact: true }),
  ).not.toBeVisible();
  await page.getByRole("slider", { name: "演示进度" }).fill("83");
  await expect(
    page.getByRole("progressbar", { name: "可调节的进度示例" }),
  ).toHaveAttribute("aria-valuenow", "83");
  await expect(
    page.getByRole("progressbar", { name: "未知总量示例" }),
  ).not.toHaveAttribute("aria-valuenow", /./);
  await expect(
    page.getByRole("progressbar", { name: "零总量示例" }),
  ).not.toHaveAttribute("aria-valuenow", /./);
});

test("palette reaches portals and persists independently of shape and density", async ({
  page,
}) => {
  await nav(page, "浮层与面板");
  await page.getByRole('group',{name:'视觉语言'}).getByRole('button',{name:'工造 · 工业仪器',exact:true}).click();
  await page
    .getByRole("combobox", { name: "配色", exact: true })
    .selectOption("jade");
  await page.getByRole("button", { name: "切换深色" }).click();
  await page.getByRole("button", { name: "快速设置", exact: true }).click();
  const popover = page.getByRole("dialog", { name: "快速设置" });
  await expect(popover).toHaveAttribute("data-ui-palette", "jade");
  await expect(popover).toHaveAttribute("data-ui-mode", "dark");
  expect(
    await popover.evaluate((el) =>
      getComputedStyle(el).getPropertyValue("--ui-accent").trim(),
    ),
  ).toBe("#a3d2b1");
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "配色", exact: true }),
  ).toHaveValue("jade");
  await expect(
    page.getByRole('group',{name:'视觉语言'}).getByRole('button',{name:'工造 · 工业仪器',exact:true}),
  ).toHaveAttribute('aria-pressed','true');
});

test("all sections fit narrow screens at largest text and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .getByRole("combobox", { name: "字号", exact: true })
    .selectOption("1.2");
  for (const section of [
    "组件总览",
    "设计组合器",
    "输入与表单",
    "选择与导航",
    "浮层与面板",
    "状态与反馈",
    "表格与分页",
    "主题与配色",
    "动效与过渡",
    "安装与接入",
  ]) {
    await nav(page, section);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      section,
    ).toBe(true);
  }
  await nav(page, "浮层与面板");
  await page.getByRole("button", { name: "打开底部面板" }).click();
  const sheet = page.getByRole("dialog", { name: "显示选项" });
  const box = await sheet.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(391);
  await sheet.getByRole("button", { name: "完成选择" }).click();
  await expect(sheet).not.toBeVisible();
});

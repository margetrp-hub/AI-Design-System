import { test, expect, type Page } from "@playwright/test";
const nav = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: "组件库导航" })
    .getByRole("link", { name: new RegExp(name) })
    .click();
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
test("slider keyboard updates values and range endpoints", async ({ page }) => {
  await nav(page, "输入与表单");
  const slider = page.getByRole("slider", { name: "音量", exact: true });
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "41");
  await slider.press("Home");
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  await slider.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "100");
  const lower = page.getByRole("slider", { name: "预算范围 下限" });
  await lower.focus();
  await lower.press("ArrowRight");
  await expect(lower).toHaveAttribute("aria-valuenow", "25");
  await expect(
    page.getByRole("slider", { name: "预算范围 上限" }),
  ).toHaveAttribute("aria-valuenow", "80");
});
test("PIN preserves leading zero, completion and reset", async ({ page }) => {
  await nav(page, "输入与表单");
  await page
    .getByRole("textbox", { name: "验证码，第1位" })
    .pressSequentially("012345");
  for (let i = 0; i < 6; i++)
    await expect(
      page.getByRole("textbox", { name: `验证码，第${i + 1}位` }),
    ).toHaveValue(String(i));
  await expect(page.getByText("已填满 6 位，等待业务校验。")).toBeVisible();
  await page.getByRole("textbox", { name: "验证码，第3位" }).fill("");
  await expect(
    page.getByRole("textbox", { name: "验证码，第4位" }),
  ).toHaveValue("3");
  await page.getByRole("button", { name: "清空验证码" }).click();
  for (let i = 1; i <= 6; i++)
    await expect(
      page.getByRole("textbox", { name: `验证码，第${i}位` }),
    ).toHaveValue("");
});
test("tags add, reject duplicates and remove without submitting", async ({
  page,
}) => {
  await nav(page, "输入与表单");
  const tags = page.getByRole("textbox", { name: "项目标签" });
  await tags.fill("复用");
  await tags.press("Enter");
  await expect(page.getByText("当前 3 / 5 个标签")).toBeVisible();
  await tags.fill("复用");
  await tags.press("Enter");
  await expect(
    page.getByText("标签重复或已达数量上限，请修改后重试。"),
  ).toBeVisible();
  await expect(page.getByText("当前 3 / 5 个标签")).toBeVisible();
  await page.getByRole("button", { name: "删除标签 复用" }).click();
  await expect(page.getByText("当前 2 / 5 个标签")).toBeVisible();
  await tags.fill("");
  await tags.press("Backspace");
  await tags.press("Backspace");
  await expect(page.getByText("当前 1 / 5 个标签")).toBeVisible();
});
test("file picker rejects invalid and oversized files, retains selection and retries", async ({
  page,
}) => {
  await nav(page, "输入与表单");
  const picker = page
    .getByRole("group", { name: "项目附件", exact: true })
    .locator('input[type="file"]');
  await picker.setInputFiles({
    name: "第一份说明.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("hello"),
  });
  await expect(page.getByText("第一份说明.txt", { exact: true })).toBeVisible();
  await picker.setInputFiles({
    name: "not-allowed.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("invalid"),
  });
  await expect(page.getByText("not-allowed.exe：文件类型不支持")).toBeVisible();
  await expect(page.getByText("第一份说明.txt", { exact: true })).toBeVisible();
  await picker.setInputFiles({
    name: "too-big.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
  });
  await expect(page.getByText("too-big.pdf：文件大小超出限制")).toBeVisible();
  await picker.setInputFiles({
    name: "第二份说明.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("valid"),
  });
  await expect(page.getByText("第二份说明.txt", { exact: true })).toBeVisible();
  await expect(
    page.getByText("原选择已保留，请重新选择文件。"),
  ).not.toBeVisible();
  await page.getByRole("button", { name: "移除文件 第一份说明.txt" }).click();
  await expect(
    page.getByText("第一份说明.txt", { exact: true }),
  ).not.toBeVisible();
});
test("command search executes only enabled result and returns focus", async ({
  page,
}) => {
  await nav(page, "选择与导航");
  const trigger = page.getByRole("button", { name: "打开快捷命令" });
  await trigger.click();
  const search = page.getByRole("textbox", { name: "搜索命令" });
  await search.fill("不存在");
  await expect(page.getByText("没有匹配的命令")).toBeVisible();
  await search.fill("设置");
  await search.press("ArrowDown");
  await search.press("Enter");
  await expect(page.getByText("已选择命令：settings")).toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByRole("option", { name: "导出记录" })).toHaveAttribute(
    "data-disabled",
    "",
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("resizable keyboard, pointer and reset preserve content when stacked", async ({
  page,
}) => {
  await nav(page, "数据与摘要");
  const handle = page.getByRole("separator", { name: "调整编辑与预览" });
  await handle.scrollIntoViewIfNeeded();
  const before = Number(await handle.getAttribute("aria-valuenow"));
  await handle.focus();
  await handle.press("ArrowRight");
  await expect
    .poll(async () => Number(await handle.getAttribute("aria-valuenow")))
    .toBeGreaterThan(before);
  await page.getByRole("button", { name: "重置分栏" }).click();
  await expect(handle).toHaveAttribute("aria-valuenow", "40");
  const box = await handle.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + 80, box!.y + box!.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect
    .poll(async () => Number(await handle.getAttribute("aria-valuenow")))
    .toBeGreaterThan(40);
  await handle.dblclick();
  await expect(handle).toHaveAttribute("aria-valuenow", "40");
  await page.getByRole("textbox", { name: "分栏草稿" }).fill("调整尺寸仍保留");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(handle).not.toBeVisible();
  await expect(page.getByRole("textbox", { name: "分栏草稿" })).toHaveValue(
    "调整尺寸仍保留",
  );
  await expect(page.getByText("调整尺寸仍保留", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

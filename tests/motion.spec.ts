import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "动效与场景", exact: true }).click();
  await page
    .getByRole("navigation", { name: "组件库导航" })
    .getByRole("link", { name: /动效与过渡/ })
    .click();
});
test("transitions retain drafts, restore focus and reverse without inert leftovers", async ({
  page,
}) => {
  const region = page.getByRole("region", { name: "可切换内容" }),
    input = page.getByRole("textbox", { name: "过渡中的草稿" });
  await input.fill("反复切换后保留的文字");
  for (const preset of ["fade", "slide", "scale"]) {
    await page.getByRole("combobox", { name: "过渡方式" }).selectOption(preset);
    await page.getByRole("button", { name: "从内容内收起" }).click();
    await expect(
      page.getByRole("button", { name: "显示内容", exact: true }),
    ).toBeFocused();
    await expect(region).not.toBeVisible();
    await page.getByRole("button", { name: "显示内容", exact: true }).click();
    await expect(input).toHaveValue("反复切换后保留的文字");
    await expect(region).not.toHaveAttribute("inert", "");
  }
  const toggle = page.getByRole("button", { name: "收起内容", exact: true });
  await toggle.focus();
  for (let i = 0; i < 6; i++) await page.keyboard.press("Space");
  await expect(input).toHaveValue("反复切换后保留的文字");
  await expect(region).not.toHaveAttribute("aria-hidden", "true");
  await input.focus();
  await expect(input).toBeFocused();
});
test("reduced motion still completes reveal, disclosure and dialog cleanup", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "收起内容", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "可切换内容" }),
  ).not.toBeVisible();
  await page.getByRole("button", { name: "显示内容", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "过渡中的草稿" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "展开详情", exact: true }).click();
  await expect(
    page.getByText("高度随内容变化；图标同步表示展开状态。"),
  ).toBeVisible();
  await page.getByRole("button", { name: "打开动效对话框" }).click();
  const dialog = page.getByRole("dialog", { name: "动效与焦点一起完成" });
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "打开动效对话框" }),
  ).toBeFocused();
});

import { test, expect } from "@playwright/test";

test("quantity boundaries, empty recovery, locale and readonly preserve meaning", async ({
  page,
}) => {
  await page.goto("/#forms");
  const seats = page.getByRole("spinbutton", { name: "成员席位", exact: true });
  const summary = page.getByLabel("配置费用", { exact: true });
  await seats.press("End");
  await expect(seats).toHaveValue("50");
  await expect(
    page.getByRole("button", { name: "增加成员席位", exact: true }),
  ).toBeDisabled();
  await seats.press("Home");
  await expect(seats).toHaveValue("1");
  await expect(
    page.getByRole("button", { name: "减少成员席位", exact: true }),
  ).toBeDisabled();
  await seats.fill("99");
  await seats.press("Tab");
  await expect(seats).toHaveValue("50");
  await seats.fill("");
  await seats.press("Tab");
  await expect(seats).toHaveAttribute("aria-invalid", "true");
  expect(await seats.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await expect(summary).toContainText("待填写");
  await expect(
    page.getByRole("button", { name: "预览配置", exact: true }),
  ).toBeDisabled();
  await seats.fill("3");
  await seats.press("Tab");
  await expect(seats).toHaveAttribute("aria-invalid", "false");
  expect(await seats.evaluate((el: HTMLInputElement) => el.checkValidity())).toBe(true);
  await expect(summary).toContainText("¥117.00");
  await seats.focus();
  await seats.hover();
  await page.mouse.wheel(0, 100);
  await expect(seats).toHaveValue("3");
  const decimal = page.getByRole("spinbutton", { name: "预计时长" });
  await decimal.press("ArrowUp");
  await expect(decimal).toHaveValue("1,75");
  await decimal.fill("2,5");
  await decimal.press("Tab");
  await expect(decimal).toHaveAttribute("aria-valuenow", "2.5");
  const readonly = page.getByRole("spinbutton", { name: "已分配席位" });
  await readonly.press("ArrowUp");
  await expect(readonly).toHaveValue("12");
  await expect(
    page.getByRole("spinbutton", { name: "追加席位" }),
  ).toBeDisabled();
  await expect(
    summary
      .locator("div")
      .filter({ has: page.getByText("服务费", { exact: true }) })
      .locator("dd"),
  ).toHaveText("0");
});

test("choice cards, segments and preview share keyboard selection and retain drafts", async ({
  page,
}) => {
  await page.goto("/#forms");
  await page
    .getByRole("button", { name: "素构 · Astryx 启发", exact: true })
    .click();
  const plan = page.getByRole("group", { name: "协作方案" });
  const team = plan.getByRole("radio", { name: /^团队/ });
  await team.press("ArrowRight");
  await expect(plan.getByRole("radio", { name: /^个人/ })).toBeChecked();
  await expect(plan.getByRole("radio", { name: /^企业/ })).toBeDisabled();
  await page
    .getByRole("radio", { name: "按月", exact: true })
    .press("ArrowRight");
  await expect(
    page.getByRole("radio", { name: "按年 · 8 折", exact: true }),
  ).toBeChecked();
  const open = page.getByRole("button", { name: "预览配置", exact: true });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "配置预览", exact: true });
  await expect(dialog).toContainText("¥1,094.40");
  await expect(dialog.locator("..")).toHaveAttribute(
    "data-ui-design",
    "astryx",
  );
  await page.keyboard.press("Escape");
  await expect(open).toBeFocused();
  await expect(
    page.getByRole("spinbutton", { name: "成员席位", exact: true }),
  ).toHaveValue("6");
  await page.getByRole("button", { name: "重置", exact: true }).click();
  await expect(team).toBeChecked();
  await expect(
    page.getByRole("radio", { name: "按月", exact: true }),
  ).toBeChecked();
});

test("astryx is independently composed and controls reflow with dark enlarged type", async ({
  page,
}) => {
  await page.goto("/#compose");
  await page
    .getByRole("button", { name: "素构 · Astryx 启发", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", { name: "配色方案", exact: true }),
  ).toHaveValue("cobalt");
  await page
    .getByRole("combobox", { name: "局部卡片造型", exact: true })
    .selectOption("base");
  await expect(
    page.locator(".sample-local-override .ui-panel-header"),
  ).toHaveCSS("border-bottom-width", "1px");
  await page.goto("/#forms");
  await page
    .getByRole("button", { name: "素构 · Astryx 启发", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "配色", exact: true })
    .selectOption("jade");
  await page.getByRole("button", { name: "切换深色", exact: true }).click();
  await page
    .getByRole("combobox", { name: "字号", exact: true })
    .selectOption("1.2");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 950 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      `page ${width}`,
    ).toBe(true);
    expect(
      await page
        .locator(".choice-example")
        .evaluate((e) => e.scrollWidth <= e.clientWidth),
      `controls ${width}`,
    ).toBe(true);
    await page.getByRole("button", { name: "预览配置", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "配置预览", exact: true });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
  }
  await page.goto("/#data");
  const facts = page.getByLabel("任务信息", { exact: true });
  await expect(facts.locator("dt")).toHaveCount(4);
  await expect(facts).toContainText("未提供");
  await expect(facts.getByText("0", { exact: true })).toBeVisible();
  await expect(facts.getByText("已完成", { exact: true })).toBeVisible();
});

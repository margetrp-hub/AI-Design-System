import { test, expect } from "@playwright/test";

test("component color recipes preserve object labels, status meaning and dark portal colors", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "组件库导航" })
    .getByRole("link", { name: "主题与配色" })
    .click();
  const lab = page.getByRole("region", { name: "组件配色实验室" });
  const panels = lab.locator(".color-project-grid > .ui-panel");
  await expect(panels).toHaveCount(3);
  await expect(panels.nth(0)).toHaveAttribute("data-ui-color", "blue");
  const status = panels.nth(0).getByText("已同步", { exact: true });
  const initialStatusColor = await status.evaluate(
    (el) => getComputedStyle(el).color,
  );
  await lab
    .getByRole("combobox", { name: "组件配色组合" })
    .selectOption("garden");
  await expect(panels.nth(0)).toHaveAttribute("data-ui-color", "teal");
  expect(await status.evaluate((el) => getComputedStyle(el).color)).toBe(
    initialStatusColor,
  );
  await lab.getByRole("switch", { name: "启用组件配色" }).uncheck();
  await expect(panels.nth(0)).not.toHaveAttribute("data-ui-color", /./);
  await expect(
    panels.nth(0).getByRole("heading", { name: "表单与流程" }),
  ).toBeVisible();
  await expect(panels.nth(0).getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "72",
  );
  await lab.getByRole("switch", { name: "启用组件配色" }).check();
  await page.getByRole("button", { name: "切换深色" }).click();
  await expect(lab.getByRole("combobox", { name: "组件配色组合" })).toHaveValue(
    "garden",
  );
  await expect(page.getByRole("button", { name: "切换浅色" })).toBeVisible();
  await lab.getByRole("button", { name: "查看配色", exact: true }).click();
  const popup = page.getByRole("dialog", { name: "组件配色说明" });
  await expect(popup).toHaveAttribute("data-ui-mode", "dark");
  const teal = popup.getByText("青绿", { exact: true });
  expect(
    await teal.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(24, 60, 56)");
  await page.keyboard.press("Escape");
  await expect(
    lab.getByRole("button", { name: "查看配色", exact: true }),
  ).toBeFocused();
});

import { test, expect } from "@playwright/test";

test("case discovery, preview state and copy recovery form one usable journey", async ({
  page,
}) => {
  await page.addInitScript(() => {
    let first = true;
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text: string) => {
          if (first) {
            first = false;
            throw new Error("Clipboard unavailable");
          }
          (window as any).copiedCase = text;
        },
      },
    });
  });
  await page.goto("/#cases");
  const search = page.getByRole("searchbox", { name: "搜索案例" });
  await search.fill("  重试  ");
  await expect(page.getByRole("link", { name: /^体验案例/ })).toHaveCount(1);
  await search.fill("UiTextarea");
  await expect(page.getByRole("link", { name: /^体验案例/ })).toHaveCount(2);
  await page.getByRole("button", { name: "AI 与数据 3", exact: true }).click();
  await page
    .getByRole("link", { name: "体验案例 · 纸语 · 思考伙伴", exact: true })
    .click();
  await expect(page).toHaveURL(/#cases\/claude\?/);
  const preview = page.frameLocator('iframe[title="纸语 · 思考伙伴"]');
  const draft = preview.getByRole("textbox", { name: "想和助手讨论什么" });
  await draft.fill("保留这个长中文草稿，切换尺寸和说明后继续编辑。");
  await page.getByRole("button", { name: "手机390", exact: true }).click();
  await page.getByRole("button", { name: "设计与接入", exact: true }).click();
  await page
    .getByRole("button", { name: "复制 Vue 代码", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "重试复制", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "重试复制", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "已复制", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => (window as any).copiedCase)).toContain(
    'case-id="claude"',
  );
  await page.getByRole("button", { name: "交互预览", exact: true }).click();
  await expect(draft).toHaveValue(
    "保留这个长中文草稿，切换尺寸和说明后继续编辑。",
  );
  await expect(page.getByRole("spinbutton", { name: "预览宽度" })).toHaveValue(
    "390",
  );
  await page.goBack();
  await expect(search).toHaveValue("UiTextarea");
  await expect(
    page.getByRole("button", { name: "AI 与数据 3" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("link", { name: "体验案例 · 纸语 · 思考伙伴" }),
  ).toBeFocused();
  await page.goForward();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "纸语 · 思考伙伴", level: 1 }),
  ).toBeVisible();
});

test("return restores list position; empty and missing entries have reachable recovery", async ({
  page,
}) => {
  await page.goto("/#cases");
  const link = page.getByRole("link", {
    name: "体验案例 · 同频 · 团队消息",
    exact: true,
  });
  await link.scrollIntoViewIfNeeded();
  const scroll = await page.evaluate(() => window.scrollY);
  await link.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.getByRole("link", { name: "返回案例库", exact: true }).click();
  await expect(link).toBeFocused();
  await expect
    .poll(async () =>
      Math.abs((await page.evaluate(() => window.scrollY)) - scroll),
    )
    .toBeLessThan(5);
  await page
    .getByRole("searchbox", { name: "搜索案例" })
    .fill("没有这种案例-123");
  await expect(
    page.getByRole("heading", { name: "没有匹配的案例" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "显示全部案例" }).click();
  await expect(page.getByRole("link", { name: /^体验案例/ })).toHaveCount(16);
  await page.goto("/#cases/missing");
  await expect(
    page.getByRole("heading", { name: "没有找到这个案例" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "返回案例库" }).click();
  await expect(page.getByRole("link", { name: /^体验案例/ })).toHaveCount(16);
});

test("mobile navigation dismisses and reaches the real React installation guide", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#cases");
  const menu = page.getByRole("button", { name: "打开导航" });
  await menu.click();
  await expect(page.getByRole("dialog", { name: "浏览设计库" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "安装与接入" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "React 18 个组件", exact: true })
    .click();
  await expect(page.locator(".install-command")).toContainText(
    "ai-design-system-react-0.2.2.tgz",
  );
  await expect(page.locator(".install-guide")).toContainText("theme={{");
  for (const width of [320, 390, 768, 801, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      )
      .toBeLessThanOrEqual(1);
  }
});

test("long translated actions keep readable labels at the largest type setting", async ({
  page,
}) => {
  await page.goto("/#forms");
  await page
    .getByRole("combobox", { name: "字号", exact: true })
    .selectOption("1.2");
  await page.getByRole("switch", { name: "窄容器预览" }).check();
  const action = page.getByRole("button", {
    name: "Alle Dateien herunterladen",
    exact: true,
  });
  await action.click();
  await expect(page.getByText("已触发演示操作，不下载文件")).toBeVisible();
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await action.evaluate((el) => {
        const bounds = el.getBoundingClientRect();
        const parent = el
          .closest(".translation-example")!
          .getBoundingClientRect();
        return (
          bounds.left >= parent.left &&
          bounds.right <= parent.right &&
          el.scrollWidth <= el.clientWidth + 1 &&
          el.scrollHeight <= el.clientHeight + 1
        );
      }),
    ).toBe(true);
  }
});

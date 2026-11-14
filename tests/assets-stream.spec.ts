import { test, expect } from "@playwright/test";
test.setTimeout(90000);

test("Vue task log switches shells, follows user intent, resumes SSE, cancels and retries failure", async ({
  page,
}) => {
  await page.goto("/#logs");
  await page
    .getByRole("button", { name: "Windows Terminal", exact: true })
    .click();
  await expect(page.locator(".ui-task-log")).toHaveAttribute(
    "data-shell",
    "windows",
  );
  await page.getByLabel("恢复场景", { exact: true }).selectOption("disconnect");
  await page.getByRole("button", { name: "开始检查", exact: true }).click();
  await expect(page.getByText("连接中断", { exact: true })).toBeVisible();
  const runId = await page.locator(".ui-task-run-id").textContent();
  await page.getByRole("button", { name: "继续接收", exact: true }).click();
  await expect(page.getByText("任务完成", { exact: true })).toBeVisible({
    timeout: 30000,
  });
  expect(await page.locator(".ui-task-run-id").textContent()).toBe(runId);
  await page
    .locator(".ui-task-log")
    .screenshot({ path: "docs/screenshots/task-log-windows-0.4.jpg" });
  await page
    .getByRole("button", { name: "macOS Terminal", exact: true })
    .click();
  await page
    .locator(".ui-task-log")
    .screenshot({ path: "docs/screenshots/task-log-mac-0.4.jpg" });
  const logs = await page.locator(".ui-task-row code").allTextContents();
  expect(new Set(logs).size).toBe(logs.length);
  await page.getByLabel("筛选日志", { exact: true }).fill("UiButton");
  await expect(page.locator(".ui-task-row")).toHaveCount(2);
  await page.getByLabel("日志级别", { exact: true }).selectOption("error");
  await expect(page.getByText("没有匹配的日志", { exact: true })).toBeVisible();
  await page.getByLabel("筛选日志", { exact: true }).clear();
  await page.getByLabel("日志级别", { exact: true }).selectOption("all");
  await page.getByLabel("恢复场景", { exact: true }).selectOption("none");
  await page.getByRole("button", { name: "开始检查", exact: true }).click();
  await expect(page.getByText("实时接收", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "暂停跟随", exact: true }).click();
  const scrollTop = await page
    .locator(".ui-task-viewport")
    .evaluate((e) => e.scrollTop);
  const pausedLines = await page.locator(".ui-task-row code").allTextContents();
  await expect
    .poll(async () =>
      parseInt((await page.locator(".ui-task-count").textContent())!),
    )
    .toBeGreaterThan(18);
  expect(await page.locator(".ui-task-row code").allTextContents()).toEqual(
    pausedLines,
  );
  await expect(page.getByText("有新日志", { exact: true })).toBeVisible();
  expect(
    await page.locator(".ui-task-viewport").evaluate((e) => e.scrollTop),
  ).toBe(scrollTop);
  await page.getByRole("button", { name: "跟随最新 ↓", exact: true }).click();
  await page.getByRole("button", { name: "取消任务", exact: true }).click();
  await expect(page.getByText("任务已取消", { exact: true })).toBeVisible();
  await page.getByLabel("恢复场景", { exact: true }).selectOption("failure");
  await page.getByRole("button", { name: "开始检查", exact: true }).click();
  await expect(page.getByText("任务失败", { exact: true })).toBeVisible();
  await page.getByLabel("恢复场景", { exact: true }).selectOption("none");
  await page.getByRole("button", { name: "重新运行", exact: true }).click();
  await expect(page.getByText("任务完成", { exact: true })).toBeVisible({
    timeout: 30000,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator(".ui-task-log")
    .screenshot({ path: "docs/screenshots/task-log-mobile-0.4.jpg" });
});

test("in-page AI streams simulated events, retains draft and recovers interrupted output", async ({
  page,
}) => {
  await page.goto("/#ai");
  const input = page.getByLabel("向助手提问", { exact: true });
  await input.fill("保留我的输入");
  await page.getByRole("button", { name: "发送消息", exact: true }).click();
  await expect(page.getByText("已完成", { exact: true })).toBeVisible();
  const complete = await page.locator(".ai-stream-message>p").textContent();
  await expect(input).toHaveValue("保留我的输入");
  await page.getByRole("switch", { name: "演示中途断流" }).click();
  await page.getByRole("button", { name: "发送消息", exact: true }).click();
  await expect(page.getByText("结果待核对", { exact: true })).toBeVisible();
  const partial = await page.locator(".ai-stream-message>p").textContent();
  expect(complete!.startsWith(partial!)).toBe(true);
  await page.getByRole("button", { name: "核对并继续", exact: true }).click();
  await expect(page.getByText("已完成", { exact: true })).toBeVisible();
  await expect(page.locator(".ai-stream-message>p")).toHaveText(complete!);
  await page.getByRole("switch", { name: "演示中途断流" }).click();
  await page.getByRole("button", { name: "发送消息", exact: true }).click();
  await expect(page.locator(".ai-stream-message>p")).not.toBeEmpty();
  await page.getByRole("button", { name: "停止生成", exact: true }).click();
  await expect(page.getByText("已停止", { exact: true })).toBeVisible();
  await expect(input).toHaveValue("保留我的输入");
  await page.getByRole("button", { name: "继续", exact: true }).click();
  await expect(page.getByText("已完成", { exact: true })).toBeVisible();
  const original = await page
    .getByLabel("页面介绍", { exact: true })
    .inputValue();
  await page.getByRole("button", { name: "查看改写建议" }).click();
  await page.getByRole("button", { name: "应用修改", exact: true }).click();
  await expect(page.getByLabel("页面介绍", { exact: true })).not.toHaveValue(
    original,
  );
  await page.getByRole("button", { name: "撤销应用", exact: true }).click();
  await expect(page.getByLabel("页面介绍", { exact: true })).toHaveValue(
    original,
  );
});

for (const framework of ["vue", "react"])
  test(`${framework} actual package: storage failure retry, dialog theme and focus`, async ({
    page,
  }) => {
    await page.goto(
      `${process.env.UI_EXAMPLES_URL || "http://127.0.0.1:4319"}/${framework}/`,
    );
    await page
      .getByRole("textbox", { name: /^工作室名称/ })
      .fill("真实包接入与失败重试");
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      (window as any).restoreStorage = () =>
        (Storage.prototype.setItem = original);
      Storage.prototype.setItem = function (key, value) {
        if (key.startsWith("ai-design-system-integration"))
          throw Error("Injected write failure");
        return original.call(this, key, value);
      };
    });
    await page.getByRole("button", { name: "保存到本机", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "重试保存", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: /^工作室名称/ }),
    ).toHaveValue("真实包接入与失败重试");
    await page.evaluate(() => (window as any).restoreStorage());
    await page.getByRole("button", { name: "重试保存", exact: true }).click();
    await expect(
      page.getByText("已保存到本机：真实包接入与失败重试", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "切换深色", exact: true }).click();
    await page.getByRole("button", { name: "查看预览", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(
      await dialog.evaluate((e) =>
        e.closest("[data-ui-mode]")?.getAttribute("data-ui-mode"),
      ),
    ).toBe("dark");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "查看预览", exact: true }),
    ).toBeFocused();
    if (framework === "react") {
      await page.getByRole("button", { name: "开始检查", exact: true }).click();
      await expect(page.getByText("实时接收", { exact: true })).toBeVisible();
      const cancelledRun = await page.locator(".ui-task-run-id").textContent();
      await page.getByRole("button", { name: "取消任务", exact: true }).click();
      await expect(page.getByText("任务已取消", { exact: true })).toBeVisible();
      const activity = page.getByRole("region", {
        name: "组件检查",
        exact: true,
      });
      await expect(activity.getByText("已取消", { exact: true })).toBeVisible();
      await activity
        .getByRole("button", { name: "重新运行", exact: true })
        .click();
      await expect(page.getByText("任务完成", { exact: true })).toBeVisible({
        timeout: 30000,
      });
      expect(await page.locator(".ui-task-run-id").textContent()).not.toBe(
        cancelledRun,
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

test("characters follow focus, reduced motion pauses backgrounds; original studio selection works", async ({
  page,
}) => {
  await page.goto("/#assets");
  await page.getByLabel("称呼", { exact: true }).focus();
  await expect(page.locator(".ui-auth-characters")).toHaveAttribute(
    "data-mode",
    "typing",
  );
  await page.getByLabel("演示密码", { exact: true }).focus();
  await expect(page.locator(".ui-auth-characters")).toHaveAttribute(
    "data-mode",
    "password",
  );
  await page.getByRole("switch", { name: "显示演示密码" }).click();
  await expect(page.locator(".ui-auth-characters")).toHaveAttribute(
    "data-mode",
    "reveal",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".ui-backdrop")).toHaveAttribute(
    "data-effect-state",
    "paused",
  );
  await page.goto("/#studio");
  await expect(page.locator(".ui-studio-scene")).toBeVisible();
  await page.getByRole('button', { name: '查看陶陶' }).click();
  await page.getByLabel('给陶陶的便签').fill('保留输入');
  await page.getByRole('button', { name: '查看小苔' }).click();
  await page.getByRole('button', { name: '查看陶陶' }).click();
  await expect(page.getByLabel('给陶陶的便签')).toHaveValue('保留输入');
});

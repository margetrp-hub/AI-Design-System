import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const terminal = (status) =>
  ["success", "failed", "cancelled"].includes(status);
/** Bounded, read-only local task service. Retention is process-local; restarting expires runs. */
export function createTaskDemo({ delay = 90 } = {}) {
  const tasks = new Map();
  function emit(task, event, data) {
    const record = {
      id: task.events.length + 1,
      event,
      data: { runId: task.runId, ...data },
    };
    task.events.push(record);
    for (const response of task.listeners) {
      if (task.disconnect && !task.disconnected && record.id === 7) {
        task.disconnected = true;
        response.destroy();
        continue;
      }
      response.write(
        `id: ${record.id}\nevent: ${event}\ndata: ${JSON.stringify(record.data)}\n\n`,
      );
      if (event === "status" && terminal(data.status)) response.end();
    }
  }
  function log(task, level, message) {
    emit(task, "log", {
      level,
      message,
      time: new Date().toISOString().slice(11, 23),
    });
  }
  function finish(task, status) {
    if (terminal(task.status)) return;
    task.status = status;
    clearTimeout(task.timer);
    emit(task, "status", { status });
  }
  async function execute(task) {
    try {
      const manifest = JSON.parse(
        await readFile(path.join(root, "registry/manifest.json"), "utf8"),
      );
      if (terminal(task.status)) return;
      const components = manifest.items.filter(
        (item) => item.kind === "component",
      );
      log(
        task,
        "info",
        `已读取 ${components.length} 个框架组件条目，开始检查源码路径。`,
      );
      let index = 0;
      async function next() {
        if (terminal(task.status)) return;
        try {
          if (task.fail && index === 4) {
            log(
              task,
              "error",
              "演示故障：主动中止检查。可关闭故障开关后重新运行。",
            );
            finish(task, "failed");
            return;
          }
          if (index >= components.length) {
            log(
              task,
              "success",
              `检查完成：${index} 个组件源码均可读取。未执行构建或访问业务服务。`,
            );
            finish(task, "success");
            return;
          }
          const item = components[index++],
            content = await readFile(path.join(root, item.source));
          if (terminal(task.status)) return;
          log(
            task,
            index % 8 === 0 ? "info" : "debug",
            `${item.framework.padEnd(5)} ${item.name.padEnd(20)} ${content.byteLength} bytes`,
          );
          task.timer = setTimeout(next, delay);
        } catch (error) {
          log(task, "error", error.message);
          finish(task, "failed");
        }
      }
      task.timer = setTimeout(next, delay);
    } catch (error) {
      log(task, "error", error.message);
      finish(task, "failed");
    }
  }
  const json = (res, status, data) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };
  async function handler(req, res) {
    const route = new URL(req.url, "http://127.0.0.1").pathname.replace(
      /\/$/,
      "",
    );
    try {
      if (route === "" && req.method === "POST") {
        let raw = "";
        for await (const chunk of req) {
          raw += chunk;
          if (raw.length > 5000) {
            json(res, 413, { error: "request too large" });
            return;
          }
        }
        const body = JSON.parse(raw);
        if (!/^[a-zA-Z0-9_-]{1,80}$/.test(body.runId ?? "")) {
          json(res, 400, { error: "invalid runId" });
          return;
        }
        if (tasks.has(body.runId)) {
          json(res, 200, {
            runId: body.runId,
            status: tasks.get(body.runId).status,
          });
          return;
        }
        if (
          [...tasks.values()].filter((t) => !terminal(t.status)).length >= 10
        ) {
          json(res, 429, { error: "too many active demo tasks" });
          return;
        }
        if (tasks.size >= 50) {
          const old = [...tasks.values()].find((t) => terminal(t.status));
          if (old) tasks.delete(old.runId);
        }
        const task = {
          runId: body.runId,
          status: "running",
          events: [],
          listeners: new Set(),
          fail: body.fault === "failure",
          disconnect: body.fault === "disconnect",
          disconnected: false,
          timer: undefined,
        };
        tasks.set(task.runId, task);
        emit(task, "status", { status: "running" });
        log(task, "info", "开始本地组件清单只读检查。");
        log(
          task,
          "warning",
          "演示任务仅保留在此开发服务进程；服务重启后记录失效。",
        );
        json(res, 201, { runId: task.runId, status: task.status });
        void execute(task);
        return;
      }
      const match = /^\/([\w-]+)\/(events|cancel)$/.exec(route),
        task = match && tasks.get(match[1]);
      if (!task) {
        json(res, 404, { error: "demo task missing or expired" });
        return;
      }
      if (match[2] === "cancel" && req.method === "POST") {
        if (!terminal(task.status)) {
          log(task, "warning", "服务端已取消剩余检查。");
          finish(task, "cancelled");
        }
        json(res, 200, { runId: task.runId, status: task.status });
        return;
      }
      if (match[2] === "events" && req.method === "GET") {
        const cursor = Number(req.headers["last-event-id"] ?? 0);
        if (
          !Number.isSafeInteger(cursor) ||
          cursor < 0 ||
          cursor > task.events.length
        ) {
          json(res, 409, { error: "invalid cursor" });
          return;
        }
        res.writeHead(200, {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
        });
        res.flushHeaders();
        res.write(": task event stream\n\n");
        // Replay and subscribe synchronously so no event can fall into a handoff gap.
        for (const event of task.events.slice(cursor))
          res.write(
            `id: ${event.id}\nevent: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`,
          );
        if (terminal(task.status)) {
          res.end();
          return;
        }
        task.listeners.add(res);
        res.on("close", () => task.listeners.delete(res));
        return;
      }
      json(res, 405, { error: "method not allowed" });
    } catch (error) {
      if (!res.headersSent) json(res, 400, { error: "Invalid demo request" });
      else res.destroy();
    }
  }
  return {
    handler,
    dispose() {
      for (const task of tasks.values()) {
        clearTimeout(task.timer);
        for (const response of task.listeners) response.end();
      }
      tasks.clear();
    },
  };
}

// Design fixtures only. This transport never opens a network connection.
type RecordEvent = { id: number; event: string; data: Record<string, unknown> };
type DemoRun = {
  id: string;
  status: string;
  events: RecordEvent[];
  listeners: Set<(event: RecordEvent) => void>;
  timer?: ReturnType<typeof setTimeout>;
  fault: string;
  disconnected: boolean;
};
const answer = Array.from(
  "好的界面，不只在静止时好看。\n\n内容逐步出现时，保持阅读位置；连接中断时，保留已有内容；建议可以采用时，把修改前后放在一起。\n\n这是浏览器里的设计模拟，没有连接模型或执行后台任务。",
);
const fixtures = [
  "Vue UiButton",
  "React UiButton",
  "主题变量",
  "字体资源",
  "输入焦点",
  "分页状态",
  "页面切换",
  "浮层定位",
  "透明材质",
  "键盘导航",
  "移动布局",
  "错误恢复",
];
const terminal = (status: string) =>
  ["success", "failed", "cancelled"].includes(status);
export function createDemoTransport() {
  const runs = new Map<string, DemoRun>();
  const closeStreams = new Set<() => void>();
  const encode = (event: RecordEvent) =>
    new TextEncoder().encode(
      `id: ${event.id}\nevent: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`,
    );
  function emit(run: DemoRun, event: string, data: Record<string, unknown>) {
    const record = {
      id: run.events.length + 1,
      event,
      data: { runId: run.id, ...data },
    };
    run.events.push(record);
    for (const listener of run.listeners) listener(record);
  }
  function finish(run: DemoRun, status: string) {
    if (terminal(run.status)) return;
    clearTimeout(run.timer);
    run.status = status;
    emit(run, "status", { status });
  }
  function log(run: DemoRun, level: string, message: string) {
    emit(run, "log", {
      level,
      message,
      time: new Date().toISOString().slice(11, 23),
    });
  }
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  const fetcher: typeof fetch = async (input, init = {}) => {
    const url = String(input);
    const body = typeof init.body === "string" ? JSON.parse(init.body) : {};
    const cursor = Number(new Headers(init.headers).get("Last-Event-ID") || 0);
    if (url.endsWith("/stream")) {
      let timer: ReturnType<typeof setTimeout>,
        index = cursor,
        stopped = false;
      let stop = () => {};
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          stop = () => {
            if (stopped) return;
            stopped = true;
            clearTimeout(timer);
            closeStreams.delete(stop);
            controller.close();
          };
          closeStreams.add(stop);
          function step() {
            if (stopped) return;
            if (body.fault === "disconnect" && cursor === 0 && index === 6) {
              stop();
              return;
            }
            if (index >= answer.length) {
              controller.enqueue(
                encode({
                  id: index + 1,
                  event: "done",
                  data: { runId: body.runId },
                }),
              );
              stop();
              return;
            }
            controller.enqueue(
              encode({
                id: index + 1,
                event: "delta",
                data: { text: answer[index++] },
              }),
            );
            timer = setTimeout(step, 22);
          }
          timer = setTimeout(step, 22);
        },
        cancel() {
          stopped = true;
          clearTimeout(timer);
          closeStreams.delete(stop);
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/event-stream" },
      });
    }
    if (url.endsWith("/tasks") && init.method === "POST") {
      let run = runs.get(body.runId);
      if (!run) {
        for (const [id, old] of runs) if (terminal(old.status)) runs.delete(id);
        run = {
          id: body.runId,
          status: "running",
          events: [],
          listeners: new Set(),
          fault: body.fault,
          disconnected: false,
        };
        runs.set(run.id, run);
        const task = run;
        emit(task, "status", { status: "running" });
        log(
          task,
          "warning",
          "浏览器模拟：以下日志为设计夹具，没有执行真实检查。",
        );
        let index = 0;
        function step() {
          if (terminal(task.status)) return;
          if (task.fault === "failure" && index === 8) {
            log(task, "error", "模拟检查失败。选择正常任务后可重新运行。");
            finish(task, "failed");
            return;
          }
          if (index === 42) {
            log(task, "success", "模拟流程完成。");
            finish(task, "success");
            return;
          }
          const message =
            index < fixtures.length
              ? fixtures[index]
              : `设计状态 ${index + 1} / 焦点、布局与反馈`;
          log(
            task,
            index % 7 ? "debug" : "info",
            `${String(index + 1).padStart(2, "0")}  ${message}`,
          );
          index++;
          task.timer = setTimeout(step, 95);
        }
        task.timer = setTimeout(step, 95);
      }
      return json({ runId: run.id, status: run.status }, 201);
    }
    const match = /\/tasks\/([^/]+)\/(events|cancel)$/.exec(url);
    const run = match && runs.get(match[1]);
    if (!run || !match)
      return json({ error: "模拟任务已过期，请重新开始。" }, 404);
    if (match[2] === "cancel") {
      log(run, "warning", "模拟任务已取消。");
      finish(run, "cancelled");
      return json({ runId: run.id, status: run.status });
    }
    let listener: (event: RecordEvent) => void,
      stop = () => {},
      stopped = false;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        stop = () => {
          if (stopped) return;
          stopped = true;
          run.listeners.delete(listener);
          closeStreams.delete(stop);
          controller.close();
        };
        listener = (event) => {
          if (stopped) return;
          if (
            run.fault === "disconnect" &&
            !run.disconnected &&
            event.id === 7
          ) {
            run.disconnected = true;
            stop();
            return;
          }
          controller.enqueue(encode(event));
          if (event.event === "status" && terminal(String(event.data.status)))
            stop();
        };
        closeStreams.add(stop);
        for (const event of run.events.slice(cursor)) listener(event);
        if (!stopped && terminal(run.status)) stop();
        if (!stopped) run.listeners.add(listener);
      },
      cancel() {
        stopped = true;
        run.listeners.delete(listener);
        closeStreams.delete(stop);
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  };
  return {
    fetcher,
    destroy() {
      for (const run of runs.values()) clearTimeout(run.timer);
      for (const close of [...closeStreams]) close();
      runs.clear();
    },
  };
}

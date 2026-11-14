import { openSse } from "./index.js";

/** Optional client for the documented task-event contract. It never retries a POST automatically. */
export function createTaskLogSession({
  url,
  onChange,
  headers,
  fetcher = fetch,
  maxEntries = 5000,
}) {
  let state = {
    runId: "",
    status: "idle",
    connection: "idle",
    entries: [],
    cursor: 0,
    discarded: 0,
    error: "",
    cancelling: false,
  };
  let controller,
    disposed = false,
    generation = 0;
  const publish = (patch) => {
    state = { ...state, ...patch };
    if (!disposed) onChange({ ...state, entries: [...state.entries] });
  };
  const auth = async () =>
    typeof headers === "function" ? await headers() : headers;
  const taskUrl = () =>
    `${url.replace(/\/$/, "")}/${encodeURIComponent(state.runId)}`;
  async function connect() {
    if (disposed || !state.runId || controller) return;
    const current = new AbortController(),
      token = ++generation;
    controller = current;
    publish({ connection: "connecting", error: "" });
    let terminal = ["success", "failed", "cancelled"].includes(state.status);
    try {
      for await (const event of openSse(taskUrl() + "/events", {
        fetcher,
        headers: await auth(),
        lastEventId: String(state.cursor),
        signal: current.signal,
      })) {
        if (token !== generation || disposed) return;
        const seq = Number(event.id);
        if (!Number.isSafeInteger(seq) || seq < 1)
          throw Error("Invalid task event cursor");
        if (seq <= state.cursor) continue;
        if (seq !== state.cursor + 1)
          throw Error("Task event gap; reconnect to reconcile");
        const data = JSON.parse(event.data);
        if (data.runId !== state.runId)
          throw Error("Task receipt belongs to another run");
        const patch = { cursor: seq, connection: "live" };
        if (event.event === "log") {
          if (
            typeof data.message !== "string" ||
            typeof data.time !== "string" ||
            !["debug", "info", "warning", "error", "success"].includes(
              data.level,
            )
          )
            throw Error("Invalid task log");
          const entries = [
            ...state.entries,
            {
              id: String(seq),
              time: data.time,
              level: data.level,
              message: data.message,
            },
          ];
          const overflow = Math.max(
            0,
            entries.length - Math.max(1, maxEntries),
          );
          patch.entries = entries.slice(overflow);
          patch.discarded = state.discarded + overflow;
        } else if (event.event === "status") {
          if (
            !["running", "success", "failed", "cancelled"].includes(data.status)
          )
            throw Error("Invalid task status");
          patch.status = data.status;
          terminal = data.status !== "running";
        } else throw Error("Unsupported task event");
        publish(patch);
      }
      if (token === generation)
        publish(
          terminal
            ? { connection: "idle" }
            : {
                connection: "disconnected",
                error: "连接结束，任务结果尚未确认。请继续接收。",
              },
        );
    } catch (error) {
      if (token === generation && !current.signal.aborted)
        publish({ connection: "disconnected", error: error.message });
    } finally {
      if (controller === current) controller = undefined;
    }
  }
  async function start(body = {}) {
    if (
      disposed ||
      controller ||
      state.status === "running" ||
      state.status === "unknown"
    )
      return;
    const runId = crypto.randomUUID(),
      token = ++generation;
    publish({
      runId,
      status: "unknown",
      connection: "connecting",
      entries: [],
      cursor: 0,
      discarded: 0,
      error: "",
    });
    const pending = new AbortController();
    controller = pending;
    try {
      const requestHeaders = new Headers(await auth());
      requestHeaders.set("Content-Type", "application/json");
      const response = await fetcher(url, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({ ...body, runId }),
        signal: pending.signal,
      });
      if (!response.ok) throw Error(`Create task HTTP ${response.status}`);
      const receipt = await response.json();
      if (receipt.runId !== runId) throw Error("Invalid task receipt");
      if (disposed || token !== generation) return;
      publish({ status: "running" });
      controller = undefined;
      await connect();
    } catch (error) {
      if (!disposed && token === generation && !pending.signal.aborted)
        publish({
          connection: "disconnected",
          error: error.message + "；保留任务编号，可继续接收核对。",
        });
    } finally {
      if (controller === pending) controller = undefined;
    }
  }
  function pause() {
    if (!controller) return;
    ++generation;
    controller.abort();
    controller = undefined;
    publish({ connection: "paused" });
  }
  async function cancel() {
    if (
      disposed ||
      state.cancelling ||
      !["running", "unknown"].includes(state.status)
    )
      return;
    publish({ cancelling: true, error: "" });
    try {
      const response = await fetcher(taskUrl() + "/cancel", {
        method: "POST",
        headers: await auth(),
      });
      if (!response.ok) throw Error(`Cancel task HTTP ${response.status}`);
      const receipt = await response.json();
      if (
        receipt.runId !== state.runId ||
        !["cancelled", "success", "failed"].includes(receipt.status)
      )
        throw Error("Invalid cancellation receipt");
      publish({ status: receipt.status });
      if (!controller) await connect();
    } catch (error) {
      publish({
        error: "取消未确认：" + error.message + "。可再次取消或继续接收核对。",
      });
    } finally {
      publish({ cancelling: false });
    }
  }
  return {
    start,
    resume: connect,
    pause,
    cancel,
    getSnapshot: () => ({ ...state, entries: [...state.entries] }),
    destroy() {
      disposed = true;
      ++generation;
      controller?.abort();
      controller = undefined;
    },
  };
}

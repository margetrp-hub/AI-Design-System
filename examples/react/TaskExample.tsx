import { useEffect, useRef, useState } from "react";
import {
  UiButton,
  UiTaskLog,
  UiCommandDock,
  UiAiComposer,
  UiAiSuggestion,
  UiToolActivity,
} from "@ai-design-system/react";
import {
  createTaskLogSession,
  type TaskLogSnapshot,
  type TaskLogSession,
} from "@ai-design-system/stream";
import { createDemoTransport } from "../shared/demo-stream";
export default function TaskExample() {
  const [shell, setShell] = useState("windows"),
    [fault, setFault] = useState("none"),
    [task, setTask] = useState<TaskLogSnapshot>({
      runId: "",
      status: "idle",
      connection: "idle",
      entries: [],
      cursor: 0,
      discarded: 0,
      error: "",
      cancelling: false,
    }),
    session = useRef<TaskLogSession | undefined>(undefined);
  const [prompt, setPrompt] = useState("检查组件清单"),
    [text, setText] = useState("我们自己的 UI 组件库。"),
    [suggestion, setSuggestion] = useState(true),
    [previous, setPrevious] = useState("");
  useEffect(() => {
    const demo = createDemoTransport();
    session.current = createTaskLogSession({
      fetcher: demo.fetcher,
      url: "/__design-demo/tasks",
      onChange: setTask,
    });
    return () => { session.current?.destroy(); demo.destroy(); };
  }, []);
  const run = () => {
      void session.current?.start({ fault });
    },
    busy = ["running", "unknown"].includes(task.status);
  return (
    <section className="integration-stack" style={{ marginTop: 40 }}>
      <h2>React · 页面内 AI 与任务日志</h2>
      <UiCommandDock
        value={shell}
        onValueChange={setShell}
        items={[
          { id: "mac", label: "macOS Terminal" },
          { id: "windows", label: "Windows Terminal" },
        ]}
      />
      <label>
        恢复场景
        <select
          value={fault}
          disabled={busy}
          onChange={(e) => setFault(e.target.value)}
        >
          <option value="none">正常任务</option>
          <option value="disconnect">中途断开连接</option>
          <option value="failure">任务主动失败</option>
        </select>
      </label>
      <UiButton type="button" disabled={busy} onClick={run}>
        开始检查
      </UiButton>
      <UiTaskLog
        {...task}
        shell={shell as "mac" | "windows"}
        title="React / inspect"
        onCancel={
          busy
            ? () => {
                void session.current?.cancel();
              }
            : undefined
        }
        onResume={
          ["paused", "disconnected"].includes(task.connection)
            ? () => {
                void session.current?.resume();
              }
            : undefined
        }
        onPause={
          task.connection === "live"
            ? () => session.current?.pause()
            : undefined
        }
        onRetry={
          !busy && task.status !== "idle" && task.connection === "idle"
            ? run
            : undefined
        }
      />
      <p className="integration-muted">
        真实 SSE 传输、本地只读清单检查；不连接模型或系统 Shell。
      </p>
      <UiAiComposer
        value={prompt}
        onValueChange={setPrompt}
        context="本地组件清单"
        busy={busy}
        onSubmit={run}
        onStop={() => {
          void session.current?.cancel();
        }}
        suggestions={["检查组件清单"]}
      />
      {task.status !== "idle" && (
        <UiToolActivity
          title="组件检查"
          status={task.status === "failed" ? "error" : task.status}
          description={task.error || "状态来自本地任务服务"}
          onRetry={() => {
            if (task.status === "unknown") void session.current?.resume();
            else run();
          }}
          onCancel={() => {
            void session.current?.cancel();
          }}
        />
      )}
      <p>{text}</p>
      {suggestion && (
        <UiAiSuggestion
          title="预置文案建议"
          before={text}
          after="一套基础，多种视觉语言。"
          onApply={() => {
            setPrevious(text);
            setText("一套基础，多种视觉语言。");
            setSuggestion(false);
          }}
          onDismiss={() => setSuggestion(false)}
        />
      )}
      <UiButton
        type="button"
        onClick={() => {
          if (previous) setText(previous);
          setSuggestion(true);
        }}
      >
        恢复文案并查看建议
      </UiButton>
    </section>
  );
}

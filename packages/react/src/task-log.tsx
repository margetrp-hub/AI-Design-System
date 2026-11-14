"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  TaskLogEntry,
  TaskStatus,
  TaskConnection,
} from "@ai-design-system/stream";
export interface UiTaskLogProps {
  entries: TaskLogEntry[];
  title?: string;
  shell?: "mac" | "windows";
  status?: TaskStatus;
  connection?: TaskConnection;
  runId?: string;
  error?: string;
  discarded?: number;
  cancelling?: boolean;
  maxVisible?: number;
  onCancel?: () => void;
  onResume?: () => void;
  onPause?: () => void;
  onRetry?: () => void;
}
const statuses = {
  idle: "未开始",
  unknown: "结果待确认",
  running: "任务执行中",
  success: "任务完成",
  failed: "任务失败",
  cancelled: "任务已取消",
};
const connections = {
  idle: "",
  connecting: "正在连接",
  live: "实时接收",
  paused: "接收已暂停",
  disconnected: "连接中断",
};
export function UiTaskLog({
  entries,
  title = "任务日志",
  shell = "mac",
  status = "idle",
  connection = "idle",
  runId,
  error,
  discarded = 0,
  cancelling = false,
  maxVisible = 500,
  onCancel,
  onResume,
  onPause,
  onRetry,
}: UiTaskLogProps) {
  const [query, setQuery] = useState(""),
    [level, setLevel] = useState("all"),
    [copy, setCopy] = useState("复制筛选日志"),
    viewport = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState<{
    runId: string | undefined;
    query: string;
    level: string;
    limit: number;
    rows: TaskLogEntry[];
    hidden: number;
    discarded: number;
    tailId: string | undefined;
  }>();
  const reading =
    pinned?.runId === runId &&
    pinned?.query === query &&
    pinned?.level === level &&
    pinned?.limit === maxVisible
      ? pinned
      : undefined;
  const following = !reading;
  const copyRevision = useRef(0),
    copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const matching = useMemo(
    () =>
      entries.filter(
        (e) =>
          (level === "all" || e.level === level) &&
          (!query || e.message.toLowerCase().includes(query.toLowerCase())),
      ),
    [entries, query, level],
  );
  const visible = reading?.rows ?? matching.slice(-Math.max(1, maxVisible)),
    hidden = reading?.hidden ?? matching.length - visible.length,
    released = reading?.discarded ?? discarded;
  const hasNewLogs = reading && reading.tailId !== entries[entries.length - 1]?.id;
  const latest = () => {
    setPinned(undefined);
    if (viewport.current)
      viewport.current.scrollTop = viewport.current.scrollHeight;
  };
  const pauseFollowing = () => {
    if (!following) return;
    setPinned({
      runId,
      query,
      level,
      limit: maxVisible,
      rows: [...visible],
      hidden,
      discarded,
      tailId: entries[entries.length - 1]?.id,
    });
  };
  useEffect(() => {
    if (!entries.length) setPinned(undefined);
  }, [entries.length]);
  useEffect(() => {
    copyRevision.current++;
    clearTimeout(copyTimer.current);
    setCopy("复制筛选日志");
    return () => {
      copyRevision.current++;
      clearTimeout(copyTimer.current);
    };
  }, [matching]);
  useEffect(() => {
    if (following && viewport.current)
      viewport.current.scrollTop = viewport.current.scrollHeight;
  }, [
    entries.length,
    entries[entries.length - 1]?.id,
    query,
    level,
    following,
    runId,
  ]);
  return (
    <section
      className="ui-task-log"
      data-shell={shell}
      data-status={status}
      aria-label={title}
    >
      <header className="ui-task-titlebar">
        {shell === "mac" ? (
          <span className="ui-terminal-lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        ) : (
          <span className="ui-task-tab-mark" aria-hidden="true">
            &gt;_
          </span>
        )}
        <strong>{title}</strong>
        <span className="ui-task-shell-name">
          {shell === "mac" ? "zsh" : "PowerShell"}
        </span>
      </header>
      <div className="ui-task-toolbar">
        <label>
          <span className="ui-sr-only">筛选日志</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="筛选日志…"
            type="search"
          />
        </label>
        <label>
          <span className="ui-sr-only">日志级别</span>
          <select
            aria-label="日志级别"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="all">全部级别</option>
            <option value="debug">DEBUG</option>
            <option value="info">INFO</option>
            <option value="warning">WARN</option>
            <option value="error">ERROR</option>
            <option value="success">SUCCESS</option>
          </select>
        </label>
        <button
          type="button"
          disabled={copy === "正在复制…"}
          onClick={async () => {
            const revision = ++copyRevision.current;
            clearTimeout(copyTimer.current);
            setCopy("正在复制…");
            try {
              await navigator.clipboard.writeText(
                matching
                  .map(
                    (e) => `${e.time} [${e.level.toUpperCase()}] ${e.message}`,
                  )
                  .join("\n"),
              );
              if (revision !== copyRevision.current) return;
              setCopy("已复制");
              copyTimer.current = setTimeout(
                () => setCopy("复制筛选日志"),
                2000,
              );
            } catch {
              if (revision === copyRevision.current) setCopy("复制失败，重试");
            }
          }}
        >
          {copy}
        </button>
        <span className="ui-sr-only" role="status">
          {copy === "已复制"
            ? "复制成功"
            : copy === "复制失败，重试"
              ? "复制失败，请重试或手动复制"
              : ""}
        </span>
        <button
          type="button"
          aria-pressed={following}
          onClick={() => (following ? pauseFollowing() : latest())}
        >
          {following ? "暂停跟随" : "跟随最新 ↓"}
        </button>
        {hasNewLogs && <span className="ui-task-new">有新日志</span>}
      </div>
      <div
        ref={viewport}
        className="ui-task-viewport"
        tabIndex={0}
        role="log"
        aria-live="off"
        aria-label={title + "内容"}
        onScroll={() => {
          const el = viewport.current;
          if (el && el.scrollHeight - el.scrollTop - el.clientHeight > 32)
            pauseFollowing();
        }}
      >
        {(released > 0 || hidden > 0) && (
          <p className="ui-task-notice">
            {released > 0 && `客户端已释放 ${released} 条早期日志。`}
            {hidden > 0 &&
              ` 当前仅渲染最近 ${visible.length} 条匹配日志；复制包含所有已保留匹配项。`}
          </p>
        )}
        {visible.map((entry) => (
          <p key={entry.id} className="ui-task-row" data-level={entry.level}>
            <time>{entry.time}</time>
            <span className="ui-task-level">
              {entry.level === "warning" ? "WARN" : entry.level.toUpperCase()}
            </span>
            <code>{entry.message}</code>
          </p>
        ))}
        {!visible.length && (
          <p className="ui-task-empty">
            {entries.length ? "没有匹配的日志" : "等待任务日志"}
            {connection === "live" && (
              <span className="ui-task-cursor" aria-hidden="true">
                ▍
              </span>
            )}
          </p>
        )}
      </div>
      {error && (
        <div className="ui-task-error" role="alert">
          {error}
        </div>
      )}
      <footer className="ui-task-footer">
        <div role="status">
          <span className="ui-task-status-dot" aria-hidden="true" />
          <strong>{statuses[status]}</strong>
          <span>{connections[connection]}</span>
        </div>
        <span className="ui-task-count">{entries.length} 条</span>
        <div className="ui-task-actions">
          {onPause && (
            <button type="button" onClick={onPause}>
              暂停接收
            </button>
          )}
          {onResume && (
            <button type="button" onClick={onResume}>
              继续接收
            </button>
          )}
          {onCancel && (
            <button type="button" disabled={cancelling} onClick={onCancel}>
              {cancelling ? "正在请求取消…" : "取消任务"}
            </button>
          )}
          {onRetry && (
            <button type="button" onClick={onRetry}>
              重新运行
            </button>
          )}
        </div>
      </footer>
      {runId && <div className="ui-task-run-id">任务 {runId}</div>}
    </section>
  );
}

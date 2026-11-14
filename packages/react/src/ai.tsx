"use client";
import { useId, useRef, type ReactNode } from "react";
export interface UiAiComposerProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (text: string) => void;
  onStop?: () => void;
  label?: string;
  placeholder?: string;
  context?: ReactNode;
  busy?: boolean;
  disabled?: boolean;
  suggestions?: string[];
  tools?: ReactNode;
  attachments?: ReactNode;
}
export function UiAiComposer({
  value,
  onValueChange,
  onSubmit,
  onStop,
  label = "向助手提问",
  placeholder = "描述你想完成的事…",
  context,
  busy = false,
  disabled = false,
  suggestions = [],
  tools,
  attachments,
}: UiAiComposerProps) {
  const id = useId(),
    composing = useRef(false);
  function submit() {
    if (!composing.current && !busy && !disabled && value.trim())
      onSubmit(value.trim());
  }
  return (
    <div className="ui-ai-composer">
      {!!suggestions.length && (
        <div className="ui-ai-suggestions" aria-label="可选提示词">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={disabled || busy}
              onClick={() => onValueChange(s)}
            >
              {s} <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      )}
      <form
        className="ui-ai-input-surface"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {context && (
          <div className="ui-ai-context">
            <span aria-hidden="true">▤</span>
            {context}
          </div>
        )}
        <label className="ui-sr-only" htmlFor={id}>
          {label}
        </label>
        <textarea
          id={id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          onCompositionStart={() => (composing.current = true)}
          onCompositionEnd={() => (composing.current = false)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing &&
              !composing.current &&
              event.keyCode !== 229
            ) {
              event.preventDefault();
              submit();
            }
          }}
        />
        {attachments && <div className="ui-ai-attachments">{attachments}</div>}
        <div className="ui-ai-input-footer">
          <div>
            {tools ?? (
              <>
                <span className="ui-ai-mark" aria-hidden="true">
                  ✳
                </span>
                <small>Shift + Enter 换行</small>
              </>
            )}
          </div>
          {busy ? (
            <button
              type="button"
              className="ui-ai-send"
              aria-label="停止生成"
              onClick={onStop}
            >
              ■
            </button>
          ) : (
            <button
              type="submit"
              className="ui-ai-send"
              disabled={disabled || !value.trim()}
              aria-label="发送消息"
            >
              ↑
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
export interface UiAiSuggestionProps {
  before: string;
  after: string;
  title?: string;
  busy?: boolean;
  error?: string;
  onApply: () => void;
  onDismiss: () => void;
  onRetry?: () => void;
  meta?: ReactNode;
}
export function UiAiSuggestion({
  before,
  after,
  title = "修改建议",
  busy = false,
  error,
  onApply,
  onDismiss,
  onRetry,
  meta,
}: UiAiSuggestionProps) {
  return (
    <section className="ui-ai-suggestion" aria-label={title}>
      <header>
        <span className="ui-ai-mark" aria-hidden="true">
          ✳
        </span>
        <strong>{title}</strong>
        {meta}
      </header>
      <div className="ui-ai-diff">
        <div>
          <small>修改前</small>
          <p>{before}</p>
        </div>
        <div>
          <small>建议内容</small>
          <p>{after}</p>
        </div>
      </div>
      {error && (
        <p className="ui-ai-error" role="alert">
          {error}
        </p>
      )}
      <footer>
        <span>由你确认修改</span>
        <button type="button" disabled={busy} onClick={onDismiss}>
          放弃
        </button>
        {error ? (
          <button type="button" disabled={busy} onClick={onRetry}>
            重试
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            className="ui-ai-primary"
            onClick={onApply}
          >
            {busy ? "应用中…" : "应用修改"}
          </button>
        )}
      </footer>
    </section>
  );
}
export interface UiToolActivityProps {
  title: string;
  status:
    | "running"
    | "success"
    | "error"
    | "approval"
    | "unknown"
    | "paused"
    | "cancelled";
  description?: string;
  detail?: string;
  busy?: boolean;
  onRetry?: () => void;
  onCancel?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  children?: ReactNode;
}
const labels = {
  running: "执行中",
  success: "已完成",
  error: "执行失败",
  approval: "需要确认",
  unknown: "结果待核对",
  paused: "已停止",
  cancelled: "已取消",
};
export function UiToolActivity({
  title,
  status,
  description,
  detail,
  busy = false,
  onRetry,
  onCancel,
  onApprove,
  onReject,
  children,
}: UiToolActivityProps) {
  return (
    <section
      className="ui-tool-activity"
      data-status={status}
      aria-label={title}
    >
      <div className="ui-tool-status-icon" aria-hidden="true">
        {status === "success"
          ? "✓"
          : status === "running"
            ? "◌"
            : status === "error"
              ? "!"
              : status === "approval"
                ? "?"
                : "·"}
      </div>
      <div className="ui-tool-content">
        <header>
          <strong>{title}</strong>
          <span role="status">{labels[status]}</span>
        </header>
        {description && <p>{description}</p>}
        {detail && (
          <details>
            <summary>查看执行详情</summary>
            <pre>{detail}</pre>
          </details>
        )}
        <div className="ui-tool-actions">
          {status === "running" && (
            <button type="button" disabled={busy} onClick={onCancel}>
              停止
            </button>
          )}
          {status === "approval" && (
            <>
              <button type="button" disabled={busy} onClick={onReject}>
                拒绝
              </button>
              <button type="button" disabled={busy} onClick={onApprove}>
                允许这次操作
              </button>
            </>
          )}
          {["error", "unknown", "paused", "cancelled"].includes(status) && (
            <button type="button" disabled={busy} onClick={onRetry}>
              {status === "unknown"
                ? "核对并继续"
                : status === "paused"
                  ? "继续"
                  : status === "cancelled"
                    ? "重新运行"
                    : "重试"}
            </button>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

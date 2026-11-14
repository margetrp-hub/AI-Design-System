"use client";
import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import {
  observeActivity,
  trackIndicator,
  type OrbitNode,
  type DockItem,
  type TerminalLine,
  type TimelineStep,
} from "@ai-design-system/effects";
export interface UiSignalOrbitProps extends ComponentPropsWithoutRef<"section"> {
  nodes: OrbitNode[];
  label: string;
  center?: string;
  selectedId?: string;
  paused?: boolean;
  duration?: number;
  onSelectNode?: (id: string) => void;
}
export function UiSignalOrbit({
  nodes,
  label,
  center = "CORE",
  selectedId,
  paused = false,
  duration = 32,
  onSelectNode,
  className = "",
  ...rest
}: UiSignalOrbitProps) {
  const host = useRef<HTMLElement>(null),
    [active, setActive] = useState(false),
    [localPaused, setPaused] = useState(false);
  useEffect(() => observeActivity(host.current!, setActive), []);
  return (
    <section
      {...rest}
      ref={host}
      className={"ui-signal-orbit " + className}
      aria-label={label}
      data-paused={paused || localPaused || !active}
      style={
        { "--orbit-duration": Math.max(10, duration) + "s" } as CSSProperties
      }
    >
      <div className="ui-orbit-art" aria-hidden="true">
        <div className="ui-orbit-rings" />
        <div className="ui-orbit-center">
          <span>◈</span>
          <strong>{center}</strong>
        </div>
        <div className="ui-orbit-track">
          {nodes.slice(0, 8).map((node, i) => (
            <div
              key={node.id}
              className="ui-orbit-satellite"
              style={{
                left:
                  50 +
                  50 * Math.cos((i * 2 * Math.PI) / Math.min(nodes.length, 8)) +
                  "%",
                top:
                  50 +
                  50 * Math.sin((i * 2 * Math.PI) / Math.min(nodes.length, 8)) +
                  "%",
              }}
            >
              <span data-selected={selectedId === node.id}>
                {node.symbol ?? node.label.slice(0, 2)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="ui-orbit-legend">
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            aria-pressed={selectedId === node.id}
            onClick={() => onSelectNode?.(node.id)}
          >
            <span>{node.symbol ?? "◈"}</span>
            {node.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={localPaused}
          onClick={() => setPaused(!localPaused)}
        >
          {localPaused ? "播放动效" : "暂停动效"}
        </button>
      </div>
    </section>
  );
}
export interface UiCommandDockProps extends ComponentPropsWithoutRef<"nav"> {
  items: DockItem[];
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
}
export function UiCommandDock({
  items,
  label = "快捷导航",
  value,
  onValueChange,
  className = "",
  ...rest
}: UiCommandDockProps) {
  const host = useRef<HTMLElement>(null);
  useEffect(() => trackIndicator(host.current!), []);
  return (
    <nav
      {...rest}
      ref={host}
      className={"ui-command-dock " + className}
      aria-label={label}
      onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
          return;
        const buttons = Array.from(
            host.current!.querySelectorAll<HTMLButtonElement>(
              "button:not(:disabled)",
            ),
          ),
          i = buttons.indexOf(event.target as HTMLButtonElement),
          next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? buttons.length - 1
                : (i + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) %
                  buttons.length;
        event.preventDefault();
        buttons[next]?.focus();
      }}
    >
      <span className="ui-dock-indicator" aria-hidden="true" />
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          aria-current={value === item.id ? "page" : undefined}
          onClick={() => onValueChange(item.id)}
        >
          <span aria-hidden="true">{item.symbol ?? "◇"}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
export interface UiTerminalProps extends ComponentPropsWithoutRef<"section"> {
  lines: TerminalLine[];
  title?: string;
  live?: boolean;
}
export function UiTerminal({
  lines,
  title = "运行记录",
  live = false,
  className = "",
  children,
  ...rest
}: UiTerminalProps) {
  const [copy, setCopy] = useState("复制记录");
  return (
    <section
      {...rest}
      className={"ui-terminal " + className}
      aria-label={title}
    >
      <header>
        <span className="ui-terminal-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <strong>{title}</strong>
        <button
          type="button"
          className="ui-button"
          data-variant="ghost"
          data-size="sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                lines.map((line) => line.text).join("\n"),
              );
              setCopy("已复制");
            } catch {
              setCopy("复制失败，重试");
            }
          }}
        >
          {copy}
        </button>
      </header>
      <div
        className="ui-terminal-output"
        role="log"
        aria-live={live ? "polite" : "off"}
        aria-label={title + "内容"}
        tabIndex={0}
      >
        {lines.map((line, i) => (
          <p key={line.id} data-tone={line.tone ?? "plain"}>
            <span className="ui-terminal-line-number" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="ui-terminal-status">
              {line.tone === "error"
                ? "错误"
                : line.tone === "warning"
                  ? "提示"
                  : line.tone === "success"
                    ? "完成"
                    : "›"}
            </span>
            <code>{line.text}</code>
          </p>
        ))}
        {!lines.length && <p className="ui-terminal-empty">暂无记录</p>}
      </div>
      {children && <footer>{children}</footer>}
    </section>
  );
}
export interface UiTimelineProps extends ComponentPropsWithoutRef<"ol"> {
  steps: TimelineStep[];
  label?: string;
  onAction?: (id: string) => void;
}
const statuses = {
  done: "已完成",
  current: "进行中",
  pending: "待处理",
  error: "需要处理",
};
export function UiTimeline({
  steps,
  label = "处理过程",
  onAction,
  className = "",
  ...rest
}: UiTimelineProps) {
  return (
    <ol {...rest} className={"ui-timeline " + className} aria-label={label}>
      {steps.map((step) => (
        <li
          key={step.id}
          data-status={step.status}
          aria-current={step.status === "current" ? "step" : undefined}
        >
          <span className="ui-timeline-marker" aria-hidden="true">
            {step.status === "done" ? "✓" : step.status === "error" ? "!" : "•"}
          </span>
          <div>
            <div className="ui-timeline-heading">
              <strong>{step.title}</strong>
              {step.time && <time>{step.time}</time>}
            </div>
            <small>{statuses[step.status]}</small>
            {step.description && <p>{step.description}</p>}
            {step.action && (
              <button
                type="button"
                className="ui-timeline-action"
                onClick={() => onAction?.(step.id)}
              >
                {step.action}
              </button>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

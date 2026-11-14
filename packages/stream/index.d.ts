export interface SseEvent {
  event: string;
  data: string;
  id?: string;
  retry?: number;
}
export interface SseOptions extends Omit<RequestInit, "body"> {
  fetcher?: typeof fetch;
  body?: unknown;
  lastEventId?: string;
  maxEventBytes?: number;
}
export function readSse(
  response: Response,
  options?: { signal?: AbortSignal; maxEventBytes?: number },
): AsyncGenerator<SseEvent>;
export function openSse(
  url: string,
  options?: SseOptions,
): AsyncGenerator<SseEvent>;
export type TaskLogLevel = "debug" | "info" | "warning" | "error" | "success";
export type TaskStatus =
  "idle" | "unknown" | "running" | "success" | "failed" | "cancelled";
export type TaskConnection =
  "idle" | "connecting" | "live" | "paused" | "disconnected";
export interface TaskLogEntry {
  id: string;
  time: string;
  level: TaskLogLevel;
  message: string;
}
export interface TaskLogSnapshot {
  runId: string;
  status: TaskStatus;
  connection: TaskConnection;
  entries: TaskLogEntry[];
  cursor: number;
  discarded: number;
  error: string;
  cancelling: boolean;
}
export interface TaskLogSession {
  start(body?: Record<string, unknown>): Promise<void>;
  resume(): Promise<void>;
  pause(): void;
  cancel(): Promise<void>;
  getSnapshot(): TaskLogSnapshot;
  destroy(): void;
}
export function createTaskLogSession(options: {
  fetcher?: typeof fetch;
  url: string;
  onChange: (state: TaskLogSnapshot) => void;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  maxEntries?: number;
}): TaskLogSession;

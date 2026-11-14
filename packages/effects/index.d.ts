export type BackdropKind =
  "rays" | "grid" | "particles" | "particle-field" | "nebula";
export type EffectState = "running" | "paused" | "fallback" | "disposed";
export interface EffectOptions {
  kind?: BackdropKind;
  paused?: boolean;
  intensity?: number;
  speed?: number;
  color?: string;
  /** Five-shape field: ribbon 0, sphere .25, helix .5, rings .75, galaxy 1. */
  progress?: number;
  onState?: (state: EffectState) => void;
}
export interface EffectHandle {
  update(options: Partial<EffectOptions>): void;
  retry(): void;
  destroy(): void;
}
export type CharacterMode = "idle" | "typing" | "password" | "reveal";
export function mountBackdrop(
  host: HTMLElement,
  options?: EffectOptions,
): EffectHandle;
export function mountCharacters(
  host: HTMLElement,
  options?: { mode?: CharacterMode; paused?: boolean },
): {
  update(options: { mode?: CharacterMode; paused?: boolean }): void;
  destroy(): void;
};
export function observeActivity(
  host: HTMLElement,
  callback: (active: boolean) => void,
): () => void;
export function trackIndicator(host: HTMLElement): () => void;
export interface OrbitNode {
  id: string;
  label: string;
  symbol?: string;
}
export interface DockItem {
  id: string;
  label: string;
  symbol?: string;
  disabled?: boolean;
}
export interface TerminalLine {
  id: string;
  text: string;
  tone?: "plain" | "success" | "warning" | "error";
}
export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  time?: string;
  status: "done" | "current" | "pending" | "error";
  action?: string;
}

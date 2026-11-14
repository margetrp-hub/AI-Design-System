"use client";
import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  mountBackdrop,
  mountCharacters,
  observeActivity,
  type EffectHandle,
  type BackdropKind,
  type EffectState,
  type CharacterMode,
} from "@ai-design-system/effects";
export interface UiBackdropProps extends ComponentPropsWithoutRef<"div"> {
  kind?: BackdropKind;
  paused?: boolean;
  intensity?: number;
  speed?: number;
  color?: string;
  onState?: (state: EffectState) => void;
  retryKey?: number;
}
export function UiBackdrop({
  kind = "rays",
  paused = false,
  intensity = 1,
  speed = 1,
  color = "#579eff",
  onState,
  retryKey = 0,
  className = "",
  ...rest
}: UiBackdropProps) {
  const host = useRef<HTMLDivElement>(null),
    effect = useRef<EffectHandle | null>(null),
    callback = useRef(onState);
  callback.current = onState;
  useEffect(() => {
    effect.current = mountBackdrop(host.current!, {
      kind,
      paused,
      intensity,
      speed,
      color,
      onState: (value) => callback.current?.(value),
    });
    return () => {
      effect.current?.destroy();
      effect.current = null;
    };
  }, [retryKey]);
  useEffect(
    () => effect.current?.update({ kind, paused, intensity, speed, color }),
    [kind, paused, intensity, speed, color],
  );
  return (
    <div
      {...rest}
      ref={host}
      className={"ui-backdrop " + className}
      data-kind={kind}
      aria-hidden="true"
    />
  );
}
export interface UiAuthCharactersProps extends ComponentPropsWithoutRef<"div"> {
  mode?: CharacterMode;
  paused?: boolean;
}
export function UiAuthCharacters({
  mode = "idle",
  paused = false,
  className = "",
  ...rest
}: UiAuthCharactersProps) {
  const host = useRef<HTMLDivElement>(null),
    effect = useRef<ReturnType<typeof mountCharacters> | null>(null);
  useEffect(() => {
    effect.current = mountCharacters(host.current!, { mode, paused });
    return () => {
      effect.current?.destroy();
      effect.current = null;
    };
  }, []);
  useEffect(() => effect.current?.update({ mode, paused }), [mode, paused]);
  return (
    <div
      {...rest}
      ref={host}
      className={"ui-auth-characters " + className}
      data-mode={mode}
      aria-hidden="true"
    />
  );
}
export interface UiGlowBorderProps extends ComponentPropsWithoutRef<"div"> {
  paused?: boolean;
  color?: string;
  duration?: number;
}
export function UiGlowBorder({
  paused = false,
  color,
  duration = 6,
  children,
  className = "",
  style,
  ...rest
}: UiGlowBorderProps) {
  const host = useRef<HTMLDivElement>(null),
    [active, setActive] = useState(false);
  useEffect(() => observeActivity(host.current!, setActive), []);
  return (
    <div
      {...rest}
      ref={host}
      className={"ui-glow-border " + className}
      data-paused={paused || !active}
      style={
        {
          "--ui-glow-color": color,
          "--ui-glow-duration": `${Math.max(1, duration)}s`,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
export interface UiAuthLayoutProps extends ComponentPropsWithoutRef<"section"> {
  visual: ReactNode;
  footer?: ReactNode;
  visualSide?: "left" | "right";
  label?: string;
}
export function UiAuthLayout({
  visual,
  footer,
  visualSide = "left",
  label = "双栏入口",
  children,
  className = "",
  ...rest
}: UiAuthLayoutProps) {
  return (
    <section
      {...rest}
      className={"ui-auth-layout " + className}
      data-side={visualSide}
      aria-label={label}
    >
      <div className="ui-auth-layout-grid">
        <div className="ui-auth-visual">{visual}</div>
        <div className="ui-auth-form">
          {children}
          {footer && <footer>{footer}</footer>}
        </div>
      </div>
    </section>
  );
}

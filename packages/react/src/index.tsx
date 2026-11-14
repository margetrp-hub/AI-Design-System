"use client";
import {
  createContext,
  useContext,
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Slot } from "@radix-ui/react-slot";
export {
  UiBackdrop,
  UiAuthCharacters,
  UiGlowBorder,
  UiAuthLayout,
} from "./effects.js";
export type {
  UiBackdropProps,
  UiAuthCharactersProps,
  UiGlowBorderProps,
  UiAuthLayoutProps,
} from "./effects.js";
export type {
  BackdropKind,
  EffectState,
  CharacterMode,
} from "@ai-design-system/effects";
export {
  UiSignalOrbit,
  UiCommandDock,
  UiTerminal,
  UiTimeline,
} from "./showcase.js";
export type {
  UiSignalOrbitProps,
  UiCommandDockProps,
  UiTerminalProps,
  UiTimelineProps,
} from "./showcase.js";
export type {
  OrbitNode,
  DockItem,
  TerminalLine,
  TimelineStep,
} from "@ai-design-system/effects";
export { UiAiComposer, UiAiSuggestion, UiToolActivity } from "./ai.js";
export type {
  UiAiComposerProps,
  UiAiSuggestionProps,
  UiToolActivityProps,
} from "./ai.js";
export { UiTaskLog } from "./task-log.js";
export type { UiTaskLogProps } from "./task-log.js";
export type {
  TaskLogEntry,
  TaskStatus,
  TaskConnection,
  TaskLogSnapshot,
} from "@ai-design-system/stream";
import type { TokenOptions } from "@ai-design-system/tokens";

export interface UiThemeOptions extends TokenOptions {
  scale?: number;
}
const ThemeContext = createContext<UiThemeOptions>({});
const classes = (...values: (string | undefined)[]) =>
  values.filter(Boolean).join(" ");

export function themeAttributes(theme: UiThemeOptions = {}) {
  return {
    "data-ui-skin": theme.skin ?? "pearl",
    "data-ui-mode": theme.mode ?? "light",
    "data-ui-density": theme.density ?? "comfortable",
    "data-ui-palette": theme.palette ?? "default",
    "data-ui-design": theme.design,
    "data-ui-font": theme.font ?? "geist",
    "data-ui-heading-font": theme.headingFont ?? "geist",
    "data-ui-motion": theme.motion ?? "standard",
    "data-ui-material": "solid",
    style: {
      "--ui-font-scale": Math.max(1, Math.min(1.2, theme.scale ?? 1)),
    } as CSSProperties,
  };
}
export function useUiThemeAttributes() {
  return themeAttributes(useContext(ThemeContext));
}
export function UiTheme({
  theme,
  children,
  className,
  style,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  theme: UiThemeOptions;
  children: ReactNode;
}) {
  const attributes = themeAttributes(theme);
  return (
    <ThemeContext.Provider value={theme}>
      <div
        {...props}
        {...attributes}
        className={classes("ui-theme", className)}
        style={{ ...attributes.style, ...style }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export interface UiButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  asChild?: boolean;
}
export const UiButton = forwardRef<HTMLButtonElement, UiButtonProps>(
  function UiButton(
    {
      className,
      variant = "primary",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        {...props}
        ref={ref}
        className={classes("ui-button", className)}
        data-variant={variant}
        data-size={size}
      />
    );
  },
);
export const UiInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(function UiInput({ className, ...props }, ref) {
  return (
    <input {...props} ref={ref} className={classes("ui-input", className)} />
  );
});
export const UiTextarea = forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<"textarea">
>(function UiTextarea({ className, ...props }, ref) {
  return (
    <textarea
      {...props}
      ref={ref}
      className={classes("ui-input ui-textarea", className)}
    />
  );
});
export const UiSurface = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(function UiSurface({ className, ...props }, ref) {
  return (
    <div {...props} ref={ref} className={classes("ui-surface", className)} />
  );
});
export const UiTable = forwardRef<
  HTMLTableElement,
  ComponentPropsWithoutRef<"table">
>(function UiTable({ className, ...props }, ref) {
  return (
    <table {...props} ref={ref} className={classes("ui-table", className)} />
  );
});

import { inject, type ComputedRef, type InjectionKey } from "vue";
export type Skin = "console" | "clinical" | "pearl";
export type Mode = "light" | "dark";
export type Density = "comfortable" | "compact";
export type { Palette } from "@ai-design-system/tokens";
import type { Palette } from "@ai-design-system/tokens";
import type { DesignStyle, FontFamily, Material, Decoration, ButtonFeel, MotionPreset } from "@ai-design-system/tokens";
export type Theme = {
  skin: Skin;
  mode: Mode;
  density: Density;
  scale: number;
  palette?: Palette;
  design?: DesignStyle;
  font?: FontFamily;
  headingFont?: FontFamily;
  material?: Material;
  decoration?: Decoration;
  buttonFeel?: ButtonFeel;
  motion?: MotionPreset;
  transparency?: number;
  glassVariant?: 'clear' | 'regular';
};
export const themeKey: InjectionKey<ComputedRef<Theme>> =
  Symbol("wiki-ui-theme");
export function useUiTheme() {
  return inject(themeKey, undefined);
}
export function themeAttrs(theme?: Theme) {
  return {
    "data-ui-skin": theme?.skin ?? "console",
    "data-ui-mode": theme?.mode ?? "light",
    "data-ui-density": theme?.density ?? "comfortable",
    "data-ui-palette": theme?.palette ?? "default",
    "data-ui-design": theme?.design,
    "data-ui-font": theme?.font,
    "data-ui-heading-font": theme?.headingFont,
    "data-ui-material": theme?.material ?? "solid",
    "data-ui-glass": theme?.glassVariant ?? "regular",
    "data-ui-decoration": theme?.decoration ?? "none",
    "data-ui-button-feel": theme?.buttonFeel ?? "standard",
    "data-ui-motion": theme?.motion,
    style: { "--ui-font-scale": Math.max(1, Math.min(1.2, theme?.scale ?? 1)), "--ui-glass-tint": `${100-Math.max(0,Math.min(100,theme?.transparency??72))}%` },
  };
}

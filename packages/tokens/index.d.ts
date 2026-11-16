export type Palette =
  | "default"
  | "cobalt"
  | "iris"
  | "dream-pink"
  | "powder-blue"
  | "yellow-violet"
  | "jade"
  | "black-gold"
  | "neutral-black";
export type CategoryColor =
  "blue" | "violet" | "teal" | "amber" | "rose" | "lime";
export type ColorRecipe = "workbench" | "soft" | "garden";
export const colorRecipes: Readonly<
  Record<
    ColorRecipe,
    { readonly label: string; readonly colors: readonly CategoryColor[] }
  >
>;
export type DesignStyle =
  | "base"
  | "brutalist"
  | "industrial"
  | "glass"
  | "editorial"
  | "soft"
  | "kinetic"
  | "geist"
  | "carbon"
  | "spectrum"
  | "atelier"
  | "astryx"
  | "material";
export type FontFamily =
  | "system"
  | "geist"
  | "noto-sans"
  | "noto-serif"
  | "plex-mono"
  | "manrope"
  | "space-grotesk"
  | "fraunces"
  | "wenkai";
export type Material = "solid" | "frosted" | "glass" | "liquid";
export type Decoration = "none" | "gradient" | "fluted" | "grid";
export type ButtonFeel = "standard" | "tactile" | "flat";
export type MotionPreset = "standard" | "crisp" | "soft" | "none";
export interface TokenOptions {
  skin?: "console" | "clinical" | "pearl";
  mode?: "light" | "dark";
  density?: "comfortable" | "compact";
  palette?: Palette;
  design?: DesignStyle;
  font?: FontFamily;
  headingFont?: FontFamily;
  motion?: MotionPreset;
}
export function resolveTokens(options?: TokenOptions): Record<string, string>;
export function getNativeTokens(
  options?: TokenOptions & { scale?: number; reducedMotion?: boolean },
): {
  colors: Record<string, string>;
  radii: { control: number; panel: number };
  spacing: number[];
  typography: { body: number; caption: number; title: number };
  sizes: { controlMinHeight: number; rowMinHeight: number; inset: number };
  motionMs: { fast: number; normal: number; enter: number };
};

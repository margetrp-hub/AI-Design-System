<script setup lang="ts">
import { computed, provide } from "vue";
import type { DesignStyle, FontFamily, Material, Decoration, ButtonFeel, MotionPreset } from "@ai-design-system/tokens";
import {
  themeKey,
  themeAttrs,
  type Skin,
  type Mode,
  type Density,
  type Palette,
} from "./theme";
const props = withDefaults(
  defineProps<{
    skin?: Skin;
    mode?: Mode;
    density?: Density;
    scale?: number;
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
  }>(),
  {
    skin: "console",
    mode: "light",
    density: "comfortable",
    scale: 1,
    palette: "default",
  },
);
const theme = computed(() => ({
  skin: props.skin,
  mode: props.mode,
  density: props.density,
  scale: props.scale,
  palette: props.palette,
  design: props.design,
  font: props.font,
  headingFont: props.headingFont,
  material: props.material,
  decoration: props.decoration,
  buttonFeel: props.buttonFeel,
  motion: props.motion,
  transparency: props.transparency,
  glassVariant: props.glassVariant,
}));
provide(themeKey, theme);
</script>
<template>
  <div class="ui-theme" v-bind="themeAttrs(theme)"><slot /></div>
</template>

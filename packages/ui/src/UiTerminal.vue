<script setup lang="ts">
import { computed } from "vue";
import type { TerminalLine } from "@ai-design-system/effects";
import UiCopyButton from "./UiCopyButton.vue";
const props = withDefaults(
  defineProps<{ lines: TerminalLine[]; title?: string; live?: boolean }>(),
  { title: "运行记录", live: false },
);
const text = computed(() => props.lines.map((line) => line.text).join("\n"));
</script>
<template>
  <section class="ui-terminal" :aria-label="title">
    <header>
      <span class="ui-terminal-lights" aria-hidden="true"><i /><i /><i /></span
      ><strong>{{ title }}</strong
      ><UiCopyButton :text="text" label="复制记录" />
    </header>
    <div
      class="ui-terminal-output"
      role="log"
      :aria-live="live ? 'polite' : 'off'"
      :aria-label="title + '内容'"
      tabindex="0"
    >
      <p
        v-for="(line, i) in lines"
        :key="line.id"
        :data-tone="line.tone ?? 'plain'"
      >
        <span class="ui-terminal-line-number" aria-hidden="true">{{
          String(i + 1).padStart(2, "0")
        }}</span
        ><span class="ui-terminal-status">{{
          line.tone === "error"
            ? "错误"
            : line.tone === "warning"
              ? "提示"
              : line.tone === "success"
                ? "完成"
                : "›"
        }}</span
        ><code>{{ line.text }}</code>
      </p>
      <p v-if="!lines.length" class="ui-terminal-empty">暂无记录</p>
    </div>
    <footer v-if="$slots.footer"><slot name="footer" /></footer>
  </section>
</template>

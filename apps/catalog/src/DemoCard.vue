<script setup lang="ts">
import { ref } from "vue";
import { UiButton, UiCopyButton } from "@ai-design-system/ui";
defineProps<{ title: string; names: string; code: string }>();
const source = ref(false);
</script>
<template>
  <article class="demo-card">
    <header class="demo-card-heading">
      <div>
        <h2>{{ title }}</h2>
        <p>{{ names }}</p>
      </div>
      <UiButton
        size="sm"
        variant="ghost"
        :aria-label="(source ? '查看预览：' : '查看代码：') + title"
        :aria-pressed="source"
        @click="source = !source"
        >{{ source ? "预览" : "代码" }}</UiButton
      >
    </header>
    <div v-if="source" class="demo-source">
      <pre class="code-block"><code>{{code}}</code></pre>
      <UiCopyButton :text="code" label="复制代码" />
    </div>
    <div v-else class="demo-card-body"><slot /></div>
  </article>
</template>

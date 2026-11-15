<script setup lang="ts">
import {
  UiDesignCase,
  designCases,
  type DesignCaseId,
} from "@ai-design-system/ui";
const requested = new URLSearchParams(location.search).get("case");
const selected = designCases.find((item) => item.id === requested);
if (selected) document.title = selected.name + " · AI Design System";
</script>
<template>
  <UiDesignCase v-if="selected" :case-id="selected.id as DesignCaseId" />
  <div v-else class="case-route-missing">
    <h1>没有找到这个案例</h1>
    <a href="./#cases">返回案例库</a>
  </div>
</template>
<style>
body {
  margin: 0;
}
.case-route-missing {
  padding: 40px;
  font-family: system-ui;
}
.ui-design-case {
  min-height: 100dvh;
}
</style>

<script setup lang="ts">
withDefaults(
  defineProps<{
    before: string;
    after: string;
    title?: string;
    busy?: boolean;
    error?: string;
  }>(),
  { title: "修改建议", busy: false },
);
const emit = defineEmits<{ apply: []; dismiss: []; retry: [] }>();
</script>
<template>
  <section class="ui-ai-suggestion" :aria-label="title">
    <header>
      <span class="ui-ai-mark" aria-hidden="true">✳</span
      ><strong>{{ title }}</strong
      ><slot name="meta" />
    </header>
    <div class="ui-ai-diff">
      <div>
        <small>修改前</small>
        <p>{{ before }}</p>
      </div>
      <div>
        <small>建议内容</small>
        <p>{{ after }}</p>
      </div>
    </div>
    <p v-if="error" class="ui-ai-error" role="alert">{{ error }}</p>
    <footer>
      <span>由你确认修改</span
      ><button type="button" :disabled="busy" @click="emit('dismiss')">
        放弃</button
      ><button
        v-if="error"
        type="button"
        :disabled="busy"
        @click="emit('retry')"
      >
        重试</button
      ><button
        v-else
        type="button"
        :disabled="busy"
        class="ui-ai-primary"
        @click="emit('apply')"
      >
        {{ busy ? "应用中…" : "应用修改" }}
      </button>
    </footer>
  </section>
</template>

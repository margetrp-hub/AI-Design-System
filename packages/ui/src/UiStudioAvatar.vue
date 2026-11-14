<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    color?: "sage" | "coral" | "sky" | "sand";
    state?: "idle" | "working" | "resting";
    size?: number;
  }>(),
  { color: "sage", state: "idle", size: 80 },
);
</script>
<template>
  <span
    class="ui-studio-avatar"
    :data-color="color"
    :data-state="state"
    :style="{ width: size + 'px', height: size + 'px' }"
    role="img"
    :aria-label="name"
  >
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <ellipse
        cx="50"
        cy="86"
        rx="28"
        ry="5"
        fill="currentColor"
        opacity=".1"
      />
      <path
        d="M29 77Q24 57 36 53H64Q76 57 71 77Q50 87 29 77"
        fill="var(--studio-person)"
      />
      <path
        d="M36 77L33 84M64 77L67 84"
        stroke="var(--studio-ink)"
        stroke-width="6"
        stroke-linecap="round"
      />
      <path
        d="M30 62L24 70M70 62L76 57"
        stroke="var(--studio-person)"
        stroke-width="8"
        stroke-linecap="round"
      />
      <path
        d="M25 28Q25 18 36 18H64Q75 18 75 29V47Q75 57 64 57H36Q25 57 25 47Z"
        fill="var(--studio-person)"
      />
      <rect
        x="30"
        y="27"
        width="40"
        height="22"
        rx="9"
        fill="var(--studio-ink)"
      />
      <g class="studio-eyes" fill="#f8ffef">
        <rect x="39" y="33" width="4" height="9" rx="2" />
        <rect x="57" y="33" width="4" height="9" rx="2" />
      </g>
      <path d="M50 18V12" stroke="var(--studio-ink)" stroke-width="3" />
      <circle
        class="studio-signal"
        cx="50"
        cy="10"
        r="4"
        fill="var(--studio-person)"
      />
      <path
        d="M39 64H61M43 69H57"
        stroke="#fff"
        stroke-opacity=".55"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

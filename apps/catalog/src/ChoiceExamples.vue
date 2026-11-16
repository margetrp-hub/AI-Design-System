<script setup lang="ts">
import { computed, ref } from "vue";
import {
  UiNumberInput,
  UiRadioGroup,
  UiMetadataList,
  UiButton,
  UiBadge,
  UiDialog,
} from "@ai-design-system/ui";
const seats = ref<number | undefined>(6),
  plan = ref("team"),
  period = ref("month"),
  preview = ref(false);
const plans = [
  { value: "personal", label: "个人", description: "基础创作 · ¥19 / 人 / 月" },
  { value: "team", label: "团队", description: "共享资源 · ¥39 / 人 / 月" },
  {
    value: "enterprise",
    label: "企业",
    description: "暂未开放",
    disabled: true,
  },
];
const summary = computed(() => [
  {
    id: "plan",
    label: "方案",
    value: plans.find((p) => p.value === plan.value)?.label,
  },
  {
    id: "seats",
    label: "成员席位",
    value: seats.value === undefined ? null : seats.value + " 人",
  },
  {
    id: "period",
    label: "周期",
    value: period.value === "month" ? "按月" : "按年 · 8 折",
  },
  { id: "fee", label: "服务费", value: 0 },
  {
    id: "total",
    label: "预计合计",
    value:
      seats.value === undefined
        ? null
        : new Intl.NumberFormat("zh-CN", {
            style: "currency",
            currency: "CNY",
          }).format(
            seats.value *
              (plan.value === "team" ? 39 : 19) *
              (period.value === "month" ? 1 : 12 * 0.8),
          ),
  },
]);
function reset() {
  seats.value = 6;
  plan.value = "team";
  period.value = "month";
}
</script>
<template>
  <section class="choice-example" aria-label="团队配置演示">
    <div class="choice-example-grid">
      <div class="choice-example-fields">
        <header>
          <h3>配置团队空间</h3>
          <p>选择方案、周期和席位。</p>
        </header>
        <UiRadioGroup
          v-model="plan"
          label="协作方案"
          :options="plans"
          variant="cards"
        />
        <UiRadioGroup
          v-model="period"
          label="计费周期"
          :options="[
            { value: 'month', label: '按月' },
            { value: 'year', label: '按年 · 8 折' },
          ]"
          variant="segment"
        />
        <UiNumberInput
          v-model="seats"
          label="成员席位"
          :min="1"
          :max="50"
          unit="人"
          required
          hint="1–50 人；可直接输入或使用方向键"
          :error="seats === undefined ? '请填写成员席位' : undefined"
        />
      </div>
      <aside class="choice-example-summary" aria-label="当前配置">
        <div class="choice-example-summary-heading">
          <h3>配置摘要</h3>
          <UiBadge>演示估算</UiBadge>
        </div>
        <UiMetadataList :items="summary" label="配置费用" empty-text="待填写" />
        <div class="ui-actions">
          <UiButton
            variant="primary"
            :disabled="seats === undefined"
            @click="preview = true"
            >预览配置</UiButton
          ><UiButton variant="ghost" @click="reset">重置</UiButton>
        </div>
      </aside>
    </div>
    <UiDialog
      v-model:open="preview"
      title="配置预览"
      description="仅演示配置，不会创建订单或扣费。"
    >
      <UiMetadataList :items="summary" label="预览费用" />
      <template #footer
        ><UiButton @click="preview = false">返回调整</UiButton></template
      >
    </UiDialog>
  </section>
</template>
<style scoped>
.choice-example {
  container-type: inline-size;
}
.choice-example-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(220px, 0.8fr);
  gap: 32px;
  align-items: start;
}
.choice-example-fields {
  display: grid;
  gap: 24px;
}
.choice-example h3 {
  margin: 0;
  font-size: 1.25em;
  letter-spacing: -0.03em;
}
.choice-example header p {
  color: var(--ui-muted);
  margin: 6px 0 0;
}
.choice-example-summary {
  min-width: 0;
  background: var(--ui-soft);
  border-radius: var(--ui-panel-radius);
  padding: 24px;
}
.choice-example-summary-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}
.choice-example-summary .ui-actions {
  margin-top: 24px;
}
@container (max-width: 680px) {
  .choice-example-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
}
</style>

<script setup lang="ts">
import { computed, useId } from "vue";
import { PinInputRoot, PinInputInput } from "reka-ui";
const model = defineModel<string[]>({ default: () => [] });
const props = withDefaults(
  defineProps<{
    label: string;
    length?: number;
    disabled?: boolean;
    mask?: boolean;
    name?: string;
    error?: string;
  }>(),
  { length: 6 },
);
const emit = defineEmits<{ complete: [value: string] }>();
const id = useId();
const count = computed(() =>
  Math.max(1, Math.min(12, Math.floor(props.length) || 6)),
);
const digits = computed({
  get: () =>
    model.value.map((value) => (value === "" ? undefined : Number(value))),
  set: (value: (number | undefined)[]) => {
    model.value = value.map((digit) =>
      digit === undefined ? "" : String(digit),
    );
  },
});
</script>
<template>
  <div class="ui-field">
    <label :for="id + '-0'">{{ label }}</label
    ><PinInputRoot
      v-model="digits"
      type="number"
      otp
      :mask="mask"
      :disabled="disabled"
      :name="name"
      class="ui-pin-input"
      @complete="emit('complete', $event.join(''))"
      ><PinInputInput
        v-for="i in count"
        :id="id + '-' + (i - 1)"
        :key="i"
        :index="i - 1"
        class="ui-input ui-pin-digit"
        :aria-label="label + '，第' + i + '位'"
        :aria-invalid="!!error"
        :aria-describedby="error ? id + '-error' : undefined" /></PinInputRoot
    ><small v-if="error" :id="id + '-error'" class="ui-error">{{
      error
    }}</small>
  </div>
</template>

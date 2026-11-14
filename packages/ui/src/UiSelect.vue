<script setup lang="ts">
import { useId } from "vue";
defineOptions({ inheritAttrs: false });
const model = defineModel<string>({ default: "" });
defineProps<{
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}>();
const id = useId();
</script>
<template>
  <div class="ui-field">
    <label :for="id">{{ label }}</label
    ><select v-bind="$attrs" class="ui-input" :id="id" v-model="model">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

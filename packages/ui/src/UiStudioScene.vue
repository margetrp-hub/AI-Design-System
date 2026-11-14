<script setup lang="ts">
import UiStudioAvatar from "./UiStudioAvatar.vue";
export type StudioMember = {
  id: string;
  name: string;
  role: string;
  color?: "sage" | "coral" | "sky" | "sand";
  state?: "idle" | "working" | "resting";
};
withDefaults(
  defineProps<{
    members: StudioMember[];
    selectedId?: string;
    label?: string;
  }>(),
  { label: "栖间创作室" },
);
const emit = defineEmits<{ select: [member: StudioMember] }>();
</script>
<template>
  <section class="ui-studio-scene" :aria-label="label">
    <div class="studio-architecture" aria-hidden="true">
      <div class="studio-window"><i /><i /><i /></div>
      <div class="studio-wall-art"><span /><span /><span /></div>
      <div class="studio-shelf"><i /><i /><b /></div>
      <div class="studio-plant"><i /><i /><i /><b /></div>
      <div class="studio-rug" />
      <div class="studio-sofa" />
      <span class="studio-floor-label">ROOM 01 / CREATIVE COMMONS</span>
    </div>
    <div class="studio-stations">
      <button
        v-for="(member, i) in members"
        :key="member.id"
        type="button"
        class="studio-station"
        :data-color="member.color || 'sage'"
        :aria-pressed="selectedId === member.id"
        :aria-label="`查看${member.name}`"
        @click="emit('select', member)"
      >
        <span class="studio-station-number" aria-hidden="true">{{
          String(i + 1).padStart(2, "0")
        }}</span>
        <span class="studio-desk" aria-hidden="true"
          ><span class="studio-monitor"><i /><i /><i /></span
          ><span class="studio-notebook" /><span class="studio-cup"
        /></span>
        <UiStudioAvatar
          :name="member.name"
          :color="member.color"
          :state="member.state"
          :size="98"
        />
        <span class="studio-person-label"
          ><strong>{{ member.name }}</strong
          ><small>{{ member.role }}</small></span
        >
      </button>
    </div>
    <p v-if="!members.length" class="studio-no-members">
      空间准备好了，等待第一位成员。
    </p>
  </section>
</template>

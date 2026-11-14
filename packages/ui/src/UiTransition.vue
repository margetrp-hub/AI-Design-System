<script setup lang="ts">
import { Transition } from "vue";
const props = withDefaults(
  defineProps<{
    preset?: "fade" | "slide" | "scale" | "page";
    mode?: "default" | "out-in" | "in-out";
    appear?: boolean;
    returnFocus?: HTMLElement | null;
  }>(),
  { preset: "fade", mode: "default" },
);
const emit = defineEmits<{ afterEnter: []; afterLeave: [] }>();
const previous = new WeakMap<
  Element,
  { inert: string | null; hidden: string | null }
>();
function restore(element: Element) {
  const attributes = previous.get(element);
  if (!attributes) return;
  for (const [name, value] of [
    ["inert", attributes.inert],
    ["aria-hidden", attributes.hidden],
  ] as const) {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }
  previous.delete(element);
}
function beforeLeave(element: Element) {
  if (
    element.contains(element.ownerDocument.activeElement) &&
    props.returnFocus?.isConnected
  )
    props.returnFocus.focus();
  previous.set(element, {
    inert: element.getAttribute("inert"),
    hidden: element.getAttribute("aria-hidden"),
  });
  element.setAttribute("inert", "");
  element.setAttribute("aria-hidden", "true");
}
function afterLeave(element: Element) {
  restore(element);
  emit("afterLeave");
}
</script>
<template>
  <Transition
    :name="'ui-motion-' + preset"
    :mode="mode"
    :appear="appear"
    @before-enter="restore"
    @before-leave="beforeLeave"
    @leave-cancelled="restore"
    @after-enter="emit('afterEnter')"
    @after-leave="afterLeave"
    ><slot
  /></Transition>
</template>

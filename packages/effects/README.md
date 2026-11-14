# Shared visual runtime

Same implementation for Vue and React. Browser-only mount functions are invoked after mount; module imports are SSR safe. `destroy()` removes owned canvas/DOM, observers, listeners, frames and GPU resources. Hidden/offscreen/reduced-motion/paused views stop scheduling. WebGL failure uses the CSS fallback; `retry()` reinitializes and context restoration retries automatically. No credential values or business APIs are read.

Extracted from the maintainer's own entry-page visuals, then separated from business logic. Rays share a small shader runtime; grid and deterministic Canvas particles are independently implemented. The four character shapes react to explicit focus modes without reading passwords. Nebula and flow-border use CSS compositions. No ReactBits source is distributed. See repository docs/design-absorption.md for provenance.

Styles live in `@ai-design-system/styles`. Runtime is visual only; controls, labels, authentication and host workflow belong to the consumer.

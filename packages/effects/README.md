# Shared visual runtime

Same implementation for Vue and React. Browser-only mount functions are invoked after mount; module imports are SSR safe. `destroy()` removes owned canvas/DOM, observers, listeners, frames and GPU resources. Hidden/offscreen/reduced-motion/paused views stop scheduling. WebGL failure uses the CSS fallback; `retry()` reinitializes and context restoration retries automatically. No credential values or business APIs are read.

Extracted from the maintainer's own entry-page visuals, then separated from business logic. `grid` preserves the administrator page's four-plane perspective tunnel and travelling scan. `particle-field` uses the old OHLAOO homepage's five coordinate shapes with a dependency-free WebGL point renderer: 16,000 points on wide hosts, 5,000 on hosts initially narrower than 720px. The lighter `particles` option remains a separate 64-dot Canvas effect. The four character shapes react to explicit focus modes without reading passwords. Nebula and flow-border use CSS compositions. No ReactBits source is distributed. See repository docs/design-absorption.md for provenance.

For `particle-field`, set `color: "#ffffff"` for the original monochrome treatment. `progress` maps 0 / .25 / .5 / .75 / 1 to ribbon / sphere / helix / rings / galaxy. Intermediate values morph continuously; new targets retarget the current transition. Paused or reduced-motion updates reach the requested shape directly. Bind progress to the host's selected section or scroll position; this runtime does not install global page-navigation handlers.

Styles live in `@ai-design-system/styles`. Runtime is visual only; controls, labels, authentication and host workflow belong to the consumer.

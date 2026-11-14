# Interaction craft

Give each transition a trigger, meaning, final state and interruption path. Reuse motion tokens. Approximate starting ranges: press 80–140ms, hover 120–180ms, selection 160–220ms, dialog entry 200–260ms and faster exit. These are design starting points, not fixed rules or performance measurements.

Fast repeated input must retarget instead of queue. Use one presence/focus owner for overlays; Reka already owns Vue overlays. Closed content cannot keep focus, intercept input or leave scroll locked. Reduced motion must reach the same usable state without relying on animationend. Dispose timers/listeners/frames, pause decorative renderers when hidden, and preserve user-controlled play/pause.

Cards communicate identity, main facts, status and action. Only genuinely interactive surfaces need hover/pressed treatment. Reserve border width so focus and selection do not shift geometry. Avoid nested interactive elements inside a parent button. Native fields and mature accessibility primitives remain useful foundations for custom visuals.

Keep input boundaries and command affordances visible. Filters retain values; commands perform actions. Group common toolbar actions and move secondary controls deliberately at narrow widths rather than letting them wrap into a sparse accidental row. Keep active filters and recovery controls reachable.

Choose tooltip for short noninteractive help, popover for small contextual work, dialog for focused decisions, and side panel for long detail with list context. Labels, errors, close/submit and discard paths remain visible. Closing a nested menu should not close the entire dialog. Interactive previews need keyboard/touch activation and collision-aware positioning, not hover alone.

Loading distinguishes first load, refresh with prior content, empty result, failure and unknown outcome. Reserve space with a matching skeleton; do not hide loaded content on every refresh. Use measured progress only when a total exists. Clipboard/save success follows actual completion. Do not hold ready data to complete decorative animation.

For text effects, preserve selectable readable text and stable dimensions. Disable nonessential blur and cycling for reduced motion. Avoid perpetual per-character live announcements. Money, errors and logs should remain directly readable. New data should not replay the whole page entrance.

For AI input, protect Chinese composition from accidental Enter submit, retain the draft on failure, and keep explicit send/stop controls. Follow arriving content only while the reader is already near the bottom; scrolling away pins their reading position and reveals a jump-to-latest action.

Separate task state, connection state and scroll-follow state. Pause-follow changes reading; pause-receive closes the subscription; cancel requests a business transition. Real services confirm terminal status. Keep runId/event cursor on unknown outcomes and reconcile before retrying a side effect. A simulated demo may use timers only when clearly labeled as simulated.

Acceptance: exercise the actual action, rapid reversal, failure/retry, long CJK content, narrow layout, keyboard focus and reduced motion. For scenes, test selecting a different identity and returning without leaking or losing drafts. A static screenshot cannot verify focus or animation smoothness; do not claim 60fps without measurement.

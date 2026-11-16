# Interaction craft

Use the [layout/disclosure reference](layout-and-disclosure.md) for settings, menu transitions and responsive review. Tutorial motion and application motion have different jobs: camera zooms, spotlight tours and 3D photo reels may fit a product video, while frequent product actions need short, interruptible feedback. Learn the mechanism without automatically installing the video's tool or adding its scene to the case library.

Give each transition a trigger, meaning, final state and interruption path. Reuse motion tokens. Approximate starting ranges: press 80–140ms, hover 120–180ms, selection 160–220ms, dialog entry 200–260ms and faster exit. These are design starting points, not fixed rules or performance measurements.

Choose the curve by movement: linear fits steady continuous travel; ease-out gives direct response and settles an entrance; ease-in can accelerate a short exit; ease-in-out connects two visible positions. Springs suit optional playful release feedback, not every form or menu. When requesting an effect, name its trigger, moving part, direction, duration and reverse path. `UiMotionSurface` supplies tilt, magnetic and reveal behavior; `UiTextScramble` supplies a bounded text-decode effect. Its final text reserves layout and remains the accessible/copyable source.

A like burst, elastic switch or button morph is an optional accent on the existing control, not a separate business flow. Separate pressed, pending, confirmed and failed states. A hold-to-confirm interaction must cancel on release, pointer cancellation and focus loss, with a keyboard alternative; it does not replace the host's real authorization or consequential-action confirmation. Do not add a new control just to reproduce every tutorial effect.

Fast repeated input must retarget instead of queue. Use one presence/focus owner for overlays; Reka already owns Vue overlays. Closed content cannot keep focus, intercept input or leave scroll locked. Reduced motion must reach the same usable state without relying on animationend. Dispose timers/listeners/frames, pause decorative renderers when hidden, and preserve user-controlled play/pause.

Cards communicate identity, main facts, status and action. Only genuinely interactive surfaces need hover/pressed treatment. Reserve border width so focus and selection do not shift geometry. Avoid nested interactive elements inside a parent button. Native fields and mature accessibility primitives remain useful foundations for custom visuals.

Keep input boundaries and command affordances visible. Filters retain values; commands perform actions. Group common toolbar actions and move secondary controls deliberately at narrow widths rather than letting them wrap into a sparse accidental row. Keep active filters and recovery controls reachable.

For a few comparable values, use `UiRadioGroup` cards or segments; use tabs when switching content panels. A selectable card should have one native choice and a full label target, not nested actions. Use `UiNumberInput` for quantities with explicit range, step and unit; keep cleared input distinct from zero and use locale formatting when needed. The Vue control commits typed values on blur/Enter, clamps and snaps to its step, and disables wheel changes. Keep business validation in the host. `UiMetadataList` preserves zero, marks missing facts and supports status/link slots; do not turn every fact into a separate card. Verify keyboard selection, bounds, empty recovery and the corresponding summary.

Choose tooltip for short noninteractive help, popover for small contextual work, dialog for focused decisions, and side panel for long detail with list context. Labels, errors, close/submit and discard paths remain visible. Closing a nested menu should not close the entire dialog. Interactive previews need keyboard/touch activation and collision-aware positioning, not hover alone.

Loading distinguishes first load, refresh with prior content, empty result, failure and unknown outcome. Reserve space with a matching skeleton; do not hide loaded content on every refresh. Use measured progress only when a total exists. Clipboard/save success follows actual completion. Do not hold ready data to complete decorative animation.

For text effects, preserve selectable readable text and stable dimensions. Disable nonessential blur and cycling for reduced motion. Avoid perpetual per-character live announcements. Money, errors and logs should remain directly readable. New data should not replay the whole page entrance.

For AI input, protect Chinese composition from accidental Enter submit, retain the draft on failure, and keep explicit send/stop controls. Follow arriving content only while the reader is already near the bottom; scrolling away pins their reading position and reveals a jump-to-latest action.

Separate task state, connection state and scroll-follow state. Pause-follow changes reading; pause-receive closes the subscription; cancel requests a business transition. Real services confirm terminal status. Keep runId/event cursor on unknown outcomes and reconcile before retrying a side effect. A simulated demo may use timers only when clearly labeled as simulated.

Acceptance: exercise the actual action, rapid reversal, failure/retry, long CJK content, narrow layout, keyboard focus and reduced motion. For scenes, test selecting a different identity and returning without leaking or losing drafts. A static screenshot cannot verify focus or animation smoothness; do not claim 60fps without measurement.

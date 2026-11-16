# Grouping, disclosure and responsive review

Use when refining settings, menus, page hierarchy or a responsive showcase. These are synthesized craft decisions from the user's video references, not instructions to reproduce the videos as pages.

## Settings are not registration forms

For short independent preferences, keep a setting on one row: a consistent label edge on the left and compact controls on the right. Remove redundant per-control cards. A group title and stronger space between groups establish hierarchy; input boundaries and error text remain visible. `UiSettingsSection` composes existing fields and switches with this alignment.

Registration, checkout, long answers and dependent multi-field edits often benefit from labels above full-width inputs. Short setting rows are not a universal form rule. Long labels, errors and narrow widths may also require stacking. Never squeeze controls or clip help to preserve a two-column appearance.

Saving policy belongs to the host. A switch may save immediately or join a batch draft: communicate which is true. Batch editing needs a visible dirty state, save, discard and an inline failure with retry; failed saves retain all affected drafts, including those in another category. Never mark a pending edit saved merely because the switch animated. The workshop settings demo uses explicit local batch saving.

## Progressive disclosure follows task frequency

Keep the primary decision and action visible. Reveal infrequent dependent options when relevant: reminder frequency can follow the enabled reminder switch. An advanced export panel may hold encoding/delimiters, but format, scope, affected count and the export action usually stay visible. Label the trigger by what it opens, not a vague “more”. If target users change an advanced option frequently, promote it.

Do not hide validation, unsaved state, permission limits or recovery behind an accordion. Collapse and reopen must preserve appropriate values and focus. Test a common task without opening advanced sections, then an uncommon task that requires them.

## Navigation motion explains movement

- A shared selection indicator can move between entries while the text and targets stay still. Rapid clicks retarget from the current position; reduced motion jumps directly to the new entry.
- An inline submenu changes its height and surrounding flow together. Preserve the selected destination when a group closes; allow keyboard access and show the current group. A single-expanded-group policy is a product choice.
- A top navigation panel can retain its container while replacing grouped contents. Keep its relationship to the trigger, keyboard dismissal and collision handling.
- A dock is suitable for a small set of repeated tools, not an unlimited replacement sidebar. Pointer effects must have keyboard/touch equivalents; reserve safe space around magnified items.
- A command palette filters on typing and executes on explicit selection. Chinese IME confirmation must not execute a command.
- Badges reflect actual unread/pending state. Opening a menu is not evidence that the contents were read; clear them after the owning application confirms the relevant action.

## Responsive preview is an actual layout viewport

Use `UiViewportFrame` around a trusted, separately routable example. The iframe changes its CSS-pixel width and height, allowing media/container queries to run. Scaling the outer presentation only makes that real viewport fit the workbench. Merely shrinking a desktop screenshot does not demonstrate mobile behavior.

Preserve the iframe while changing dimensions, and retain inputs, filters and selection. Check 390/768/1366/1440/1920 and intermediate widths near the actual breakpoints, plus long text, zoom and focus visibility. Show real dimensions and presentation scale separately. A 12-column overlay is an alignment aid, not proof that every page should use 12 columns. CSS pixels are not physical display resolution, DPR emulation, native safe areas or an actual mobile-browser test.

For reusable grids, let content importance determine spans and DOM reading order. Reflow sections deliberately at narrow widths; retain access to secondary controls. A visual grid builder may output starting CSS, but the result still needs interaction and content checks.

For dashboards, a dominant module plus smaller supporting facts suits one main decision. Full-width bands suit a summary → trend → detail reading sequence. A main area with a narrow sticky aside suits a long review with persistent context. A full-bleed canvas with floating tools suits spatial manipulation. Choose by the task; tutorial column ratios and gaps are starting examples, not universal constraints. A 3D map or model is useful only when spatial relationships matter, and must not hide exact chart values or controls.

## Text growth is a layout input

Use content width plus padding for short actions, with a minimum touch target rather than a fixed text box. When a group runs out of room, deliberately wrap the action group, stack its actions, or let a full-width button grow in height. Retain label meaning, readable type size and icon separation. Ellipsis is unsuitable when it hides what an action will do; shortening a translation requires preserving the action and object.

Test actual translations, not character-count guesses: Chinese, a longer German phrase and mixed-language names expose different constraints. Check the host's largest type setting, narrow and intermediate container widths, and pending/error labels. Keep `min-width: 0` on shrinking text containers, allow word wrapping where appropriate, and keep icons from shrinking. Avoid globally forcing every button to wrap or every toolbar to stay on one line; make that choice in its owning layout.

## Let the interface explain the task

Use a page heading for orientation and an action label for its result. Remove slogans, repeated category captions and paragraphs that merely narrate visible UI. In an asset library, framework support, installation commands and API examples are useful product content; implementation commentary in an ordinary business workflow usually is not.

Keep visible labels, limitations that affect a choice, error recovery, unsaved state and consequential-action explanations. Tooltips can hold optional short help, but cannot become the only way to understand a control. After editing copy, a first-time user should still be able to identify the next action and its outcome.

## Browsing reusable assets

Keep the gallery, interactive example and reuse instructions connected. Search should match the task, interaction and component names as well as the visual title. Expose the useful operation before the preview; offer an independent page, exact framework-specific code and a concise AI handoff alongside it. A copied prompt is not an implemented integration.

Give each detail a stable URL. Opening from a list should reach the detail heading; returning should retain filters, position and a sensible focus target. A preview must survive switching to its code panel and back. Test refresh, browser back/forward, a missing entry and no matching results. Treat a compact gallery thumbnail as a preview, not a replacement for a real responsive viewport.

## Verify the actual journey

Review one actual task from entry through completion and recovery. Check discoverability, meaningful feedback, consistency, readable text at larger sizes, keyboard/touch access and interruption. Do not convert a video's rounded list of principles into a mandatory score or claim that it establishes formal conformance.

Public source links and inspected-material boundaries are maintained in the repository's `docs/design-absorption.md`. Do not ship downloaded videos, screenshots from authors or proprietary brand assets with the public package.

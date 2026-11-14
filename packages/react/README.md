# React adapter 0.2

18 owned components: UiTheme, UiButton, UiInput, UiTextarea, UiSurface, UiTable, UiBackdrop, UiAuthCharacters, UiAuthLayout, UiGlowBorder, UiSignalOrbit, UiCommandDock, UiTerminal, UiTimeline, UiAiComposer, UiAiSuggestion, UiToolActivity, UiTaskLog. Query current types with `npm run ui -- show --framework react UiTaskLog`; examples import the built package.

Import `@ai-design-system/react/style.css` once. It uses the same @ai-design-system/styles, @ai-design-system/tokens and @ai-design-system/effects as Vue. Optional SSE framing/session helpers come from @ai-design-system/stream. The adapter does not bundle Vue or fonts. Add only the fonts the host uses.

Button/Input/Textarea/Surface/Table forward refs and their native attributes; other components have their own typed props. UiInput/UiTextarea are native inputs: host labels, errors and controlled value/onChange remain host-owned. UiAiComposer uses value/onValueChange; UiTaskLog uses optional onCancel/onResume/onPause/onRetry callbacks, not Vue events/canCancel props. UiBackdrop retries via retryKey. Full API is in registry/manifest.json and dist declarations.

Use UiTheme or themeAttributes on a .ui-theme ancestor. Body portals require the same attributes; examples/react/App.tsx exercises a native host-owned dialog. This package does not implement UiDialog, UiDataTable, Vue's UiLayout, or the liquid-refraction runtime. Next.js SSR/hydration and native environments still require real target verification.

Examples cover settings failure/retry and a browser-simulated task stream. Neither the AI controls nor a terminal-looking view executes a model, business tool or system Shell. The real integration protocol is documented in @ai-design-system/stream.

Sources and notices: repository docs/design-absorption.md and @ai-design-system/styles/THIRD_PARTY_NOTICES.md. Original studio components are currently Vue-only.

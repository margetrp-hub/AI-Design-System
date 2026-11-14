---
name: ai-design-system
description: Build and refine interfaces using AI Design System components, visual languages, page layouts and motion. Use for reusable UI implementation, styling, component absorption, or AI and streaming interface design in Vue or React.
license: MIT
---

# AI Design System

Turn a design direction into working, reusable UI. Use the user's references and product context; a calm workspace and an expressive landing page are both valid. Preserve approved choices instead of restarting discovery.

## Find the real implementation

Locate the AI-Design-System checkout in the current workspace or a path supplied by the user. An installed skill does not imply the component packages are installed. If the checkout is absent, inspect installed package declarations and the consuming project's design owner; state what cannot be queried. Never invent component APIs.

From the checkout:

```sh
npm run ui -- doctor
npm run ui -- find --framework vue 日志
npm run ui -- show --framework react UiTaskLog
```

`registry/manifest.json` is generated from source and declarations; `registry/tasks.json` maps common tasks to existing components. Use the actual framework. Exit 3 means no implementation, not permission to assume the other framework's API. Exit 4 means stale/missing metadata: run `npm run build:registry`, review, then query again.

## Choose the design, then implement

1. Identify the main action, audience, page type and framework from the conversation and existing code. Ask only for a choice that materially changes the result and cannot be inferred.
2. Select a page skeleton and complete visual language. Choose palette, typography, material, density and motion independently afterwards. Use [visual-language.md](references/visual-language.md) for this step.
3. Query components and compose them through the consumer's existing entry points. Use [integration.md](references/integration.md) for package and framework boundaries.
4. Make the actual interaction work, including the relevant empty, pending, error and recovery states. Use [interaction.md](references/interaction.md) for motion, focus, AI, streaming and detailed craft.
5. Inspect the runnable page with realistic content, narrow widths, keyboard and reduced motion. Test the changed flow and its reversal/failure. Record what was verified and what remains platform-specific.

## Absorb, do not trace

Extract a useful mechanism from references: hierarchy, grouping, material construction, selection feedback, reading position or composition. Create your own geometry and implementation. Liking an illustration does not authorize copying its paths, characters, furniture or source. Directly adapted permissive code must retain its actual license and notice; public visibility alone is insufficient.

Add reusable work to the correct package, with a real example and registry keywords. Choose a variant or composition when it reuses existing behavior. Avoid a second base Button/Dialog/Table implementation merely to create a different visual language. A reference directory, screenshot, placeholder export or unsupported framework package is not a finished component.

## Deliver the right boundary

Use the existing product framework and business owner. Visual changes do not authorize production migration, publishing, external messages or backend actions. User-authorized implementation and publication should continue without repeated approval requests.

The online workshop's AI and SSE examples are explicitly simulated in the browser. Keep that label in demonstrations. Real integrations derive completion/cancellation from the actual service, never a timer. This skill and its references are portable and contain no author's machine paths or credentials.

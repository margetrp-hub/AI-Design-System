# Contributing

Start from a real interface need. Query the framework-specific registry before adding a component. Prefer a variation or composition when behavior already exists.

- Implement in packages/ui or packages/react; share CSS in styles and values in tokens.
- Add a runnable example with keyboard, responsive, reduced-motion and meaningful failure/recovery behavior.
- Add purpose/keywords to registry/usage.mjs, then run npm run build:registry. Types are extracted, not hand-maintained.
- Run npm run check and affected browser tests. For package changes, run npm run check:packages.
- Preserve adapted-code source/license notices. New original visuals require their own construction.
- Keep credentials, internal paths, production data and generated dependencies out of commits.

Demo data is fictional. Simulations must be labeled and must not call paid services or execute commands.

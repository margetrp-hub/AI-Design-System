# Provenance

The components and scoped CSS in this package are a new local implementation. No upstream product components, paid templates, workstation illustrations, or third-party theme files are vendored here.

Vue and Reka UI are peer dependencies. Their installed packages retain their own MIT license notices. Design decisions and source attribution are maintained in DESIGN.md and docs/design-absorption.md.

The shadcn source ownership and semantic-token approach informed the API conventions. This package does not bundle shadcn registry source. Future copied/adapted code must retain its actual upstream license and revision here.

Original code is distributed under the repository's MIT license. The shared styles package retains the Magic UI notice for its adapted orbit composition. Original studio characters and furniture contain no workstation-teacher code or artwork.

## 0.3 fonts and reference mechanisms

Optional `fonts.css` imports fixed Fontsource packages: Geist Variable 5.3.0, Noto Sans SC Variable 5.3.1, Noto Serif SC Variable 5.3.1, IBM Plex Mono 5.3.0, Manrope Variable 5.3.0, Space Grotesk Variable 5.3.0, Fraunces Variable 5.3.0, LXGW WenKai 5.3.0. Each package retains its own SIL Open Font License 1.1 and copyright notice. Font binaries are dependency assets, not copied into this repository. Consumers must retain those notices when distributing bundled font files.

LeiBox tactile/gradient/fluted descriptions, NeoBrutalism, Carbon, Apple Materials, rdev/liquid-glass-react, Aceternity and Magic UI inform the mechanisms documented in DESIGN.md. No source from these effects or paid templates was copied. UiLens computes its own rounded rectangle normal displacement map; it is a Web approximation with browser-dependent support, not Apple's native implementation. This statement does not grant any license to upstream branded assets or restricted community submissions.

## 0.3 additional layout references

The layout relationships were reviewed in MIT-licensed Shadcn Admin (`e16c87f213a5ba5e45964e9b67c792105ec74d26`), Tailark Blocks (`8139698115c1341bfd2e3e286c04bb4d8146f472`), and assistant-ui (`7854908de003619397e9e30c578eb926246d2068`). The settings, split, focused and conversation CSS and Vue examples are independent implementations; no upstream React source, brand assets or application backend is included. Exact reference files and scope are recorded in DESIGN.md. Square UI's restricted standalone-library license was reviewed and its templates were not incorporated.

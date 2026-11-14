# Integration and ownership

Locate the checkout or installed package first. Package names are @ai-design-system/ui (Vue), /react, /tokens, /styles, /effects and /stream. Current distribution is locally built or release tgz files, not a promised npm-registry publication.

Build with npm run build:registry. For Vue run npm run pack:ui, for React pack:react; install tokens/styles/effects/stream and the selected framework tarballs together. Import that framework's style.css once. Fonts are an optional import or selected Fontsource dependencies.

Use the source-generated registry before writing props. Vue and React are not API-identical: Vue input labels and v-model do not transfer to React native inputs; React UiAiComposer uses value/onValueChange and UiTaskLog uses callbacks. React currently lacks UiDialog, UiDataTable, UiLayout, liquid-refraction runtime and studio components. Use an existing host primitive or implement an authorized adapter instead of inventing support.

Theme attributes must reach teleported/body-portalled content. Page canvas remains the consumer's responsibility. Preserve an existing application's wrapper entry points and adapt internally; do not introduce another competing global reset, token owner or modal lifecycle.

Next.js requires client/server and hydration testing. Electron uses the actual renderer framework; IPC, native menus and filesystem access are outside this package. Uni-app and React Native can map token values, but require native controls, layout, events, accessibility, safe areas and keyboard handling. DOM components are not native support.

Use examples/vue and examples/react as real package consumers. npm run check:packages installs tarballs in isolation and compares their files before building. Normal checks are npm run check and affected browser tests. New components need source exports, purpose/keywords, runnable examples and a rebuilt registry.

For real SSE, readSse/openSse parse bytes and expose event IDs; EOF alone is not success. The optional task session follows the protocol in packages/stream/README.md. Demo fetcher injection is separate from production fetch and never needs to be copied into business code.

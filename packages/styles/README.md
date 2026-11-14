# Shared web CSS

The single component-style owner for the Vue and React adapters. Token values remain in `@ai-design-system/tokens`; this package owns control/surface/layout CSS without importing a framework or fonts. Vue's former CSS entry points forward here for compatibility. React primitives use the same classes and attributes.

Portals must inherit a `.ui-theme` scope and its data attributes. Browser focus and overlays remain owned by the host's mature primitives. Import this stylesheet once, optionally in the host's component cascade layer so explicit business layout utilities remain effective. Native platforms do not consume web CSS.

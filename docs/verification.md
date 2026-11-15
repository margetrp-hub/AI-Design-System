# Release verification · 0.5.0

Verified locally on 2026-11-15. Tutorial videos supply interaction and layout lessons; they are not gallery entries. The separate case library contains 16 original page compositions informed by the pinned awesome-design-md revision.

| Check | Result |
| --- | --- |
| Current source and registry | `npm run build:registry`, `npm run check` passed after the final viewport input and gallery layout changes; 67 Vue and 18 React exports |
| Node checks | 20 passed locally, including seven private historical catalog checks; the public suite contains 13 |
| Existing browser regression | 33 passed initially; the form-save flow exposed a field-label collision introduced by the settings example. The example label was made specific and the affected regression passed on rerun |
| Settings interaction | Failure retains input, switching category retains drafts, retry saves, discard restores the saved values, and dependent reminder controls disclose when enabled |
| Cases | All 16 inspected at narrow widths; a mobile canvas object overflow was repaired. Build failure/retry, task move/undo, AI stop with retained input, and separate channel drafts exercised directly |
| Responsive frame | 1440 → 390 and custom 823 CSS-pixel iframe widths retain destination search and favorites; orientation swaps dimensions without resetting the example. The frame's body measured 823px with no horizontal overflow at that width |
| Six packages | Independently installed and compared file by file with the final tarballs; Vue/React consumer typechecks and builds passed. The installed Vue package's settings binding, readable text effect and case failure/retry were exercised in the browser with no console errors |
| Portable skill | Structure validator passed; layout/disclosure guidance is linked from the skill; tutorial lessons and complete cases have separate owners |

The responsive frame changes a real iframe layout viewport; presentation scaling is reported separately. It does not emulate device pixel ratio, native browser chrome or mobile hardware. All case content and asynchronous actions are local simulations. New cases, settings and motion components are Vue implementations; the React package shares updated styles, not those new Vue APIs. Package installation and publication evidence is recorded with the release.

## 0.4.1 baseline

Verified locally on 2026-11-14, Windows / Edge Chromium. This records the tested boundary, not a promise of compatibility with every host.

| Check | Result |
| --- | --- |
| TypeScript, Vue declarations, Vue/React/example production builds | Passed `npm run check` |
| Public Node tests | 13 passed: SSE framing/replay/cancel, files, tables, token mappings and contrast. The local run also included seven private historical catalog tests, excluded from this release. |
| Browser regression | 34 passed: forms and retry, clipboard failure, keyboard menus, draft protection, focus return, table selection, narrow screens, visual language geometry, real font loading, glass transparency/fallback, interruption and reduced motion |
| AI and task logs | Simulated stream interruption/resume, cancel/restart, retained drafts, suggestion recovery, distinct follow/connection/task states verified in Vue and React |
| Original studio | Workstation selection retains each member's note; 390px viewport has no page overflow |
| Six tarballs | Independently installed; every installed file matches packed source; Vue/React consumer typecheck and production build passed |
| AI registry | 62 Vue and 18 React components; `ui doctor` ready; export/declaration/source fingerprint validation passed |
| Portable skill | Skill structure validator passed; references contain no machine-specific paths |
| Pages build | Built with `BASE_PATH=/AI-Design-System/`; deployment status is visible in GitHub Actions |

README images were captured from the runnable workshop. The Pages workflow repeats the public source checks on Linux / Node 24 before deployment.

## 0.4.1 asset correction

The administrator reference is a centered dark form over a four-plane scanning tunnel. It is now separate from the split character login. The OHLAOO homepage uses its original ribbon/sphere/helix/rings/galaxy coordinates; `particle-field` is distinct from the 64-dot `particles` background. Console-form recipe CSS is distributed in the shared styles package.

On 2026-11-14, local type/Node/build/registry checks passed, followed by five affected browser regressions. Direct browser checks exercised all five shapes, rapid retargeting, pause and reduced-motion shape selection, WebGL loss/restoration, 16,000/5,000 initial point counts, retained form input when switching examples, and 390px layouts without page overflow. README screenshots show the running components. The final six tarballs were independently installed, compared file by file, and built as Vue/React consumers. Both installed consumers then passed layout/background switching, shape progress, retained draft, reduced-motion and narrow-screen browser checks. The existing Vite consumer needed a force restart to discard its old dependency prebundle after package replacement.

The 34-test total above describes the 0.4.0 baseline; 0.4.1 reran the five affected regressions and the new effect/consumer interactions, not that entire baseline suite. Motion screenshots are not frame-rate benchmarks. Production login and original business sites were not changed.

## Reproduce

```sh
npm ci
npm run build:registry
npm run check
npm run test:browser
npm run check:packages
```

Browser checks use installed Edge on Windows, or Playwright Chromium elsewhere. Install Chromium with `npx playwright install chromium` if needed, or set `UI_BROWSER_EXECUTABLE` to a compatible browser. Package checks install tarballs into the ignored `.consumer-check` directory; they do not use workspace source aliases.

## Limits

AI answers and task logs on the site are browser simulations: no model, backend job or shell command runs. The separate stream client is tested with a local network fixture. Production authentication, business cancellation and persistence remain the consumer's responsibility.

Next.js SSR/hydration, Electron hosts, native Uni-app and React Native controls have not been run. Native support currently means token mappings. Safari/Firefox liquid refraction is not established by Chromium testing; fallback behavior and high-transparency contrast require target-page review. See [platforms.md](platforms.md).

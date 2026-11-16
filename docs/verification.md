# Verification

## Navigation update · 2026-11-17

The workshop now uses overview/page-case entries, four collapsible asset categories and a separate installation footer. Desktop and mobile use the same component and route map; existing hash links remain valid. Packages, versions and release assets are unchanged.

- `npm run check` passed, including typecheck, 20 local Node checks, production/example builds and registry validation. Source fingerprints were rechecked after browser review.
- Seven affected catalog journeys passed, including keyboard collapse/current-group indication, history reopening, a 600px-high desktop, mobile drawer dismissal/focus return, enlarged type, reduced motion, color examples and retained case state. The narrow-screen test's selector needed correction to find links inside a collapsed group; its rerun passed.
- Eight additional component/motion journeys passed. Their navigation helper now waits for the rendered menu before deciding whether to expand a category, avoiding an initial-load race that could close the default group.
- Actual desktop and 390px mobile navigation were visually inspected. Selecting a mobile destination closes the drawer, and reopening expands its current category. No console errors were reported. The README case screenshot was refreshed from the running workshop.

Browser evidence is Chromium/Edge only. These navigation checks do not expand the platform or package-consumption guarantees below.

## Release · 0.6.0 · 2026-11-17

Added the original Astryx-inspired visual language, Vue number input and metadata list, and card/segmented variants of the existing radio group. Shared CSS/tokens also serve the existing React controls. Totals: 69 Vue / 18 React exports and 13 visual languages.

| Check | Result |
| --- | --- |
| Source | Registry generation, typecheck, 20 local Node checks (13 public), Vue/React and example production builds passed |
| Browser regression | 40 of 41 passed in the full run. The remaining test pinned the previous React tarball version; it now checks the current package version. All seven affected catalog/choice journeys passed on rerun |
| Controls | Quantity boundaries, clamped input, empty/error recovery, disabled/readonly, German decimal format, wheel stability, native required validity, radio keyboard selection, disabled choices, summary/preview agreement, Escape and focus return |
| Composition | Palette remains independent; nested local language overrides retain their geometry. Dark mode, 120% text, reduced motion, 320/390/768/1280px layouts and dialog bounds checked; missing metadata differs from zero |
| Visual review | Actual light controls and a 390px dark enlarged-type page inspected; summary stacks in narrow containers. Screenshot in the README comes from the running workshop |
| Distribution | Six tarballs independently installed and compared file by file, with Vue/React typecheck and production builds. The Vue consumer imports both new controls and card choices; the React consumer uses the shared Astryx language |
| Skill | Existing visual-language and interaction references updated; structure validator passed |

The new numeric/choice/metadata interfaces are Vue-only. They do not install Astryx, StyleX or its assets. Browser checks use Chromium/Edge; they do not establish Safari/Firefox or native/Next.js/Electron runtime support. Configuration prices are labeled demo estimates, with no payment or order creation.

## Catalog and Skill update · 2026-11-17

This update changes the workshop, reuse guidance and portable Skill. The six published component packages retain their 0.5.0-release versions and APIs; the latest Skill is in `skills/ai-design-system` on main, while the v0.5.0 release ZIP remains that release's snapshot.

| Check | Result |
| --- | --- |
| Source and production build | `npm run build:registry` and `npm run check` passed: typecheck, 20 local Node tests (13 public and seven private historical checks), Vue/React/example builds and registry fingerprints. `ui doctor` reports ready with 67 Vue / 18 React exports |
| Browser regression | 38 scenarios covered: 36 passed in the full run. Two old selectors assumed visible desktop navigation and a single portal; updated them for the mobile drawer and the named dialog, then both passed on targeted rerun |
| Case journey | Search by interaction/component, category filtering, direct detail URL, refresh and browser history; returning retains list position, filters and focus. No-results and missing-entry views have working recovery |
| Preview and reuse | Switching preview/code preserves iframe drafts and selected viewport. Clipboard rejection exposes retry; successful retry copies the actual Vue case code |
| Mobile and text growth | Drawer selection, Escape and focus return; installation page checked at 320/390/768/801/1280px without page overflow. Long German actions at 120% type retain full labels and click behavior at 390/768/1280px |
| Visual review | Actual 390px grouped navigation, dark React installation guide and enlarged long-label buttons inspected. README case image recaptured from the running workshop |
| Portable Skill | Structure validator and relative-link checks passed. Layout rules now cover translations, concise functional copy and asset browsing; integration guidance requires actual framework/API/dependency inspection |

The workshop's case compositions remain Vue-only, and case actions remain browser simulations. Package consumption evidence below is from the unchanged 0.5.0 packages; this catalog update does not claim new native, Next.js or Electron host validation.

## Release · 0.5.0

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

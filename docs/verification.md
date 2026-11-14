# Release verification · 0.4.1

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

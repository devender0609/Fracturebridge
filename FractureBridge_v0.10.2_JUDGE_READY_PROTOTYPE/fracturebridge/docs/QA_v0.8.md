# QA report — FractureBridge v0.8

Automated with a headless browser against the production build (`npm run build`, then `vite preview`).
This is a prototype QA pass, not validation.

## Build
`npm ci` and `npm run build` both succeed from a clean checkout.

```
dist/index.html                     0.94 kB
dist/assets/index-*.css            ~23 kB   (gzip ~4.9 kB)
dist/assets/index-*.js            ~227 kB   (gzip ~67 kB)
dist/assets/Measures-*.js         ~394 kB   (gzip ~109 kB, lazy-loaded)
```

## Pages tested
- Overview
- Worklist (all five filters)
- Case detail (Margaret FB-04417, plus paging across all 12 cases)
- Analytics (all four categories, charts rendered and measured in the DOM)
- Safety & design

## Interactions tested
- Overview → Open case → case detail
- Confirm actionable & assign owner → owned
- Review and approve the draft → Approve for outreach → contacted, with the simulated-outreach notice shown
- Record evaluation initiated → arranged
- Disposition menu → Clinically reviewed closure → Patient declined evaluation → Reviewed & closed, audit event written
- Full audit trail disclosure open/close
- Full report disclosure, sources disclosure, letter disclosure
- Demo perspective switch (all three), including read-only enforcement
- Guided demo: 7 steps, forward and back

## Responsive widths tested
1920×1080, 1366×768, 390×844. No horizontal overflow at any width (measured as
`scrollWidth − clientWidth ≤ 2px` on Overview and Worklist).

## Console
No errors and no warnings, including no missing-key warnings. The favicon 404 present in v0.7 is fixed.

## Accessibility spot-checks
- Visible focus ring on keyboard tab (2px solid outline, set in `index.css`).
- Disclosure buttons carry `aria-expanded`.
- Paging buttons carry `aria-label`.
- Disabled controls: verified 5 disabled controls plus an explanatory banner in the quality-leader perspective;
  "Approve for outreach" is disabled until an owner is assigned; "Record closure" under *Other* is disabled until a
  reason is typed.

Not tested: screen-reader announcement order, colour-contrast audit across all states, touch-target sizing.

## Which values remain simulated
- Overview funnel: 12,480 reports → 412 with fracture language → 268 unique patients; 171 stand down, 97 routed
  (171 + 97 = 268). Labelled on the card.
- Analytics category 1: reports screened, patients with fracture language, the 74 / 12 / 7 / 4 disposition split
  (= 97), and the screening-exclusion reason breakdown (= 12). Each chart labelled.
- Analytics category 2: the weekly routed-versus-closed trend. Labelled.
- Analytics category 3: the care-process cascade from 74 actionable cases. Labelled.
- All 12 patient cases, reports, follow-up checks, audit trails, and team names.

## Shown as unmeasured rather than invented
Human-confirmation rate, screening-exclusion rate, cases per week, median time to review, time to owner assignment,
reviewer effort per case (**To measure**); secondary fracture, admissions, treatment persistence, patient-reported
understanding (**Not yet measured**).

## Known limitations
- No EHR, portal, messaging, or FHIR connectivity exists. Integration language is conceptual.
- The "AI" is simulated: no model runs anywhere in this build.
- Workflow state is in-memory and resets on reload.
- The demo perspective is not an authorization control and provides no security.
- Charts are Recharts defaults; tooltips are mouse-only.
- Not validated, not production ready, not complete.

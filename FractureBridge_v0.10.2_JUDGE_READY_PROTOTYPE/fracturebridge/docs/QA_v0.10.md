# QA report — FractureBridge v0.10

Automated with a headless browser against the production build. Prototype QA, not validation.

## Build (exact output)

```
> fracturebridge@0.10.0 build
> vite build

vite v5.4.21 building for production...
✓ 2306 modules transformed.
dist/index.html                     1.28 kB │ gzip:   0.69 kB
dist/assets/index-DG_Z9ca9.css     24.99 kB │ gzip:   5.22 kB
dist/assets/index-BhRilqhf.js     249.98 kB │ gzip:  71.90 kB
dist/assets/Measures-Bt9XpE61.js  398.96 kB │ gzip: 109.75 kB
✓ built in 10.55s
```

`npm ci` then `npm run build` from a clean checkout.

## Routes tested
Overview, Worklist (five filters), Case detail (13 cases via paging), Analytics (framework and scenario), How it works.

## Responsive
1920×1080, 1366×768, 390×844 — every route in both analytics modes. Horizontal overflow ≤ 2px everywhere.
At 390×844 the *Why this case is here* panel is verified to appear in the DOM before the report content.

## Workflow
Assign an owner → record simulated outreach approval → record patient reached → record evaluation initiated → record
documented outcome → record pathway completed. Final state verified as **Pathway completed**.

## Dispositions
All four families exercised from a fresh review case and verified in the closure record:
not appropriate for this pathway (duplicate case), relevant care already exists (outside-system care confirmed),
reviewed — no further action required (goals of care), unable to reach (after the outreach protocol).
Verified that **Unable to reach is not offered** before an outreach attempt exists, and is offered after one.

## Guided demo
Eight steps forward. Spotlight verified in the DOM (`.demo-spot` present on a targeted step). *Explore the prototype*
verified to land on the worklist.

## Perspectives
Care coordinator, clinician, quality leader. Quality leader verified to open Analytics; its case view is read-only
(3 disabled controls plus the banner — fewer than v0.9 because the disposition menu is now collapsed by default).

## Console
No errors and no warnings on any route, interaction, or viewport.

## Reset behaviour
Workflow state is in memory; reload returns every case to its seeded state. Verified.

## Simulated values
1. Overview funnel: 12,480 → 412 → 268; 171 stand down + 97 routed = 268. Labelled on the card.
2. Analytics scenario mode only: reports screened 12,480; patients 268; dispositions 74 / 12 / 7 / 4 = 97;
   screening-exclusion reasons 5 / 3 / 2 / 1 / 1 = 12; 26 weekly points totalling 97 routed and 71 closed; cascade
   74 → 71 → 55 → 41 → 30 → 26; outreach split 55 reached + 16 incomplete = 71; open-case bottleneck 9 / 4 / 7 / 6 / 5 / 3.
3. All 13 patients, reports, findings, follow-up checks, owners, letters, audit trails.
4. Lookback windows, labelled as configurable pilot windows.

Marked **To measure**: human-confirmation rate, screening-exclusion rate, cases routed per week, median time to human
review, time to owner assignment, reviewer effort per case, and all six reviewer-effort measures. Marked **Not yet
measured**: subsequent fracture, admissions, treatment persistence, patient-reported understanding.

## Known limitations
- No EHR, portal, messaging or FHIR connectivity. No model runs; all "AI" output is fixed text.
- Workflow state resets on reload.
- The View-as selector is a demo perspective, not an authorization control.
- `noindex` discourages indexing; it is not access control.
- The guided-demo spotlight dims with a scrim rather than a true cut-out mask.
- Charts are Recharts defaults; tooltips are mouse-only.
- Case-finding performance, operational burden and care-process completion are entirely unmeasured.
- Not validated, not production ready, not deployed, not EHR integrated, not clinically proven.

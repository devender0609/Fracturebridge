# QA report — FractureBridge v0.10.1

Automated with a headless browser against the production build. Prototype QA, not validation.

## Build (exact output)

```
> fracturebridge@0.10.1 build
> vite build

vite v5.4.21 building for production...
✓ 2306 modules transformed.
dist/index.html                     1.28 kB │ gzip:   0.69 kB
dist/assets/index-DIVdkQQD.css     25.62 kB │ gzip:   5.29 kB
dist/assets/index-Dt-0zyWe.js     253.50 kB │ gzip:  72.49 kB
dist/assets/Measures-xkMDevPR.js  399.37 kB │ gzip: 109.86 kB
✓ built in 11.50s
```

`npm ci` then `npm run build` from a clean checkout.

## Routes tested
Overview, Worklist (five filters), Case detail (13 cases via paging), Analytics (framework and scenario),
How it works.

## Responsive
1920×1080, 1366×768, 390×844 — every route, both analytics modes. Horizontal overflow ≤ 2px everywhere.

## Icon semantics (the change that mattered most this pass)
Verified on Margaret in the DOM: the configured-source list shows a grey dash and "none found" on all five evidence
sources; the only `text-emerald-600` element on the page is the legend's key, not a source row; the result line reads *No relevant bone-health follow-up found in the configured sources.*
Context items (prior fracture history, calcium/vitamin D) appear in a separate **Clinical context for reviewer** block
with an amber info icon, not as follow-up evidence. Legend present: qualifying follow-up found / searched, none found /
context only.

## Case header
Verified that the state appears once: Next workflow step (Human review), Owner (Unassigned), Status chip (Needs
review). "Current need" removed from the why-panel — verified absent from the DOM.

## Workflow tracker
Six stages — Finding → Review → Owner → Outreach → Evaluation → Outcome — with the machine/human boundary rule beneath.
Terminal cases show the stages reached plus an end-cap; `stoppedAt` remapped for all seeded terminal cases.

## Workflow and dispositions
Assign an owner → simulated outreach approval → patient reached → evaluation initiated → documented outcome → pathway
completed, verified end to end. All four disposition families exercised and verified in the closure record. Unable to
reach remains unavailable before an outreach attempt.

## Guided demo and perspectives
Eight steps, spotlight verified in the DOM, ends on Explore the prototype. Quality leader opens Analytics and the case
view is read-only.

## Console
No errors and no warnings on any route, interaction, or viewport.

## Simulated values
1. Overview funnel: 12,480 → 412 → 268; 171 + 97 = 268. Labelled on the card.
2. Analytics scenario mode only: reports screened 12,480; patients 268; dispositions 74 / 12 / 7 / 4 = 97;
   screening-exclusion reasons 5 / 3 / 2 / 1 / 1 = 12; 26 weeks totalling 97 routed and 71 closed; cascade
   74 → 71 → 55 → 41 → 30 → 26; outreach split 55 + 16 = 71; open cases by stage 9 / 4 / 7 / 6 / 5 / 3.
3. All 13 patients, reports, findings, follow-up checks, owners, letters, audit trails.
4. Lookback windows, labelled as configurable pilot windows.

Marked **To measure**: share of routed cases confirmed actionable, screening-exclusion rate, cases routed per week,
time to human review, time to owner assignment, reviewer effort per case, and all six reviewer-effort measures.
Marked **Not yet measured**: subsequent fracture, admissions, treatment persistence, patient-reported understanding.

## Known limitations
- No EHR, portal, messaging or FHIR connectivity. No model runs; all "AI" output is fixed text.
- Workflow state is in memory and resets on reload.
- The View-as selector is a demo perspective, not an authorization control.
- `noindex` discourages indexing; it is not access control.
- The guided-demo spotlight uses a scrim, not a cut-out mask.
- Charts are Recharts defaults; tooltips are mouse-only.
- Case-finding performance, operational burden and care-process completion are entirely unmeasured.
- Not validated, not production ready, not deployed, not EHR integrated, not clinically proven.

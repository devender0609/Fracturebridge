# QA report — FractureBridge v0.9

Automated with a headless browser against the production build. This is a prototype QA pass, not validation.

## Build (exact output)

```
> fracturebridge@0.9.0 build
> vite build

vite v5.4.21 building for production...
transforming...
✓ 2306 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     1.28 kB │ gzip:   0.69 kB
dist/assets/index-BwgwONJI.css     23.71 kB │ gzip:   5.00 kB
dist/assets/index-CgZGwKSy.js     241.91 kB │ gzip:  70.21 kB
dist/assets/Measures-DX8Haxgw.js  396.74 kB │ gzip: 109.29 kB
✓ built in 11.43s
```

`npm ci` and `npm run build` both succeed from a clean checkout.

## Routes tested
Overview, Worklist (all five filters), Case detail (all 13 cases via paging), Analytics (both modes), Safety & design.

## Responsive widths
1920×1080, 1366×768, 390×844 — every route. Horizontal overflow measured as `scrollWidth − clientWidth`; ≤ 2px
everywhere. Mobile navigation verified working (Analytics reached from the mobile tab row at 390px).

## Workflow tested end to end
Review → confirm actionable & assign demo owner → approve draft → record simulated outreach approval (stage becomes
**Outreach attempted**, verified in the DOM) → record patient reached → record evaluation initiated → record documented
outcome → record pathway completed (**Pathway completed**, verified).

## Disposition families
All four exercised, each writing an audit entry with a responsible human, a reason and a timestamp:
screening exclusion, follow-up already addressed, human-reviewed disposition, outreach incomplete.
Verified that the outreach-incomplete family is **not offered** on a case that has had no outreach attempt.

## Terminal bridge states
One fictional patient per state, checked for agreement between worklist chip, bridge end-cap, disposition panel and
audit trail:

| Case | Terminal state |
|---|---|
| Helen Marchetti | Pathway completed |
| Wanda Pryce | Follow-up already addressed |
| Ruth Delgado | Human-reviewed disposition |
| Beatrice Lyman | Outreach incomplete |
| Edward Kalinowski / Yolanda Rios | Screening exclusion |

No terminal case renders Human review as the pending step.

## Other interactions
- Guided demo: 8 steps forward, back, and **Explore the prototype** landing on the worklist.
- Analytics toggle: framework is the default and shows no simulated values (verified "12,480" absent); the illustrative
  scenario shows them (verified present) with a label at every chart.
- Demo-perspective selector: all three; quality-leader read-only verified (5 disabled controls plus banner).
- Refresh: workflow state is in memory and resets on reload — by design, verified.

## Console
No errors and no warnings on any route or interaction.

## Accessibility spot-checks
Visible focus ring on tab; `aria-expanded` on disclosures; `aria-pressed` on the analytics toggle; `aria-label` on
paging controls; "Record simulated outreach approval" disabled until an owner is assigned; "Record closure" under
*Other* disabled until text is entered.
Not tested: screen-reader announcement order, full contrast audit, touch-target sizing.

## Every simulated value remaining
1. Overview funnel: 12,480 reports → 412 with fracture language → 268 unique patients; 171 stand down, 97 routed
   (171 + 97 = 268). Labelled on the card.
2. Analytics category 1 (scenario mode only): reports screened 12,480; patients 268; disposition split 74 actionable /
   12 screening exclusion / 7 follow-up already addressed / 4 human-reviewed disposition (= 97); screening-exclusion
   reasons 5 / 3 / 2 / 1 / 1 (= 12).
3. Analytics category 2 (scenario mode only): 26 weekly points totalling 97 routed and 71 closed.
4. Analytics category 3 (scenario mode only): cascade 74 actionable → 71 outreach attempted → 55 patient reached → 41
   evaluation initiated → 30 evaluation completed → 26 documented outcome; outreach split 55 reached / 16 incomplete
   (= 71).
5. All 13 patients, their reports, findings, follow-up checks, owners, letters and audit trails.
6. Lookback windows (12/24 months, 5 years) — labelled as configurable pilot windows.

Shown as unmeasured rather than invented: human-confirmation rate, screening-exclusion rate, cases routed per week,
median time to human review, time to owner assignment, reviewer effort per case (**To measure**); subsequent fracture,
admissions, treatment persistence, patient-reported understanding (**Not yet measured**). In framework mode, reports
screened and patients with fracture language also read **To measure**.

## Every conceptual EHR / FHIR feature
Nothing below is implemented, connected, or claimed to be supported by any organisation or vendor:
- Conceptual flow: report → case-finding service → evidence check → potential gap → human-reviewed worklist → named
  owner → human-approved next step → documented workflow status.
- DiagnosticReport and DocumentReference (radiology report); ServiceRequest (orders and referrals); DiagnosticReport
  with Observation (DXA/BMD); MedicationRequest and MedicationStatement or equivalent (medication data); Encounter
  (completed visits); Task (ownership and workflow status); CommunicationRequest and Communication (patient
  communication, human approved only).
- SMART App Launch as a possible future embedding pattern, vendor- and site-dependent.
- Optional later sources: free-text notes, outside-system documentation, broader interoperability feeds.

## Known limitations
- No EHR, portal, messaging or FHIR connectivity. No model runs anywhere in this build; all "AI" output is fixed text.
- Workflow state is in-memory and resets on reload.
- The demo-perspective selector is not an authorization control and provides no security.
- `noindex` discourages indexing; it is not access control.
- Charts are Recharts defaults; tooltips are mouse-only.
- Case-finding performance, operational burden and care-process completion are entirely unmeasured.
- Not validated, not production ready, not complete.

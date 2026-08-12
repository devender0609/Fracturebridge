# FractureBridge

**Accountable care-gap closure after a fragility fracture has already been found.**

A woman in her seventies has a CT for abdominal pain. The radiologist documents a chronic L1
compression deformity. The abdominal problem is treated. The fracture — a warning sign for the next
fracture — never reaches anyone whose job it is to act on it.

The fracture was found. No one owned what happened next.

FractureBridge reads radiology reports that already exist, checks whether bone-health follow-up
already happened, and puts the remainder in front of a named human with a clock on it. It tracks each
case until the loop is closed or closed with a stated reason.

> **This is a demonstration prototype.** All patients, reports, and metrics are fictional. There is no
> EHR connection, no real AI inference, and no patient data of any kind. Nothing here is validated for
> clinical use.

---

## What the system does — and does not do

**Does:** screens report text for fragility-fracture language; extracts level, chronicity, and how
explicit the language is; searches nine follow-up sources across defined lookback windows; stands down
when follow-up is already documented; orders the queue by explicit, inspectable triage rules;
summarizes the case; drafts patient-readable language for a human to edit and approve; routes to a
named owner with a timestamped audit trail.

**Does not:** diagnose osteoporosis; decide whether a fracture is osteoporotic; order a DXA;
prescribe; place a referral; send anything to a patient without human approval; predict who will
fracture next; make any final clinical decision.

The rule-based triage order is **not** a risk prediction. Upstream fracture-risk modelling appears in
the product only as an explicitly labelled future concept.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to ./dist
npm run preview  # serve the production build locally
```

Requires Node 18 or newer.

---

## Deploy

### Push to GitHub

```bash
git init
git add .
git commit -m "FractureBridge prototype"
git branch -M main
git remote add origin https://github.com/<your-username>/fracturebridge.git
git push -u origin main
```

### Deploy on Vercel

**From the dashboard (easiest):** New Project → Import the GitHub repo → Vercel detects Vite from
`vercel.json` → Deploy. Build command `npm run build`, output directory `dist`. No environment
variables are needed; the app is fully static.

**From the CLI:**

```bash
npm i -g vercel
vercel        # preview deployment
vercel --prod # production deployment
```

`vercel.json` sets an `X-Robots-Tag: noindex` header, and `index.html` carries a `noindex` meta tag,
so a public demo URL will not be indexed by search engines. Keep both in place while the prototype is
shared with reviewers.

---

## Project structure

```
index.html               Page shell, fonts, noindex meta
vercel.json              Vercel build + noindex headers
tailwind.config.js       Type scale and font stacks
src/
  main.jsx               React entry point
  index.css              Tailwind layers, focus ring, reduced-motion
  data.js                Constants, colour tokens, and the entire fictional dataset
  ui.jsx                 Design atoms and the Bridge stage tracker
  App.jsx                Shell, navigation, guided-demo runner
  views/
    Worklist.jsx         Case-finding funnel and the review queue
    CaseDetail.jsx       Report, extraction, follow-up check, ownership, letter, audit
    LoopBoard.jsx        Six-lane operational board plus excluded and verified cases
    Measures.jsx         Four categories of pilot instrumentation (Recharts; lazy-loaded)
    HowItWorks.jsx       Scope limits, positioning, architecture, governance
docs/
  demo-script.md         75-second walkthrough for a panel
```

### Changing the demo data

Everything shown is in `src/data.js`. Each case carries its report lines (`hl: true` marks the
highlighted passage), the extraction fields, a `followUp` array of evidence checks with source and
lookback window, `verify` items requiring human judgement, its workflow `stage`, and an `audit` array.
`STAGES` defines the seven piers of the bridge; `EXCLUSION_REASONS` defines the fixed reason list a
reviewer must choose from.

### Where a real integration would attach

The screening step, the follow-up check, and the letter drafting are deliberately separate so each can
be validated, replaced, or switched off on its own. The **How it works** page lists the data each
would require — `DiagnosticReport`, `Observation`, `ServiceRequest`, `MedicationRequest`,
`DocumentReference`, `Condition` — as planned integrations. None exist in this repository.

---

## Colour is state, never decoration

Each workflow stage owns one colour, defined once in `STAGE_STYLE` in `src/data.js` and reused
identically on the bridge, the board lanes, the queue dots, the status chips and the charts. Violet
always means an AI action; teal always means a human one; rose marks a case that is both actionable
and aging. Changing a stage colour in one place changes it everywhere.

## Two things to fix before this is shown as evidence

1. **The 19% → 52% baseline comparison in Measures is invented.** Either replace it with a real local
   denominator or relabel it as illustrative. It will be the first number a reviewer challenges.
2. **The nine-source follow-up check depends on note-text search**, which is the hardest of the eight
   listed integrations to actually obtain. Scope the pilot around what the data feed can really
   deliver.

---

## Prior art

Fracture liaison services and opportunistic fracture-detection tools already exist and work. This is
neither. The claim here is narrower: the combination of case identification, follow-up verification,
accountable routing, clinician engagement, patient engagement, and closed-loop tracking, over
information the health system already holds — aimed at the incidental vertebral fracture that never
arrives at an FLS door.

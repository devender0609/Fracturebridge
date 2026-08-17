# FractureBridge

**Accountable, human-reviewed follow-up after a vertebral compression-fracture finding is documented.**

A woman in her seventies has a CT for abdominal pain. The radiologist documents a chronic-appearing L1 compression
deformity. The abdominal problem is treated. The fracture — which may matter for future fracture risk — never reaches
anyone whose job it is to act on it.

The fracture was found. No one owned what happened next.

FractureBridge reads radiology reports that already exist, checks whether relevant bone-health follow-up is already
visible in connected sources, and routes only the remainder to a named human. It tracks each case until it is
appropriately resolved.

> **Demonstration prototype.** All patients, reports, and numbers are fictional. There is no EHR connection, no real AI
> inference, no patient messaging, and no clinical validation. Nothing here is Ascension data or observed performance.

---

## Navigation

**Overview** — what is the problem and what does this do? **Worklist** — who needs attention? **Case** — why is this
patient here and what needs to happen next? **Analytics** — how would we know whether the workflow works?
**How it works** — what does the AI do, what do people decide, and how could this connect to an EHR?

Case detail opens from the worklist and from the Overview example; it has no navigation item of its own.

## The clinical sequence

1. **Report finding** — a radiology report contains vertebral compression-fracture language.
2. **Follow-up evidence check** — connected sources are checked within defined lookback windows.
3. **Potential follow-up gap** — no relevant evidence is visible in the connected record.
4. **Human review** — a person confirms context, outside care, eligibility, and whether action is appropriate.
5. **Actionable case / ownership** — if appropriate, a named human owns the next step.

A patient is never described as a confirmed care gap before human review.

## What the system does — and does not do

**Supports:** finding fracture language in existing reports; checking connected sources for follow-up evidence;
summarizing what was found and what is uncertain; drafting clinician and patient communication for human approval;
keeping a timestamped record.

**Does not:** diagnose osteoporosis; determine fracture etiology or label a fracture osteoporotic; prescribe; order DXA
or any test; place referrals; contact patients; predict future fracture; make any final clinical decision.

Queue ordering is operational only — workflow state and elapsed time. There is no fracture-risk or clinical-urgency
score. Age, prior fracture and glucocorticoid exposure appear as clinical context for the reviewer.

## How a reviewed case can end

Four distinct outcomes, never collapsed into one bucket and never into "false positives":

| Family | Meaning | Counts as a screening exclusion? |
|---|---|---|
| **Not appropriate for this pathway** *(screening exclusion)* | Outside pathway scope — trauma, pathologic fracture, degenerative change, duplicate, extraction error | Yes |
| **Relevant care already exists** *(follow-up already addressed)* | The reviewer identified care that was not visible in the initial connected sources, including outside-system care | No |
| **Reviewed — no further action required** *(human-reviewed disposition)* | Reviewed, and no additional action is indicated — clinician judgment, patient declined after outreach, goals of care, other documented reason | No |
| **Unable to reach** *(outreach incomplete)* | Outreach attempted and the patient was not reached. Operational, not clinical: not care completed, not follow-up addressed, not patient contact. Reported separately | No |

Every closure records a responsible human, a reason, and a timestamp.

---

## Quick start

```bash
npm ci        # or: npm install
npm run dev   # http://localhost:5173
npm run build # production build to ./dist
npm run preview
```

Requires Node 18 or newer.

## Deploy

Push to GitHub, then import the repo in Vercel. `vercel.json` declares the Vite framework, `npm run build`, and `dist`;
no environment variables are needed. The app is fully static.

`noindex` discourages search-engine indexing; **it is not access control**. The deployment is not private or secure
merely because `noindex` is set — anyone with the URL can open it. Because every patient and value in the prototype is
fictional, sharing a demonstration URL with a committee is acceptable; do not treat the URL as confidential.

## Project structure

```
index.html               Page shell, fonts, favicon, noindex meta
vercel.json              Vercel build settings and noindex header
tailwind.config.js       Font stacks
src/
  main.jsx               React entry point
  index.css              Tailwind layers, focus ring, reduced-motion
  data.js                Colour tokens, disposition families, fictional cases, simulated pilot figures
  ui.jsx                 Design atoms and the Bridge stage tracker
  App.jsx                Shell, navigation, demo perspective, guided demo
  views/
    Overview.jsx         Problem, Find/Check/Route, funnel, one demo case
    Worklist.jsx         Operational queue, one cue per row
    CaseDetail.jsx       Why this case is here → what was checked → what happens next → decision
    Measures.jsx         Four question-led measurement sections, bottleneck view, framework/scenario toggle
    HowItWorks.jsx       AI scope, hard limits, taxonomy, data scope, EHR concept, boundary, references
docs/
  demo-script.md         Guided walkthrough for a panel
  QA_v0.10.1.md            What was tested, and what remains simulated
  committee-demo-guide.md  What to click in 60 seconds
```

## Pilot data scope and EHR integration

The first-phase evidence check uses radiology report text, orders, DXA/BMD results, medication data, and structured
referrals or encounters where available. Free-text clinical notes, outside-system documentation and broader
interoperability feeds are optional later sources; note-text checks appear in the case view under *Optional future
source — not required for the first-phase workflow*. Lookback windows are illustrative configurable pilot windows, not
universal clinical standards.

**How It Works** carries a conceptual **How FractureBridge could fit into the EHR** section with FHIR resource mappings
(DiagnosticReport, DocumentReference, ServiceRequest, Observation, MedicationRequest, MedicationStatement, Encounter,
Task, Communication/CommunicationRequest) and SMART App Launch as a possible future embedding pattern. All of it is
conceptual and subject to EHR capabilities, security, governance and local implementation. FractureBridge is not a
SMART on FHIR app, has no FHIR connection, and no vendor or organisation is claimed to support any of it.

## Which values are simulated

The Overview funnel (12,480 → 412 → 268; 171 stand down, 97 routed) is an illustrative six-month single-market
simulation, labelled on the card. Analytics defaults to a **pilot measurement framework** with no simulated values;
switching to **illustrative demo scenario** reveals them, labelled at every chart. Operational metrics — confirmation
rate, cases per week, review time, time to owner assignment, reviewer effort — read **To measure**. Longer-term
outcomes read **Not yet measured**. There is no before/after improvement figure anywhere in the product. The full list
is in `docs/QA_v0.10.1.1.md`.

## Status

This is a working prototype for design and workflow discussion. It is not validated, not production ready, not
clinically deployed, not EHR integrated, not FHIR integrated, not proven, and not complete.

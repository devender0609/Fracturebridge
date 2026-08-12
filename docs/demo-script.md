# 75-second demo script

Click **Guided demo** in the left rail. Seven steps, roughly ten seconds each.

**1 — Worklist.** "12,480 reports read in one market over six months. 268 patients had
fragility-fracture language in the report. 171 already had bone-health follow-up on record, so the
system stood down. 97 did not." *(The fourth number is the one that separates this from an alert that
fires on everybody.)*

**2 — Open Margaret Ellison.** "A CT for right lower quadrant pain. The fracture is right there in the
impression — the radiologist did their job. 102 days have passed and no note references it."

**3 — Scroll to the follow-up check.** "Nine sources, each with its lookback window. No DXA, no order,
no medication, no referral, no documented assessment. Vitamin D on the home list — supplementation is
not an evaluation. And a wrist fracture in 2024, which raises the priority and does not close the
gap."

**4 — Confirm care gap and assign.** "A nurse reviews it and takes ownership. The AI stops here — it
never diagnoses, orders, prescribes, or refers." *(Point at the bridge: the span now reaches pier
four, with a name under it.)*

**5 — Approve the patient letter.** "AI-drafted, plain language, unsent. It cannot send itself. A
human edits and approves, and the audit trail records who." *(The Exclude button and its required
reason list are worth one sentence here if the panel is skeptical.)*

**6 — Loop board.** "Every case moves left to right with an owner and a clock, or is closed with a
stated reason. Below the lanes: the patient already on treatment who never entered the worklist, and
the burst fracture from a car crash that a human excluded — that reason feeds the false-positive
measure."

**7 — Measures.** "Case finding, operations, care process. Four cases a week; one fracture liaison
nurse absorbs that inside an existing role. And the fourth category says plainly that a six-month
pilot cannot prove fracture reduction, so it is measured as a baseline, not claimed as a result."

**Close:** "The fracture was already found. FractureBridge is the part that was never anyone's job."

## Likely questions

- *How is this different from an EHR alert?* — An alert dies when it is dismissed. Here dismissal is a
  recorded decision with a reason from a fixed list, and the reasons are reported.
- *Don't we already have an FLS?* — An FLS sees the patients who arrive at its door, mostly hip and
  clinical fractures. The incidental vertebral fracture on an abdominal CT never arrives. This feeds
  an existing team rather than building a new one.
- *What is the AI accuracy?* — Unknown until a pilot. That is what the case-finding category measures,
  and the exclusion reasons are the defect report.

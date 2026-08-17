# FractureBridge v0.10.1 — final cleanup

Do less, more clearly. No new features, no redesign, no new navigation.

## The most important fix: honest icons
The follow-up-check summary showed a green tick beside every source that had been *searched*. On Margaret — where
nothing was found — seven green ticks read as seven pieces of follow-up evidence. Now:

- grey dash + "none found" = searched, nothing found;
- green tick + "found" = qualifying follow-up evidence;
- amber info icon = context only, shown in a separate **Clinical context for reviewer** block.

Prior fracture history, glucocorticoid exposure, calcium/vitamin D and falls screening are flagged `context` in the
data model, so they can never render as follow-up evidence. A legend sits under the list.

## Language
- Result line: *No relevant bone-health follow-up found in the configured sources* + *This is a review signal, not proof
  that care did not occur elsewhere.* Replaces "No qualifying follow-up evidence visible."
- Funnel: *Relevant follow-up not found in configured sources → potential follow-up gap → human review*.
- Verification items no longer ask a reviewer to adjudicate etiology: *Confirm the fracture context and whether the case
  is appropriate for this pathway.*
- "AI-highlighted" badge is now small grey text, *Finding highlighted by AI*, with the explanation in a tooltip. The
  message is that the fracture was already documented; the innovation is follow-through.

## Repetition removed
The case header showed the same state four times. It now appears once as a three-part strip: **Next workflow step ·
Owner · Status**. "Current need" is gone from the why-panel. What happens next is three short imperatives — Confirm the
finding · Check outside care · Assign owner or disposition — with one sentence beneath.

## Workflow tracker simplified
Eight technical stages collapsed to six memorable ones: **Finding → Review → Owner → Outreach → Evaluation → Outcome**.
Substates (outreach attempted versus patient reached, evaluation initiated versus documented) remain in the audit trail
and the status chips. A rule beneath the tracker marks the boundary: machine-supported screening on the left, human
judgment and action on everything from Review onward.

## Overview
The dark guided-demo banner is now a compact button pair — *60-second guided demo* and *Open example case* — with
"New to FractureBridge? Start here." as small text. The application is visually dominant again.

## Analytics
**Where are open cases waiting?** moved to the top: the first management question is where the workflow is stuck. Metric
definitions collapsed behind *View definition*. "Can we identify the right cases?" → "Can we identify appropriate cases
for review?"; "Human-confirmation rate" → "Share of routed cases confirmed actionable".

## How it works
The EHR diagram is five boxes for an executive — EHR report → FractureBridge find + check → Human review → Named owner
+ action → Status documented. The eight-step workflow and the FHIR mappings moved inside *Technical integration detail*.
Added a compact **without / with** comparison (documented → finalized → no clear owner, versus documented → check →
review → owner → outcome) stating plainly that the difference is accountable workflow, not a prevented fracture.
Platform potential is now one sentence with no example cards.

## Documentation
Removed the superseded `docs/demo-script.md`, `docs/QA_v0.8.md` and `docs/QA_v0.9.md`. README now describes the actual
navigation and the six-stage tracker, and points at `docs/QA_v0.10.1.md`. No "Safety & design" references remain.

## Unchanged
Every clinical boundary, the four disposition families, outreach attempt versus patient contact, the absence of any
priority or risk score, and every simulated-value label.

## Not claimed
Not validated, not production ready, not deployed, not EHR integrated, not clinically proven.

# FractureBridge v0.3 — workflow intelligence and demo polish

This pass builds on v0.2 without expanding the clinical scope. The goal is to make the prototype feel more like a usable clinical operations product while preserving human review and demo-data transparency.

## Added
- Role switcher for Care coordinator, Clinician, and Quality leader demo perspectives.
- Action-needed Overview panel with the oldest open case surfaced directly.
- Worklist Table / Board toggle for operational workflow review.
- Operational escalation badges for unassigned and aging cases; these are explicitly workflow signals, not clinical risk predictions.
- Patient-case summary strip showing days since finding, follow-up evidence status, and owner.
- Human-review checklist tailored around fracture context, outside care, and appropriateness of additional follow-up.
- Follow-up evidence grouped into existing management, follow-up underway, and risk/context signals.
- Connected-source transparency panel explaining what the prototype checked and its limitations.
- Clinician communication preview with AI-draft / human-verification labeling.

## Preserved safety boundaries
- No autonomous diagnosis, treatment, referral, or patient messaging.
- No claim that absence of connected evidence proves absence of care.
- No predictive future-fracture model added to the MVP.
- All displayed patients and workflow values remain fictional demonstration data.

## Validation note
A full Vite production build could not be run in this environment because project dependencies are not installed and offline npm cache is incomplete. Run `npm ci && npm run build` on a normal development machine before deployment.

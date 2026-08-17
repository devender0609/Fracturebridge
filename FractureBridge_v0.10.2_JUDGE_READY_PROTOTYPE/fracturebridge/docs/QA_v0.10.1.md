# QA v0.10.1

## Scope
Focused committee-readiness pass on hierarchy, wording, progressive disclosure, and workflow comprehension.

## Static checks completed
- Navigation remains Overview / Worklist / Analytics / How it works.
- No remaining “Follow-up not visible”, “Current need”, “Human-confirmation rate”, or “AI-HIGHLIGHTED” committee-facing labels.
- Margaret verification no longer asks the prototype to determine fragility etiology.
- Executive EHR flow is five steps; technical FHIR mapping remains under disclosure.
- High-level bridge is six stages; detailed substates remain in audit/status.
- Platform-potential examples are not rendered as product cards or navigation.
- No clinical treatment recommendation, autonomous order/referral, autonomous outreach, or fracture-risk prediction was added.

## Build verification
The source package is prepared for `npm ci && npm run build`. A clean dependency install/build could not be reproduced in this sandbox because package installation is unavailable here. Do not represent this file as fresh build proof. The prior v0.10 package included its own QA report; v0.10.1 requires a normal CI/Vercel build when deployed.

## Known limitations
- Fictional patients and simulated AI outputs only.
- No EHR/FHIR connection.
- State resets on reload.
- No real messaging, orders, referrals, authentication, or RBAC.
- Pilot lookback windows and workflow rules are illustrative/configurable.

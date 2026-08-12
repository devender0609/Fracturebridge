# FractureBridge v0.2 refinement

This pass focuses on clinical accuracy, safer language, clearer ownership, less simulated precision, and a cleaner executive-demo experience.

## Key changes
- Added a concise Overview screen and simplified primary navigation.
- Rebuilt the Worklist as an action-first queue rather than an analytics dashboard.
- Replaced CT-inappropriate marrow-edema language in the Margaret demo report.
- Replaced ambiguous AI confidence labels with extraction certainty language.
- Changed definitive no-follow-up wording to no follow-up evidence found in the connected demonstration record.
- Softened patient messaging and removed blanket non-emergency reassurance.
- Separated screening exclusions from already-managed cases in workflow language.
- Removed unsupported staffing claims and invented pre/post performance comparisons from Analytics.
- Reframed all metrics as illustrative pilot data or to-be-measured fields.
- Reframed FLS positioning as complementary rather than adversarial.
- Replaced an implausible pelvis-radiograph vertebral example with a CT-chest incidental T12 example.
- Updated the guided demo to emphasize evidence limits, human review, and measurable pilot outcomes.

## Validation note
The source was statically reviewed in this environment. JavaScript-only files pass Node syntax checks. A full Vite production build could not be run because npm dependencies are not available in the execution environment and external package retrieval is disabled. Run `npm ci && npm run build` in a normal development environment before deployment.

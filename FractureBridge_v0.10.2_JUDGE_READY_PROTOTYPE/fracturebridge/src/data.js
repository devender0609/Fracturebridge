/* FractureBridge — demonstration dataset and workflow constants.
 * All patients are fictional. No real or deidentified clinical data is used.
 */

export const cx = (...a) => a.filter(Boolean).join(" ");

/* ---------------------------- care team ---------------------------- */

export const TEAM = [
  "A. Ruiz, RN — Fracture Liaison",
  "M. Okafor, NP — Bone Health Clinic",
  "Dr. L. Hahn — Primary Care",
];

/* ------------------------- six memorable stages ------------------------- */
/* Detailed substates remain in the audit trail; the bridge shows only the */
/* high-level workflow a first-time user needs to remember.                 */

export const STAGES = [
  { key: "finding", label: "Finding", by: "Radiology" },
  { key: "review", label: "Review", by: "Reviewer" },
  { key: "owner", label: "Owner", by: "Named person" },
  { key: "outreach", label: "Outreach", by: "Care team" },
  { key: "evaluation", label: "Evaluation", by: "Clinician" },
  { key: "outcome", label: "Outcome", by: "Clinician" },
];

/* Number of high-level piers complete when a case sits in this stage. */
export const STAGE_INDEX = {
  review: 1,
  owned: 2,
  outreach: 3,
  reached: 4,
  evaluation: 4,
  documented: 5,
  closed: 6,
};

/* Terminal states. A case that ends here does not fall back to Human review:
   the bridge shows the piers it reached, then an end-cap. */
export const TERMINAL_STAGES = ["closed", "excluded", "verified", "resolved", "unreached"];

/* ------------------- how a reviewed case can end -------------------- *
 * Four distinct families. They are never collapsed into one bucket and
 * never into "false positives": only family A is a screening exclusion.
 * -------------------------------------------------------------------- */

export const DISPOSITIONS = {
  screening: {
    key: "screening",
    stage: "excluded",
    label: "Not appropriate for this pathway",
    term: "Screening exclusion",
    short: "Outside pathway scope",
    help: "The finding should not have entered the pathway. These reasons are the case-finding refinement signal for the screen.",
    reasons: [
      "High-energy trauma — outside pathway scope",
      "Pathologic fracture — known malignancy",
      "Degenerative change or Schmorl node — not a fracture",
      "Duplicate of an existing case",
      "Report extraction error",
    ],
  },
  addressed: {
    key: "addressed",
    stage: "verified",
    label: "Relevant care already exists",
    term: "Follow-up already addressed",
    short: "Already receiving care",
    help: "The reviewer identified care that was not visible in the initial connected sources. Not a screening exclusion.",
    reasons: [
      "Active osteoporosis therapy documented",
      "Recent bone-health evaluation documented",
      "Established fracture-liaison follow-up",
      "Outside-system care confirmed by the reviewer",
    ],
  },
  clinical: {
    key: "clinical",
    stage: "resolved",
    label: "Reviewed — no further action required",
    term: "Human-reviewed disposition",
    short: "Clinician or care team reviewed",
    help: "A clinician or care-team member reviewed the case and documented why no additional action is indicated. Not a screening exclusion.",
    reasons: [
      "Treating clinician determined no additional action indicated",
      "Patient declined after outreach",
      "Goals of care — comfort-focused",
      "Other documented clinical reason",
    ],
  },
  outreach: {
    key: "outreach",
    stage: "unreached",
    label: "Unable to reach",
    term: "Outreach incomplete",
    short: "Operational, not clinical",
    help: "Outreach was attempted and the patient was not reached. This may stop repeated outreach under the pilot protocol. It is not a clinical closure, not care completed, and not patient contact. Reported separately.",
    requiresOutreach: true,
    reasons: ["Unable to reach after the defined outreach protocol"],
  },
};

/* Workflow-only next step. Never a clinical recommendation. */
export const NEXT_STEP = {
  review: "Human review required",
  owned: "Patient outreach pending",
  outreach: "Patient response pending",
  reached: "Evaluation status pending",
  evaluation: "Document outcome",
  documented: "Confirm pathway complete",
  closed: "None — pathway complete",
  excluded: "None — closed with a documented reason",
  verified: "None — closed with a documented reason",
  resolved: "None — closed with a documented reason",
  unreached: "None — outreach protocol exhausted",
};

/* One short cue for the worklist. One only. */
export const WHY_HERE = {
  review: "Needs human review",
  owned: "Needs outreach",
  outreach: "Outreach pending",
  reached: "Evaluation pending",
  evaluation: "Awaiting outcome",
  documented: "Ready to close",
};

/* G: windows are configuration, not clinical standards. */
export const LOOKBACK_NOTE =
  "Illustrative configurable pilot windows — not universal clinical standards.";

/* --------------------------- demo dataset -------------------------- */

const FU_OPT = (label, status, source, lookback, note) => fu(label, status, source, lookback, note, true);

const fu = (label, status, source, lookback, note, optional = false) => ({
  label,
  status,
  source,
  lookback,
  optional,
  note,
});

export const MARGARET_REPORT = [
  { t: "EXAM: CT abdomen and pelvis with IV contrast.", head: true },
  {
    t: "INDICATION: 74-year-old woman with three days of right lower quadrant pain and low-grade fever.",
  },
  { t: "FINDINGS", head: true },
  {
    t: "Bowel: Wall thickening of the terminal ileum with adjacent fat stranding, consistent with ileitis. No free air. No abscess.",
  },
  {
    t: "Solid organs: Liver, spleen, pancreas, adrenals and kidneys unremarkable. No hydronephrosis.",
  },
  {
    t: "Vascular: Aortic atherosclerotic calcification without aneurysm.",
  },
  {
    t: "Osseous structures: Chronic-appearing compression deformity of the L1 vertebral body with approximately 30% anterior height loss and no retropulsion. Degenerative changes of the lower lumbar spine.",
    hl: true,
  },
  { t: "IMPRESSION", head: true },
  { t: "1. Terminal ileitis. Correlate clinically." },
  { t: "2. No abscess or perforation." },
  {
    t: "3. Chronic-appearing L1 vertebral compression deformity. Correlate with clinical and bone-health history.",
    hl: true,
  },
];

export const CASES = [
  {
    id: "FB-04417",
    name: "Margaret Ellison",
    age: 74,
    sex: "F",
    mrn: "DEMO-88214",
    exam: "CT abdomen/pelvis with contrast",
    indication: "Right lower quadrant pain",
    reportDate: "May 2, 2026",
    days: 102,
    finding: "Chronic L1 vertebral compression deformity",
    level: "L1",
    chronicity: "Chronic-appearing",
    confidence: "Explicit report language",
    clinicalContext: [
      "Age 74",
      "Prior low-trauma fracture documented (distal radius, 2024)",
      "No relevant bone-health follow-up evidence found in the connected demonstration record",
      "Report language explicit, not equivocal",
    ],
    report: MARGARET_REPORT,
    verify: [
      "Confirm the fracture context and whether the case is appropriate for this pathway",
      "Check whether relevant bone-health care occurred outside this health system",
    ],
    followUp: [
      fu("DXA / BMD result", "none", "Imaging results feed", "24 months", "No study on file"),
      fu("DXA order", "none", "Orders", "24 months", "No order placed"),
      fu("Osteoporosis pharmacotherapy", "none", "Medication list", "12 months", "No bisphosphonate, denosumab, or anabolic agent"),
      fu("Calcium / vitamin D", "partial", "Medication list", "12 months", "Vitamin D 1000 IU on the home list — supplementation alone is not an osteoporosis evaluation"),
      fu("Bone-health or FLS referral", "none", "Referrals", "24 months", "No referral found"),
      fu("Endocrinology referral", "none", "Referrals", "24 months", "No referral found"),
      FU_OPT("Osteoporosis assessment in notes", "none", "Note text", "24 months", "No documented assessment or discussion"),
      fu("Prior fracture history", "found", "Problem list / imaging", "5 years", "Distal radius fracture, March 2024 — clinical context for the reviewer; does not close the case"),
      FU_OPT("Documented clinical review of this finding", "none", "Note text", "Since report date", "No note references the L1 finding"),
    ],
    stage: "review",
    owner: null,
    letterApproved: false,
    letter:
      "Dear Ms. Ellison,\n\nWhen you had your CT scan on May 2, the radiology report noted a compression deformity in one of the bones of your spine (the L1 vertebra). This finding was not the reason for your scan.\n\nIn some adults, this type of finding may be associated with weakened bone and may warrant additional bone-health review.\n\nYour care team would like to review whether additional bone-health evaluation may be appropriate for you. Someone from our office will contact you to discuss the next step.\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "May 2, 2026 · 4:12p", actor: "Radiology", text: "Report finalized by radiologist." },
      {
        ts: "May 3, 2026 · 2:05a",
        actor: "FractureBridge",
        ai: true,
        text: "Report screened. Vertebral compression-fracture language identified in Findings and Impression; human review required.",
      },
      {
        ts: "May 3, 2026 · 2:05a",
        actor: "FractureBridge",
        ai: true,
        text: "Configured follow-up sources checked. No relevant bone-health follow-up evidence found in the connected demonstration record.",
      },
      {
        ts: "May 3, 2026 · 2:06a",
        actor: "FractureBridge",
        ai: true,
        text: "Case placed on the human-review worklist by operational queue order. No clinical action taken and no urgency score assigned.",
      },
    ],
  },
  {
    id: "FB-04392",
    name: "Doris Whitfield",
    age: 81,
    sex: "F",
    mrn: "DEMO-88103",
    exam: "Lumbar spine radiograph, 2 views",
    indication: "Chronic low back pain",
    reportDate: "Jun 14, 2026",
    days: 59,
    finding: "T12 wedge deformity, age indeterminate",
    level: "T12",
    chronicity: "Age indeterminate",
    confidence: "Equivocal report language",
    clinicalContext: ["Age 81", "No follow-up evidence found in the demonstration record"],
    report: [
      { t: "EXAM: Lumbar spine, AP and lateral.", head: true },
      { t: "INDICATION: 81-year-old woman with chronic low back pain." },
      { t: "FINDINGS", head: true },
      {
        t: "Mild wedge deformity of the T12 vertebral body, approximately 20% anterior height loss, age indeterminate. Multilevel disc space narrowing.",
        hl: true,
      },
      { t: "IMPRESSION", head: true },
      { t: "1. T12 wedge deformity, age indeterminate. 2. Lumbar spondylosis.", hl: true },
    ],
    verify: [
      "Report language is equivocal — confirm this represents a fracture rather than a developmental or degenerative deformity",
      "Confirm no bone-health care outside this health system",
    ],
    followUp: [
      fu("DXA / BMD result", "none", "Imaging results feed", "24 months", "No study on file"),
      fu("DXA order", "none", "Orders", "24 months", "No order placed"),
      fu("Osteoporosis pharmacotherapy", "none", "Medication list", "12 months", "None found"),
      fu("Bone-health or FLS referral", "none", "Referrals", "24 months", "No referral found"),
      FU_OPT("Osteoporosis assessment in notes", "none", "Note text", "24 months", "No documented assessment"),
      fu("Prior fracture history", "none", "Problem list / imaging", "5 years", "None found"),
    ],
    stage: "review",
    owner: null,
    letterApproved: false,
    letter:
      "Dear Ms. Whitfield,\n\nYour recent spine X-ray showed a change in the shape of one of your vertebrae that can sometimes be caused by weakened bone. Your care team would like to review whether a bone-health check would be helpful.\n\nSomeone from our office will call you.\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "Jun 14, 2026 · 11:20a", actor: "Radiology", text: "Report finalized by radiologist." },
      {
        ts: "Jun 15, 2026 · 2:03a",
        actor: "FractureBridge",
        ai: true,
        text: "Flagged for review. Report language equivocal — human verification required before any action.",
      },
    ],
  },
  {
    id: "FB-04408",
    name: "Ronald Vasquez",
    age: 69,
    sex: "M",
    mrn: "DEMO-88450",
    exam: "Low-dose CT chest (lung cancer screening)",
    indication: "Screening, former smoker",
    reportDate: "Jul 1, 2026",
    days: 42,
    finding: "Mild T8 compression deformity",
    level: "T8",
    chronicity: "Chronic-appearing",
    confidence: "Explicit report language",
    clinicalContext: ["Age 69", "Long-term inhaled and oral steroid use on medication list", "No follow-up evidence found"],
    report: [
      { t: "EXAM: Low-dose CT chest without contrast.", head: true },
      { t: "INDICATION: Lung cancer screening, 69-year-old former smoker." },
      { t: "FINDINGS", head: true },
      { t: "Lungs: 4 mm right upper lobe nodule, Lung-RADS 2. No consolidation." },
      {
        t: "Osseous: Mild chronic compression deformity of T8 with approximately 20% height loss.",
        hl: true,
      },
      { t: "IMPRESSION", head: true },
      { t: "1. Lung-RADS 2. Continue annual screening. 2. Chronic T8 compression deformity.", hl: true },
    ],
    verify: [
      "Confirm glucocorticoid exposure and duration with the prescribing clinician",
      "Confirm the deformity is not post-traumatic",
    ],
    followUp: [
      fu("DXA / BMD result", "none", "Imaging results feed", "24 months", "No study on file"),
      fu("Osteoporosis pharmacotherapy", "none", "Medication list", "12 months", "None found"),
      fu("Bone-health or FLS referral", "none", "Referrals", "24 months", "None found"),
      FU_OPT("Osteoporosis assessment in notes", "none", "Note text", "24 months", "None found"),
      fu("Glucocorticoid exposure", "found", "Medication list", "24 months", "Prednisone courses x3 and chronic inhaled steroid — clinical context for the reviewer"),
    ],
    stage: "review",
    owner: null,
    letterApproved: false,
    letter:
      "Dear Mr. Vasquez,\n\nYour recent CT scan noted a compression deformity in one of the bones of your mid-back. In some adults, this type of finding may be associated with weakened bone. Your care team would like to review whether additional bone-health evaluation may be appropriate.\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "Jul 1, 2026 · 9:02a", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Jul 2, 2026 · 2:04a", actor: "FractureBridge", ai: true, text: "Routed for human review. No urgency score assigned." },
    ],
  },
  {
    id: "FB-04371",
    name: "Patricia Nam",
    age: 77,
    sex: "F",
    mrn: "DEMO-87990",
    exam: "CT abdomen/pelvis",
    indication: "Diverticulitis follow-up",
    reportDate: "Apr 18, 2026",
    days: 116,
    finding: "L2 compression deformity",
    level: "L2",
    chronicity: "Chronic-appearing",
    confidence: "Explicit report language",
    clinicalContext: ["Age 77", "No follow-up evidence found in the demonstration record"],
    report: [
      { t: "EXAM: CT abdomen and pelvis.", head: true },
      { t: "FINDINGS", head: true },
      { t: "Resolved sigmoid diverticulitis. No abscess." },
      { t: "Osseous: Chronic L2 compression deformity with 25% height loss.", hl: true },
    ],
    verify: ["Confirm low-energy mechanism", "Confirm no outside bone-health care"],
    followUp: [
      fu("DXA / BMD result", "none", "Imaging results feed", "24 months", "No study on file"),
      fu("Osteoporosis pharmacotherapy", "none", "Medication list", "12 months", "None found"),
      fu("Bone-health or FLS referral", "none", "Referrals", "24 months", "None found"),
      FU_OPT("Osteoporosis assessment in notes", "none", "Note text", "24 months", "None found"),
    ],
    stage: "owned",
    owner: TEAM[0],
    letterApproved: false,
    letter:
      "Dear Ms. Nam,\n\nYour recent CT scan noted a compression fracture in your spine. Your care team would like to review whether a bone-health evaluation would be helpful.\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "Apr 18, 2026 · 3:40p", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Apr 19, 2026 · 2:02a", actor: "FractureBridge", ai: true, text: "Flagged for review. No follow-up evidence found in the connected demonstration record." },
      { ts: "Apr 21, 2026 · 10:15a", actor: TEAM[0], text: "Human review confirmed the case is actionable. Case assigned." },
    ],
  },
  {
    id: "FB-04350",
    name: "Gloria Adeyemi",
    age: 72,
    sex: "F",
    mrn: "DEMO-87741",
    exam: "MRI lumbar spine",
    indication: "New back pain",
    reportDate: "Mar 30, 2026",
    days: 135,
    finding: "T11 compression fracture with marrow edema",
    level: "T11",
    chronicity: "Acute or subacute",
    confidence: "Explicit report language",
    clinicalContext: ["Age 72", "Acute fracture with edema", "No follow-up evidence found"],
    report: [
      { t: "EXAM: MRI lumbar spine without contrast.", head: true },
      { t: "FINDINGS", head: true },
      { t: "T11 compression fracture with marrow edema, suggesting acute or subacute injury. No retropulsion or cord compression.", hl: true },
    ],
    verify: ["Confirm low-energy mechanism", "Confirm pain management plan is in place"],
    followUp: [
      fu("DXA / BMD result", "none", "Imaging results feed", "24 months", "No study on file"),
      fu("Osteoporosis pharmacotherapy", "none", "Medication list", "12 months", "None found"),
      fu("Bone-health or FLS referral", "none", "Referrals", "24 months", "None found"),
    ],
    stage: "reached",
    owner: TEAM[1],
    letterApproved: true,
    letter:
      "Dear Ms. Adeyemi,\n\nYour recent MRI showed a compression fracture in your spine. Your care team would like to check whether a bone-health evaluation would help lower the chance of another fracture.\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "Mar 30, 2026 · 1:10p", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Mar 31, 2026 · 2:01a", actor: "FractureBridge", ai: true, text: "Flagged for review." },
      { ts: "Apr 2, 2026 · 9:30a", actor: TEAM[1], text: "Human review confirmed the case is actionable. Case assigned." },
      { ts: "Apr 4, 2026 · 11:00a", actor: TEAM[1], text: "Patient letter approved and sent. Phone outreach completed — patient agreeable to evaluation." },
    ],
  },
  {
    id: "FB-04333",
    name: "Frances Boyle",
    age: 84,
    sex: "F",
    mrn: "DEMO-87502",
    exam: "CT chest without contrast",
    indication: "Chronic cough",
    reportDate: "Mar 9, 2026",
    days: 156,
    finding: "T12 compression deformity noted incidentally",
    level: "T12",
    chronicity: "Chronic-appearing",
    confidence: "Probable report language",
    clinicalContext: ["Age 84", "Fall history", "No follow-up evidence found"],
    report: [
      { t: "EXAM: CT chest without contrast.", head: true },
      { t: "INDICATION: Chronic cough.", head: false },
      { t: "FINDINGS", head: true },
      { t: "Osseous structures: Chronic-appearing T12 vertebral compression deformity with mild anterior height loss. No acute osseous abnormality identified.", hl: true },
    ],
    verify: ["Confirm fracture context and whether bone-health follow-up is already occurring outside the connected record"],
    followUp: [
      fu("DXA / BMD result", "none", "Imaging results feed", "24 months", "No study on file"),
      fu("Bone-health or FLS referral", "none", "Referrals", "24 months", "None found"),
      FU_OPT("Falls assessment", "found", "Note text", "12 months", "Falls screening documented — relevant but not a bone-health evaluation"),
    ],
    stage: "evaluation",
    owner: TEAM[2],
    letterApproved: true,
    letter: "Dear Ms. Boyle,\n\nYour recent CT report noted a compression deformity in your spine...\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "Mar 9, 2026 · 8:45a", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Mar 10, 2026 · 2:02a", actor: "FractureBridge", ai: true, text: "Flagged for review." },
      { ts: "Mar 12, 2026 · 1:20p", actor: TEAM[0], text: "Human review confirmed the case is actionable. Assigned to primary care." },
      { ts: "Mar 18, 2026 · 4:05p", actor: TEAM[2], text: "DEMONSTRATION: patient reached. Evaluation initiated by the treating clinician." },
      { ts: "Mar 26, 2026 · 9:00a", actor: TEAM[2], text: "DEMONSTRATION: evaluation scheduled." },
    ],
  },
  {
    id: "FB-04321",
    name: "Nancy Oyelaran",
    age: 73,
    sex: "F",
    mrn: "DEMO-87388",
    exam: "CT abdomen/pelvis",
    indication: "Abdominal pain",
    reportDate: "Feb 24, 2026",
    days: 169,
    finding: "L3 compression deformity",
    level: "L3",
    chronicity: "Chronic-appearing",
    confidence: "Explicit report language",
    clinicalContext: ["Age 73", "No follow-up evidence found at time of flag"],
    report: [
      { t: "EXAM: CT abdomen and pelvis.", head: true },
      { t: "FINDINGS", head: true },
      { t: "Chronic L3 compression deformity with 20% height loss.", hl: true },
    ],
    verify: ["Confirm treatment plan documented by treating clinician"],
    followUp: [
      fu("DXA / BMD result", "found", "Imaging results feed", "24 months", "DXA completed Apr 14, 2026 — T-score -2.8 (after FractureBridge outreach)"),
      fu("Osteoporosis pharmacotherapy", "found", "Medication list", "12 months", "Alendronate started Apr 22, 2026"),
      fu("Bone-health or FLS referral", "found", "Referrals", "24 months", "Bone Health Clinic, Apr 2026"),
    ],
    stage: "documented",
    owner: TEAM[1],
    letterApproved: true,
    letter: "Dear Ms. Oyelaran,\n\nYour recent CT scan noted a compression fracture...\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "Feb 24, 2026 · 2:30p", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Feb 25, 2026 · 2:03a", actor: "FractureBridge", ai: true, text: "Flagged for review. No follow-up evidence found in the connected demonstration record." },
      { ts: "Feb 27, 2026 · 10:00a", actor: TEAM[0], text: "Human review confirmed the case is actionable. Assigned to Bone Health Clinic." },
      { ts: "Mar 4, 2026 · 3:15p", actor: TEAM[1], text: "DEMONSTRATION: patient communication approved by the owner; simulated outreach recorded. Patient reached. No message was sent by this prototype." },
      { ts: "Apr 14, 2026 · 11:00a", actor: TEAM[1], text: "DEMONSTRATION: evaluation completed; result available to the treating clinician." },
      { ts: "Apr 22, 2026 · 9:40a", actor: TEAM[1], text: "DEMONSTRATION: outcome documented — treatment plan recorded by the treating clinician." },
    ],
  },
  {
    id: "FB-04298",
    name: "Helen Marchetti",
    age: 79,
    sex: "F",
    mrn: "DEMO-87145",
    exam: "CT abdomen/pelvis",
    indication: "Hematuria",
    reportDate: "Jan 12, 2026",
    days: 212,
    finding: "L1 compression deformity",
    level: "L1",
    chronicity: "Chronic-appearing",
    confidence: "Explicit report language",
    clinicalContext: ["Age 79", "No follow-up evidence found at time of flag"],
    report: [
      { t: "EXAM: CT abdomen and pelvis.", head: true },
      { t: "FINDINGS", head: true },
      { t: "Chronic L1 compression deformity. No acute osseous abnormality.", hl: true },
    ],
    verify: [],
    followUp: [
      fu("DXA / BMD result", "found", "Imaging results feed", "24 months", "DXA completed Feb 20, 2026 — T-score -2.5"),
      fu("Osteoporosis pharmacotherapy", "found", "Medication list", "12 months", "Denosumab started Mar 2026"),
      FU_OPT("Osteoporosis assessment in notes", "found", "Note text", "24 months", "Bone Health Clinic note, Mar 3, 2026"),
    ],
    stage: "closed",
    owner: TEAM[1],
    letterApproved: true,
    letter: "Dear Ms. Marchetti,\n\nYour recent CT scan noted a compression fracture...\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "Jan 12, 2026 · 4:00p", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Jan 13, 2026 · 2:01a", actor: "FractureBridge", ai: true, text: "Flagged for review. No follow-up evidence found in the connected demonstration record." },
      { ts: "Jan 15, 2026 · 9:20a", actor: TEAM[0], text: "Human review confirmed the case is actionable. Assigned." },
      { ts: "Jan 20, 2026 · 2:00p", actor: TEAM[1], text: "Patient letter approved and sent. Outreach completed." },
      { ts: "Feb 20, 2026 · 10:30a", actor: TEAM[1], text: "DEMONSTRATION: evaluation completed; result available to the treating clinician." },
      { ts: "Mar 3, 2026 · 11:15a", actor: TEAM[1], text: "DEMONSTRATION: outcome documented by the treating clinician." },
      { ts: "Mar 3, 2026 · 11:18a", actor: TEAM[1], text: "DEMONSTRATION: pathway completed — evaluation completed and outcome documented." },
    ],
  },
  {
    id: "FB-04361",
    name: "Wanda Pryce",
    age: 76,
    sex: "F",
    mrn: "DEMO-87866",
    exam: "CT abdomen/pelvis",
    indication: "Abdominal pain",
    reportDate: "Apr 8, 2026",
    days: 126,
    finding: "T7 compression deformity",
    level: "T7",
    chronicity: "Chronic-appearing",
    confidence: "Explicit report language",
    clinicalContext: [],
    report: [
      { t: "EXAM: CT abdomen and pelvis.", head: true },
      { t: "FINDINGS", head: true },
      { t: "Chronic T7 compression deformity, stable compared with prior study.", hl: true },
    ],
    verify: [],
    followUp: [
      fu("DXA / BMD result", "found", "Imaging results feed", "24 months", "DXA completed Aug 2025 — T-score -2.6"),
      fu("Osteoporosis pharmacotherapy", "found", "Medication list", "12 months", "Alendronate 70 mg weekly, active"),
      FU_OPT("Osteoporosis assessment in notes", "found", "Note text", "24 months", "Endocrinology note, Sep 2025"),
    ],
    stage: "verified",
    stoppedAt: 3,
    disposition: "addressed",
    closureReason: "Active osteoporosis therapy documented",
    owner: null,
    letterApproved: false,
    letter: "",
    audit: [
      { ts: "Apr 8, 2026 · 5:12p", actor: "Radiology", text: "Report finalized by radiologist." },
      {
        ts: "Apr 9, 2026 · 2:02a",
        actor: "FractureBridge",
        ai: true,
        text: "Fracture language identified. Follow-up check found active osteoporosis treatment and a DXA within 24 months. No worklist entry created. Logged for audit only.",
      },
    ],
  },
  {
    id: "FB-04275",
    name: "Beatrice Lyman",
    age: 78,
    sex: "F",
    mrn: "DEMO-86904",
    exam: "CT abdomen/pelvis",
    indication: "Abdominal pain",
    reportDate: "Feb 11, 2026",
    days: 183,
    finding: "L2 compression deformity",
    level: "L2",
    chronicity: "Chronic-appearing",
    confidence: "Explicit report language",
    clinicalContext: ["Age 78", "No relevant follow-up evidence visible in the configured sources"],
    report: [
      { t: "EXAM: CT abdomen and pelvis.", head: true },
      { t: "FINDINGS", head: true },
      { t: "Chronic L2 compression deformity with 25% height loss.", hl: true },
    ],
    verify: [],
    followUp: [
      fu("DXA / BMD result", "none", "Imaging results", "24 months", "No study visible in the configured demonstration sources"),
      fu("DXA order", "none", "Orders", "24 months", "No order visible"),
      fu("Osteoporosis pharmacotherapy", "none", "Medication data", "12 months", "None visible"),
      fu("Bone-health or FLS referral", "none", "Referrals / encounters", "24 months", "None visible"),
    ],
    stage: "unreached",
    stoppedAt: 4,
    disposition: "outreach",
    closureReason: "Unable to reach after the defined outreach protocol",
    owner: TEAM[1],
    letterApproved: true,
    letter: "Dear Ms. Lyman,\n\nYour recent CT scan noted a compression fracture in your spine...\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "Feb 11, 2026 · 1:05p", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Feb 12, 2026 · 2:02a", actor: "FractureBridge", ai: true, text: "Vertebral compression-fracture language identified. Configured follow-up sources checked; no relevant evidence visible. Routed for human review." },
      { ts: "Feb 16, 2026 · 9:20a", actor: TEAM[0], text: "Human review confirmed the case is actionable. Owner assigned." },
      { ts: "Feb 18, 2026 · 11:00a", actor: TEAM[1], text: "DEMONSTRATION: patient communication approved by the owner; simulated outreach recorded. No message was sent by this prototype." },
      { ts: "Mar 6, 2026 · 4:30p", actor: TEAM[1], text: "Outreach incomplete — unable to reach after the defined outreach protocol. Operational disposition recorded; not a clinical closure and not patient contact." },
    ],
  },
  {
    id: "FB-04289",
    name: "Ruth Delgado",
    age: 80,
    sex: "F",
    mrn: "DEMO-87021",
    exam: "CT abdomen/pelvis",
    indication: "Weight loss workup",
    reportDate: "Jan 6, 2026",
    days: 219,
    finding: "T12 compression deformity",
    level: "T12",
    chronicity: "Chronic-appearing",
    confidence: "High",
    clinicalContext: [],
    report: [
      { t: "EXAM: CT abdomen and pelvis.", head: true },
      { t: "FINDINGS", head: true },
      { t: "Chronic T12 compression deformity with 20% height loss.", hl: true },
    ],
    verify: [],
    followUp: [
      fu("DXA / BMD result", "none", "Imaging results feed", "24 months", "No study visible in the connected demonstration sources"),
      fu("Osteoporosis pharmacotherapy", "none", "Medication list", "12 months", "None visible"),
      fu("Bone-health or FLS referral", "none", "Referrals", "24 months", "None visible"),
    ],
    stage: "resolved",
    stoppedAt: 5,
    disposition: "clinical",
    closureReason: "Patient declined evaluation",
    owner: TEAM[0],
    letterApproved: true,
    letter: "Dear Ms. Delgado,\n\nYour recent CT scan noted a compression fracture in your spine...\n\n— Bone Health Program, Austin market",
    audit: [
      { ts: "Jan 6, 2026 · 2:15p", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Jan 7, 2026 · 2:02a", actor: "FractureBridge", ai: true, text: "Vertebral compression-fracture language identified. No relevant follow-up evidence visible in the connected demonstration sources. Routed for human review." },
      { ts: "Jan 9, 2026 · 10:40a", actor: TEAM[0], text: "Reviewed and assigned. DEMONSTRATION: outreach approved by the assigned owner; no message was sent." },
      { ts: "Jan 21, 2026 · 3:05p", actor: TEAM[0], text: "Clinically reviewed closure — patient declined evaluation. Recorded by the assigned owner. Not a screening exclusion." },
    ],
  },
  {
    id: "FB-04344",
    name: "Edward Kalinowski",
    age: 71,
    sex: "M",
    mrn: "DEMO-87610",
    exam: "CT thoracic spine",
    indication: "Motor vehicle collision",
    reportDate: "Mar 20, 2026",
    days: 145,
    finding: "T12 burst fracture",
    level: "T12",
    chronicity: "Acute",
    confidence: "Explicit report language",
    clinicalContext: [],
    report: [
      { t: "EXAM: CT thoracic spine.", head: true },
      { t: "INDICATION: Restrained driver, high-speed motor vehicle collision." },
      { t: "FINDINGS", head: true },
      { t: "Acute T12 burst fracture with 40% height loss and mild retropulsion.", hl: true },
    ],
    verify: [],
    followUp: [
      fu("DXA / BMD result", "none", "Imaging results feed", "24 months", "No study on file"),
      fu("Spine surgery involvement", "found", "Referrals", "12 months", "Admitted, managed by spine service"),
    ],
    stage: "excluded",
    excludeReason: "High-energy trauma — not eligible for this bone-health pathway",
    owner: TEAM[0],
    letterApproved: false,
    letter: "",
    audit: [
      { ts: "Mar 20, 2026 · 7:40p", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Mar 21, 2026 · 2:01a", actor: "FractureBridge", ai: true, text: "Flagged for review — mechanism not determinable from report text alone." },
      { ts: "Mar 21, 2026 · 8:30a", actor: TEAM[0], text: "Excluded after review: high-energy trauma. Reason recorded for screening-performance analysis." },
    ],
  },
  {
    id: "FB-04310",
    name: "Yolanda Rios",
    age: 68,
    sex: "F",
    mrn: "DEMO-87299",
    exam: "CT chest/abdomen/pelvis",
    indication: "Restaging, breast carcinoma",
    reportDate: "Feb 5, 2026",
    days: 188,
    finding: "L3 pathologic compression fracture",
    level: "L3",
    chronicity: "Acute",
    confidence: "Explicit report language",
    clinicalContext: [],
    report: [
      { t: "EXAM: CT chest, abdomen and pelvis.", head: true },
      { t: "FINDINGS", head: true },
      { t: "New L3 compression fracture through a lytic lesion, consistent with pathologic fracture in the setting of known metastatic disease.", hl: true },
    ],
    verify: [],
    followUp: [
      fu("Oncology involvement", "found", "Referrals", "12 months", "Active oncology care, radiation oncology consulted"),
    ],
    stage: "excluded",
    stoppedAt: 3,
    disposition: "screening",
    closureReason: "Pathologic fracture — known malignancy",
    owner: TEAM[0],
    letterApproved: false,
    letter: "",
    audit: [
      { ts: "Feb 5, 2026 · 3:22p", actor: "Radiology", text: "Report finalized by radiologist." },
      { ts: "Feb 6, 2026 · 2:03a", actor: "FractureBridge", ai: true, text: "Flagged for review — malignancy context present in report." },
      { ts: "Feb 6, 2026 · 9:10a", actor: TEAM[0], text: "Excluded after review: pathologic fracture, managed by oncology." },
    ],
  },
];

/* ---------------------- visual language ---------------------------- *
 * One colour per workflow stage, used identically on the bridge, the
 * board, the queue dots and the charts. Colour carries state, never
 * decoration.
 * ------------------------------------------------------------------ */

export const STAGE_STYLE = {
  review: {
    name: "Needs review",
    dot: "bg-amber-500",
    soft: "bg-amber-50",
    text: "text-amber-800",
    ring: "border-amber-200",
    bar: "bg-amber-500",
    hex: "#f59e0b",
  },
  owned: {
    name: "Owned",
    dot: "bg-sky-500",
    soft: "bg-sky-50",
    text: "text-sky-800",
    ring: "border-sky-200",
    bar: "bg-sky-500",
    hex: "#0ea5e9",
  },
  reached: {
    name: "Patient reached",
    dot: "bg-indigo-500",
    soft: "bg-indigo-50",
    text: "text-indigo-800",
    ring: "border-indigo-200",
    bar: "bg-indigo-500",
    hex: "#6366f1",
  },
  evaluation: {
    name: "Evaluation initiated",
    dot: "bg-teal-500",
    soft: "bg-teal-50",
    text: "text-teal-800",
    ring: "border-teal-200",
    bar: "bg-teal-500",
    hex: "#14b8a6",
  },
  documented: {
    name: "Documented outcome",
    dot: "bg-emerald-500",
    soft: "bg-emerald-50",
    text: "text-emerald-800",
    ring: "border-emerald-200",
    bar: "bg-emerald-500",
    hex: "#10b981",
  },
  closed: {
    name: "Pathway completed",
    term: "Evaluation completed and outcome documented",
    dot: "bg-slate-400",
    soft: "bg-slate-100",
    text: "text-slate-600",
    ring: "border-slate-200",
    bar: "bg-slate-400",
    hex: "#94a3b8",
  },
  outreach: {
    name: "Outreach attempted",
    dot: "bg-indigo-400",
    soft: "bg-indigo-50",
    text: "text-indigo-800",
    ring: "border-indigo-200",
    bar: "bg-indigo-400",
    hex: "#818cf8",
  },
  unreached: {
    name: "Unable to reach",
    term: "Outreach incomplete",
    dot: "bg-slate-400",
    soft: "bg-slate-50",
    text: "text-slate-600",
    ring: "border-slate-300",
    bar: "bg-slate-400",
    hex: "#94a3b8",
  },
  resolved: {
    name: "Reviewed — no further action",
    term: "Human-reviewed disposition",
    dot: "bg-slate-300",
    soft: "bg-slate-50",
    text: "text-slate-500",
    ring: "border-slate-200",
    bar: "bg-slate-300",
    hex: "#cbd5e1",
  },
  verified: {
    name: "Already receiving care",
    term: "Follow-up already addressed",
    dot: "bg-slate-300",
    soft: "bg-slate-50",
    text: "text-slate-500",
    ring: "border-slate-200",
    bar: "bg-slate-300",
    hex: "#cbd5e1",
  },
  excluded: {
    name: "Not for this pathway",
    term: "Screening exclusion",
    dot: "bg-slate-300",
    soft: "bg-slate-50",
    text: "text-slate-500",
    ring: "border-slate-200",
    bar: "bg-slate-300",
    hex: "#cbd5e1",
  },
};

export const AI_HEX = "#7c3aed";
export const HUMAN_HEX = "#0f766e";

/* ------------------------- pilot instrumentation ------------------- *
 * Every number below is an ILLUSTRATIVE SIMULATION used to show what the
 * dashboard would display. None of it is observed performance, and none of
 * it comes from Ascension. Metrics that a pilot would have to measure are
 * represented as TO_MEASURE rather than invented.
 * ------------------------------------------------------------------- */

export const TO_MEASURE = "To measure";

/* Illustrative six-month, single-market simulation.
   171 + 97 = 268 (see COVERAGE below). */
export const SCREEN_FUNNEL = [
  { step: "Reports screened", n: 12480, hex: "#cbd5e1" },
  { step: "Reports with fracture language", n: 412, hex: "#a5b4fc" },
  { step: "Unique patients", n: 268, hex: "#6366f1" },
  { step: "Routed for human review", n: 97, hex: "#f59e0b" },
];

export const COVERAGE = {
  patients: 268,
  standDown: 171,
  routed: 97,
};

/* Of the 97 routed for review: 74 + 12 + 7 + 4 = 97.
   Only the 12 are screening exclusions. */
export const REVIEW_DISPOSITION = [
  { label: "Actionable after review", n: 74, hex: "#0ea5e9" },
  { label: "Screening exclusion", n: 12, hex: "#f59e0b" },
  { label: "Follow-up already addressed", n: 7, hex: "#14b8a6" },
  { label: "Human-reviewed disposition", n: 4, hex: "#94a3b8" },
];

/* The 12 screening exclusions only. Outside-system care is NOT here —
   it is a follow-up-already-addressed disposition. */
export const SCREENING_EXCLUSION_DATA = [
  { reason: "High-energy trauma", n: 5 },
  { reason: "Pathologic fracture", n: 3 },
  { reason: "Degenerative change", n: 2 },
  { reason: "Duplicate case", n: 1 },
  { reason: "Extraction error", n: 1 },
];

export const WEEKLY = [
  { w: "W1", routed: 4, closed: 0 },
  { w: "W2", routed: 3, closed: 0 },
  { w: "W3", routed: 5, closed: 1 },
  { w: "W4", routed: 4, closed: 1 },
  { w: "W5", routed: 3, closed: 2 },
  { w: "W6", routed: 4, closed: 2 },
  { w: "W7", routed: 5, closed: 3 },
  { w: "W8", routed: 3, closed: 2 },
  { w: "W9", routed: 4, closed: 3 },
  { w: "W10", routed: 4, closed: 3 },
  { w: "W11", routed: 3, closed: 3 },
  { w: "W12", routed: 5, closed: 4 },
  { w: "W13", routed: 4, closed: 3 },
  { w: "W14", routed: 3, closed: 3 },
  { w: "W15", routed: 4, closed: 4 },
  { w: "W16", routed: 3, closed: 3 },
  { w: "W17", routed: 4, closed: 4 },
  { w: "W18", routed: 5, closed: 3 },
  { w: "W19", routed: 3, closed: 3 },
  { w: "W20", routed: 4, closed: 4 },
  { w: "W21", routed: 3, closed: 3 },
  { w: "W22", routed: 4, closed: 3 },
  { w: "W23", routed: 3, closed: 3 },
  { w: "W24", routed: 3, closed: 4 },
  { w: "W25", routed: 3, closed: 3 },
  { w: "W26", routed: 4, closed: 4 },
];

export const WEEKLY_TOTALS = { routed: 97, closed: 71 };

/* Care-process cascade from the 74 actionable cases. */
export const CASCADE = [
  { step: "Actionable after review", n: 74, hex: "#f59e0b" },
  { step: "Outreach attempted", n: 71, hex: "#818cf8" },
  { step: "Patient reached", n: 55, hex: "#6366f1" },
  { step: "Evaluation initiated", n: 41, hex: "#14b8a6" },
  { step: "Evaluation completed", n: 30, hex: "#0d9488" },
  { step: "Documented outcome", n: 26, hex: "#10b981" },
];

/* Reported separately. An unsuccessful attempt is never counted as contact. */
export const OUTREACH_SPLIT = [
  { label: "Patient reached", n: 55, hex: "#6366f1" },
  { label: "Outreach incomplete", n: 16, hex: "#94a3b8" },
];

/* What each care-process step would have to mean before it is counted. */
export const PROCESS_DEFINITIONS = [
  ["Outreach attempted", "Human-approved communication is issued under the pilot outreach protocol. An attempt is only an attempt."],
  ["Patient reached", "The communication is delivered and acknowledged, or the patient is spoken with. Attempts that do not reach the patient are never counted here."],
  ["Outreach incomplete", "The outreach protocol is exhausted without reaching the patient. Reported separately as an operational disposition, not as care completed."],
  ["Evaluation initiated", "A bone-health evaluation or DXA is ordered, or a bone-health visit is scheduled, by a clinician."],
  ["Evaluation completed", "The evaluation or DXA is performed and the result is available."],
  ["Documented outcome", "A clinician documents the assessment and plan, including a documented decision not to treat."],
];

/* 15: where open cases are waiting. Illustrative scenario values. */
export const BOTTLENECK = [
  { stage: "Human review", n: 9, hex: "#f59e0b" },
  { stage: "Owner assignment", n: 4, hex: "#0ea5e9" },
  { stage: "Outreach", n: 7, hex: "#818cf8" },
  { stage: "Patient response", n: 6, hex: "#6366f1" },
  { stage: "Evaluation", n: 5, hex: "#14b8a6" },
  { stage: "Documentation", n: 3, hex: "#10b981" },
];

/* 16: reviewer-effort measures. Answering "does this reduce manual case
   finding, or merely create another worklist?" — no savings claimed. */
export const EFFORT_MEASURES = [
  ["Reports screened automatically", "Volume the team never has to search by hand"],
  ["Cases routed for human review", "What the workflow actually puts in front of a person"],
  ["Percentage stood down because follow-up was already visible", "The share the team is spared"],
  ["Median reviewer time per routed case", "Self-timed during the pilot"],
  ["Cases requiring manual chart search", "Where the configured sources were not enough"],
  ["Time from report finding to owner assignment", "How long accountability takes to attach"],
];

/* 17: kept deliberately small. Not built, not in navigation. */
export const PLATFORM_POTENTIAL = [
  "Pulmonary nodules",
  "Aortic aneurysm findings",
  "Adrenal incidental findings",
  "Renal masses",
];

/* MVP versus later data sources. Availability is an assumption to test in a
   pilot, not a promise. */
export const DATA_SCOPE = {
  mvp: [
    ["Radiology report text", "The documented finding itself"],
    ["Orders", "Whether an evaluation was ordered but not completed"],
    ["DXA / BMD results", "Whether a study exists and what it showed"],
    ["Medication data", "Osteoporosis therapy, glucocorticoid exposure"],
    ["Structured referrals / encounters, where available", "Bone health, endocrinology, fracture-liaison contact"],
  ],
  later: [
    ["Free-text clinical notes", "Assessment documented only in prose — optional enrichment, not required for the first-phase workflow"],
    ["Outside-system documentation", "Care delivered elsewhere"],
    ["Broader interoperability feeds", "Regional, HIE or payer data"],
  ],
};

/* H: conceptual mapping only. Nothing here is connected, and the correct
   resource for a given system has to be validated locally. */
export const FHIR_MAP = [
  ["Radiology report", "DiagnosticReport where available; DocumentReference may also be relevant for unstructured report or document access."],
  ["Orders and referrals", "ServiceRequest."],
  ["DXA / BMD results", "DiagnosticReport together with Observation where appropriate. Observation alone does not necessarily represent a complete study."],
  ["Medication information", "MedicationRequest may represent orders; MedicationStatement or an equivalent medication-list representation may be needed for actual or current use. Exact mapping must be validated."],
  ["Completed visits", "Encounter. An encounter is not a ServiceRequest."],
  ["Ownership and workflow status", "Task is the appropriate conceptual resource, since FractureBridge is fundamentally an accountable workflow."],
  ["Patient communication", "CommunicationRequest could represent a request to communicate; Communication could represent an actual communication if one is performed and the EHR supports it. All patient communication remains human approved."],
];

export const EHR_FLOW = [
  "EHR report",
  "FractureBridge · find + check",
  "Human review",
  "Named owner + action",
  "Status documented",
];

/* I: what is demonstrated versus what would have to be built. */
export const BOUNDARY = {
  current: {
    title: "Current demonstration",
    tone: "teal",
    items: [
      "Fictional reports and patients",
      "Simulated AI outputs",
      "In-memory workflow that resets on reload",
      "No messages sent",
      "No EHR connection",
    ],
  },
  pilot: {
    title: "Potential pilot",
    tone: "amber",
    items: [
      "Real report feed after approvals",
      "Validated case-finding algorithm",
      "Configured follow-up sources",
      "Human-reviewed worklist",
      "Process and operational measurement",
    ],
  },
  future: {
    title: "Potential future integration",
    tone: "slate",
    items: [
      "Embedded or linked EHR workflow",
      "Governed status write-back",
      "Human-triggered clinical actions",
      "Larger clinical outcome evaluation",
    ],
  },
};

/* P: authoritative references only. No prevalence, effectiveness or financial
   claims are drawn from them into the product. */
export const REFERENCES = [
  ["ASBMR — Secondary Fracture Prevention Initiative: clinical recommendations", "https://www.asbmr.org/about/statement-detail/secondary-fracture-prevention-initiative-recommend"],
  ["HL7 FHIR R4 — DiagnosticReport", "https://hl7.org/fhir/R4/diagnosticreport.html"],
  ["HL7 FHIR R4 — DocumentReference", "https://hl7.org/fhir/R4/documentreference.html"],
  ["HL7 FHIR R4 — ServiceRequest", "https://hl7.org/fhir/R4/servicerequest.html"],
  ["HL7 FHIR R4 — Observation", "https://hl7.org/fhir/R4/observation.html"],
  ["HL7 FHIR R4 — MedicationRequest", "https://hl7.org/fhir/R4/medicationrequest.html"],
  ["HL7 FHIR R4 — MedicationStatement", "https://hl7.org/fhir/R4/medicationstatement.html"],
  ["HL7 FHIR R4 — Encounter", "https://hl7.org/fhir/R4/encounter.html"],
  ["HL7 FHIR R4 — Task", "https://hl7.org/fhir/R4/task.html"],
  ["HL7 FHIR R4 — Communication and CommunicationRequest", "https://hl7.org/fhir/R4/communication.html"],
  ["HL7 SMART App Launch", "https://hl7.org/fhir/smart-app-launch/"],
];

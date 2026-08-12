import React from "react";
import { Check, X, ShieldCheck } from "lucide-react";
import { cx } from "../data";
import { Eyebrow, Card, CardHead, AiTag, HumanTag } from "../ui";

const DOES = [
  "Reads existing radiology reports and flags vertebral compression-fracture language for review",
  "Extracts the level, the chronicity as reported, and how explicit the language is",
  "Searches nine follow-up sources across defined lookback windows",
  "Stands down when follow-up is already documented",
  "Orders the queue by explicit, inspectable triage rules",
  "Summarizes the case so a reviewer does not rebuild the chart by hand",
  "Drafts patient-readable language for a human to edit and approve",
  "Routes to a named person and keeps a timestamped record",
];

const DOES_NOT = [
  "Diagnose osteoporosis",
  "Decide whether a fracture is osteoporotic",
  "Order a DXA or any other test",
  "Prescribe or recommend a specific drug",
  "Place a referral",
  "Send anything to a patient without human approval",
  "Predict who will fracture next",
  "Make any final clinical decision",
];

const PIPE = [
  { t: "Screen", who: "AI", d: "Report text in, fracture language out" },
  { t: "Check", who: "AI", d: "Available follow-up evidence across connected sources" },
  { t: "Review", who: "Human", d: "Confirm, exclude with a reason, or stand down" },
  { t: "Own", who: "Human", d: "Named person, clock running" },
  { t: "Close", who: "Human", d: "Evaluation and plan documented" },
];

const DIFFS = [
  {
    t: "Not another EHR alert",
    p: "An alert fires at the wrong person at the wrong moment and dies when it is dismissed. Here, dismissal is a recorded decision with a reason from a fixed list, and the reasons are reported.",
  },
  {
    t: "Not a replacement for a fracture liaison service",
    p: "Fracture liaison services are established secondary-fracture prevention models. FractureBridge can complement them by helping identify incidental vertebral-fracture cases that may otherwise never enter the pathway.",
  },
  {
    t: "Not an opportunistic fracture detector",
    p: "Detection tools find fractures on images. Every case here starts with a fracture a radiologist already found and wrote down. The work is verification, ownership and closure.",
  },
];

const SOURCES = [
  ["Radiology reports", "FHIR DiagnosticReport", "Report text for screening"],
  ["Imaging results", "FHIR Observation", "DXA / BMD results"],
  ["Orders", "FHIR ServiceRequest", "DXA ordered but not completed"],
  ["Medications", "FHIR MedicationRequest", "Osteoporosis therapy, glucocorticoids"],
  ["Referrals", "FHIR ServiceRequest", "Bone health, endocrinology, FLS"],
  ["Notes", "FHIR DocumentReference", "Documented assessment of the finding"],
  ["Problem list", "FHIR Condition", "Prior fracture history, malignancy context"],
  ["Patient messaging", "Portal / mail vendor", "Approved letters only"],
];

function HowItWorks() {
  return (
    <div>
      <header className="mb-6">
        <Eyebrow>Design, safety and governance</Eyebrow>
        <h1 className="mt-2 max-w-3xl font-serif text-3xl leading-tight text-slate-900">
          The AI does the searching. People do the deciding.
        </h1>
      </header>

      {/* pipeline */}
      <Card className="mb-6 px-5 py-5">
        <Eyebrow>Where the handover happens</Eyebrow>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
          {PIPE.map((p, i) => (
            <div
              key={p.t}
              className={cx(
                "relative rounded-lg border px-3 py-3",
                p.who === "AI" ? "border-violet-200 bg-violet-50" : "border-teal-200 bg-teal-50"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cx("font-serif text-base", p.who === "AI" ? "text-violet-900" : "text-teal-900")}>{p.t}</span>
                <span className={cx("font-mono text-xs uppercase tracking-wider", p.who === "AI" ? "text-violet-500" : "text-teal-600")}>
                  {p.who}
                </span>
              </div>
              <p className={cx("mt-1 text-xs leading-snug", p.who === "AI" ? "text-violet-800" : "text-teal-800")}>{p.d}</p>
              {i === 1 && (
                <span className="absolute -bottom-2 right-2 rounded-full bg-slate-900 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-white sm:-right-3 sm:bottom-auto sm:top-1/2">
                  handover
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHead accent="bg-violet-500" eyebrow="Scope" title="What the AI does" right={<AiTag>AI</AiTag>} />
          <ul className="divide-y divide-slate-100">
            {DOES.map((d) => (
              <li key={d} className="flex items-start gap-3 px-5 py-2.5 text-sm text-slate-700">
                <Check size={15} className="mt-0.5 shrink-0 text-violet-600" />
                {d}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHead accent="bg-teal-600" eyebrow="Hard limits" title="What the AI never does" right={<HumanTag>Human</HumanTag>} />
          <ul className="divide-y divide-slate-100">
            {DOES_NOT.map((d) => (
              <li key={d} className="flex items-start gap-3 px-5 py-2.5 text-sm text-slate-700">
                <X size={15} className="mt-0.5 shrink-0 text-rose-400" />
                {d}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHead accent="bg-amber-500" eyebrow="Positioning" title="Fracture prevention is not new. This part of it is unowned." />
        <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {DIFFS.map((d) => (
            <div key={d.t} className="px-5 py-4">
              <h4 className="font-serif text-base text-slate-900">{d.t}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{d.p}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHead
            accent="bg-sky-500"
            eyebrow="Architecture"
            title="Conceptual integration architecture"
            right={<span className="whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider text-amber-700">Planned · none connected</span>}
          />
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {SOURCES.map(([a, b, c]) => (
                <tr key={a}>
                  <td className="px-5 py-2.5 font-medium text-slate-800">{a}</td>
                  <td className="py-2.5 font-mono text-xs text-slate-400">{b}</td>
                  <td className="px-5 py-2.5 text-slate-600">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs leading-relaxed text-slate-600">
            Everything here is simulated. Potential future integration sources may include these resources, but no EHR connections exist in this prototype. Screening, follow-up checking, and drafting remain separable so each can be validated, replaced, or switched off independently.
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHead accent="bg-teal-600" eyebrow="Safeguards" title="Built into the workflow, not the policy binder" />
            <ul className="divide-y divide-slate-100">
              {[
                "No case reaches a patient without a named human approving it",
                "Every AI-produced element is labelled where it appears",
                "Exclusion requires a reason from a fixed list, and the reasons are reported",
                "Timestamped audit trail separating human and AI actions",
                "Read-only against the record; it writes nothing back without a person",
              ].map((s) => (
                <li key={s} className="flex items-start gap-3 px-5 py-2.5 text-sm text-slate-700">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0 text-teal-600" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-dashed bg-slate-50">
            <CardHead
              accent="bg-slate-300"
              eyebrow="Future concept"
              title="Upstream risk — not in this version"
              right={<span className="whitespace-nowrap rounded-full border border-slate-300 px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider text-slate-500">Not built</span>}
            />
            <div className="px-5 py-4 text-sm leading-relaxed text-slate-600">
              Once the closed loop is validated, the same ownership machinery could be pointed at patients who have not
              fractured yet, using externally validated risk models — prior fracture, age, bone density, glucocorticoid
              exposure, falls, comorbidities.
              <span className="mt-2 block font-medium text-slate-800">
                No predictive model exists in this prototype, and none should be implied.
              </span>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardHead accent="bg-indigo-500" eyebrow="Proposed pilot" title="What a 6–12 month pilot could answer" />
        <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Can the cases be found reliably?", "Screen yield, confirmation rate, exclusion reasons"],
            ["How many need a human?", "Routed cases per week and per 1,000 reports"],
            ["Can an existing team carry it?", "Reviewer minutes per case, backlog age"],
            ["Does follow-up improve?", "Evaluation initiation and completion"],
            ["What breaks?", "False-positive patterns, unreachable patients"],
            ["Would it scale?", "Effort per closed case, transfer of rules to a second market"],
          ].map(([q, a]) => (
            <div key={q} className="bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-800">{q}</div>
              <div className="mt-1 font-mono text-xs leading-relaxed text-slate-500">{a}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default HowItWorks;

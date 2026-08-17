import React from "react";
import { Check, X, ShieldCheck, FileSearch, UserCheck, HeartHandshake, ChevronDown, ArrowDown, ExternalLink } from "lucide-react";
import { cx, DISPOSITIONS, DATA_SCOPE, FHIR_MAP, EHR_FLOW, REFERENCES, BOUNDARY } from "../data";
import { Eyebrow, Card, CardHead, AiTag, HumanTag } from "../ui";

const AI_DOES = [
  "Finds explicit or equivocal vertebral compression-fracture language in existing reports",
  "Checks connected sources for relevant follow-up evidence within defined lookback windows",
  "Summarizes what was found, what was not, and what remains uncertain",
  "Drafts clinician and patient communication for a human to edit and approve",
  "Keeps a timestamped record of every step",
];

const PEOPLE_DO = [
  "Confirm the finding's context and whether the pathway applies",
  "Check outside care and documentation the system cannot see",
  "Assign an accountable owner, or record an appropriate closure with a reason",
  "Approve any patient communication before it goes anywhere",
  "Decide when the case is appropriately resolved",
];

const LIMITS = [
  "Diagnose osteoporosis",
  "Determine fracture etiology or label a fracture osteoporotic",
  "Prescribe medication",
  "Order DXA or any other test",
  "Place referrals",
  "Send patient communication",
  "Predict who will fracture next",
  "Make any final clinical decision",
];

const STEPS = [
  { icon: FileSearch, title: "Find & check", who: "AI support", text: "Screen report text, extract the finding, and check connected sources for follow-up evidence.", tone: "violet" },
  { icon: UserCheck, title: "Review & own", who: "Human", text: "Confirm context, check what the system cannot see, assign ownership, or close with a documented reason.", tone: "teal" },
  { icon: HeartHandshake, title: "Engage & close", who: "Human", text: "Approve communication, track follow-up, and keep the case visible until it is appropriately resolved.", tone: "emerald" },
];

const tone = {
  violet: "border-violet-200 bg-violet-50 text-violet-900",
  teal: "border-teal-200 bg-teal-50 text-teal-900",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export default function HowItWorks() {
  const [refsOpen, setRefsOpen] = React.useState(false);
  const [techOpen, setTechOpen] = React.useState(false);
  return (
    <div>
      <header className="mb-6">
        <Eyebrow>How it works</Eyebrow>
        <h1 className="mt-2 max-w-4xl font-serif text-3xl leading-tight text-slate-900">
          AI searches and summarizes. People decide.
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          FractureBridge is intentionally bounded. It supports case finding and accountable follow-through; it does not
          replace clinical judgment.
        </p>
      </header>

      <Card className="mb-6 p-5">
        <Eyebrow>From report to resolved case</Eyebrow>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, who, text, tone: t }) => (
            <div key={title} className={cx("rounded-xl border p-4", tone[t])}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/70">
                  <Icon size={18} />
                </div>
                <span className="rounded-full bg-white/70 px-2 py-0.5 font-mono text-xs uppercase tracking-wider">{who}</span>
              </div>
              <h2 className="mt-3 text-base font-semibold">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed opacity-90">{text}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHead accent="bg-violet-500" eyebrow="AI scope" title="What the AI supports" right={<AiTag>Verify</AiTag>} />
          <ul className="divide-y divide-slate-100">
            {AI_DOES.map((d) => (
              <li key={d} className="flex items-start gap-3 px-5 py-3 text-sm text-slate-700">
                <Check size={15} className="mt-0.5 shrink-0 text-violet-600" />
                {d}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHead accent="bg-teal-600" eyebrow="Human responsibility" title="What people decide" right={<HumanTag>Required</HumanTag>} />
          <ul className="divide-y divide-slate-100">
            {PEOPLE_DO.map((d) => (
              <li key={d} className="flex items-start gap-3 px-5 py-3 text-sm text-slate-700">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-teal-600" />
                {d}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHead accent="bg-rose-400" eyebrow="Hard limits" title="What FractureBridge does not do" />
        <div className="grid gap-2 p-5 sm:grid-cols-2">
          {LIMITS.map((x) => (
            <div key={x} className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-slate-700">
              <X size={14} className="mt-0.5 shrink-0 text-rose-500" />
              {x}
            </div>
          ))}
        </div>
      </Card>

      {/* four distinct disposition families */}
      <Card className="mb-6">
        <CardHead accent="bg-amber-500" eyebrow="Taxonomy" title="How a reviewed case can end — four distinct outcomes" />
        <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {Object.values(DISPOSITIONS).map((f) => (
            <div key={f.key} className="px-5 py-4">
              <h3 className="font-serif text-base text-slate-900">{f.label}</h3>
              <div className="font-mono text-xs uppercase tracking-wider text-slate-400">{f.term}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.help}</p>
              <ul className="mt-2.5 space-y-1">
                {f.reasons.slice(0, 4).map((r) => (
                  <li key={r} className="text-xs leading-relaxed text-slate-500">
                    · {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs leading-relaxed text-slate-600">
          Only the screening-exclusion family counts against case-finding quality. Collapsing the other outcomes into "false positives" would
          misrepresent both the screen and the reviewers.
        </div>
      </Card>

      {/* pilot data scope */}
      <Card className="mb-6">
        <CardHead
          accent="bg-sky-500"
          eyebrow="Pilot data scope"
          title="What a first phase would actually need"
          right={
            <span className="whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider text-amber-700">
              Conceptual · nothing connected
            </span>
          }
        />
        <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <div className="px-5 py-4">
            <Eyebrow>Likely first-phase sources</Eyebrow>
            <table className="mt-3 w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {DATA_SCOPE.mvp.map(([a, b, c]) => (
                  <tr key={a}>
                    <td className="py-2.5 pr-3 align-top font-medium text-slate-800">{a}</td>
                    <td className="py-2.5 align-top text-slate-600">
                      {b}
                      <div className="font-mono text-xs text-slate-400">{c}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4">
            <Eyebrow>Optional / later sources</Eyebrow>
            <table className="mt-3 w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {DATA_SCOPE.later.map(([a, b]) => (
                  <tr key={a}>
                    <td className="py-2.5 pr-3 align-top font-medium text-slate-800">{a}</td>
                    <td className="py-2.5 align-top text-slate-600">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              The MVP does not depend on the later sources. Free-text note search is the hardest to obtain and is
              deliberately out of the first phase. FHIR resource names are conceptual examples; no connectivity is
              claimed or implied.
            </p>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <CardHead accent="bg-teal-600" eyebrow="Accountability" title="What changes in the workflow" />
        <div className="grid gap-3 p-5 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-mono text-xs uppercase tracking-wider text-slate-500">Without FractureBridge</div>
            <p className="mt-2 text-sm font-medium text-slate-800">Fracture documented → report finalized → no clear owner</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <div className="font-mono text-xs uppercase tracking-wider text-teal-700">With FractureBridge</div>
            <p className="mt-2 text-sm font-medium text-teal-900">Fracture documented → follow-up check → human review → named owner → documented outcome</p>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <CardHead accent="bg-teal-600" eyebrow="Positioning" title="A complement to established fracture-prevention programs" />
        <div className="px-5 py-4 text-sm leading-relaxed text-slate-600">
          Fracture liaison services are established secondary-fracture prevention models, and FractureBridge does not
          replace them. FractureBridge is intended to help identify documented vertebral-fracture findings that may not
          otherwise enter an accountable secondary-fracture-prevention workflow, to check whether relevant follow-up is
          already visible, and to keep ownership visible until the case is appropriately resolved.
        </div>
      </Card>

      {/* conceptual EHR integration */}
      <Card className="mb-6">
        <CardHead
          accent="bg-slate-400"
          eyebrow="Conceptual future integration"
          title="How FractureBridge could fit into the EHR"
          right={
            <span className="whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider text-amber-700">
              Concept only · nothing connected
            </span>
          }
        />
        <div className="border-b border-slate-100 px-5 py-4 text-xs leading-relaxed text-slate-600">
          Subject to EHR capabilities, security, governance and local implementation. No integration exists today, and
          no claim is made about what any specific EHR or organisation currently exposes or supports.
        </div>
        <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <div className="px-5 py-4">
            <Eyebrow>Executive view</Eyebrow>
            <ol className="mt-3 space-y-1">
              {EHR_FLOW.map((step, i) => (
                <li key={step}>
                  <div
                    className={cx(
                      "rounded-lg border px-3 py-2 text-sm",
                      i === 0
                        ? "border-slate-300 bg-slate-50 text-slate-700"
                        : i === 1
                        ? "border-violet-200 bg-violet-50 text-violet-900"
                        : "border-teal-200 bg-teal-50 text-teal-900"
                    )}
                  >
                    {step}
                  </div>
                  {i < EHR_FLOW.length - 1 && <ArrowDown size={13} className="mx-auto my-0.5 text-slate-300" />}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              The handoff to human review is the boundary between machine-supported screening and clinical judgment.
              Detailed interoperability mappings are available below; no EHR connection exists today.
            </p>
          </div>
          <div className="px-5 py-4">
            <Eyebrow>What this would mean in practice</Eyebrow>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              FractureBridge would read reports that already exist, check the sources it is configured to check, and hand
              a case to a person. Every clinical action stays where it is today: with the clinician, in the EHR.
            </p>
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
              The actual pilot integration could use supported APIs, existing enterprise interfaces, or approved
              data-platform feeds. The final approach depends on local architecture, and every mapping would have to be
              validated against the system in use. FractureBridge is not a SMART on FHIR app and has no FHIR connection.
            </p>
          </div>
        </div>
        <button
          onClick={() => setTechOpen((v) => !v)}
          aria-expanded={techOpen}
          className="flex w-full items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-left transition-colors hover:bg-slate-50"
        >
          <span className="text-sm font-medium text-teal-800">Technical integration detail</span>
          <ChevronDown size={15} className={cx("shrink-0 text-slate-400 transition-transform", techOpen && "rotate-180")} />
        </button>
        {techOpen && (
          <div className="border-t border-slate-100 px-5 py-4">
            <Eyebrow>Conceptual resource mapping — to be validated locally</Eyebrow>
            <dl className="mt-3 divide-y divide-slate-100">
              {FHIR_MAP.map(([k, v]) => (
                <div key={k} className="py-2.5">
                  <dt className="text-sm font-medium text-slate-800">{k}</dt>
                  <dd className="mt-0.5 text-xs leading-relaxed text-slate-500">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              SMART App Launch is one possible future embedding pattern, conceptual and vendor- and site-dependent.
            </p>
          </div>
        )}
      </Card>

      {/* 13 · current vs pilot vs future, moved here from Overview */}
      <Card className="mb-6">
        <CardHead accent="bg-teal-600" eyebrow="Boundary" title="What exists today, and what would have to be built" />
        <div className="grid grid-cols-1 gap-3 p-5 lg:grid-cols-3">
          {Object.values(BOUNDARY).map((b) => (
            <div
              key={b.title}
              className={cx(
                "rounded-xl border p-4",
                b.tone === "teal" ? "border-teal-200 bg-teal-50" : b.tone === "amber" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"
              )}
            >
              <div className={cx("font-mono text-xs uppercase tracking-wider", b.tone === "teal" ? "text-teal-700" : b.tone === "amber" ? "text-amber-700" : "text-slate-500")}>
                {b.title}
              </div>
              <ul className="mt-2 space-y-1">
                {b.items.map((i) => (
                  <li key={i} className={cx("flex gap-1.5 text-sm leading-snug", b.tone === "teal" ? "text-teal-900" : b.tone === "amber" ? "text-amber-900" : "text-slate-600")}>
                    <span className="shrink-0">{b.tone === "teal" ? "✓" : "•"}</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Only the first column exists today.</div>
      </Card>

      {/* references drawer */}
      <Card className="mb-6">
        <button
          onClick={() => setRefsOpen((v) => !v)}
          aria-expanded={refsOpen}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50"
        >
          <span>
            <Eyebrow>Reference</Eyebrow>
            <span className="mt-0.5 block font-serif text-lg text-slate-900">Clinical &amp; interoperability references</span>
          </span>
          <ChevronDown size={16} className={cx("shrink-0 text-slate-400 transition-transform", refsOpen && "rotate-180")} />
        </button>
        {refsOpen && (
          <div className="border-t border-slate-100 px-5 py-4">
            <ul className="space-y-1.5">
              {REFERENCES.map(([label, url]) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-teal-800 underline decoration-teal-300 underline-offset-2 hover:decoration-teal-700"
                  >
                    {label}
                    <ExternalLink size={12} className="shrink-0 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              These are listed as the standards and clinical-consensus sources behind the concepts shown. No prevalence,
              effectiveness or financial figures are drawn from them into this prototype.
            </p>
          </div>
        )}
      </Card>

      <Card>
        <CardHead accent="bg-indigo-500" eyebrow="Proposed pilot" title="What 6–12 months in one market could answer" />
        <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Can the cases be found reliably?", "Screen yield, confirmation rate, screening-exclusion reasons"],
            ["How many need a human?", "Routed cases per week and per 1,000 reports"],
            ["What is the operational burden?", "Reviewer time, backlog age, time to owner assignment"],
            ["Does follow-up progress?", "Evaluation initiated and completed, plan documented"],
            ["Where does the workflow fail?", "Screening-exclusion patterns, unreachable patients"],
            ["Could it scale?", "Effort per appropriately closed case, transfer to a second market"],
          ].map(([q, a]) => (
            <div key={q} className="bg-white px-5 py-4">
              <div className="text-sm font-medium text-slate-800">{q}</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-500">{a}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 border-dashed">
        <CardHead accent="bg-slate-300" eyebrow="Platform potential" title="Not built, not in scope for this pilot" />
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-600">
            The same accountable follow-up architecture could eventually support other documented incidental findings,
            each requiring its own clinical pathway, governance, and validation.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            None of these is built, and none appears in this prototype. The vertebral-fracture workflow is the product
            being demonstrated.
          </p>
        </div>
      </Card>
    </div>
  );
}
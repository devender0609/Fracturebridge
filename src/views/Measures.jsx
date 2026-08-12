import React from "react";
import { AlertTriangle, SearchCheck, Workflow, HeartPulse } from "lucide-react";
import { Card, CardHead, Eyebrow, Stat } from "../ui";

const sections = [
  {
    icon: SearchCheck,
    accent: "bg-violet-500",
    eyebrow: "Case finding",
    title: "Can we find the right cases?",
    metrics: [
      ["Reports screened", "12,500", "illustrative volume"],
      ["Potential cases", "24", "after report screening"],
      ["Confirmed after review", "—", "to be measured"],
      ["Screen exclusions", "—", "reasons reported"],
    ],
  },
  {
    icon: Workflow,
    accent: "bg-sky-500",
    eyebrow: "Operations",
    title: "Can the workflow operate?",
    metrics: [
      ["Needs review", "9", "illustrative open queue"],
      ["Owner assigned", "—", "to be measured"],
      ["Time to review", "—", "to be measured"],
      ["Reviewer burden", "—", "minutes per case"],
    ],
  },
  {
    icon: HeartPulse,
    accent: "bg-teal-600",
    eyebrow: "Care process",
    title: "Does follow-up improve?",
    metrics: [
      ["Patient contacted", "—", "to be measured"],
      ["Evaluation initiated", "—", "to be measured"],
      ["Evaluation completed", "—", "to be measured"],
      ["Care plan documented", "—", "to be measured"],
    ],
  },
];

export default function Measures(){
  return <div>
    <header className="mb-6">
      <Eyebrow>Proposed pilot measurement</Eyebrow>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Measure the workflow before claiming the outcome.</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">The prototype shows what a pilot would measure. Values shown as numbers are illustrative only; dashes are intentionally left unfilled until real pilot data exist.</p>
    </header>
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>Illustrative pilot dashboard.</strong> Demonstration values only — not Ascension performance data.</div>
    <div className="grid gap-6 lg:grid-cols-3">
      {sections.map(({icon:Icon,accent,eyebrow,title,metrics})=><Card key={title}>
        <CardHead accent={accent} eyebrow={eyebrow} title={title} right={<Icon size={18} className="text-slate-400"/>}/>
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">{metrics.map(([label,n,sub])=><Stat key={label} n={n} label={label} sub={sub}/>)}</div>
      </Card>)}
    </div>
    <Card className="mt-6">
      <CardHead accent="bg-slate-400" eyebrow="Longer-term outcomes" title="Important, but not expected to be proven in an initial pilot"/>
      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {["Secondary fractures","Fracture-related hospitalizations","Long-term utilization","Treatment persistence"].map(x=><div key={x} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">{x}</div>)}
      </div>
      <div className="flex gap-2 border-t border-slate-100 bg-amber-50 px-5 py-3 text-sm text-amber-900"><AlertTriangle size={16} className="mt-0.5 shrink-0"/><span>A proposed 6–12 month pilot should focus on case-finding performance, operational burden, and care-process completion. It should not claim that FractureBridge has already reduced future fractures.</span></div>
    </Card>
    <Card className="mt-6 p-5">
      <Eyebrow>Staffing question</Eyebrow>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">The pilot should measure weekly case volume and median reviewer time to determine staffing requirements before scale-up. The prototype does not assume that an existing team can absorb a particular volume.</p>
    </Card>
  </div>
}

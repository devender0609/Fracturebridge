import React from "react";
import { AlertTriangle, SearchCheck, Workflow, HeartPulse } from "lucide-react";
import { Card, CardHead, Eyebrow } from "../ui";

const sections = [
  {icon:SearchCheck,accent:"bg-violet-500",eyebrow:"Case finding",title:"Can we find the right cases?",metrics:["Reports screened","Potential cases identified","Human confirmation rate","Screen-exclusion reasons"]},
  {icon:Workflow,accent:"bg-sky-500",eyebrow:"Operations",title:"Can the workflow operate?",metrics:["Cases awaiting review","Owner assignment rate","Time to review","Reviewer effort"]},
  {icon:HeartPulse,accent:"bg-teal-600",eyebrow:"Care process",title:"Does follow-up improve?",metrics:["Patient contacted","Evaluation initiated","Evaluation completed","Care plan documented"]},
];

export default function Measures(){
  return <div>
    <header className="mb-6">
      <Eyebrow>Proposed pilot measurement</Eyebrow>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Measure the workflow before claiming the outcome.</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">This page shows what a pilot should measure. It intentionally does not display invented performance results.</p>
    </header>
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>Illustrative pilot framework.</strong> Metrics remain unfilled until real pilot data exist.</div>
    <div className="grid gap-6 lg:grid-cols-3">
      {sections.map(({icon:Icon,accent,eyebrow,title,metrics})=><Card key={title}>
        <CardHead accent={accent} eyebrow={eyebrow} title={title} right={<Icon size={18} className="text-slate-400"/>}/>
        <div className="divide-y divide-slate-100">{metrics.map(label=><div key={label} className="flex items-center justify-between gap-4 px-5 py-3"><span className="text-sm text-slate-700">{label}</span><span className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-slate-400">To measure</span></div>)}</div>
      </Card>)}
    </div>
    <Card className="mt-6">
      <CardHead accent="bg-slate-400" eyebrow="Longer-term outcomes" title="Important, but not an initial-pilot claim"/>
      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">{["Secondary fractures","Fracture-related hospitalizations","Long-term utilization","Treatment persistence"].map(x=><div key={x} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">{x}</div>)}</div>
      <div className="flex gap-2 border-t border-slate-100 bg-amber-50 px-5 py-3 text-sm text-amber-900"><AlertTriangle size={16} className="mt-0.5 shrink-0"/><span>A proposed 6–12 month pilot should first establish case-finding performance, operational burden, and care-process completion. It should not claim that FractureBridge has already reduced future fractures.</span></div>
    </Card>
  </div>;
}

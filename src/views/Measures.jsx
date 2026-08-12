import React from "react";
import { SearchCheck, Workflow, HeartPulse, AlertTriangle } from "lucide-react";
import { Card, Eyebrow } from "../ui";

const groups = [
  {icon:SearchCheck,title:"Case finding",question:"Can we find the right cases?",tone:"violet",items:["Reports screened","Potential cases identified","Human confirmation rate","Screen-exclusion reasons"]},
  {icon:Workflow,title:"Operations",question:"Can the workflow run reliably?",tone:"sky",items:["Cases awaiting review","Owner assignment rate","Time to review","Reviewer effort"]},
  {icon:HeartPulse,title:"Care process",question:"Does follow-up improve?",tone:"teal",items:["Patient contacted","Evaluation initiated","Evaluation completed","Care plan documented"]},
];
const toneMap={violet:"bg-violet-50 text-violet-700",sky:"bg-sky-50 text-sky-700",teal:"bg-teal-50 text-teal-700"};

export default function Measures(){
  return <div>
    <header className="mb-8 max-w-4xl"><Eyebrow>Analytics · proposed pilot</Eyebrow><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Measure the workflow before claiming the outcome.</h1><p className="mt-3 text-sm leading-7 text-slate-600">This prototype shows what a pilot should measure. It does not present real Ascension performance results.</p></header>
    <div className="mb-7 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900"><strong>Illustrative pilot framework.</strong> Values remain intentionally unfilled until real pilot data exist.</div>
    <div className="grid gap-6 lg:grid-cols-3">{groups.map(({icon:Icon,title,question,tone,items})=><Card key={title} className="p-6"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneMap[tone]}`}><Icon size={19}/></div><div className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</div><h2 className="mt-1 text-lg font-semibold text-slate-950">{question}</h2><ul className="mt-5 space-y-3">{items.map(x=><li key={x} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-sm text-slate-700 last:border-0 last:pb-0"><span>{x}</span><span className="text-xs text-slate-400">To measure</span></li>)}</ul></Card>)}</div>
    <Card className="mt-7 p-6"><Eyebrow>Longer-term outcomes</Eyebrow><div className="mt-3 flex items-start gap-3"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600"/><div><h2 className="text-lg font-semibold text-slate-950">Important, but not an initial-pilot claim</h2><p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">Secondary fractures, fracture-related hospitalizations, long-term utilization, and treatment persistence matter. A proposed 6–12 month pilot should first establish case-finding performance, operational burden, and care-process completion.</p></div></div></Card>
  </div>;
}

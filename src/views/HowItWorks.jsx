import React from "react";
import { Check, X, ShieldCheck, FileSearch, UserCheck, HeartHandshake } from "lucide-react";
import { cx } from "../data";
import { Eyebrow, Card, CardHead, AiTag, HumanTag } from "../ui";

const AI_DOES=[
  "Finds explicit or equivocal vertebral compression-fracture language in existing reports",
  "Checks connected demonstration sources for relevant follow-up evidence",
  "Summarizes what was found and what remains uncertain",
  "Drafts clinician and patient communication for human review",
];
const PEOPLE_DO=[
  "Confirm fracture context and whether the case is actionable",
  "Check outside care or documentation the system may not see",
  "Assign an accountable owner and decide the next step",
  "Approve outreach and determine when the case is appropriately closed",
];
const LIMITS=["Diagnose osteoporosis","Order tests or referrals","Prescribe or recommend a specific drug","Send patient communication without approval","Predict who will fracture next"];
const STEPS=[
  {icon:FileSearch,title:"Find & check",who:"AI support",text:"Screen report text, extract the finding, and check connected data for follow-up evidence.",tone:"violet"},
  {icon:UserCheck,title:"Review & own",who:"Human",text:"Confirm context, check what the system cannot see, assign ownership, and decide the next step.",tone:"teal"},
  {icon:HeartHandshake,title:"Engage & close",who:"Human",text:"Communicate with the clinician and patient, track follow-up, and keep the case visible until resolved.",tone:"emerald"},
];
const tone={violet:"border-violet-200 bg-violet-50 text-violet-900",teal:"border-teal-200 bg-teal-50 text-teal-900",emerald:"border-emerald-200 bg-emerald-50 text-emerald-900"};

export default function HowItWorks(){return <div>
  <header className="mb-6"><Eyebrow>Design, safety and governance</Eyebrow><h1 className="mt-2 max-w-4xl text-3xl font-semibold leading-tight text-slate-900">A simple handoff: AI finds the potential gap. A person owns it.</h1><p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">FractureBridge is intentionally bounded. It supports case finding and accountable follow-through; it does not replace clinical judgment.</p></header>

  <Card className="mb-6 p-5"><Eyebrow>From report to resolved case</Eyebrow><div className="mt-4 grid gap-3 md:grid-cols-3">{STEPS.map(({icon:Icon,title,who,text,tone:t})=><div key={title} className={cx("rounded-xl border p-4",tone[t])}><div className="flex items-center justify-between gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/70"><Icon size={18}/></div><span className="rounded-full border border-current/20 bg-white/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">{who}</span></div><h2 className="mt-3 text-base font-semibold">{title}</h2><p className="mt-1.5 text-sm leading-relaxed opacity-85">{text}</p></div>)}</div></Card>

  <div className="mb-6 grid gap-6 lg:grid-cols-2">
    <Card><CardHead accent="bg-violet-500" eyebrow="AI scope" title="What the AI supports" right={<AiTag>Verify</AiTag>}/><ul className="divide-y divide-slate-100">{AI_DOES.map(d=><li key={d} className="flex items-start gap-3 px-5 py-3 text-sm text-slate-700"><Check size={15} className="mt-0.5 shrink-0 text-violet-600"/>{d}</li>)}</ul></Card>
    <Card><CardHead accent="bg-teal-600" eyebrow="Human responsibility" title="What people decide" right={<HumanTag>Required</HumanTag>}/><ul className="divide-y divide-slate-100">{PEOPLE_DO.map(d=><li key={d} className="flex items-start gap-3 px-5 py-3 text-sm text-slate-700"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-teal-600"/>{d}</li>)}</ul></Card>
  </div>

  <div className="mb-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <Card><CardHead accent="bg-rose-400" eyebrow="Hard limits" title="What FractureBridge does not do"/><div className="grid gap-2 p-5 sm:grid-cols-2">{LIMITS.map(x=><div key={x} className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-slate-700"><X size={14} className="mt-0.5 shrink-0 text-rose-500"/>{x}</div>)}</div></Card>
    <Card><CardHead accent="bg-sky-500" eyebrow="Implementation" title="Conceptual integration only"/><div className="px-5 py-4 text-sm leading-relaxed text-slate-600">The prototype simulates radiology reports, orders, medications, referrals, notes, and patient messaging. No live EHR connection exists. Future integrations would be validated source by source.</div></Card>
  </div>

  <Card className="mb-6"><CardHead accent="bg-amber-500" eyebrow="Positioning" title="A complement to established fracture-prevention programs"/><div className="px-5 py-4 text-sm leading-relaxed text-slate-600">Fracture liaison services are established secondary-fracture prevention models. FractureBridge is designed to complement them by helping surface incidental vertebral-fracture cases, verify whether follow-up is already visible, assign ownership, and track the loop to resolution.</div></Card>

  <Card><CardHead accent="bg-indigo-500" eyebrow="Proposed pilot" title="What a 6–12 month pilot could answer"/><div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">{[
    ["Can the cases be found reliably?","Screen yield, confirmation rate, exclusion reasons"],
    ["How many need a human?","Routed cases per week and per 1,000 reports"],
    ["What is the operational burden?","Reviewer time, backlog age, owner assignment"],
    ["Does follow-up improve?","Evaluation initiation and completion"],
    ["Where does the workflow fail?","False-positive patterns, unreachable patients"],
    ["Could it scale?","Effort per appropriately closed case and transfer to another market"],
  ].map(([q,a])=><div key={q} className="bg-white px-5 py-4"><div className="text-sm font-medium text-slate-800">{q}</div><div className="mt-1 text-xs leading-relaxed text-slate-500">{a}</div></div>)}</div></Card>
</div>}

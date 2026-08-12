import React from "react";
import { Check, X, ShieldCheck, FileSearch, UserCheck, HeartHandshake, Database } from "lucide-react";
import { Card, Eyebrow, AiTag, HumanTag } from "../ui";

const aiDoes=["Finds explicit or equivocal vertebral compression-fracture language in existing reports","Checks connected data for relevant follow-up evidence","Summarizes what was found and what remains uncertain","Drafts clinician and patient communication for review"];
const humanDoes=["Confirms fracture context and whether the case is actionable","Checks outside care or documentation the system may not see","Assigns an accountable owner and decides the next step","Approves outreach and determines when the case is appropriately closed"];
const never=["Diagnose osteoporosis","Order tests or referrals","Prescribe or recommend a specific drug","Send patient communication without approval","Predict who will fracture next"];

export default function HowItWorks(){
  return <div>
    <header className="mb-8 max-w-4xl"><Eyebrow>Safety & design</Eyebrow><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">A simple handoff: AI finds the gap. A person owns it.</h1><p className="mt-3 text-sm leading-7 text-slate-600">The product is intentionally bounded. It supports case finding and workflow; it does not replace clinical judgment.</p></header>

    <Card className="mb-7 p-6"><Eyebrow>From report to resolved case</Eyebrow><div className="mt-5 grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm"><FileSearch size={19}/></div><AiTag>AI support</AiTag></div><h2 className="mt-4 text-lg font-semibold text-slate-950">Find & check</h2><p className="mt-2 text-sm leading-6 text-slate-600">Screen existing report text, extract the finding, and check the connected record for relevant follow-up evidence.</p></div>
      <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm"><UserCheck size={19}/></div><HumanTag>Human</HumanTag></div><h2 className="mt-4 text-lg font-semibold text-slate-950">Review & own</h2><p className="mt-2 text-sm leading-6 text-slate-600">Confirm context, check what the system cannot see, assign ownership, and decide what—if anything—should happen next.</p></div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm"><HeartHandshake size={19}/></div><HumanTag>Human</HumanTag></div><h2 className="mt-4 text-lg font-semibold text-slate-950">Engage & close</h2><p className="mt-2 text-sm leading-6 text-slate-600">Communicate with the clinician and patient, track follow-up, and keep the case visible until it is appropriately resolved.</p></div>
    </div></Card>

    <div className="mb-7 grid gap-6 lg:grid-cols-2">
      <Card className="p-6"><div className="flex items-center justify-between"><Eyebrow>AI scope</Eyebrow><AiTag>Verify</AiTag></div><h2 className="mt-2 text-xl font-semibold text-slate-950">What the AI supports</h2><ul className="mt-5 space-y-3">{aiDoes.map(x=><li key={x} className="flex gap-3 text-sm leading-6 text-slate-600"><Check size={16} className="mt-1 shrink-0 text-violet-600"/>{x}</li>)}</ul></Card>
      <Card className="p-6"><div className="flex items-center justify-between"><Eyebrow>Human responsibility</Eyebrow><HumanTag>Required</HumanTag></div><h2 className="mt-2 text-xl font-semibold text-slate-950">What people decide</h2><ul className="mt-5 space-y-3">{humanDoes.map(x=><li key={x} className="flex gap-3 text-sm leading-6 text-slate-600"><ShieldCheck size={16} className="mt-1 shrink-0 text-teal-600"/>{x}</li>)}</ul></Card>
    </div>

    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="p-6"><Eyebrow>Hard limits</Eyebrow><h2 className="mt-2 text-xl font-semibold text-slate-950">What FractureBridge does not do</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{never.map(x=><div key={x} className="flex items-start gap-2 rounded-xl bg-rose-50/70 px-3 py-3 text-sm text-slate-700"><X size={15} className="mt-0.5 shrink-0 text-rose-500"/>{x}</div>)}</div></Card>
      <Card className="p-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Database size={19}/></div><Eyebrow className="mt-4">Implementation</Eyebrow><h2 className="mt-1 text-xl font-semibold text-slate-950">Conceptual integration only</h2><p className="mt-3 text-sm leading-6 text-slate-600">The prototype simulates radiology reports, orders, medications, referrals, notes, and patient messaging. No live EHR connection exists. Future integrations would be validated source by source.</p></Card>
    </div>

    <Card className="mt-7 p-6"><Eyebrow>Positioning</Eyebrow><h2 className="mt-2 text-xl font-semibold text-slate-950">A complement to established fracture-prevention programs</h2><p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">Fracture liaison services are established secondary-fracture prevention models. FractureBridge is designed to complement them by helping surface incidental vertebral-fracture cases, verify whether follow-up is already visible, assign ownership, and track the loop to resolution.</p></Card>
  </div>;
}

import React, { useState } from "react";
import { ChevronRight, Info } from "lucide-react";
import { cx, STAGE_STYLE } from "../data";
import { Eyebrow, Card, StatusChip } from "../ui";

const FILTERS = [
  ["active", "Open"], ["review", "Needs review"], ["unassigned", "Unassigned"], ["aging", "Aging >30d"], ["closed", "Closed"]
];
const GROUPS = {
  active: (c) => ["review", "owned", "contacted", "arranged", "documented"].includes(c.stage),
  review: (c) => c.stage === "review",
  unassigned: (c) => ["review", "owned"].includes(c.stage) && !c.owner,
  aging: (c) => c.days > 30 && ["review", "owned"].includes(c.stage),
  closed: (c) => ["closed", "verified", "excluded"].includes(c.stage),
};

function Worklist({ cases, onOpen }) {
  const [filter, setFilter] = useState("active");
  const shown = cases.filter(GROUPS[filter]);
  const count = (k) => cases.filter(GROUPS[k]).length;
  const kpis = [
    ["Needs review", count("review"), "text-amber-700", "bg-amber-50"],
    ["Unassigned", count("unassigned"), "text-slate-800", "bg-slate-100"],
    ["In progress", cases.filter((c)=>["owned","contacted","arranged","documented"].includes(c.stage)).length, "text-sky-700", "bg-sky-50"],
    ["Aging >30 days", count("aging"), "text-rose-700", "bg-rose-50"],
  ];
  return <div>
    <header className="mb-5">
      <Eyebrow>Operational worklist</Eyebrow>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Cases requiring human review or follow-up</h1>
      <p className="mt-2 text-sm text-slate-600">Action-first view: who needs attention, how long the case has been open, and who owns the next step.</p>
    </header>
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900"><strong>Illustrative pilot data.</strong> Fictional patients and demonstration workflow only.</div>
    <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
      {kpis.map(([label,n,tone,bg]) => <Card key={label} className={cx("p-4", bg)}><div className={cx("text-2xl font-semibold", tone)}>{n}</div><div className="mt-1 text-sm font-medium text-slate-700">{label}</div></Card>)}
    </div>
    <div className="mb-3 flex flex-wrap gap-2">{FILTERS.map(([k,label])=><button key={k} onClick={()=>setFilter(k)} className={cx("rounded-full border px-3 py-1 text-sm", filter===k?"border-slate-900 bg-slate-900 text-white":"border-slate-300 bg-white text-slate-600 hover:bg-slate-50")}>{label} <span className="font-mono text-xs opacity-60">{count(k)}</span></button>)}</div>
    <Card>
      <div className="hidden items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-2 font-mono text-xs uppercase tracking-wider text-slate-400 sm:flex">
        <span className="w-1.5"/><span className="w-40">Patient</span><span className="min-w-0 flex-1">Finding / study</span><span className="w-24 text-right">Elapsed</span><span className="w-36">Follow-up evidence</span><span className="w-32">Owner</span><span className="w-36">Status</span><span className="w-4"/>
      </div>
      <div className="divide-y divide-slate-100">{shown.map(c=>{
        const s=STAGE_STYLE[c.stage]; const none=c.followUp.filter(f=>f.status==="none").length; const aging=c.days>30&&["review","owned"].includes(c.stage);
        return <button key={c.id} onClick={()=>onOpen(c.id)} className="group flex w-full items-center gap-4 px-5 py-3.5 text-left hover:bg-slate-50">
          <span className={cx("h-10 w-1.5 rounded-full",s.bar)}/><div className="w-40 shrink-0"><div className="truncate font-medium text-slate-900">{c.name}</div><div className="font-mono text-xs text-slate-400">{c.age}{c.sex} · {c.level}</div></div>
          <div className="min-w-0 flex-1"><div className="truncate text-sm text-slate-700">{c.finding}</div><div className="truncate font-mono text-xs text-slate-400">{c.exam}</div></div>
          <div className={cx("hidden w-24 text-right font-mono text-sm sm:block",aging?"font-medium text-rose-600":"text-slate-500")}>{c.days}d</div>
          <div className="hidden w-36 lg:block"><span className={cx("rounded px-2 py-1 text-xs",none?"bg-amber-50 text-amber-800":"bg-teal-50 text-teal-800")}>{none?"No evidence found":"Evidence present"}</span></div>
          <div className="hidden w-32 truncate text-xs text-slate-600 xl:block">{c.owner?c.owner.split(" —")[0]:"Unassigned"}</div>
          <span className="w-36"><StatusChip stage={c.stage}/></span><ChevronRight size={16} className="text-slate-300 group-hover:translate-x-0.5"/>
        </button>})}
        {shown.length===0&&<div className="px-5 py-12 text-center text-sm text-slate-500">Nothing in this queue.</div>}
      </div>
    </Card>
    <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500"><Info size={14} className="mt-0.5 shrink-0"/>Operational prioritization is a prototype rule set, not a validated clinical fracture-risk score. Human review is required.</p>
  </div>
}
export default Worklist;

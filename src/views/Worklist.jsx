import React, { useMemo, useState } from "react";
import { ChevronRight, Info } from "lucide-react";
import { cx, STAGE_STYLE } from "../data";
import { Eyebrow, Card, StatusChip } from "../ui";

const FILTERS = [["active","Open"],["review","Needs review"],["unassigned","Unassigned"],["aging","Aging >30d"],["closed","Closed"]];
const GROUPS = {
  active:c=>["review","owned","contacted","arranged","documented"].includes(c.stage),
  review:c=>c.stage==="review",
  unassigned:c=>["review","owned"].includes(c.stage)&&!c.owner,
  aging:c=>c.days>30&&["review","owned"].includes(c.stage),
  closed:c=>["closed","verified","excluded"].includes(c.stage),
};

export default function Worklist({ cases, onOpen, role="Care coordinator" }) {
  const [filter,setFilter]=useState("active");
  const shown=useMemo(()=>cases.filter(GROUPS[filter]).sort((a,b)=>b.days-a.days),[cases,filter]);
  const count=k=>cases.filter(GROUPS[k]).length;
  const roleLine=role==="Clinician"?"Review the finding, context, and available evidence before deciding whether follow-up is appropriate.":role==="Quality leader"?"Operational view of cases; program measurement is summarized separately in Analytics.":"Focused queue for cases that need human review, ownership, or follow-up.";

  return <div>
    <header className="mb-5">
      <Eyebrow>Operational worklist · {role}</Eyebrow>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Cases requiring attention</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{roleLine}</p>
    </header>

    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>Illustrative pilot data.</strong> Fictional patients and demonstration workflow only.</div>

    <Card className="mb-5 p-4">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div><span className="text-2xl font-semibold text-slate-900">{count("active")}</span><span className="ml-2 text-sm text-slate-500">open</span></div>
        <div><span className="text-2xl font-semibold text-amber-700">{count("review")}</span><span className="ml-2 text-sm text-slate-500">need review</span></div>
        <div><span className="text-2xl font-semibold text-slate-800">{count("unassigned")}</span><span className="ml-2 text-sm text-slate-500">unassigned</span></div>
        <div><span className="text-2xl font-semibold text-rose-700">{count("aging")}</span><span className="ml-2 text-sm text-slate-500">aging &gt;30 days</span></div>
      </div>
    </Card>

    <div className="mb-3 flex flex-wrap gap-2">{FILTERS.map(([k,label])=><button key={k} onClick={()=>setFilter(k)} className={cx("rounded-full border px-3 py-1.5 text-sm",filter===k?"border-slate-900 bg-slate-900 text-white":"border-slate-300 bg-white text-slate-600 hover:bg-slate-50")}>{label} <span className="font-mono text-xs opacity-60">{count(k)}</span></button>)}</div>

    <Card>
      <div className="hidden items-center gap-5 border-b border-slate-200 bg-slate-50 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-400 md:grid md:grid-cols-[1.15fr_2.3fr_0.7fr_1.25fr_1fr_24px]">
        <span>Patient</span><span>Finding / study</span><span>Elapsed</span><span>Owner</span><span>Status</span><span/>
      </div>
      <div className="divide-y divide-slate-100">{shown.map(c=>{
        const s=STAGE_STYLE[c.stage]; const none=c.followUp?.some(f=>f.status==="none"); const aging=c.days>30&&["review","owned"].includes(c.stage);
        return <button key={c.id} onClick={()=>onOpen(c.id)} className="group grid w-full grid-cols-1 gap-3 px-5 py-4 text-left hover:bg-slate-50 md:grid-cols-[1.15fr_2.3fr_0.7fr_1.25fr_1fr_24px] md:items-center md:gap-5">
          <div className="flex min-w-0 items-start gap-3"><span className={cx("mt-0.5 h-10 w-1.5 shrink-0 rounded-full",s.bar)}/><div className="min-w-0"><div className="truncate font-medium text-slate-900">{c.name}</div><div className="mt-0.5 font-mono text-xs text-slate-400">{c.age} yrs · {c.id}</div></div></div>
          <div className="min-w-0"><div className="text-sm font-medium leading-5 text-slate-800">{c.finding}</div><div className="mt-1 truncate text-xs text-slate-500">{c.exam} · {c.reportDate}</div>{none&&<div className="mt-1.5 text-xs text-amber-700">No relevant follow-up evidence visible in connected demo sources</div>}</div>
          <div><div className={cx("font-mono text-sm",aging?"font-semibold text-rose-600":"text-slate-600")}>{c.days}d</div><div className="text-[11px] text-slate-400">since finding</div></div>
          <div className={cx("truncate text-sm",c.owner?"text-teal-800":"font-medium text-amber-700")}>{c.owner?c.owner.split(" —")[0]:"Unassigned"}</div>
          <div><StatusChip stage={c.stage}/></div>
          <ChevronRight size={16} className="hidden text-slate-300 transition-transform group-hover:translate-x-0.5 md:block"/>
        </button>})}
        {shown.length===0&&<div className="px-5 py-12 text-center text-sm text-slate-500">Nothing in this queue.</div>}
      </div>
    </Card>

    <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500"><Info size={14} className="mt-0.5 shrink-0"/>“No follow-up evidence found” means no relevant evidence was visible in the connected demonstration sources. It does not prove that care did not occur elsewhere. Human review is required.</p>
  </div>;
}

import React, { useMemo, useState } from "react";
import { ChevronRight, Info, Clock3, UserRoundPlus, LayoutList, Columns3 } from "lucide-react";
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

const escalation = (c) => {
  if (!["review", "owned"].includes(c.stage)) return null;
  if (!c.owner && c.days > 30) return { label: "Unassigned + aging", tone: "border-rose-200 bg-rose-50 text-rose-700" };
  if (!c.owner) return { label: "Needs owner", tone: "border-amber-200 bg-amber-50 text-amber-700" };
  if (c.days > 60) return { label: "Aging", tone: "border-rose-200 bg-rose-50 text-rose-700" };
  return null;
};

function Worklist({ cases, onOpen, role = "Care coordinator" }) {
  const [filter, setFilter] = useState("active");
  const [layout, setLayout] = useState("table");
  const shown = useMemo(() => cases.filter(GROUPS[filter]).sort((a,b)=>b.days-a.days), [cases, filter]);
  const count = (k) => cases.filter(GROUPS[k]).length;
  const kpis = [
    ["Needs review", count("review"), "text-amber-700", "bg-amber-50"],
    ["Unassigned", count("unassigned"), "text-slate-800", "bg-slate-100"],
    ["In progress", cases.filter((c)=>["owned","contacted","arranged","documented"].includes(c.stage)).length, "text-sky-700", "bg-sky-50"],
    ["Aging >30 days", count("aging"), "text-rose-700", "bg-rose-50"],
  ];
  const roleLine = role === "Clinician" ? "Clinical review queue: verify context and decide whether follow-up is appropriate." : role === "Quality leader" ? "Operational queue shown for context; program metrics live in Analytics." : "Action-first view: who needs attention, how long the case has been open, and who owns the next step.";

  return <div>
    <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <Eyebrow>Operational worklist · {role}</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Cases requiring human review or follow-up</h1>
        <p className="mt-2 text-sm text-slate-600">{roleLine}</p>
      </div>
      <div className="flex rounded-lg border border-slate-300 bg-white p-1 text-xs">
        <button onClick={()=>setLayout("table")} className={cx("flex items-center gap-1 rounded-md px-2.5 py-1.5",layout==="table"?"bg-slate-900 text-white":"text-slate-600")}><LayoutList size={14}/>Table</button>
        <button onClick={()=>setLayout("board")} className={cx("flex items-center gap-1 rounded-md px-2.5 py-1.5",layout==="board"?"bg-slate-900 text-white":"text-slate-600")}><Columns3 size={14}/>Board</button>
      </div>
    </header>
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900"><strong>Illustrative pilot data.</strong> Fictional patients and demonstration workflow only.</div>
    <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
      {kpis.map(([label,n,tone,bg]) => <Card key={label} className={cx("p-4", bg)}><div className={cx("text-2xl font-semibold", tone)}>{n}</div><div className="mt-1 text-sm font-medium text-slate-700">{label}</div></Card>)}
    </div>
    <div className="mb-3 flex flex-wrap gap-2">{FILTERS.map(([k,label])=><button key={k} onClick={()=>setFilter(k)} className={cx("rounded-full border px-3 py-1 text-sm", filter===k?"border-slate-900 bg-slate-900 text-white":"border-slate-300 bg-white text-slate-600 hover:bg-slate-50")}>{label} <span className="font-mono text-xs opacity-60">{count(k)}</span></button>)}</div>

    {layout === "table" ? <Card>
      <div className="hidden items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-2 font-mono text-xs uppercase tracking-wider text-slate-400 sm:flex">
        <span className="w-1.5"/><span className="w-40">Patient</span><span className="min-w-0 flex-1">Finding / study</span><span className="w-24 text-right">Elapsed</span><span className="w-40">Follow-up evidence</span><span className="w-40">Owner</span><span className="w-28">Status</span><span className="w-5"/>
      </div>
      <div className="divide-y divide-slate-100">
        {shown.map(c=>{const st=STAGE_STYLE[c.stage]||STAGE_STYLE.closed; const esc=escalation(c); return <button key={c.id} onClick={()=>onOpen(c.id)} className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 sm:gap-4 sm:px-5">
          <span className={cx("h-8 w-1.5 shrink-0 rounded-full",st.dot)}/>
          <div className="w-40 min-w-0"><div className="truncate text-sm font-semibold text-slate-900">{c.name}</div><div className="font-mono text-xs text-slate-400">{c.age} · {c.id}</div></div>
          <div className="min-w-0 flex-1"><div className="truncate text-sm text-slate-800">{c.finding}</div><div className="truncate text-xs text-slate-500">{c.exam} · {c.reportDate}</div>{esc&&<span className={cx("mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium",esc.tone)}>{esc.label}</span>}</div>
          <div className={cx("hidden w-24 text-right sm:block", c.days>60&&["review","owned"].includes(c.stage)?"text-rose-700":"text-slate-600")}><div className="text-sm font-semibold tabular-nums">{c.days}d</div><div className="text-xs text-slate-400">since finding</div></div>
          <div className="hidden w-40 text-xs text-slate-600 md:block">{["review","owned"].includes(c.stage)?"No relevant evidence found in connected record":"Follow-up underway or resolved"}</div>
          <div className="hidden w-40 lg:block"><div className={cx("truncate text-xs font-medium",c.owner?"text-teal-800":"text-amber-700")}>{c.owner?c.owner.split(" —")[0]:"Unassigned"}</div></div>
          <div className="hidden w-28 sm:block"><StatusChip stage={c.stage}/></div>
          <ChevronRight size={16} className="ml-auto shrink-0 text-slate-300"/>
        </button>})}
        {shown.length===0&&<div className="px-5 py-12 text-center text-sm text-slate-500">No cases in this view.</div>}
      </div>
      <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs leading-relaxed text-slate-600"><Info size={14} className="mt-0.5 shrink-0"/>“No follow-up evidence found” means the connected demonstration sources did not contain relevant evidence. It does not prove that care did not occur elsewhere.</div>
    </Card> : <div className="grid gap-4 md:grid-cols-3">
      {["review","owned","contacted"].map(stage=><Card key={stage} className="min-h-[260px]"><div className="border-b border-slate-100 bg-slate-50 px-4 py-3"><div className="text-sm font-semibold text-slate-800">{stage==="review"?"Needs review":stage==="owned"?"Owned":"Patient contacted"}</div><div className="text-xs text-slate-400">{shown.filter(c=>c.stage===stage).length} cases</div></div><div className="space-y-2 p-3">{shown.filter(c=>c.stage===stage).map(c=><button key={c.id} onClick={()=>onOpen(c.id)} className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-teal-300 hover:bg-teal-50/40"><div className="text-sm font-semibold text-slate-900">{c.name}</div><div className="mt-1 text-xs text-slate-600">{c.finding}</div><div className="mt-2 flex items-center justify-between"><span className="flex items-center gap-1 text-xs text-slate-500"><Clock3 size={12}/>{c.days}d</span><span className={cx("flex items-center gap-1 text-xs",c.owner?"text-teal-700":"text-amber-700")}><UserRoundPlus size={12}/>{c.owner?c.owner.split(" —")[0]:"Unassigned"}</span></div></button>)}</div></Card>)}
    </div>}
  </div>;
}

export default Worklist;

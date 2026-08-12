import React, { useMemo, useState } from "react";
import { ChevronRight, Info, Clock3, UserRound, LayoutList, Columns3 } from "lucide-react";
import { cx, STAGE_STYLE } from "../data";
import { Eyebrow, Card, StatusChip } from "../ui";

const FILTERS = [
  ["active", "Open"], ["review", "Needs review"], ["unassigned", "Unassigned"], ["aging", "Aging"], ["closed", "Closed"]
];
const GROUPS = {
  active: (c) => ["review", "owned", "contacted", "arranged", "documented"].includes(c.stage),
  review: (c) => c.stage === "review",
  unassigned: (c) => ["review", "owned"].includes(c.stage) && !c.owner,
  aging: (c) => c.days > 30 && ["review", "owned"].includes(c.stage),
  closed: (c) => ["closed", "verified", "excluded"].includes(c.stage),
};

const attention = (c) => {
  if (!["review", "owned"].includes(c.stage)) return null;
  if (!c.owner && c.days > 30) return { label: "Needs owner · aging", tone: "border-rose-200 bg-rose-50 text-rose-700" };
  if (!c.owner) return { label: "Needs owner", tone: "border-amber-200 bg-amber-50 text-amber-700" };
  if (c.days > 60) return { label: "Aging", tone: "border-rose-200 bg-rose-50 text-rose-700" };
  return null;
};

function Worklist({ cases, onOpen, role = "Care coordinator" }) {
  const [filter, setFilter] = useState("active");
  const [layout, setLayout] = useState("table");
  const shown = useMemo(() => cases.filter(GROUPS[filter]).sort((a, b) => b.days - a.days), [cases, filter]);
  const count = (k) => cases.filter(GROUPS[k]).length;
  const openCount = count("active");
  const unassigned = count("unassigned");
  const aging = count("aging");
  const roleLine = role === "Clinician"
    ? "Review the finding, confirm context, and decide whether follow-up is appropriate."
    : role === "Quality leader"
    ? "Operational view for context; pilot performance is summarized in Analytics."
    : "A focused queue showing who needs attention, how long the case has been open, and who owns the next step.";

  return <div>
    <header className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Eyebrow>Worklist · {role}</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Cases needing attention</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{roleLine}</p>
      </div>
      <div className="inline-flex w-fit rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        <button onClick={()=>setLayout("table")} className={cx("flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium", layout==="table"?"bg-slate-900 text-white":"text-slate-600 hover:bg-slate-50")}><LayoutList size={14}/>List</button>
        <button onClick={()=>setLayout("board")} className={cx("flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium", layout==="board"?"bg-slate-900 text-white":"text-slate-600 hover:bg-slate-50")}><Columns3 size={14}/>Board</button>
      </div>
    </header>

    <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div><span className="text-2xl font-semibold text-slate-950">{openCount}</span><span className="ml-2 text-sm text-slate-500">open</span></div>
      <div className="hidden h-7 w-px bg-slate-200 sm:block"/>
      <div><span className="text-2xl font-semibold text-amber-700">{unassigned}</span><span className="ml-2 text-sm text-slate-500">unassigned</span></div>
      <div className="hidden h-7 w-px bg-slate-200 sm:block"/>
      <div><span className="text-2xl font-semibold text-rose-700">{aging}</span><span className="ml-2 text-sm text-slate-500">aging &gt;30 days</span></div>
      <div className="ml-auto text-xs text-slate-400">Illustrative pilot data · fictional patients</div>
    </div>

    <div className="mb-4 flex flex-wrap gap-2">
      {FILTERS.map(([k,label])=><button key={k} onClick={()=>setFilter(k)} className={cx("rounded-full border px-3.5 py-1.5 text-sm transition", filter===k?"border-teal-700 bg-teal-700 text-white shadow-sm":"border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50")}>{label}<span className="ml-1.5 text-xs opacity-70">{count(k)}</span></button>)}
    </div>

    {layout === "table" ? <Card className="overflow-visible">
      <div className="hidden grid-cols-[minmax(150px,1.05fr)_minmax(250px,2fr)_110px_minmax(150px,1fr)_130px_24px] gap-5 border-b border-slate-100 bg-slate-50/80 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 lg:grid">
        <span>Patient</span><span>Finding</span><span>Elapsed</span><span>Owner</span><span>Status</span><span/>
      </div>
      <div className="divide-y divide-slate-100">
        {shown.map(c=>{const st=STAGE_STYLE[c.stage]||STAGE_STYLE.closed; const att=attention(c); return <button key={c.id} onClick={()=>onOpen(c.id)} className="group grid w-full gap-3 px-5 py-5 text-left transition hover:bg-slate-50/80 lg:grid-cols-[minmax(150px,1.05fr)_minmax(250px,2fr)_110px_minmax(150px,1fr)_130px_24px] lg:items-center lg:gap-5 lg:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className={cx("mt-1 h-9 w-1 shrink-0 rounded-full",st.dot)}/>
            <div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-950">{c.name}</div><div className="mt-0.5 text-xs text-slate-400">{c.age} yrs · {c.id}</div></div>
          </div>
          <div className="min-w-0 pl-4 lg:pl-0">
            <div className="text-sm font-medium leading-snug text-slate-800">{c.finding}</div>
            <div className="mt-1 truncate text-xs text-slate-500">{c.exam} · {c.reportDate}</div>
            {att&&<span className={cx("mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium",att.tone)}>{att.label}</span>}
          </div>
          <div className={cx("pl-4 lg:pl-0", c.days>60&&["review","owned"].includes(c.stage)?"text-rose-700":"text-slate-700")}><div className="text-sm font-semibold tabular-nums">{c.days} days</div><div className="text-xs text-slate-400">since finding</div></div>
          <div className="pl-4 lg:pl-0"><div className={cx("flex items-center gap-1.5 text-sm font-medium",c.owner?"text-teal-800":"text-amber-700")}><UserRound size={13}/><span className="truncate">{c.owner?c.owner.split(" —")[0]:"Unassigned"}</span></div></div>
          <div className="pl-4 lg:pl-0"><StatusChip stage={c.stage}/></div>
          <ChevronRight size={17} className="hidden text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500 lg:block"/>
        </button>})}
        {shown.length===0&&<div className="px-6 py-14 text-center text-sm text-slate-500">No cases in this view.</div>}
      </div>
      <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-3 text-xs leading-relaxed text-slate-500"><Info size={14} className="mt-0.5 shrink-0"/>“No follow-up evidence found” means no relevant evidence was found in connected demonstration sources; it does not prove care did not occur elsewhere.</div>
    </Card> : <div className="grid gap-5 lg:grid-cols-3">
      {["review","owned","contacted"].map(stage=>{
        const items=shown.filter(c=>c.stage===stage);
        return <Card key={stage} className="min-h-[280px]"><div className="border-b border-slate-100 px-5 py-4"><div className="text-sm font-semibold text-slate-900">{stage==="review"?"Needs review":stage==="owned"?"Owned":"Patient contacted"}</div><div className="mt-0.5 text-xs text-slate-400">{items.length} cases</div></div><div className="space-y-3 p-4">{items.map(c=><button key={c.id} onClick={()=>onOpen(c.id)} className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-300 hover:shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-semibold text-slate-950">{c.name}</div><div className="mt-1 text-xs leading-relaxed text-slate-600">{c.finding}</div></div><ChevronRight size={15} className="shrink-0 text-slate-300"/></div><div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs"><span className="flex items-center gap-1 text-slate-500"><Clock3 size={12}/>{c.days} days</span><span className={c.owner?"text-teal-700":"text-amber-700"}>{c.owner?c.owner.split(" —")[0]:"Unassigned"}</span></div></button>)}{items.length===0&&<div className="py-10 text-center text-xs text-slate-400">No cases</div>}</div></Card>
      })}
    </div>}
  </div>;
}

export default Worklist;

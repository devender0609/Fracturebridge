import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check, X, AlertTriangle, UserCheck, Lock, ChevronDown, Database, Clock3, UserRound, ShieldCheck, FileText, MessageSquare, History } from "lucide-react";
import { cx, TEAM, EXCLUSION_REASONS, STAGE_STYLE } from "../data";
import { Eyebrow, Card, AiTag, HumanTag, StatusChip, Bridge } from "../ui";

const stamp = () => {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const EvidenceRow = ({ f }) => (
  <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
    <span className={cx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", f.status === "found" ? "border-teal-600 bg-teal-600 text-white" : f.status === "partial" ? "border-slate-300 bg-white text-slate-400" : "border-amber-300 bg-amber-50 text-amber-600")}>
      {f.status === "found" ? <Check size={12} strokeWidth={3}/> : f.status === "partial" ? <span className="text-xs">~</span> : <X size={12} strokeWidth={3}/>} 
    </span>
    <div className="min-w-0 flex-1">
      <div className="text-sm font-medium text-slate-800">{f.label}</div>
      <div className="mt-0.5 text-xs leading-5 text-slate-500">{f.note}</div>
      <div className="mt-1 text-[11px] text-slate-400">{f.source} · {f.lookback}</div>
    </div>
  </div>
);

function CaseDetail({ c, onBack, update, notify, onStep, position, role = "Care coordinator" }) {
  const [letter, setLetter] = useState(c.letter);
  const [editing, setEditing] = useState(false);
  const [assignTo, setAssignTo] = useState(TEAM[0]);
  const [excludeOpen, setExcludeOpen] = useState(false);
  const [fullReport, setFullReport] = useState(false);

  const act = (patch, entry, message) => {
    update(c.id, (old) => ({ ...old, ...patch, audit: [...old.audit, { ts: stamp(), actor: entry.actor, text: entry.text }] }));
    if (message && notify) notify(message);
  };

  const empty = c.followUp.filter((f) => f.status === "none").length;
  const visible = fullReport ? c.report : c.report.filter((l) => l.hl || l.head);
  const operationalAlert = ["review","owned"].includes(c.stage) && c.days > 30;
  const sourcesChecked = [...new Set(c.followUp.map(f=>f.source))];
  const groups = [
    { title:"Existing bone-health management", items:c.followUp.filter(f=>/pharmacotherapy|assessment|FLS|Endocrinology/i.test(f.label)) },
    { title:"Follow-up underway", items:c.followUp.filter(f=>/DXA \/ BMD result|DXA order|clinical review/i.test(f.label)) },
    { title:"Risk / context signals", items:c.followUp.filter(f=>/Prior fracture|Glucocorticoid|Calcium|vitamin/i.test(f.label)) },
  ].filter(g=>g.items.length);

  const Primary = ({ children, ...p }) => <button {...p} className="w-full rounded-xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">{children}</button>;

  return <div>
    <div className="mb-6 flex items-center justify-between">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={15}/>Worklist</button>
      <div className="flex items-center gap-2"><span className="text-xs text-slate-400">{position}</span><button onClick={()=>onStep(-1)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"><ChevronLeft size={15}/></button><button onClick={()=>onStep(1)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"><ChevronRight size={15}/></button></div>
    </div>

    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><Eyebrow>{c.id} · fictional patient</Eyebrow><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{c.name}</h1><p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{c.age}-year-old {c.sex === "F" ? "woman" : "man"}. <strong className="font-medium text-slate-800">{c.finding}</strong> documented on {c.reportDate} during {c.exam.toLowerCase()} for {c.indication.toLowerCase()}.</p></div>
      <div className="flex items-center gap-2"><StatusChip stage={c.stage}/></div>
    </header>

    <Card className="mb-7">
      <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-6 py-5"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><Clock3 size={14}/>Elapsed</div><div className={cx("mt-2 text-2xl font-semibold",operationalAlert?"text-rose-700":"text-slate-950")}>{c.days} days</div><div className="mt-1 text-xs text-slate-500">Operational aging signal</div></div>
        <div className="px-6 py-5"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><Database size={14}/>Evidence</div><div className="mt-2 text-sm font-semibold text-slate-950">{["review","owned"].includes(c.stage)?"No relevant follow-up evidence found":"Follow-up underway or resolved"}</div><div className="mt-1 text-xs text-slate-500">Connected demonstration record only</div></div>
        <div className="px-6 py-5"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><UserRound size={14}/>Owner</div><div className={cx("mt-2 text-sm font-semibold",c.owner?"text-teal-800":"text-amber-700")}>{c.owner?c.owner.split(" —")[0]:"Unassigned"}</div><div className="mt-1 text-xs text-slate-500">{c.owner?"Named person accountable":"Human assignment required"}</div></div>
      </div>
    </Card>

    <div className="grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.8fr)]">
      <div className="space-y-6">
        <Card>
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5"><div><Eyebrow>Radiology source</Eyebrow><h2 className="mt-1 text-lg font-semibold text-slate-950">The finding already in the report</h2></div><AiTag>AI-highlighted</AiTag></div>
          <div className="space-y-2 px-6 py-5 font-mono text-sm leading-relaxed">{visible.map((line,i)=><p key={i} className={cx(line.head&&"pt-1 text-[11px] uppercase tracking-widest text-slate-400",line.hl&&"rounded-r-xl border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-slate-800",!line.head&&!line.hl&&"text-slate-600")}>{line.t}</p>)}</div>
          <div className="grid gap-px border-t border-slate-100 bg-slate-100 sm:grid-cols-4">{[["Level",c.level],["Chronicity",c.chronicity],["Extraction certainty",c.confidence],["Human verification",c.verify.length?"Required":"No issue noted"]].map(([k,v])=><div key={k} className="bg-white px-4 py-3"><div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{k}</div><div className="mt-1 text-sm text-slate-700">{v}</div></div>)}</div>
          <button onClick={()=>setFullReport(v=>!v)} className="flex w-full items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-3 text-left text-xs text-slate-600 hover:bg-slate-50"><span>Report text is the source of truth. Highlighting only.</span><span className="flex items-center gap-1 font-medium">{fullReport?"Hide full report":"View full report"}<ChevronDown size={14} className={cx("transition",fullReport&&"rotate-180")}/></span></button>
        </Card>

        {c.verify.length>0&&<Card className="p-6"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700"><AlertTriangle size={15}/>Human verification needed</div><ul className="mt-3 space-y-2">{c.verify.map(v=><li key={v} className="text-sm leading-6 text-slate-700">• {v}</li>)}</ul></Card>}

        <Card>
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5"><div><Eyebrow>Follow-up evidence</Eyebrow><h2 className="mt-1 text-lg font-semibold text-slate-950">What FractureBridge checked</h2></div><AiTag>AI check · verify</AiTag></div>
          <div className="divide-y divide-slate-100 px-6">{groups.map((g,i)=><details key={g.title} open={i===0} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4"><div><div className="text-sm font-semibold text-slate-900">{g.title}</div><div className="mt-0.5 text-xs text-slate-400">{g.items.length} sources / signals</div></div><ChevronDown size={16} className="text-slate-400 transition group-open:rotate-180"/></summary><div className="mt-4 divide-y divide-slate-100">{g.items.map(f=><EvidenceRow key={f.label} f={f}/>)}</div></details>)}</div>
          <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4"><div className="flex flex-wrap gap-2">{sourcesChecked.map(src=><span key={src} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500">{src}</span>)}</div><p className="mt-3 text-xs leading-5 text-slate-500">No evidence in connected sources does not prove care did not happen. Outside-system care and unavailable documentation require human confirmation.</p></div>
        </Card>

        <Card className="p-6"><div className="mb-4 flex items-center justify-between"><Eyebrow>Closed-loop progress</Eyebrow><span className="text-xs text-slate-400">Signature workflow</span></div><Bridge stage={c.stage} owner={c.owner}/></Card>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
        <Card className={cx("border-t-4",c.stage==="review"?"border-t-amber-500":"border-t-teal-600")}>
          <div className="border-b border-slate-100 px-6 py-5"><div className="flex items-center justify-between gap-3"><div><Eyebrow>Human decision</Eyebrow><h2 className="mt-1 text-xl font-semibold text-slate-950">What happens next?</h2></div><HumanTag>Human only</HumanTag></div></div>
          <div className="space-y-5 px-6 py-5">
            <div className="rounded-xl bg-teal-50/70 p-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700"><ShieldCheck size={14}/>Review checklist · {role}</div><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700"><li>1. Does the finding fit the clinical context?</li><li>2. Is care already happening elsewhere?</li><li>3. Is additional follow-up appropriate?</li></ul></div>

            {c.stage==="review"&&<><label className="block"><span className="text-xs font-semibold text-slate-500">Assign owner</span><select value={assignTo} onChange={e=>setAssignTo(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">{TEAM.map(t=><option key={t}>{t}</option>)}</select></label><Primary onClick={()=>act({stage:"owned",owner:assignTo},{actor:TEAM[0],text:`Potential care gap confirmed after chart review. Case assigned to ${assignTo}.`},`Assigned to ${assignTo.split(",")[0]}`)}>Confirm potential care gap & assign</Primary><div className="grid grid-cols-2 gap-2"><button onClick={()=>act({stage:"verified"},{actor:TEAM[0],text:"Reviewed: bone-health care already in place. Closed without outreach."},"Closed — already managed")} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">Already addressed</button><button onClick={()=>setExcludeOpen(v=>!v)} className={cx("rounded-xl border px-3 py-2.5 text-sm",excludeOpen?"border-slate-900 bg-slate-900 text-white":"border-slate-200 text-slate-700 hover:bg-slate-50")}>Not eligible</button></div>{excludeOpen&&<div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-xs font-semibold text-slate-500">Select a reason</div><div className="mt-2 space-y-1">{EXCLUSION_REASONS.map(r=><button key={r} onClick={()=>{setExcludeOpen(false);act({stage:"excluded",excludeReason:r},{actor:TEAM[0],text:`Excluded after review: ${r}. Reason recorded for screening-exclusion analysis.`},"Excluded — reason recorded")}} className="block w-full rounded-lg bg-white px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">{r}</button>)}</div></div>}</>}

            {c.stage==="owned"&&<p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Owner assigned. Review the communication drafts below, approve patient outreach when appropriate, and keep the case moving.</p>}
            {c.stage==="contacted"&&<Primary onClick={()=>act({stage:"arranged"},{actor:c.owner||TEAM[0],text:"Evaluation arranged: DXA ordered by the treating clinician."},"Evaluation arranged")}>Record evaluation arranged</Primary>}
            {c.stage==="arranged"&&<Primary onClick={()=>act({stage:"documented"},{actor:c.owner||TEAM[0],text:"Bone-health plan documented by the treating clinician."},"Plan documented")}>Record plan documented</Primary>}
            {c.stage==="documented"&&<Primary onClick={()=>act({stage:"closed"},{actor:c.owner||TEAM[0],text:"Loop closed: evaluation completed and plan documented."},"Loop closed")}>Close the loop</Primary>}
            {["closed","verified","excluded"].includes(c.stage)&&<p className="text-sm leading-6 text-slate-600">{c.stage==="closed"?"Loop closed. The case remains available for measurement and audit.":c.stage==="excluded"?`Not eligible: ${c.excludeReason}. Reason recorded.`:"Follow-up was verified as already addressed. No outreach was generated."}</p>}
          </div>
        </Card>

        {!['verified','excluded'].includes(c.stage)&&<details className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"><summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5"><div className="flex items-center gap-3"><MessageSquare size={18} className="text-sky-600"/><div><div className="text-sm font-semibold text-slate-950">Communication drafts</div><div className="mt-0.5 text-xs text-slate-400">Clinician + patient · human approval required</div></div></div><ChevronDown size={16} className="text-slate-400 transition group-open:rotate-180"/></summary><div className="border-t border-slate-100 px-6 py-5"><div className="mb-5"><div className="flex items-center justify-between"><div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Clinician message</div><AiTag>Draft · verify</AiTag></div><div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><strong>{c.finding}</strong> documented {c.days} days ago. No relevant bone-health follow-up evidence was identified in the connected demonstration record. Please verify fracture context, outside care, and whether additional follow-up is appropriate.</div></div><div className="border-t border-slate-100 pt-5"><div className="flex items-center justify-between"><div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Patient message</div>{c.letterApproved?<HumanTag>Approved & sent</HumanTag>:<AiTag>Draft · unsent</AiTag>}</div>{editing?<textarea value={letter} onChange={e=>setLetter(e.target.value)} rows={9} className="mt-3 w-full rounded-xl border border-slate-200 p-3 text-sm leading-6"/>:<div className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{letter}</div>}{!c.letterApproved&&<div className="mt-3 flex gap-2"><button onClick={()=>setEditing(v=>!v)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{editing?"Done":"Edit"}</button><button disabled={c.stage==='review'} onClick={()=>act({stage:'contacted',letterApproved:true,letter},{actor:c.owner||TEAM[0],text:'Patient letter reviewed and approved. Released to the portal and mail. Outreach call queued.'},'Letter approved and sent')} className="flex-1 rounded-xl bg-teal-800 px-3 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400">{c.stage==='review'?'Assign owner first':'Approve and send'}</button></div>}<div className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500"><Lock size={13} className="mt-0.5 shrink-0"/>Nothing is sent without human approval.</div></div></div></details>}

        <details className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"><summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5"><div className="flex items-center gap-3"><History size={18} className="text-slate-500"/><div><div className="text-sm font-semibold text-slate-950">Audit trail</div><div className="mt-0.5 text-xs text-slate-400">{c.audit.length} recorded events</div></div></div><ChevronDown size={16} className="text-slate-400 transition group-open:rotate-180"/></summary><ol className="border-t border-slate-100 px-6 py-5">{c.audit.map((a,i)=><li key={i} className="relative flex gap-3 pb-4 last:pb-0"><div className="flex flex-col items-center"><span className={cx("mt-1 h-2.5 w-2.5 shrink-0 rounded-full",a.ai?"bg-violet-500":"bg-teal-600")}/>{i<c.audit.length-1&&<span className="w-px flex-1 bg-slate-200"/>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs text-slate-400">{a.ts}</span><span className={cx("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",a.ai?"bg-violet-50 text-violet-700":"bg-teal-50 text-teal-800")}>{a.ai?"AI":"Human"}</span></div><div className="mt-1 text-sm leading-6 text-slate-700">{a.text}</div><div className="text-xs text-slate-400">{a.actor}</div></div></li>)}</ol></details>
      </aside>
    </div>
  </div>;
}

export default CaseDetail;

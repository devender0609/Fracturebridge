import React, { useState, useEffect, lazy, Suspense } from "react";
import { Home, Search, BarChart3, ShieldCheck, ChevronRight, ChevronLeft, Play, Check } from "lucide-react";
import { cx, CASES } from "./data";
import Overview from "./views/Overview";
import Worklist from "./views/Worklist";
import CaseDetail from "./views/CaseDetail";
const Measures = lazy(() => import("./views/Measures"));
import HowItWorks from "./views/HowItWorks";

const NAV = [
  { key: "overview", label: "Overview", icon: Home },
  { key: "worklist", label: "Worklist", icon: Search },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "safety", label: "Safety & design", icon: ShieldCheck },
];

const DEMO_STEPS = [
  { view: "overview", id: null, say: "FractureBridge starts after the fracture is already documented. It finds a potential follow-up gap and keeps it visible until a human resolves it." },
  { view: "case", id: "FB-04417", say: "Margaret had a CT for abdominal pain. The report also documents a chronic-appearing L1 compression deformity." },
  { view: "case", id: "FB-04417", say: "The connected demonstration record contains no relevant bone-health follow-up evidence. That is a review signal, not a conclusion." },
  { view: "case", id: "FB-04417", say: "A human reviewer confirms context, checks outside care, and assigns an accountable owner. AI does not make the clinical decision." },
  { view: "case", id: "FB-04417", say: "Patient-facing language is drafted for review and cannot be sent without human approval." },
  { view: "analytics", id: null, say: "The pilot measures case finding, operational burden, and follow-up completion. Longer-term fracture outcomes are explicitly separated." },
  { view: "safety", id: null, say: "The design boundary is simple: AI searches and summarizes; people decide, communicate, and close the loop." },
];

export default function FractureBridge() {
  const [view, setView] = useState("overview");
  const [cases, setCases] = useState(CASES);
  const [selected, setSelected] = useState(null);
  const [demo, setDemo] = useState(-1);
  const [toast, setToast] = useState(null);
  const [role, setRole] = useState("Care coordinator");

  useEffect(() => { if (!toast) return; const t=setTimeout(()=>setToast(null),3200); return()=>clearTimeout(t); }, [toast]);
  const open=(id)=>{ setSelected(id); setView("case"); window.scrollTo({top:0}); };
  const update=(id,fn)=>setCases(cs=>cs.map(c=>c.id===id?fn(c):c));
  const goDemo=(n)=>{ const step=DEMO_STEPS[n]; setDemo(n); if(step.id)setSelected(step.id); setView(step.view); window.scrollTo({top:0}); };
  const current=cases.find(c=>c.id===selected); const idx=current?cases.findIndex(c=>c.id===current.id):-1;
  const step=(d)=>open(cases[(idx+d+cases.length)%cases.length].id);
  const navView = view === "case" ? "worklist" : view;

  return <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-800">
    <nav className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <button onClick={()=>setView("overview")} className="border-b border-slate-100 px-5 py-5 text-left">
        <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-800 font-mono text-xs font-bold text-white">FB</div><div className="text-lg font-semibold text-slate-900">FractureBridge</div></div>
        <div className="mt-2 text-xs leading-snug text-slate-500">Accountable follow-up after a fracture is already found</div>
      </button>
      <div className="flex-1 py-3">{NAV.map(n=>{const Icon=n.icon; const active=navView===n.key; return <button key={n.key} onClick={()=>setView(n.key)} className={cx("flex w-full items-center gap-3 border-l-2 px-5 py-2.5 text-sm transition-colors",active?"border-teal-700 bg-teal-50 font-medium text-teal-900":"border-transparent text-slate-600 hover:bg-slate-50")}><Icon size={16}/>{n.label}</button>})}</div>
      <div className="border-t border-slate-100 p-4">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Demo role</label>
        <select value={role} onChange={(e)=>setRole(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700">
          {["Care coordinator","Clinician","Quality leader"].map(r=><option key={r}>{r}</option>)}
        </select>
        <button onClick={()=>demo>=0?setDemo(-1):goDemo(0)} className={cx("mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",demo>=0?"bg-slate-900 text-white":"border border-slate-300 text-slate-700 hover:bg-slate-50")}><Play size={13}/>{demo>=0?"Exit demo":"Guided demo"}</button>
        <div className="mt-3 text-[11px] leading-relaxed text-slate-400">Prototype · fictional patients · no EHR connection</div>
      </div>
    </nav>
    <main className="min-w-0 flex-1 pb-24">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:hidden"><div className="flex h-7 w-7 items-center justify-center rounded bg-teal-800 font-mono text-xs font-bold text-white">FB</div>{NAV.map(n=><button key={n.key} onClick={()=>setView(n.key)} className={cx("shrink-0 rounded-full border px-3 py-1 text-xs",navView===n.key?"border-teal-700 bg-teal-700 text-white":"border-slate-300 text-slate-600")}>{n.label}</button>)}</div>
      <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center font-mono text-xs uppercase tracking-widest text-amber-800">Demonstration prototype · fictional data · not connected to any clinical system</div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-7 lg:px-10">
        {view==="overview"&&<Overview cases={cases} onOpen={open} role={role}/>} 
        {view==="worklist"&&<Worklist cases={cases} onOpen={open} role={role}/>} 
        {view==="case"&&current&&<CaseDetail key={current.id} c={current} onBack={()=>setView("worklist")} update={update} notify={setToast} onStep={step} position={`${idx+1} of ${cases.length}`} role={role}/>} 
        {view==="case"&&!current&&<Worklist cases={cases} onOpen={open} role={role}/>} 
        {view==="analytics"&&<Suspense fallback={<div className="py-24 text-center text-sm text-slate-400">Loading analytics…</div>}><Measures/></Suspense>}
        {view==="safety"&&<HowItWorks/>}
      </div>
    </main>
    {toast&&<div className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"><Check size={15} className="text-emerald-400"/>{toast}</div>}
    {demo>=0&&<div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-800 bg-slate-900 px-4 py-3 text-white sm:px-6"><div className="mx-auto flex max-w-5xl items-center gap-3"><span className="hidden font-mono text-xs uppercase tracking-widest text-slate-400 sm:block">{demo+1} / {DEMO_STEPS.length}</span><p className="flex-1 text-sm leading-snug">{DEMO_STEPS[demo].say}</p><button onClick={()=>goDemo(Math.max(0,demo-1))} disabled={demo===0} className="rounded-lg border border-slate-700 p-1.5 text-slate-300 disabled:opacity-30"><ChevronLeft size={15}/></button>{demo<DEMO_STEPS.length-1?<button onClick={()=>goDemo(demo+1)} className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-900">Next <ChevronRight size={14}/></button>:<button onClick={()=>setDemo(-1)} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-900">Finish</button>}</div></div>}
  </div>;
}

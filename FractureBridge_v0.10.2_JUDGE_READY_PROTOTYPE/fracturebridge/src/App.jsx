import React, { useState, useEffect, lazy, Suspense } from "react";
import { Home, Search, BarChart3, ShieldCheck, ChevronRight, ChevronLeft, Play, Check, Stethoscope } from "lucide-react";
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
  { key: "safety", label: "How it works", icon: ShieldCheck },
];

const DEMO_STEPS = [
  { view: "overview", target: "headline", say: "The fracture was already found. The problem is that no one owns what happens next." },
  { view: "overview", target: "funnel", say: "Follow-up already visible → stand down. Relevant follow-up not found in configured sources → human review." },
  { view: "case", id: "FB-04417", target: null, say: "Margaret, 74. An incidental L1 compression deformity on a CT ordered for abdominal pain." },
  { view: "case", id: "FB-04417", target: "why", say: "Why this case is here: the report finding, the follow-up check, and what is needed now." },
  { view: "case", id: "FB-04417", target: "checked", say: "What the system checked — and the honest result: nothing visible is not proof that care did not occur." },
  { view: "case", id: "FB-04417", target: "decision", say: "The human decision: assign an owner, or document why the case should not continue." },
  { view: "analytics", target: null, say: "Analytics: what a pilot would measure. Simulated values appear only if you ask for them." },
  { view: "safety", target: null, say: "How it works: what the AI supports, what people decide, and how this could connect to an EHR one day. This is a proposed workflow; future EHR integration would require local technical, clinical, security, and governance review." },
];

export default function FractureBridge() {
  const [view, setView] = useState("overview");
  const [cases, setCases] = useState(CASES);
  const [selected, setSelected] = useState(null);
  const [demo, setDemo] = useState(-1);
  const [toast, setToast] = useState(null);
  const [role, setRole] = useState("Care coordinator");
  const roleFilter = role === "Clinician" ? "review" : role === "Quality leader" ? "active" : "unassigned";
  const chooseRole = (r) => {
    setRole(r);
    if (r === "Quality leader") setView("analytics");
    else if (view === "analytics") setView("worklist");
  };

  useEffect(() => { if (!toast) return; const t=setTimeout(()=>setToast(null),3200); return()=>clearTimeout(t); }, [toast]);
  const open=(id)=>{ setSelected(id); setView("case"); window.scrollTo({top:0}); };
  const update=(id,fn)=>setCases(cs=>cs.map(c=>c.id===id?fn(c):c));
  const goDemo=(n)=>{ const step=DEMO_STEPS[n]; setDemo(n); if(step.id)setSelected(step.id); setView(step.view); window.scrollTo({top:0}); };

  useEffect(() => {
    document.querySelectorAll("[data-demo]").forEach((el) => el.classList.remove("demo-spot"));
    if (demo < 0) return;
    const t = DEMO_STEPS[demo]?.target;
    if (!t) return;
    const id = setTimeout(() => {
      const el = document.querySelector(`[data-demo="${t}"]`);
      if (!el) return;
      el.classList.add("demo-spot");
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 90);
    return () => clearTimeout(id);
  }, [demo, view, selected]);
  const current=cases.find(c=>c.id===selected); const idx=current?cases.findIndex(c=>c.id===current.id):-1;
  const step=(d)=>open(cases[(idx+d+cases.length)%cases.length].id);
  const navView = view === "case" ? "worklist" : view;

  return <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-800">
    <nav className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <button onClick={()=>setView("overview")} className="border-b border-slate-100 px-5 py-5 text-left">
        <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-800 font-mono text-xs font-bold text-white">FB</div><div className="font-serif text-lg text-slate-900">FractureBridge</div></div>
        <div className="mt-2 text-xs leading-snug text-slate-500">Human-reviewed follow-up after a documented vertebral compression fracture</div>
      </button>
      <div className="flex-1 py-3">{NAV.map(n=>{const Icon=n.icon; const active=navView===n.key; return <button key={n.key} onClick={()=>setView(n.key)} className={cx("flex w-full items-center gap-3 border-l-2 px-5 py-2.5 text-sm transition-colors",active?"border-teal-700 bg-teal-50 font-medium text-teal-900":"border-transparent text-slate-600 hover:bg-slate-50")}><Icon size={16}/>{n.label}</button>})}</div>
      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500"><Stethoscope size={13}/>View as</div>
          <div className="mt-2 space-y-1">
            {[["Care coordinator","Who needs attention today?"],["Clinician","What needs my review?"],["Quality leader","Is the pathway working?"]].map(([r,q])=>(
              <button key={r} onClick={()=>chooseRole(r)} aria-pressed={role===r}
                className={cx("block w-full rounded-md px-2.5 py-1.5 text-left transition-colors", role===r?"bg-white shadow-sm ring-1 ring-slate-200":"hover:bg-white/60")}>
                <span className={cx("block text-xs font-medium", role===r?"text-slate-900":"text-slate-600")}>{r}</span>
                <span className="block text-xs leading-snug text-slate-400">{q}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-snug text-slate-500">Demo perspective only — not an authorization control.</p>
        </div>
        <button onClick={()=>demo>=0?setDemo(-1):goDemo(0)} className={cx("flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",demo>=0?"bg-slate-900 text-white":"border border-slate-300 text-slate-700 hover:bg-slate-50")}><Play size={13}/>{demo>=0?"Exit demo":"Guided demo"}</button>
        <div className="mt-3 font-mono text-xs leading-relaxed text-slate-400">Prototype · fictional patients · no EHR connection</div>
      </div>
    </nav>
    <main className="min-w-0 flex-1 pb-24">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:hidden"><div className="flex h-7 w-7 items-center justify-center rounded bg-teal-800 font-mono text-xs font-bold text-white">FB</div>{NAV.map(n=><button key={n.key} onClick={()=>setView(n.key)} className={cx("shrink-0 rounded-full border px-3 py-1 text-xs",navView===n.key?"border-teal-700 bg-teal-700 text-white":"border-slate-300 text-slate-600")}>{n.label}</button>)}</div>
      <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center font-mono text-xs uppercase tracking-widest text-amber-800">Demonstration prototype · fictional data · not connected to any clinical system</div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {view==="overview"&&<Overview cases={cases} onOpen={open} onStartDemo={()=>goDemo(0)}/>} 
        {view==="worklist"&&<Worklist key={role} cases={cases} onOpen={open} role={role} initialFilter={roleFilter}/>} 
        {view==="case"&&current&&<CaseDetail key={current.id} c={current} onBack={()=>setView("worklist")} update={update} notify={setToast} onStep={step} position={`${idx+1} of ${cases.length}`} role={role}/>} 
        {view==="case"&&!current&&<Worklist key={role} cases={cases} onOpen={open} role={role} initialFilter={roleFilter}/>} 
        {view==="analytics"&&<Suspense fallback={<div className="py-24 text-center text-sm text-slate-400">Loading analytics…</div>}><Measures/></Suspense>}
        {view==="safety"&&<HowItWorks/>}
      </div>
    </main>
    {demo>=0 && DEMO_STEPS[demo].target && <div className="pointer-events-none fixed inset-0 z-20 bg-slate-900/20" />}
    {toast&&<div className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"><Check size={15} className="text-emerald-400"/>{toast}</div>}
    {demo>=0&&<div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-800 bg-slate-900 px-4 py-3 text-white sm:px-6"><div className="mx-auto flex max-w-5xl items-center gap-3"><span className="hidden font-mono text-xs uppercase tracking-widest text-slate-400 sm:block">{demo+1} / {DEMO_STEPS.length}</span><p className="flex-1 text-sm leading-snug">{DEMO_STEPS[demo].say}</p><button onClick={()=>goDemo(Math.max(0,demo-1))} disabled={demo===0} className="rounded-lg border border-slate-700 p-1.5 text-slate-300 disabled:opacity-30"><ChevronLeft size={15}/></button>{demo<DEMO_STEPS.length-1?<button onClick={()=>goDemo(demo+1)} className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-900">Next <ChevronRight size={14}/></button>:<button onClick={()=>{setDemo(-1); setView("worklist");}} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-900">Explore the prototype</button>}</div></div>}
  </div>;
}
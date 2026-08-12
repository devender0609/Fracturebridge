import React, { useState, useEffect, lazy, Suspense } from "react";
import { Search, Layers, BarChart3, ShieldCheck, ChevronRight, ChevronLeft, Play, Check } from "lucide-react";
import { cx, CASES } from "./data";
import Worklist from "./views/Worklist";
import CaseDetail from "./views/CaseDetail";
import LoopBoard from "./views/LoopBoard";
const Measures = lazy(() => import("./views/Measures"));
import HowItWorks from "./views/HowItWorks";

const NAV = [
  { key: "worklist", label: "Worklist", icon: Search },
  { key: "loop", label: "Loop board", icon: Layers },
  { key: "measures", label: "Measures", icon: BarChart3 },
  { key: "how", label: "How it works", icon: ShieldCheck },
];

const DEMO_STEPS = [
  { view: "worklist", id: null, say: "268 patients had a fracture in the report. 171 already had bone-health follow-up, so the system stood down. 97 did not." },
  { view: "case", id: "FB-04417", say: "A CT for abdominal pain. The fracture is in the impression — and nothing has referenced it for 102 days." },
  { view: "case", id: "FB-04417", say: "Nine follow-up sources, each with a lookback window. None returned evidence." },
  { view: "case", id: "FB-04417", say: "A nurse confirms the gap and takes ownership. Click Confirm care gap and assign — the AI stops here." },
  { view: "case", id: "FB-04417", say: "The letter is AI-drafted and cannot send itself. Approve it to release it." },
  { view: "loop", id: null, say: "Every case stays on the board with an owner and a clock, until the loop closes or is closed with a reason." },
  { view: "measures", id: null, say: "And the pilot measures whether follow-up actually improved — not whether fractures were prevented." },
];

export default function FractureBridge() {
  const [view, setView] = useState("worklist");
  const [cases, setCases] = useState(CASES);
  const [selected, setSelected] = useState(null);
  const [demo, setDemo] = useState(-1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const open = (id) => {
    setSelected(id);
    setView("case");
    window.scrollTo({ top: 0 });
  };

  const update = (id, fn) => setCases((cs) => cs.map((c) => (c.id === id ? fn(c) : c)));

  const goDemo = (n) => {
    const step = DEMO_STEPS[n];
    setDemo(n);
    if (step.id) setSelected(step.id);
    setView(step.view);
    window.scrollTo({ top: 0 });
  };

  const current = cases.find((c) => c.id === selected);
  const idx = current ? cases.findIndex((c) => c.id === current.id) : -1;
  const step = (d) => open(cases[(idx + d + cases.length) % cases.length].id);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-800">
      {/* rail */}
      <nav className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <button onClick={() => setView("worklist")} className="border-b border-slate-100 px-5 py-5 text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-800 font-mono text-xs font-bold text-white">FB</div>
            <div className="font-serif text-lg leading-none text-slate-900">FractureBridge</div>
          </div>
          <div className="mt-2 text-xs leading-snug text-slate-500">Closing the loop after a fracture is already found</div>
        </button>

        <div className="flex-1 py-3">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = view === n.key || (n.key === "worklist" && view === "case");
            return (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                className={cx(
                  "flex w-full items-center gap-3 px-5 py-2.5 text-sm transition-colors",
                  active
                    ? "border-l-2 border-teal-700 bg-teal-50 font-medium text-teal-900"
                    : "border-l-2 border-transparent text-slate-600 hover:bg-slate-50"
                )}
              >
                <Icon size={16} />
                {n.label}
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={() => (demo >= 0 ? setDemo(-1) : goDemo(0))}
            className={cx(
              "flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              demo >= 0 ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"
            )}
          >
            <Play size={13} />
            {demo >= 0 ? "Exit demo" : "Guided demo"}
          </button>
          <div className="mt-3 font-mono text-xs leading-relaxed text-slate-400">
            Prototype · fictional patients · no EHR connection
          </div>
        </div>
      </nav>

      {/* main */}
      <main className="min-w-0 flex-1 pb-24">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-teal-800 font-mono text-xs font-bold text-white">FB</div>
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              className={cx(
                "shrink-0 rounded-full border px-3 py-1 text-xs",
                view === n.key || (n.key === "worklist" && view === "case")
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 text-slate-600"
              )}
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={() => (demo >= 0 ? setDemo(-1) : goDemo(0))}
            className="shrink-0 rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600"
          >
            {demo >= 0 ? "Exit" : "Demo"}
          </button>
        </div>

        <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center font-mono text-xs uppercase tracking-widest text-amber-800">
          Demonstration prototype · fictional data · not connected to any clinical system
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {view === "worklist" && <Worklist cases={cases} onOpen={open} />}
          {view === "case" && current && (
            <CaseDetail
              key={current.id}
              c={current}
              onBack={() => setView("worklist")}
              update={update}
              notify={setToast}
              onStep={step}
              position={`${idx + 1} of ${cases.length}`}
            />
          )}
          {view === "case" && !current && <Worklist cases={cases} onOpen={open} />}
          {view === "loop" && <LoopBoard cases={cases} onOpen={open} />}
          {view === "measures" && (
            <Suspense fallback={<div className="py-24 text-center font-mono text-sm text-slate-400">Loading charts…</div>}>
              <Measures />
            </Suspense>
          )}
          {view === "how" && <HowItWorks />}
        </div>
      </main>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          <Check size={15} className="text-emerald-400" />
          {toast}
        </div>
      )}

      {/* demo bar */}
      {demo >= 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-800 bg-slate-900 px-4 py-3 text-white sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <span className="hidden font-mono text-xs uppercase tracking-widest text-slate-400 sm:block">
              {demo + 1} / {DEMO_STEPS.length}
            </span>
            <p className="flex-1 text-sm leading-snug">{DEMO_STEPS[demo].say}</p>
            <button
              onClick={() => goDemo(Math.max(0, demo - 1))}
              disabled={demo === 0}
              className="rounded-lg border border-slate-700 p-1.5 text-slate-300 disabled:opacity-30"
              aria-label="Previous step"
            >
              <ChevronLeft size={15} />
            </button>
            {demo < DEMO_STEPS.length - 1 ? (
              <button
                onClick={() => goDemo(demo + 1)}
                className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-900"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={() => setDemo(-1)} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-900">
                Finish
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

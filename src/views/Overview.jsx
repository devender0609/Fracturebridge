import React, { useState } from "react";
import { ArrowRight, Play, Search, ClipboardCheck, Share2, ChevronDown } from "lucide-react";
import { cx, SCREEN_FUNNEL, COVERAGE } from "../data";
import { Card, Eyebrow } from "../ui";

const STEPS = [
  { icon: Search, title: "Find", text: "Identify documented vertebral-fracture findings." },
  { icon: ClipboardCheck, title: "Check", text: "Look for relevant follow-up already visible." },
  { icon: Share2, title: "Route", text: "Send unresolved cases for human review." },
];

export default function Overview({ onOpen, onStartDemo }) {
  const { patients, standDown, routed } = COVERAGE;
  const [what, setWhat] = useState(false);

  return (
    <div>
      {/* 1 · problem */}
      <header className="mb-6" data-demo="headline">
        <Eyebrow>FractureBridge</Eyebrow>
        <h1 className="mt-2 max-w-4xl font-serif text-4xl leading-tight text-slate-900">
          The fracture was already found. <span className="text-teal-700">Make sure someone owns the next step.</span>
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
          FractureBridge identifies documented vertebral-fracture findings, checks whether relevant follow-up is already
          visible, and routes unresolved cases for human review.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={onStartDemo}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            <Play size={13} /> 60-second guided demo
          </button>
          <button
            onClick={() => onOpen("FB-04417")}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            Open example case
          </button>
          <span className="text-xs text-slate-500">New to FractureBridge? Start here.</span>
        </div>

        {/* 13 · the disclaimer, one click away */}
        <div className="mt-3">
          <button
            onClick={() => setWhat((v) => !v)}
            aria-expanded={what}
            className="inline-flex items-center gap-1 text-xs text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-slate-800"
          >
            What am I viewing?
            <ChevronDown size={13} className={cx("transition-transform", what && "rotate-180")} />
          </button>
          {what && (
            <p className="mt-2 max-w-3xl rounded-lg bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600">
              This is a demonstration prototype using fictional patients and simulated AI outputs. It is not connected to
              an EHR. What exists today, what a pilot would add, and what later integration would require are set out
              under How it works.
            </p>
          )}
        </div>
      </header>

      {/* 2 · what it does differently */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="relative rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Icon size={18} />
            </div>
            <div className="mt-3 font-serif text-xl text-slate-900">{title}</div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
            {i < STEPS.length - 1 && (
              <ArrowRight size={16} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-slate-300 md:block" />
            )}
          </div>
        ))}
      </div>

      {/* funnel */}
      <Card className="mb-6" data-demo="funnel">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
          <Eyebrow>Not every finding becomes a worklist case</Eyebrow>
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-amber-800">
            Illustrative six-month simulation — not Ascension performance data
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="border-b border-slate-100 p-5 lg:col-span-2 lg:border-b-0 lg:border-r">
            {SCREEN_FUNNEL.map((f, i) => (
              <div key={f.step} className={cx(i > 0 && "mt-3")}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className={cx("truncate text-xs", i === 3 ? "font-medium text-amber-700" : "text-slate-500")}>{f.step}</span>
                  <span className="shrink-0 font-mono text-sm tabular-nums text-slate-900">{f.n.toLocaleString()}</span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full" style={{ background: f.hex, width: `${i === 0 ? 100 : (f.n / SCREEN_FUNNEL[i - 1].n) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 lg:col-span-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-slate-800">{patients} patients with fracture language in the report</span>
              <span className="font-mono text-xs text-slate-400">{standDown} + {routed} = {patients}</span>
            </div>
            <div className="mt-3 flex h-16 overflow-hidden rounded-lg">
              <div className="flex items-center justify-center bg-teal-700 text-white" style={{ width: `${(standDown / patients) * 100}%` }}>
                <span className="font-serif text-2xl tabular-nums">{standDown}</span>
              </div>
              <div className="flex items-center justify-center bg-amber-500 text-white" style={{ width: `${(routed / patients) * 100}%` }}>
                <span className="font-serif text-2xl tabular-nums">{routed}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-teal-50 px-3 py-2.5">
                <div className="text-sm font-medium text-teal-900">Relevant follow-up found</div>
                <p className="mt-0.5 text-xs leading-relaxed text-teal-800">Stand down → no worklist case.</p>
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-2.5">
                <div className="text-sm font-medium text-amber-900">Relevant follow-up not found in configured sources</div>
                <p className="mt-0.5 text-xs leading-relaxed text-amber-800">Potential follow-up gap → human review.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3 · one example */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Eyebrow>See one example · fictional patient</Eyebrow>
          <span className="font-mono text-xs text-slate-400">FB-04417</span>
        </div>
        <h2 className="mt-2 font-serif text-2xl text-slate-900">Margaret Ellison · 74</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          CT abdomen/pelvis for abdominal pain. The report also documents an incidental chronic-appearing L1 compression
          deformity. No relevant follow-up found, and no one owns the case.
        </p>
        <button
          onClick={() => onOpen("FB-04417")}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-900"
        >
          Open the case <ArrowRight size={15} />
        </button>
      </Card>
    </div>
  );
}

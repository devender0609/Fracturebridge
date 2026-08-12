import React, { useState } from "react";
import { ChevronRight, Info } from "lucide-react";
import { cx, STAGE_STYLE, SCREEN_FUNNEL } from "../data";
import { Eyebrow, Card, StatusChip } from "../ui";

const FILTERS = [
  ["active", "Open cases"],
  ["review", "Needs review"],
  ["closed", "Closed"],
  ["verified", "Follow-up verified"],
  ["excluded", "Excluded"],
];

const GROUPS = {
  active: (c) => ["review", "owned", "contacted", "arranged", "documented"].includes(c.stage),
  review: (c) => c.stage === "review",
  closed: (c) => c.stage === "closed",
  verified: (c) => c.stage === "verified",
  excluded: (c) => c.stage === "excluded",
};

function Worklist({ cases, onOpen }) {
  const [filter, setFilter] = useState("active");
  const shown = cases.filter(GROUPS[filter]);
  const count = (k) => cases.filter(GROUPS[k]).length;

  const patients = 268;
  const covered = 171;
  const gaps = patients - covered;

  return (
    <div>
      <header className="mb-6">
        <Eyebrow>Fragility fracture care-gap program · Austin market</Eyebrow>
        <h1 className="mt-2 max-w-3xl font-serif text-4xl leading-tight text-slate-900">
          The fracture was already found.
          <span className="block text-slate-400">This is who owns what happens next.</span>
        </h1>
      </header>

      {/* the story in one card */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="border-b border-slate-100 p-5 lg:col-span-2 lg:border-b-0 lg:border-r">
            <Eyebrow>Six months, one market</Eyebrow>
            <div className="mt-3 space-y-3">
              {SCREEN_FUNNEL.map((f, i) => (
                <div key={f.step}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={cx("truncate text-xs", i === 3 ? "font-medium text-amber-700" : "text-slate-500")}>
                      {f.step}
                    </span>
                    <span className="shrink-0 font-mono text-sm tabular-nums text-slate-900">{f.n.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ background: f.hex, width: `${i === 0 ? 100 : (f.n / SCREEN_FUNNEL[i - 1].n) * 100}%` }}
                    />
                  </div>
                  <div className="mt-0.5 font-mono text-xs text-slate-400">
                    {i === 0 ? "all reports in the market" : `${((f.n / SCREEN_FUNNEL[i - 1].n) * 100).toFixed(i === 1 ? 1 : 0)}% of the step above`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 lg:col-span-3">
            <div className="flex items-baseline justify-between">
              <Eyebrow>Of 268 patients with a fracture in the report</Eyebrow>
              <span className="font-mono text-xs text-slate-400">follow-up check</span>
            </div>
            <div className="mt-3 flex h-14 overflow-hidden rounded-lg">
              <div className="flex items-center justify-center bg-teal-700 text-white" style={{ width: `${(covered / patients) * 100}%` }}>
                <span className="font-serif text-2xl tabular-nums">{covered}</span>
              </div>
              <div className="flex items-center justify-center bg-amber-500 text-white" style={{ width: `${(gaps / patients) * 100}%` }}>
                <span className="font-serif text-2xl tabular-nums">{gaps}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                  <span className="h-2 w-2 rounded-full bg-teal-700" /> Already had follow-up
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  No worklist entry created. The system stands down.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> No follow-up found
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Routed to a named human. 87% confirmed as real gaps after review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* queue */}
      <div className="mb-3 flex flex-wrap gap-2">
        {FILTERS.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cx(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              filter === k ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
            )}
          >
            {label} <span className="font-mono text-xs opacity-60">{count(k)}</span>
          </button>
        ))}
      </div>

      <Card>
        <div className="hidden items-center gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-400 sm:flex sm:px-5">
          <span className="w-1.5 shrink-0" />
          <span className="w-40 shrink-0">Patient</span>
          <span className="min-w-0 flex-1">Finding</span>
          <span className="w-28 shrink-0 text-right">Elapsed</span>
          <span className="hidden w-32 shrink-0 lg:block">Follow-up / owner</span>
          <span className="w-36 shrink-0">Status</span>
          <span className="w-4 shrink-0" />
        </div>
        <div className="divide-y divide-slate-100">
          {shown.map((c) => {
            const s = STAGE_STYLE[c.stage];
            const empties = c.followUp.filter((f) => f.status === "none").length;
            const aging = c.days > 90 && ["review", "owned"].includes(c.stage);
            return (
              <button
                key={c.id}
                onClick={() => onOpen(c.id)}
                className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 sm:px-5"
              >
                <span className={cx("h-9 w-1.5 shrink-0 rounded-full", s.bar)} />
                <div className="w-40 shrink-0">
                  <div className="truncate font-medium text-slate-900">{c.name}</div>
                  <div className="font-mono text-xs text-slate-400">
                    {c.age}{c.sex} · {c.level}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-slate-700">{c.finding}</div>
                  <div className="truncate font-mono text-xs text-slate-400">{c.exam}</div>
                </div>
                <div className="hidden w-28 shrink-0 text-right sm:block">
                  <span className={cx("font-mono text-sm tabular-nums", aging ? "font-medium text-rose-600" : "text-slate-500")}>
                    {c.days}d
                  </span>
                </div>
                <div className="hidden w-32 shrink-0 lg:block">
                  {c.stage === "review" ? (
                    <span className="rounded bg-amber-50 px-2 py-0.5 font-mono text-xs text-amber-700">
                      0 of {c.followUp.length} found
                    </span>
                  ) : (
                    <span className="block truncate text-xs text-slate-500">{c.owner ? c.owner.split(" —")[0] : "—"}</span>
                  )}
                </div>
                <span className="w-36 shrink-0"><StatusChip stage={c.stage} /></span>
                <ChevronRight size={16} className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
              </button>
            );
          })}
          {shown.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Nothing in this queue. New cases arrive after the overnight report run.
            </div>
          )}
        </div>
      </Card>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <Info size={14} className="mt-0.5 shrink-0" />
        Order is rule-based triage — age, prior fragility fracture, glucocorticoid exposure, time since report, and how
        explicit the report language is. It is not a predicted fracture risk.
      </p>
    </div>
  );
}

export default Worklist;

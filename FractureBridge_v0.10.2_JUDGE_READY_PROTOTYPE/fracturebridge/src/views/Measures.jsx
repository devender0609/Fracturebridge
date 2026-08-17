import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from "recharts";
import { AlertTriangle, FlaskConical, Ruler } from "lucide-react";
import {
  cx,
  TO_MEASURE,
  REVIEW_DISPOSITION,
  SCREENING_EXCLUSION_DATA,
  WEEKLY,
  WEEKLY_TOTALS,
  CASCADE,
  OUTREACH_SPLIT,
  PROCESS_DEFINITIONS,
  BOTTLENECK,
  EFFORT_MEASURES,
} from "../data";
import { Eyebrow, Card, CardHead } from "../ui";

const axis = { fontSize: 11, fontFamily: "ui-monospace, monospace", fill: "#94a3b8" };
const tip = { contentStyle: { borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, boxShadow: "0 4px 12px rgba(15,23,42,.08)" } };

const SimLabel = ({ children = "Simulated pilot scenario — not observed performance" }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-amber-800">
    <FlaskConical size={12} className="shrink-0" />
    {children}
  </span>
);

const Kpi = ({ value, label, sub, measured = false }) => (
  <div className="px-5 py-4">
    {measured ? (
      <div className="font-serif text-3xl leading-none tabular-nums text-slate-900">{value}</div>
    ) : (
      <div className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs uppercase tracking-wider text-slate-500">
        {value}
      </div>
    )}
    <div className="mt-1.5 text-sm font-medium leading-tight text-slate-700">{label}</div>
    {sub && <div className="mt-0.5 font-mono text-xs text-slate-400">{sub}</div>}
  </div>
);

/* In framework mode a chart is replaced by what it would show and how it
   would be defined. Simulated values appear only on request. */
const FrameworkPanel = ({ title, lines }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500">
      <Ruler size={13} /> {title}
    </div>
    <ul className="mt-2 space-y-1.5">
      {lines.map((l) => (
        <li key={l} className="flex gap-2 text-sm leading-relaxed text-slate-600">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
          {l}
        </li>
      ))}
    </ul>
  </div>
);

export default function Measures() {
  const [mode, setMode] = useState("framework");
  const sim = mode === "scenario";

  return (
    <div>
      <header className="mb-5">
        <Eyebrow>Proposed pilot measurement</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl text-slate-900">What a pilot would measure</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Four categories. The default view is the measurement framework: what would be counted and how it would be
          defined. The illustrative scenario shows simulated values so the charts can be seen — it contains no results.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
          {[
            ["framework", "Pilot measurement framework"],
            ["scenario", "Illustrative demo scenario"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              aria-pressed={mode === k}
              className={cx(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                mode === k ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {sim && <SimLabel>All values below are simulated</SimLabel>}
      </div>

      <div className="space-y-6">
        {/* 1 · case finding */}
        <Card>
          <CardHead accent="bg-violet-500" eyebrow="Case finding" title="Can we identify appropriate cases for review?" />
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-b border-slate-100 lg:grid-cols-4 lg:divide-y-0">
            <Kpi measured={sim} value={sim ? "12,480" : TO_MEASURE} label="Reports screened" sub={sim ? "simulated six-month scenario" : "per market, per period"} />
            <Kpi measured={sim} value={sim ? "268" : TO_MEASURE} label="Patients with fracture language" sub={sim ? "simulated scenario" : "unique patients"} />
            <Kpi value={TO_MEASURE} label="Actionable after review" sub="share of routed cases confirmed actionable" />
            <Kpi value={TO_MEASURE} label="Screening-exclusion rate" sub="family A only" />
          </div>

          <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <div className="px-5 py-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <Eyebrow>How routed cases were dispositioned</Eyebrow>
                {sim && <SimLabel />}
              </div>
              {sim ? (
                <>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={REVIEW_DISPOSITION} layout="vertical" margin={{ left: 8, right: 28 }}>
                        <XAxis type="number" tick={axis} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="label" width={150} tick={{ ...axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: "#f8fafc" }} {...tip} />
                        <Bar dataKey="n" name="cases" radius={[0, 4, 4, 0]} barSize={18} isAnimationActive={false}>
                          {REVIEW_DISPOSITION.map((d) => (
                            <Cell key={d.label} fill={d.hex} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">74 + 12 + 7 + 4 = 97 routed cases.</p>
                </>
              ) : (
                <FrameworkPanel
                  title="What would be counted"
                  lines={[
                    "Actionable after human review",
                    "Screening exclusion — family A only",
                    "Follow-up already addressed — the reviewer identified care that was not visible in the initial connected sources",
                    "Human-reviewed disposition — an appropriate outcome reached after review",
                  ]}
                />
              )}
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Follow-up already addressed means the reviewer identified care that was not visible in the initial
                connected sources. Human-reviewed dispositions are appropriate outcomes reached after review. Neither is
                a screening exclusion.
              </p>
            </div>

            <div className="px-5 py-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <Eyebrow>Screening exclusions only</Eyebrow>
                {sim && <SimLabel />}
              </div>
              {sim ? (
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SCREENING_EXCLUSION_DATA} layout="vertical" margin={{ left: 8, right: 28 }}>
                      <XAxis type="number" tick={axis} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="reason" width={130} tick={{ ...axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: "#f8fafc" }} {...tip} />
                      <Bar dataKey="n" name="cases" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={14} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <FrameworkPanel
                  title="Reasons that would be tracked"
                  lines={SCREENING_EXCLUSION_DATA.map((d) => d.reason)}
                />
              )}
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                These reasons are a case-finding refinement signal. Some exclusions are expected in a deliberately
                sensitive screen; the pattern over time is what matters.
              </p>
            </div>
          </div>
        </Card>

        {/* 15 · where open cases are waiting */}
        <Card>
          <CardHead accent="bg-indigo-500" eyebrow="Operations" title="Where are open cases waiting?" />
          <div className="px-5 py-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <Eyebrow>Open cases by stage</Eyebrow>
              {sim && <SimLabel>Illustrative scenario</SimLabel>}
            </div>
            {sim ? (
              <>
                <div className="flex h-4 overflow-hidden rounded-full">
                  {BOTTLENECK.map((b) => (
                    <div key={b.stage} style={{ background: b.hex, width: `${(b.n / 34) * 100}%` }} title={`${b.stage}: ${b.n}`} />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {BOTTLENECK.map((b) => (
                    <div key={b.stage} className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: b.hex }} />
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-600">{b.stage}</span>
                      <span className="font-mono text-sm tabular-nums text-slate-900">{b.n}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <FrameworkPanel
                title="Stages that would be counted"
                lines={BOTTLENECK.map((b) => b.stage)}
              />
            )}
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Case finding is only half the question. This view shows where follow-through stalls — whether cases wait on
              a reviewer, an owner, the patient, or documentation.
            </p>
          </div>
          <div className="border-t border-slate-100 px-5 py-4">
            <Eyebrow>Does this reduce manual case finding, or just add a worklist?</Eyebrow>
            <dl className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {EFFORT_MEASURES.map(([m, why]) => (
                <div key={m} className="border-b border-slate-100 py-2.5">
                  <dt className="flex items-start justify-between gap-3 text-sm font-medium text-slate-800">
                    <span>{m}</span>
                    <span className="shrink-0 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-xs uppercase tracking-wider text-slate-500">
                      {TO_MEASURE}
                    </span>
                  </dt>
                  <dd className="mt-0.5 text-xs leading-relaxed text-slate-500">{why}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              No time saved, FTE reduction or financial saving is claimed anywhere in this prototype. None has been
              measured.
            </p>
          </div>
        </Card>


        {/* 2 · operations */}
        <Card>
          <CardHead accent="bg-sky-500" eyebrow="Operations" title="Can a real team carry the workflow?" />
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-b border-slate-100 lg:grid-cols-4 lg:divide-y-0">
            <Kpi value={TO_MEASURE} label="Cases routed per week" sub="per market, per 1,000 reports" />
            <Kpi value={TO_MEASURE} label="Median time to human review" sub="from report signature" />
            <Kpi value={TO_MEASURE} label="Time to owner assignment" sub="from review" />
            <Kpi value={TO_MEASURE} label="Reviewer effort per case" sub="self-timed" />
          </div>
          <div className="px-5 py-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <Eyebrow>Cases routed and cases closed, by week</Eyebrow>
              {sim && <SimLabel>Simulated — 26 weeks, {WEEKLY_TOTALS.routed} routed</SimLabel>}
            </div>
            {sim ? (
              <>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={WEEKLY} margin={{ left: -20, right: 8, top: 8 }}>
                      <CartesianGrid stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="w" tick={axis} axisLine={false} tickLine={false} interval={3} />
                      <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip {...tip} />
                      <Line type="monotone" dataKey="routed" name="routed" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="closed" name="closed" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> routed ({WEEKLY_TOTALS.routed} over 26 weeks)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> closed ({WEEKLY_TOTALS.closed})</span>
                </div>
              </>
            ) : (
              <FrameworkPanel
                title="What this view would answer"
                lines={[
                  "Whether closure keeps pace with intake over the pilot period",
                  "Backlog age and the number of cases waiting on an owner",
                  "Whether the volume is carryable by the team actually doing the work — a pilot finding, not an assumption",
                ]}
              />
            )}
          </div>
        </Card>

        {/* 3 · care process */}
        <Card>
          <CardHead accent="bg-teal-500" eyebrow="Care process" title="Does follow-up move forward?" />
          <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <div className="px-5 py-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <Eyebrow>Care-process cascade</Eyebrow>
                {sim && <SimLabel />}
              </div>
              {sim ? (
                <>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CASCADE} layout="vertical" margin={{ left: 8, right: 28 }}>
                        <XAxis type="number" domain={[0, 80]} tick={axis} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="step" width={140} tick={{ ...axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: "#f8fafc" }} {...tip} />
                        <Bar dataKey="n" name="patients" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={false}>
                          {CASCADE.map((d) => (
                            <Cell key={d.step} fill={d.hex} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 rounded-lg border border-slate-200 px-3 py-2.5">
                    <Eyebrow>Of 71 outreach attempts — reported separately</Eyebrow>
                    <div className="mt-2 flex h-8 overflow-hidden rounded">
                      {OUTREACH_SPLIT.map((o) => (
                        <div
                          key={o.label}
                          className="flex items-center justify-center text-xs font-medium text-white"
                          style={{ background: o.hex, width: `${(o.n / 71) * 100}%` }}
                        >
                          {o.n}
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      55 reached, 16 outreach incomplete. An attempt that does not reach the patient is never counted as
                      patient contact, and outreach incomplete is an operational disposition, not a clinical outcome.
                    </p>
                  </div>
                </>
              ) : (
                <FrameworkPanel
                  title="Steps that would be counted"
                  lines={[
                    "Outreach attempted, reported separately from contact",
                    "Patient reached — delivered and acknowledged only",
                    "Outreach incomplete — operational, reported separately",
                    "Evaluation initiated, evaluation completed, documented outcome",
                  ]}
                />
              )}
            </div>

            <div className="px-5 py-4">
              <Eyebrow>Measurement definitions</Eyebrow>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Each step has a predefined pilot definition so an outreach attempt is never confused with a patient reached or an outcome completed.</p>
              <details className="mt-3 rounded-lg border border-slate-200 bg-slate-50">
                <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-teal-800">View definitions</summary>
                <dl className="divide-y divide-slate-200 border-t border-slate-200 px-3">
                  {PROCESS_DEFINITIONS.map(([step, def]) => (
                    <div key={step} className="py-2.5">
                      <dt className="text-sm font-medium text-slate-800">{step}</dt>
                      <dd className="mt-0.5 text-xs leading-relaxed text-slate-500">{def}</dd>
                    </div>
                  ))}
                </dl>
              </details>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Denominator: cases confirmed actionable after human review. Follow-up already addressed and
                human-reviewed dispositions are reported separately, never as failures.
              </p>
            </div>
          </div>
        </Card>

        {/* 4 · longer-term outcomes */}
        <Card>
          <CardHead accent="bg-slate-400" eyebrow="Longer-term outcomes" title="What would require a larger or longer evaluation?" />
          <div className="px-5 py-4">
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                An initial 6–12 month single-market pilot should be designed primarily around case-finding, operational
                and care-process outcomes. Reduction in subsequent fractures would generally require a larger and/or
                longer evaluation, and is not an initial-pilot claim.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                "Subsequent fragility fracture within 24 months",
                "Fracture-related admissions and length of stay",
                "Treatment persistence at 12 months",
                "Patient-reported understanding of the contact",
              ].map((x) => (
                <div key={x} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="text-sm text-slate-700">{x}</span>
                  <span className="shrink-0 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-slate-500">
                    Not yet measured
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

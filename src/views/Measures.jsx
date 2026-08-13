import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import { EXCLUSION_DATA, WEEKLY, CASCADE, BASELINE } from "../data";
import { Eyebrow, Card, CardHead, Stat } from "../ui";

const axis = { fontSize: 11, fontFamily: "ui-monospace, monospace", fill: "#94a3b8" };

const tip = {
  contentStyle: {
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 12,
    boxShadow: "0 4px 12px rgba(15,23,42,.08)",
  },
};

function Measures() {
  return (
    <div>
      <header className="mb-6">
        <Eyebrow>Proposed pilot measurement · illustrative demonstration</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl text-slate-900">What a pilot would actually be able to measure</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Four categories show how a pilot could evaluate case finding, operational feasibility, care-process follow-through, and longer-term outcomes. All numeric values on this demonstration page are illustrative only — not Ascension performance data.
        </p>
      </header>

      <div className="space-y-6">
        {/* 1 — case finding */}
        <Card>
          <CardHead accent="bg-violet-500" eyebrow="Category 1" title="Case finding — can it find the right patients?" />
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-b border-slate-100 lg:grid-cols-4 lg:divide-y-0">
            <Stat n="12,480" label="Reports screened" sub="CT, MR, radiograph" />
            <Stat n="268" label="Patients with fracture language" sub="2.1% of reports" />
            <Stat n="87%" label="Confirmed after human review" sub="84 of 97 routed" tone="text-teal-700" />
            <Stat n="13" label="False positives" sub="each with a stated reason" tone="text-amber-600" />
          </div>
          <div className="px-5 py-4">
            <Eyebrow>Why the 13 were excluded</Eyebrow>
            <div className="mt-3 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EXCLUSION_DATA} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <XAxis type="number" tick={axis} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="reason" width={150} tick={axis} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} {...tip} />
                  <Bar dataKey="n" name="cases" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-600">
            Human-reviewed exclusions are an important quality signal. A real pilot should track why cases are excluded and use those reasons to improve screening performance.
          </div>
        </Card>

        {/* 2 — operations */}
        <Card>
          <CardHead accent="bg-sky-500" eyebrow="Category 2" title="Operations — can a real team carry the volume?" />
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-b border-slate-100 lg:grid-cols-4 lg:divide-y-0">
            <Stat n="4/wk" label="New cases per week" sub="one market" />
            <Stat n="1.8 d" label="Median time to review" sub="from report signature" />
            <Stat n="6 d" label="Median time to patient contact" sub="from review" />
            <Stat n="14 min" label="Reviewer time per case" sub="median, self-timed" />
          </div>
          <div className="px-5 py-4">
            <Eyebrow>Cases found and cases closed, by week</Eyebrow>
            <div className="mt-3 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEEKLY} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="w" tick={axis} axisLine={false} tickLine={false} />
                  <YAxis tick={axis} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} />
                  <Line type="monotone" dataKey="found" name="found" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="closed" name="closed" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> found</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> closed</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              The found-versus-closed trend is illustrative. A real pilot should measure weekly case volume, backlog, median reviewer time, and time to closure before making any staffing assumptions.
            </p>
          </div>
        </Card>

        {/* 3 — care process */}
        <Card>
          <CardHead accent="bg-teal-500" eyebrow="Category 3" title="Care process — did follow-up actually change?" />
          <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <div className="px-5 py-4">
              <Eyebrow>Illustrative care-process cascade</Eyebrow>
              <div className="mt-3 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CASCADE} layout="vertical" margin={{ left: 8, right: 28 }}>
                    <XAxis type="number" domain={[0, 90]} tick={axis} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="step" width={170} tick={{ ...axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} {...tip} />
                    <Bar dataKey="n" name="patients" radius={[0, 4, 4, 0]} barSize={18} isAnimationActive={false}>
                      {CASCADE.map((d) => (
                        <Cell key={d.step} fill={d.hex} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="px-5 py-4">
              <Eyebrow>Illustrative follow-up within 6 months of the report</Eyebrow>
              <div className="mt-3 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BASELINE} margin={{ left: -20, top: 8 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="period" tick={axis} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} unit="%" tick={axis} axisLine={false} tickLine={false} />
                    <Tooltip {...tip} formatter={(v) => `${v}%`} />
                    <Bar dataKey="pct" name="follow-up" radius={[4, 4, 0, 0]} barSize={64} isAnimationActive={false}>
                      <Cell fill="#cbd5e1" />
                      <Cell fill="#0f766e" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-amber-700">
                Illustrative figures. Pre/post within one market with no concurrent control — a service-improvement
                signal, not a causal estimate. Replace with a real local denominator before this is shown as evidence.
              </p>
            </div>
          </div>
        </Card>

        {/* 4 — outcomes */}
        <Card>
          <CardHead accent="bg-slate-400" eyebrow="Category 4" title="Outcomes — the part a pilot cannot claim" />
          <div className="px-5 py-4">
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                A 6–12 month pilot should not claim that FractureBridge has reduced future fractures. These outcomes can be captured as baseline or exploratory measures and evaluated over longer follow-up and, if feasible, across larger populations.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                "Secondary fragility fracture within 24 months",
                "Fracture-related admissions and length of stay",
                "Treatment persistence at 12 months",
                "Patient-reported understanding of the contact",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Measures;

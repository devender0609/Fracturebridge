import React from "react";
import { Check } from "lucide-react";
import { cx, STAGES, STAGE_INDEX, STAGE_STYLE } from "./data";

/* ------------------------------ atoms ------------------------------ */

export const Eyebrow = ({ children, className }) => (
  <div className={cx("font-mono text-xs uppercase tracking-widest text-slate-400", className)}>
    {children}
  </div>
);

export const Card = ({ children, className }) => (
  <section className={cx("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
    {children}
  </section>
);

export const CardHead = ({ eyebrow, title, right, accent = "bg-slate-300" }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
    <div className="flex gap-3">
      <span className={cx("mt-1 h-8 w-1 shrink-0 rounded-full", accent)} />
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-0.5 text-lg font-semibold leading-snug text-slate-900">{title}</h3>
      </div>
    </div>
    {right && <div className="shrink-0">{right}</div>}
  </div>
);

export const AiTag = ({ children = "AI-generated · verify" }) => (
  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider text-violet-700">
    {children}
  </span>
);

export const HumanTag = ({ children }) => (
  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider text-teal-800">
    {children}
  </span>
);

export const StatusChip = ({ stage, className }) => {
  const s = STAGE_STYLE[stage] || STAGE_STYLE.closed;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        s.soft,
        s.text,
        s.ring,
        className
      )}
    >
      <span className={cx("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.name}
    </span>
  );
};

export const Stat = ({ n, label, sub, tone = "text-slate-900" }) => (
  <div className="px-5 py-4">
    <div className={cx("text-3xl font-semibold leading-none tabular-nums", tone)}>{n}</div>
    <div className="mt-1.5 text-sm font-medium leading-tight text-slate-700">{label}</div>
    {sub && <div className="mt-0.5 font-mono text-xs text-slate-400">{sub}</div>}
  </div>
);

/* A single-row proportional bar. Used for coverage, cascades, reasons. */
export const RowBar = ({ label, value, max, note, color = "bg-teal-600" }) => (
  <div className="px-5 py-2">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-slate-700">{label}</span>
      <span className="font-mono text-xs tabular-nums text-slate-500">{note}</span>
    </div>
    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={cx("h-full rounded-full", color)} style={{ width: `${Math.max(2, Math.round((value / max) * 100))}%` }} />
    </div>
  </div>
);

/* -------------------- signature element: the bridge ----------------- */
/* Seven piers. Each carries a named owner. The span that has not been  */
/* built yet is drawn as a gap, because that is the whole product.      */

export const Bridge = ({ stage, owner }) => {
  const done = STAGE_INDEX[stage] ?? 2;
  const isDead = stage === "excluded" || stage === "verified";
  const hue = STAGE_STYLE[stage] || STAGE_STYLE.closed;

  return (
    <div>
      <div className="flex min-w-full items-stretch overflow-x-auto pb-1">
        {STAGES.map((s, i) => {
          const complete = i < done;
          const current = i === done && !isDead;
          return (
            <div key={s.key} className="flex min-w-0 flex-1 flex-col" style={{ minWidth: 96 }}>
              <div className="flex items-center">
                <div
                  className={cx(
                    "h-0.5 flex-1",
                    i === 0 ? "bg-transparent" : complete ? "bg-teal-600" : "border-t-2 border-dashed border-slate-300"
                  )}
                />
                <div
                  className={cx(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs shadow-sm transition-colors",
                    complete
                      ? "border-teal-700 bg-teal-700 text-white"
                      : current
                      ? cx("border-2", hue.ring, hue.soft, hue.text)
                      : "border-slate-200 bg-white text-slate-300"
                  )}
                >
                  {complete ? <Check size={14} strokeWidth={3} /> : <span className="font-mono">{i + 1}</span>}
                </div>
                <div
                  className={cx(
                    "h-0.5 flex-1",
                    i === STAGES.length - 1 ? "bg-transparent" : complete && i + 1 < done ? "bg-teal-600" : "border-t-2 border-dashed border-slate-300"
                  )}
                />
              </div>
              <div className="px-1 pt-2 text-center">
                <div className={cx("text-xs font-medium leading-tight", complete ? "text-slate-800" : current ? hue.text : "text-slate-400")}>
                  {s.label}
                </div>
                <div className="mt-0.5 truncate font-mono text-xs leading-tight text-slate-400">
                  {current && owner ? owner.split(" —")[0] : current ? "unassigned" : s.by}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isDead && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
          {stage === "verified"
            ? "This patient never reached the worklist. Follow-up was already documented, so the check was logged and the system stood down."
            : "Closed with a reason before outreach. The span was never built, and the record says why."}
        </div>
      )}
    </div>
  );
};

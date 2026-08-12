import React from "react";
import { cx, LANES, STAGE_STYLE } from "../data";
import { Eyebrow, Card, StatusChip } from "../ui";

const initials = (owner) =>
  owner
    ? owner.split(" ").slice(0, 2).map((w) => w[0]).join("").replace(/[^A-Za-z]/g, "").toUpperCase()
    : "—";

function LoopBoard({ cases, onOpen }) {
  const side = cases.filter((c) => c.stage === "verified" || c.stage === "excluded");
  const live = cases.filter((c) => LANES.some((l) => l.key === c.stage));

  return (
    <div>
      <header className="mb-5">
        <Eyebrow>Operational board</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl text-slate-900">Nothing leaves this board unresolved</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          An alert disappears when it is dismissed. A case here moves left to right with a named owner and a clock on it,
          or it is closed with a stated reason that gets counted.
        </p>
      </header>

      {/* distribution strip */}
      <Card className="mb-5 p-5">
        <div className="flex h-3 overflow-hidden rounded-full">
          {LANES.map((lane) => {
            const n = cases.filter((c) => c.stage === lane.key).length;
            if (!n) return null;
            return (
              <div
                key={lane.key}
                className={cx("h-full", STAGE_STYLE[lane.key].bar)}
                style={{ width: `${(n / live.length) * 100}%` }}
                title={`${lane.label}: ${n}`}
              />
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {LANES.map((lane) => {
            const n = cases.filter((c) => c.stage === lane.key).length;
            return (
              <div key={lane.key} className="flex items-center gap-1.5">
                <span className={cx("h-2 w-2 rounded-full", STAGE_STYLE[lane.key].dot)} />
                <span className="text-xs text-slate-600">{lane.label}</span>
                <span className="font-mono text-xs tabular-nums text-slate-900">{n}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {LANES.map((lane) => {
          const items = cases.filter((c) => c.stage === lane.key);
          const s = STAGE_STYLE[lane.key];
          return (
            <div key={lane.key} className="flex flex-col rounded-xl border border-slate-200 bg-white">
              <div className={cx("flex items-center justify-between rounded-t-xl border-b px-3 py-2", s.soft, s.ring)}>
                <span className={cx("text-xs font-medium", s.text)}>{lane.label}</span>
                <span className={cx("font-mono text-xs tabular-nums", s.text)}>{items.length}</span>
              </div>
              <div className="flex-1 space-y-2 p-2">
                {items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onOpen(c.id)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
                  >
                    <div className="truncate text-sm font-medium text-slate-800">{c.name}</div>
                    <div className="mt-0.5 flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-400">{c.level}</span>
                      <span className={cx("font-mono text-xs tabular-nums", c.days > 90 && ["review", "owned"].includes(c.stage) ? "text-rose-600" : "text-slate-400")}>{c.days}d</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={cx("flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white", c.owner ? s.dot : "bg-slate-300")}>
                        {initials(c.owner)}
                      </span>
                      <span className="truncate text-xs text-slate-500">{c.owner ? c.owner.split(" —")[0] : "unassigned"}</span>
                    </div>
                  </button>
                ))}
                {items.length === 0 && <div className="px-1 py-4 text-center font-mono text-xs text-slate-300">empty</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Eyebrow>Off the board, on the record</Eyebrow>
        <p className="mb-2 mt-1 max-w-2xl text-sm text-slate-600">
          One row shows the system standing down because care already happened. The other shows a human overruling the
          flag — and that reason feeds the false-positive measure.
        </p>
        <Card>
          <div className="divide-y divide-slate-100">
            {side.map((c) => (
              <button key={c.id} onClick={() => onOpen(c.id)} className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-slate-50">
                <span className="w-40 shrink-0 truncate text-sm font-medium text-slate-800">{c.name}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-slate-600">
                  {c.stage === "verified" ? "Follow-up already documented — never entered the worklist" : c.excludeReason}
                </span>
                <StatusChip stage={c.stage} />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LoopBoard;

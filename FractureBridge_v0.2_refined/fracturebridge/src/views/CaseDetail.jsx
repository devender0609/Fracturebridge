import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check, X, AlertTriangle, UserCheck, Lock, ChevronDown } from "lucide-react";
import { cx, TEAM, EXCLUSION_REASONS, STAGE_STYLE } from "../data";
import { Eyebrow, Card, CardHead, AiTag, HumanTag, StatusChip, Bridge } from "../ui";

const stamp = () => {
  const d = new Date();
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
};

function CaseDetail({ c, onBack, update, notify, onStep, position }) {
  const [letter, setLetter] = useState(c.letter);
  const [editing, setEditing] = useState(false);
  const [assignTo, setAssignTo] = useState(TEAM[0]);
  const [excludeOpen, setExcludeOpen] = useState(false);
  const [fullReport, setFullReport] = useState(false);

  const act = (patch, entry, message) => {
    update(c.id, (old) => ({
      ...old,
      ...patch,
      audit: [...old.audit, { ts: stamp(), actor: entry.actor, text: entry.text }],
    }));
    if (message && notify) notify(message);
  };

  const s = STAGE_STYLE[c.stage];
  const found = c.followUp.filter((f) => f.status === "found").length;
  const empty = c.followUp.filter((f) => f.status === "none").length;
  const visible = fullReport ? c.report : c.report.filter((l) => l.hl || l.head);

  const Primary = ({ children, ...p }) => (
    <button
      {...p}
      className="w-full rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
    >
      {children}
    </button>
  );

  return (
    <div>
      {/* breadcrumb + paging */}
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ChevronLeft size={15} /> Worklist
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400">{position}</span>
          <button onClick={() => onStep(-1)} className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-500 hover:bg-slate-50" aria-label="Previous case">
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => onStep(1)} className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-500 hover:bg-slate-50" aria-label="Next case">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>{c.id} · MRN {c.mrn} · fictional patient</Eyebrow>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">{c.name}</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
            {c.age}-year-old {c.sex === "F" ? "woman" : "man"}. {c.finding}, documented {c.reportDate} on a {c.exam} ordered for {c.indication.toLowerCase()}.{" "}
            {empty > 0 && (
              <span className="text-amber-700">
                No follow-up evidence was found in {empty} of {c.followUp.length} checked sources in the connected demonstration record.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {c.priority !== "—" && (
            <span className={cx("rounded-full border px-2.5 py-0.5 text-xs font-medium", c.priority === "High" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 bg-slate-50 text-slate-600")}>
              {c.priority} priority
            </span>
          )}
          <StatusChip stage={c.stage} />
        </div>
      </div>

      <Card className="mb-6 px-5 py-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Eyebrow>The bridge · every span has a named owner</Eyebrow>
          <span className={cx("font-mono text-xs", c.days > 90 && ["review", "owned"].includes(c.stage) ? "text-rose-600" : "text-slate-400")}>{c.days} days elapsed</span>
        </div>
        <Bridge stage={c.stage} owner={c.owner} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* left */}
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHead
              accent="bg-slate-400"
              eyebrow="Source document · radiology"
              title="The finding was documented on the day of the scan"
              right={<span className="font-mono text-xs text-slate-400">RIS · signed</span>}
            />
            <div className="space-y-2 px-5 py-4 font-mono text-sm leading-relaxed">
              {visible.map((line, i) => (
                <p
                  key={i}
                  className={cx(
                    line.head && "pt-1 text-xs uppercase tracking-widest text-slate-400",
                    line.hl && "rounded-r-lg border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-slate-800",
                    !line.head && !line.hl && "text-slate-600"
                  )}
                >
                  {line.t}
                </p>
              ))}
            </div>
            <button
              onClick={() => setFullReport((v) => !v)}
              className="flex w-full items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-left transition-colors hover:bg-slate-100"
            >
              <span className="flex items-center gap-2">
                <AiTag>AI-highlighted</AiTag>
                <span className="text-xs text-slate-500">Highlighting only. The report text is the source of truth.</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-600">
                {fullReport ? "Hide" : "Full report"}
                <ChevronDown size={14} className={cx("transition-transform", fullReport && "rotate-180")} />
              </span>
            </button>
          </Card>

          <Card>
            <CardHead accent="bg-violet-500" eyebrow="Step 1 · extraction" title="What was extracted from the report" right={<AiTag />} />
            <dl className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2">
              {[
                ["Finding", c.finding],
                ["Level", c.level],
                ["Chronicity as reported", c.chronicity],
                ["Extraction certainty", c.confidence],
              ].map(([k, v]) => (
                <div key={k} className="bg-white px-5 py-3">
                  <dt className="font-mono text-xs uppercase tracking-wider text-slate-400">{k}</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>
            {c.verify.length > 0 && (
              <div className="border-t border-slate-100 bg-amber-50 px-5 py-4">
                <Eyebrow className="text-amber-700">Needs human verification</Eyebrow>
                <ul className="mt-2 space-y-1.5">
                  {c.verify.map((v) => (
                    <li key={v} className="flex items-start gap-2 text-sm text-amber-900">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card>
            <CardHead
              accent="bg-teal-500"
              eyebrow="Step 2 · follow-up check"
              title="Available follow-up evidence checked before routing"
              right={
                <span className={cx("rounded-full border px-2.5 py-1 font-mono text-xs", found ? "border-teal-200 bg-teal-50 text-teal-800" : "border-amber-200 bg-amber-50 text-amber-800")}>
                  {found} evidence present · {c.followUp.length - found} not found
                </span>
              }
            />
            <div className="flex gap-0.5 px-5 pt-4">
              {c.followUp.map((f, i) => (
                <span
                  key={i}
                  className={cx(
                    "h-1.5 flex-1 rounded-full",
                    f.status === "found" ? "bg-teal-600" : f.status === "partial" ? "bg-slate-300" : "bg-amber-400"
                  )}
                />
              ))}
            </div>
            <div className="divide-y divide-slate-100">
              {c.followUp.map((f) => (
                <div key={f.label} className="flex items-start gap-3 px-5 py-3">
                  <span
                    className={cx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      f.status === "found"
                        ? "border-teal-600 bg-teal-600 text-white"
                        : f.status === "partial"
                        ? "border-slate-300 bg-white text-slate-400"
                        : "border-amber-300 bg-amber-50 text-amber-600"
                    )}
                  >
                    {f.status === "found" ? <Check size={12} strokeWidth={3} /> : f.status === "partial" ? <span className="text-xs">~</span> : <X size={12} strokeWidth={3} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm font-medium text-slate-800">{f.label}</span>
                      <span className="font-mono text-xs text-slate-400">{f.source} · {f.lookback}</span>
                    </div>
                    <div className="text-sm text-slate-600">{f.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs leading-relaxed text-slate-600">
              No evidence in a connected source does not prove that care did not happen. Care may have occurred elsewhere or may appropriately have been deferred. Human review is required before action.
            </div>
          </Card>
        </div>

        {/* right */}
        <div className="space-y-6 lg:col-span-5">
          <Card className={cx("border-t-4", c.stage === "review" ? "border-t-amber-500" : "border-t-teal-600")}>
            <CardHead accent={s.bar} eyebrow="Step 3 · ownership" title="Who owns the next step" right={<HumanTag>Human only</HumanTag>} />
            <div className="px-5 py-4">
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="font-mono text-xs uppercase tracking-wider text-slate-400">Current owner</div>
                <div className="mt-0.5 text-sm font-medium text-slate-900">{c.owner || "Unassigned — sitting in the review queue"}</div>
              </div>

              {c.stage === "review" && (
                <div className="space-y-3">
                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-400">Assign to</span>
                    <select
                      value={assignTo}
                      onChange={(e) => setAssignTo(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    >
                      {TEAM.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <Primary
                    onClick={() =>
                      act(
                        { stage: "owned", owner: assignTo },
                        { actor: TEAM[0], text: `Potential care gap confirmed after chart review. Case assigned to ${assignTo}.` },
                        `Assigned to ${assignTo.split(",")[0]}`
                      )
                    }
                  >
                    Confirm potential care gap & assign
                  </Primary>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        act(
                          { stage: "verified" },
                          { actor: TEAM[0], text: "Reviewed: bone-health care already in place. Closed without outreach." },
                          "Closed — already managed"
                        )
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Already managed
                    </button>
                    <button
                      onClick={() => setExcludeOpen((v) => !v)}
                      className={cx("rounded-lg border px-3 py-2 text-sm transition-colors", excludeOpen ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50")}
                    >
                      Exclude
                    </button>
                  </div>
                  {excludeOpen && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <Eyebrow>A reason is required</Eyebrow>
                      <div className="mt-2 space-y-1">
                        {EXCLUSION_REASONS.map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              setExcludeOpen(false);
                              act(
                                { stage: "excluded", excludeReason: r },
                                { actor: TEAM[0], text: `Excluded after review: ${r}. Reason recorded for screening-exclusion analysis.` },
                                "Excluded — reason recorded"
                              );
                            }}
                            className="block w-full rounded-md bg-white px-2.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {c.stage === "owned" && (
                <p className="text-sm text-slate-600">Next: approve the patient letter below, then log the outreach call.</p>
              )}

              {c.stage === "contacted" && (
                <Primary
                  onClick={() =>
                    act(
                      { stage: "arranged" },
                      { actor: c.owner || TEAM[0], text: "Evaluation arranged: DXA ordered by the treating clinician." },
                      "Evaluation arranged"
                    )
                  }
                >
                  Record evaluation arranged
                </Primary>
              )}

              {c.stage === "arranged" && (
                <Primary
                  onClick={() =>
                    act(
                      { stage: "documented" },
                      { actor: c.owner || TEAM[0], text: "Bone-health plan documented by the treating clinician." },
                      "Plan documented"
                    )
                  }
                >
                  Record plan documented
                </Primary>
              )}

              {c.stage === "documented" && (
                <Primary
                  onClick={() =>
                    act(
                      { stage: "closed" },
                      { actor: c.owner || TEAM[0], text: "Loop closed: evaluation completed and plan documented." },
                      "Loop closed"
                    )
                  }
                >
                  Close the loop
                </Primary>
              )}

              {(c.stage === "closed" || c.stage === "verified" || c.stage === "excluded") && (
                <p className="text-sm text-slate-600">
                  {c.stage === "closed"
                    ? "Loop closed. The case stays in the record for measurement and audit."
                    : c.stage === "excluded"
                    ? `Excluded: ${c.excludeReason}. Recorded as a screening exclusion for case-finding analysis.`
                    : "Follow-up was verified as already in place. No outreach was generated."}
                </p>
              )}
            </div>
          </Card>

          {c.stage !== "verified" && c.stage !== "excluded" && (
            <Card>
              <CardHead
                accent="bg-indigo-500"
                eyebrow="Step 4 · patient engagement"
                title="Letter to the patient"
                right={c.letterApproved ? <HumanTag>Approved &amp; sent</HumanTag> : <AiTag>AI draft · unsent</AiTag>}
              />
              <div className="px-5 py-4">
                {editing ? (
                  <textarea
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    rows={10}
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed"
                  />
                ) : (
                  <div className="whitespace-pre-line rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    {letter}
                  </div>
                )}

                {!c.letterApproved ? (
                  <div className="mt-4">
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-600">
                      <Lock size={14} className="mt-0.5 shrink-0 text-slate-400" />
                      Nothing reaches the patient without a person approving it. There is no automatic send.
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing((v) => !v)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        {editing ? "Done" : "Edit"}
                      </button>
                      <div className="flex-1">
                        <Primary
                          disabled={c.stage === "review"}
                          onClick={() =>
                            act(
                              { stage: "contacted", letterApproved: true, letter },
                              {
                                actor: c.owner || TEAM[0],
                                text: "Patient letter reviewed and approved. Released to the portal and mail. Outreach call queued.",
                              },
                              "Letter approved and sent"
                            )
                          }
                        >
                          {c.stage === "review" ? "Assign an owner first" : "Approve and send"}
                        </Primary>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <UserCheck size={14} /> Approved by {c.owner || "the assigned owner"} before release.
                  </p>
                )}
              </div>
            </Card>
          )}

          <Card>
            <CardHead accent="bg-slate-400" eyebrow="Audit trail" title="Everything that happened, and who did it" />
            <ol className="px-5 py-4">
              {c.audit.map((a, i) => (
                <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className={cx("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", a.ai ? "bg-violet-500" : "bg-teal-600")} />
                    {i < c.audit.length - 1 && <span className="w-px flex-1 bg-slate-200" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{a.ts}</span>
                      <span className={cx("rounded px-1.5 py-0.5 font-mono text-xs uppercase tracking-wider", a.ai ? "bg-violet-50 text-violet-700" : "bg-teal-50 text-teal-800")}>
                        {a.ai ? "AI" : "Human"}
                      </span>
                    </div>
                    <div className="mt-1 text-sm leading-snug text-slate-700">{a.text}</div>
                    <div className="font-mono text-xs text-slate-400">{a.actor}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CaseDetail;

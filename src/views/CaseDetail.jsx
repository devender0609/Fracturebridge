import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Check, X, Minus, Info, AlertTriangle, Lock, Eye, ArrowRight } from "lucide-react";
import { cx, TEAM, DISPOSITIONS, STAGE_STYLE, STAGE_INDEX, TERMINAL_STAGES, LOOKBACK_NOTE, NEXT_STEP } from "../data";
import { Eyebrow, Card, CardHead, AiTag, HumanTag, StatusChip, Bridge } from "../ui";

const stamp = () => {
  const d = new Date();
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
};

function Disclose({ open, onToggle, label, count, children }) {
  return (
    <>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 border-t border-slate-100 px-5 py-2.5 text-left transition-colors hover:bg-slate-50"
      >
        <span className="text-sm font-medium text-teal-800">{label}</span>
        <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-slate-400">
          {count}
          <ChevronDown size={14} className={cx("transition-transform", open && "rotate-180")} />
        </span>
      </button>
      {open && children}
    </>
  );
}

function SourceRow({ f }) {
  return (
    <div className="flex items-start gap-3 px-5 py-3">
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
  );
}

export default function CaseDetail({ c, onBack, update, notify, onStep, position, role = "Care coordinator" }) {
  const [letter, setLetter] = useState(c.letter);
  const [editing, setEditing] = useState(false);
  const [assignTo, setAssignTo] = useState(TEAM[0]);
  const [documentWhy, setDocumentWhy] = useState(false);
  const [dispOpen, setDispOpen] = useState(null);
  const [otherReason, setOtherReason] = useState("");
  const [showEvidence, setShowEvidence] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  const readOnly = role === "Quality leader";
  const s = STAGE_STYLE[c.stage];
  const core = c.followUp.filter((f) => !f.optional);
  const evidenceSources = core.filter((f) => !f.context);
  const contextItems = core.filter((f) => f.context);
  const optional = c.followUp.filter((f) => f.optional);
  const empty = evidenceSources.filter((f) => f.status !== "found").length;
  const terminal = TERMINAL_STAGES.includes(c.stage);
  const highlight = c.report.filter((l) => l.hl);

  const act = (patch, entry, message) => {
    update(c.id, (old) => ({ ...old, ...patch, audit: [...old.audit, { ts: stamp(), actor: entry.actor, text: entry.text }] }));
    if (message && notify) notify(message);
  };

  const closeWith = (familyKey, reason) => {
    const f = DISPOSITIONS[familyKey];
    const text = reason.startsWith("Other") ? otherReason.trim() : reason;
    if (!text) return;
    setDispOpen(null);
    setDocumentWhy(false);
    setOtherReason("");
    act(
      { stage: f.stage, disposition: familyKey, closureReason: text, stoppedAt: STAGE_INDEX[c.stage] ?? 3 },
      {
        actor: c.owner || TEAM[0],
        text: `DEMONSTRATION: ${f.term.toLowerCase()} recorded by a human reviewer — ${text}.${
          familyKey === "screening"
            ? " Counted as a screening exclusion."
            : familyKey === "outreach"
            ? " Operational disposition: not a clinical closure, not care completed, and not patient contact."
            : " Not a screening exclusion."
        }`,
      },
      `${f.label} recorded`
    );
  };

  const Primary = (p) => (
    <button
      {...p}
      disabled={p.disabled || readOnly}
      className="w-full rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
    />
  );

  /* 6 · one primary action, one secondary, categories revealed on request */
  const DecisionMenu = (
    <div className="mt-2 space-y-2">
      {Object.values(DISPOSITIONS)
        .filter((f) => !f.requiresOutreach || ["outreach", "reached", "evaluation", "documented"].includes(c.stage))
        .map((f) => (
          <div key={f.key} className="overflow-hidden rounded-lg border border-slate-200">
            <button
              onClick={() => setDispOpen(dispOpen === f.key ? null : f.key)}
              disabled={readOnly}
              aria-expanded={dispOpen === f.key}
              className={cx(
                "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors disabled:text-slate-400",
                dispOpen === f.key ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium">{f.label}</span>
                <span className={cx("block font-mono text-xs uppercase tracking-wider", dispOpen === f.key ? "text-slate-400" : "text-slate-400")}>
                  {f.term}
                </span>
              </span>
              <ChevronDown size={14} className={cx("shrink-0 transition-transform", dispOpen === f.key && "rotate-180")} />
            </button>
            {dispOpen === f.key && (
              <div className="border-t border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs leading-relaxed text-slate-500">{f.help}</p>
                <div className="space-y-1">
                  {f.reasons.map((r) =>
                    r.startsWith("Other") ? (
                      <div key={r} className="rounded-md bg-white p-2">
                        <label className="font-mono text-xs uppercase tracking-wider text-slate-400" htmlFor={`other-${f.key}`}>
                          Other — reason required
                        </label>
                        <input
                          id={`other-${f.key}`}
                          value={otherReason}
                          onChange={(e) => setOtherReason(e.target.value)}
                          placeholder="Short reason"
                          className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                        />
                        <button
                          disabled={!otherReason.trim()}
                          onClick={() => closeWith(f.key, r)}
                          className="mt-2 w-full rounded bg-slate-900 px-2 py-1.5 text-xs font-medium text-white disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          Record closure
                        </button>
                      </div>
                    ) : (
                      <button
                        key={r}
                        onClick={() => closeWith(f.key, r)}
                        className="block w-full rounded-md bg-white px-2.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        {r}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
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

      {/* header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>{c.id} · MRN {c.mrn} · fictional patient</Eyebrow>
          <h1 className="mt-1 font-serif text-3xl text-slate-900">{c.name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {c.age}-year-old {c.sex === "F" ? "woman" : "man"} · {c.exam} for {c.indication.toLowerCase()} · {c.days} days since the finding
          </p>
        </div>
        <div className="flex flex-wrap items-stretch gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
          <span className="bg-white px-3 py-2">
            <span className="block font-mono text-xs uppercase tracking-wider text-slate-400">Next workflow step</span>
            <span className="block text-sm font-medium text-slate-900">{NEXT_STEP[c.stage]}</span>
          </span>
          <span className="bg-white px-3 py-2">
            <span className="block font-mono text-xs uppercase tracking-wider text-slate-400">Owner</span>
            <span className="block text-sm font-medium text-slate-900">{c.owner ? c.owner.split(" —")[0] : "Unassigned"}</span>
          </span>
          <span className="flex items-center bg-white px-3 py-2">
            <StatusChip stage={c.stage} />
          </span>
        </div>
      </div>

      {readOnly && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
          <Eye size={15} className="shrink-0 text-slate-400" />
          Quality-leader view: workflow actions are read-only in this demonstration.
        </div>
      )}

      {/* 3 + 4 · the five-second answer */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2" data-demo="why">
        <Card className="border-l-4 border-l-amber-500 p-5">
          <Eyebrow>Why this case is here</Eyebrow>
          <dl className="mt-3 space-y-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Report</dt>
              <dd className="mt-0.5 text-sm leading-snug text-slate-800">{c.finding} documented {c.reportDate}.</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Follow-up check</dt>
              <dd className="mt-0.5 text-sm leading-snug text-slate-800">
                {empty > 0
                  ? "No relevant bone-health follow-up found in the configured sources."
                  : "Relevant bone-health follow-up found in the configured sources."}
              </dd>
              <dd className="mt-1 text-xs leading-snug text-slate-500">
                A review signal, not proof that care did not occur elsewhere.
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-5">
          <Eyebrow>What happens next?</Eyebrow>
          <ol className="mt-3 space-y-2">
            {["Confirm the finding", "Check outside care", "Assign owner or disposition"].map((t, i) => (
              <li key={t} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-xs text-slate-600">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            A human decides whether the case should continue through the pathway. Workflow steps only — not a clinical
            recommendation.
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* evidence column */}
        <div className="space-y-6 lg:col-span-7">
          {/* 7 · what the system already checked */}
          <Card data-demo="checked">
            <CardHead
              accent="bg-teal-500"
              eyebrow="Follow-up check"
              title="What the system already checked"
              right={
                <span className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600">
                  {core.length} configured sources checked
                </span>
              }
            />
            <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 px-5 py-4 sm:grid-cols-2">
              {evidenceSources.map((f) => (
                <li key={f.label} className="flex items-start gap-2 text-sm text-slate-700">
                  {f.status === "found" ? (
                    <Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                  ) : (
                    <Minus size={14} className="mt-0.5 shrink-0 text-slate-300" />
                  )}
                  <span className="min-w-0 flex-1 leading-snug">{f.label}</span>
                  <span className={cx("mt-0.5 shrink-0 font-mono text-xs", f.status === "found" ? "text-emerald-700" : "text-slate-400")}>
                    {f.status === "found" ? "found" : "none found"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-x-4 gap-y-1 px-5 pb-3 font-mono text-xs text-slate-400">
              <span className="flex items-center gap-1"><Check size={11} className="text-emerald-600" /> qualifying follow-up found</span>
              <span className="flex items-center gap-1"><Minus size={11} className="text-slate-300" /> searched, none found</span>
              {contextItems.length > 0 && <span className="flex items-center gap-1"><Info size={11} className="text-amber-500" /> context only</span>}
            </div>
            <div className={cx("mx-5 mb-4 rounded-lg px-4 py-3", empty > 0 ? "bg-amber-50" : "bg-teal-50")}>
              <div className="font-mono text-xs uppercase tracking-wider text-slate-500">Result</div>
              <div className={cx("mt-0.5 text-sm font-medium", empty > 0 ? "text-amber-900" : "text-teal-900")}>
                {empty > 0
                  ? "No relevant bone-health follow-up found in the configured sources."
                  : "Relevant bone-health follow-up found in the configured sources."}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                This is a review signal, not proof that care did not occur elsewhere.
              </p>
            </div>
            {contextItems.length > 0 && (
              <div className="mx-5 mb-4 rounded-lg border border-slate-200 px-4 py-3">
                <div className="font-mono text-xs uppercase tracking-wider text-slate-400">Clinical context for reviewer</div>
                <ul className="mt-1.5 space-y-1">
                  {contextItems.map((f) => (
                    <li key={f.label} className="flex items-start gap-2 text-sm text-slate-700">
                      <Info size={13} className="mt-0.5 shrink-0 text-amber-500" />
                      <span>
                        <span className="font-medium">{f.label}:</span> {f.note}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1.5 text-xs text-slate-500">Context for the reviewer. Not a score, and not follow-up evidence.</p>
              </div>
            )}
            <Disclose open={showEvidence} onToggle={() => setShowEvidence((v) => !v)} label="View evidence details" count={`${core.length} sources`}>
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {core.map((f) => (
                  <SourceRow key={f.label} f={f} />
                ))}
              </div>
              {optional.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                  <div className="font-mono text-xs uppercase tracking-wider text-slate-400">
                    Optional future source — not required for the first-phase workflow
                  </div>
                  {optional.map((f) => (
                    <div key={f.label} className="mt-1.5 text-sm text-slate-600">
                      <span className="font-medium text-slate-700">{f.label}</span> · {f.note}
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-slate-100 px-5 py-2.5 text-xs text-slate-500">{LOOKBACK_NOTE}</div>
            </Disclose>
          </Card>

          {/* report, collapsed to the highlighted lines */}
          <Card>
            <CardHead accent="bg-slate-400" eyebrow="Report finding" title="What the radiologist documented" right={<span className="whitespace-nowrap font-mono text-xs text-slate-400" title="The passage below was highlighted by AI. The report text is unchanged and is the source of truth.">Finding highlighted by AI</span>} />
            <div className="space-y-2 px-5 py-4 font-mono text-sm leading-relaxed">
              {highlight.map((line, i) => (
                <p key={i} className="rounded-r-lg border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-slate-800">
                  {line.t}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-px border-t border-slate-100 bg-slate-100 sm:grid-cols-3">
              {[
                ["Level", c.level],
                ["Chronicity as reported", c.chronicity],
                ["Extraction certainty", c.confidence],
              ].map(([k, v]) => (
                <div key={k} className="bg-white px-4 py-2.5">
                  <div className="font-mono text-xs uppercase tracking-wider text-slate-400">{k}</div>
                  <div className="mt-0.5 text-sm text-slate-800">{v}</div>
                </div>
              ))}
            </div>
            <Disclose open={showReport} onToggle={() => setShowReport((v) => !v)} label="View full report excerpt" count="RIS · signed">
              <div className="space-y-2 border-t border-slate-100 px-5 py-4 font-mono text-sm leading-relaxed">
                {c.report.map((line, i) => (
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
            </Disclose>
          </Card>

          {c.verify.length > 0 && (
            <Card>
              <CardHead accent="bg-amber-500" eyebrow="Human verification" title="What a person confirms before any action" />
              <ul className="space-y-2 px-5 py-4">
                {c.verify.map((v) => (
                  <li key={v} className="flex items-start gap-2 text-sm text-slate-700">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
                    {v}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* decision column */}
        <div className="space-y-6 lg:col-span-5">
          <Card className={cx("border-t-4", c.stage === "review" ? "border-t-amber-500" : "border-t-teal-600")} data-demo="decision">
            <CardHead accent={s.bar} eyebrow="Human decision" title="What should happen?" right={<HumanTag>Human only</HumanTag>} />
            <div className="px-5 py-4">
              <div className="mb-4 rounded-lg bg-slate-50 px-4 py-3">
                <div className="font-mono text-xs uppercase tracking-wider text-slate-400">Current owner</div>
                <div className="mt-0.5 text-sm font-medium text-slate-900">{c.owner || "Unassigned — awaiting human review"}</div>
                {terminal && c.closureReason && (
                  <div className="mt-2 border-t border-slate-200 pt-2">
                    <div className="text-sm font-medium text-slate-800">{c.disposition ? DISPOSITIONS[c.disposition].label : "Closed"}</div>
                    <div className="font-mono text-xs uppercase tracking-wider text-slate-400">
                      {c.disposition ? DISPOSITIONS[c.disposition].term : ""}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">{c.closureReason}</div>
                  </div>
                )}
              </div>

              {c.stage === "review" && (
                <div className="space-y-3">
                  <div>
                    <Eyebrow>Primary action</Eyebrow>
                    <label className="mt-1.5 block">
                      <span className="sr-only">Assign to</span>
                      <select
                        value={assignTo}
                        onChange={(e) => setAssignTo(e.target.value)}
                        disabled={readOnly}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        {TEAM.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                    <div className="mt-2">
                      <Primary
                        onClick={() =>
                          act(
                            { stage: "owned", owner: assignTo },
                            { actor: TEAM[0], text: `Human review confirmed the case is actionable; context checked and no outside care identified. DEMONSTRATION: owner assigned to ${assignTo}.` },
                            `Assigned to ${assignTo.split(",")[0]}`
                          )
                        }
                      >
                        Assign an owner
                      </Primary>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <button
                      onClick={() => setDocumentWhy((v) => !v)}
                      disabled={readOnly}
                      aria-expanded={documentWhy}
                      className="flex w-full items-center justify-between gap-2 text-left text-sm text-slate-600 hover:text-slate-900 disabled:text-slate-400"
                    >
                      Document why this case should not continue through the pathway
                      <ChevronDown size={15} className={cx("shrink-0 transition-transform", documentWhy && "rotate-180")} />
                    </button>
                    {documentWhy && DecisionMenu}
                  </div>
                </div>
              )}

              {["owned", "outreach", "reached", "evaluation", "documented"].includes(c.stage) && (
                <div className="space-y-3">
                  {c.stage === "owned" && (
                    <p className="text-sm text-slate-600">Next: review and approve the patient communication. Approval records an outreach attempt — not patient contact.</p>
                  )}
                  {c.stage === "outreach" && (
                    <Primary onClick={() => act({ stage: "reached" }, { actor: c.owner || TEAM[0], text: "DEMONSTRATION: patient reached — communication delivered and acknowledged." }, "Patient reached")}>
                      Record patient reached
                    </Primary>
                  )}
                  {c.stage === "reached" && (
                    <Primary onClick={() => act({ stage: "evaluation" }, { actor: c.owner || TEAM[0], text: "DEMONSTRATION: evaluation initiated — bone-health evaluation ordered by the treating clinician." }, "Evaluation initiated")}>
                      Record evaluation initiated
                    </Primary>
                  )}
                  {c.stage === "evaluation" && (
                    <Primary onClick={() => act({ stage: "documented" }, { actor: c.owner || TEAM[0], text: "DEMONSTRATION: outcome documented by the treating clinician." }, "Outcome documented")}>
                      Record documented outcome
                    </Primary>
                  )}
                  {c.stage === "documented" && (
                    <Primary onClick={() => act({ stage: "closed" }, { actor: c.owner || TEAM[0], text: "DEMONSTRATION: pathway completed — evaluation completed and outcome documented." }, "Pathway completed")}>
                      Record pathway completed
                    </Primary>
                  )}
                  <div className="border-t border-slate-100 pt-3">
                    <button
                      onClick={() => setDocumentWhy((v) => !v)}
                      disabled={readOnly}
                      aria-expanded={documentWhy}
                      className="flex w-full items-center justify-between gap-2 text-left text-sm text-slate-600 hover:text-slate-900 disabled:text-slate-400"
                    >
                      Document why this case should not continue through the pathway
                      <ChevronDown size={15} className={cx("shrink-0 transition-transform", documentWhy && "rotate-180")} />
                    </button>
                    {documentWhy && DecisionMenu}
                  </div>
                </div>
              )}

              {terminal && (
                <p className="text-sm leading-relaxed text-slate-600">
                  {c.stage === "closed"
                    ? "Pathway completed. The case stays in the record for measurement and audit."
                    : c.disposition === "screening"
                    ? "Recorded as a screening exclusion and reported as a case-finding refinement signal."
                    : c.disposition === "outreach"
                    ? "Operational disposition. Reported separately from clinical outcomes; the patient was not reached and no clinical conclusion was drawn."
                    : "Closed after human review. Reported as an appropriate disposition, not a screening exclusion."}
                </p>
              )}
            </div>
          </Card>

          {!terminal && (
            <Card>
              <CardHead
                accent="bg-indigo-500"
                eyebrow="Patient engagement"
                title="Draft communication"
                right={c.letterApproved ? <HumanTag>Approved · simulated</HumanTag> : <AiTag>AI draft · not approved</AiTag>}
              />
              <div className="px-5 py-4">
                {c.letterApproved ? (
                  <div className="rounded-lg bg-teal-50 px-4 py-3 text-sm leading-relaxed text-teal-900">
                    <span className="font-medium">Demonstration outreach recorded — no message was actually sent.</span> Approved by{" "}
                    {c.owner || "the assigned owner"}.
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                    <Lock size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    Nothing goes to a patient without a person approving it, and this prototype cannot send anything.
                  </div>
                )}
              </div>
              <Disclose
                open={showLetter}
                onToggle={() => setShowLetter((v) => !v)}
                label={c.letterApproved ? "View approved draft" : "Review and approve the draft"}
                count={c.letterApproved ? "approved" : "not approved"}
              >
                <div className="border-t border-slate-100 px-5 py-4">
                  {editing ? (
                    <textarea value={letter} onChange={(e) => setLetter(e.target.value)} rows={10} className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed" />
                  ) : (
                    <div className="whitespace-pre-line rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{letter}</div>
                  )}
                  {!c.letterApproved && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setEditing((v) => !v)}
                        disabled={readOnly}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:text-slate-400"
                      >
                        {editing ? "Done" : "Edit"}
                      </button>
                      <div className="flex-1">
                        <Primary
                          disabled={c.stage === "review"}
                          onClick={() =>
                            act(
                              { stage: "outreach", letterApproved: true, letter },
                              {
                                actor: c.owner || TEAM[0],
                                text: "DEMONSTRATION: patient communication reviewed and approved by the assigned owner; simulated outreach attempt recorded. No message was sent by this prototype. An attempt is not patient contact.",
                              },
                              "Simulated outreach attempt recorded — nothing was sent"
                            )
                          }
                        >
                          {c.stage === "review" ? "Assign an owner first" : "Record simulated outreach approval"}
                        </Primary>
                      </div>
                    </div>
                  )}
                </div>
              </Disclose>
            </Card>
          )}

          <Card>
            <CardHead accent="bg-slate-400" eyebrow="Audit" title="Who did what, and when" right={<span className="font-mono text-xs text-slate-400">{c.audit.length} events</span>} />
            {!showAudit && <div className="px-5 py-3 text-sm leading-snug text-slate-600">Latest: {c.audit[c.audit.length - 1].text}</div>}
            <Disclose open={showAudit} onToggle={() => setShowAudit((v) => !v)} label="View full audit trail" count={`${c.audit.length} events`}>
              <ol className="border-t border-slate-100 px-5 py-4">
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
            </Disclose>
          </Card>
        </div>
      </div>

      {/* the loop, kept but demoted below the decision */}
      <Card className="mt-6 px-5 py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Eyebrow>Where this case sits in the loop</Eyebrow>
          <span className="flex items-center gap-1 font-mono text-xs text-slate-400">
            report <ArrowRight size={11} /> check <ArrowRight size={11} /> review <ArrowRight size={11} /> owner <ArrowRight size={11} /> outcome
          </span>
        </div>
        <Bridge stage={c.stage} owner={c.owner} stoppedAt={c.stoppedAt} disposition={c.disposition} closureReason={c.closureReason} />
      </Card>
    </div>
  );
}

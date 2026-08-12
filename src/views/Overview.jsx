import React from "react";
import { ArrowRight, ShieldCheck, UserCheck, FileSearch, HeartHandshake, Clock3, UserRoundCheck, AlertCircle, BarChart3 } from "lucide-react";
import { Card, Eyebrow, Stat } from "../ui";

const steps = [
  { icon: FileSearch, title: "Fracture documented", text: "Radiology report contains a vertebral compression-fracture finding." },
  { icon: ShieldCheck, title: "Potential gap identified", text: "Available follow-up evidence is checked across connected sources." },
  { icon: UserCheck, title: "Human owns the case", text: "A reviewer confirms context, assigns ownership, and decides the next step." },
  { icon: HeartHandshake, title: "Loop closes", text: "Patient communication and follow-up remain visible until appropriately resolved." },
];

const roleCopy = {
  "Care coordinator": {
    eyebrow: "Your operational view",
    title: "What needs action today",
    bullets: ["Unassigned cases", "Cases aging without resolution", "Patients waiting for outreach or evaluation"],
    icon: UserRoundCheck,
  },
  Clinician: {
    eyebrow: "Your clinical review view",
    title: "What needs a decision",
    bullets: ["Verify fracture context", "Confirm whether care is already underway", "Document whether additional follow-up is appropriate"],
    icon: ShieldCheck,
  },
  "Quality leader": {
    eyebrow: "Your program view",
    title: "What proves the pilot works",
    bullets: ["Case-finding yield", "Operational burden and aging", "Follow-up completion and closure"],
    icon: BarChart3,
  },
};

export default function Overview({ cases, onOpen, role = "Care coordinator" }) {
  const needs = cases.filter((c) => c.stage === "review").length;
  const unassigned = cases.filter((c) => ["review", "owned"].includes(c.stage) && !c.owner).length;
  const active = cases.filter((c) => ["owned", "contacted", "arranged", "documented"].includes(c.stage)).length;
  const closed = cases.filter((c) => c.stage === "closed").length;
  const aging = cases.filter((c) => c.days > 30 && ["review", "owned"].includes(c.stage)).length;
  const oldest = [...cases].filter(c=>["review","owned"].includes(c.stage)).sort((a,b)=>b.days-a.days)[0];
  const rc = roleCopy[role] || roleCopy["Care coordinator"];
  const RoleIcon = rc.icon;

  return (
    <div>
      <header className="mb-6">
        <Eyebrow>FractureBridge · accountable care-gap closure</Eyebrow>
        <h1 className="mt-2 max-w-4xl text-4xl font-semibold leading-tight text-slate-900">
          The fracture was already found. <span className="text-teal-700">Make sure someone owns the next step.</span>
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          FractureBridge surfaces potential follow-up gaps from radiology reports, routes them for human review, and tracks each case until it is appropriately resolved.
        </p>
      </header>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Illustrative pilot data.</strong> Demonstration values only — not Ascension performance data.
      </div>

      <Card className="mb-6 border-t-4 border-t-teal-700">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-800"><RoleIcon size={18}/><Eyebrow className="text-teal-700">{rc.eyebrow}</Eyebrow></div>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{rc.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2">{rc.bullets.map(b=><span key={b} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">{b}</span>)}</div>
          </div>
          {oldest && <button onClick={()=>onOpen(oldest.id)} className="min-w-[230px] rounded-xl border border-rose-200 bg-rose-50 p-4 text-left transition hover:bg-rose-100">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-rose-700"><Clock3 size={14}/>Oldest open case</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{oldest.name}</div>
            <div className="mt-1 text-sm text-slate-600">{oldest.finding}</div>
            <div className="mt-2 text-sm font-semibold text-rose-700">{oldest.days} days since finding →</div>
          </button>}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 md:grid-cols-5 md:divide-y-0">
          <Stat n={needs} label="Needs review" sub="human verification" tone="text-amber-700" />
          <Stat n={unassigned} label="Unassigned" sub="no named owner" tone="text-slate-800" />
          <Stat n={active} label="In progress" sub="owned workflow" tone="text-sky-700" />
          <Stat n={aging} label="Aging >30 days" sub="operational attention" tone="text-rose-700" />
          <Stat n={closed} label="Closed" sub="appropriately resolved" tone="text-emerald-700" />
        </div>
      </Card>

      <Card className="mb-6 p-5">
        <Eyebrow>How the loop closes</Eyebrow>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="relative rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Icon size={18}/></div>
              <div className="text-sm font-semibold text-slate-900">{title}</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-600">{text}</div>
              {i < steps.length - 1 && <ArrowRight className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-slate-300 md:block" size={18}/>} 
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <Eyebrow>Demo case</Eyebrow>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Margaret Ellison · 74</h2>
          <p className="mt-2 text-sm text-slate-600">CT abdomen/pelvis for abdominal pain documents a chronic-appearing L1 compression deformity.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-rose-50 p-3"><div className="text-xs text-rose-700">Days since finding</div><div className="mt-1 text-2xl font-semibold text-rose-800">102</div></div>
            <div className="rounded-lg bg-amber-50 p-3"><div className="text-xs text-amber-700">Follow-up evidence</div><div className="mt-1 text-sm font-semibold text-amber-900">Not found in connected record</div></div>
            <div className="rounded-lg bg-slate-50 p-3"><div className="text-xs text-slate-600">Owner</div><div className="mt-1 text-sm font-semibold text-slate-900">Unassigned</div></div>
          </div>
          <button onClick={() => onOpen("FB-04417")} className="mt-4 rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900">Open demo case</button>
        </Card>
        <Card className="p-5">
          <Eyebrow>Responsible AI boundary</Eyebrow>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">AI searches. People decide.</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• AI extracts report language and checks available follow-up evidence.</li>
            <li>• Human review determines whether the case is actionable.</li>
            <li>• No autonomous diagnosis, prescribing, referral, or patient messaging.</li>
            <li>• Every closure or exclusion is documented with a reason.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

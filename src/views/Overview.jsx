import React from "react";
import { ArrowRight, ShieldCheck, UserCheck, FileSearch, HeartHandshake, Clock3 } from "lucide-react";
import { Card, Eyebrow } from "../ui";

const steps = [
  { icon: FileSearch, title: "Find", text: "A radiology report already documents a vertebral compression-fracture finding." },
  { icon: ShieldCheck, title: "Verify", text: "FractureBridge checks the connected record for relevant follow-up evidence." },
  { icon: UserCheck, title: "Own", text: "A human confirms context, assigns responsibility, and decides the next step." },
  { icon: HeartHandshake, title: "Close", text: "Follow-up stays visible until the case is appropriately resolved." },
];

export default function Overview({ cases, onOpen }) {
  const needs = cases.filter((c) => c.stage === "review").length;
  const unassigned = cases.filter((c) => ["review", "owned"].includes(c.stage) && !c.owner).length;
  const active = cases.filter((c) => ["owned", "contacted", "arranged", "documented"].includes(c.stage)).length;
  const aging = cases.filter((c) => c.days > 30 && ["review", "owned"].includes(c.stage)).length;
  const oldest = [...cases].filter(c=>["review","owned"].includes(c.stage)).sort((a,b)=>b.days-a.days)[0];

  return <div>
    <header className="mb-8 max-w-4xl">
      <Eyebrow>FractureBridge</Eyebrow>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">The fracture was already found.</h1>
      <p className="mt-3 text-xl font-medium text-teal-700">Make sure someone owns the next step.</p>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">FractureBridge identifies potential follow-up gaps from existing radiology reports, routes them for human review, and keeps each case visible until it is appropriately resolved.</p>
    </header>

    <Card className="mb-7">
      <div className="grid divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {[
          [needs,"Needs review","text-amber-700"],
          [unassigned,"Unassigned","text-slate-900"],
          [active,"In progress","text-sky-700"],
          [aging,"Aging >30 days","text-rose-700"],
        ].map(([n,label,tone])=><div key={label} className="px-6 py-5"><div className={`text-3xl font-semibold ${tone}`}>{n}</div><div className="mt-1 text-sm text-slate-600">{label}</div></div>)}
      </div>
      <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-2.5 text-xs text-slate-400">Illustrative pilot data · fictional patients · no clinical system connection</div>
    </Card>

    <div className="mb-7 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4"><Eyebrow>How it works</Eyebrow><span className="text-xs text-slate-400">AI supports · humans decide</span></div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {steps.map(({icon:Icon,title,text},i)=><div key={title} className="relative"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon size={19}/></div><div className="mt-3 text-sm font-semibold text-slate-950">{title}</div><div className="mt-1 text-xs leading-5 text-slate-600">{text}</div>{i<steps.length-1&&<ArrowRight size={16} className="absolute -right-3 top-3 hidden text-slate-300 md:block"/>}</div>)}
        </div>
      </Card>

      {oldest&&<button onClick={()=>onOpen(oldest.id)} className="rounded-xl border border-rose-200 bg-white p-6 text-left shadow-sm transition hover:border-rose-300 hover:shadow-md"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700"><Clock3 size={14}/>Needs attention</div><div className="mt-4 text-xl font-semibold text-slate-950">{oldest.name}</div><div className="mt-1 text-sm leading-relaxed text-slate-600">{oldest.finding}</div><div className="mt-4 text-3xl font-semibold text-rose-700">{oldest.days}<span className="ml-1 text-sm font-normal text-slate-500">days</span></div><div className="mt-4 text-sm font-medium text-teal-800">Open case →</div></button>}
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6"><Eyebrow>Demo case</Eyebrow><h2 className="mt-2 text-xl font-semibold text-slate-950">Margaret Ellison · 74</h2><p className="mt-2 text-sm leading-6 text-slate-600">CT abdomen/pelvis for abdominal pain documents a chronic-appearing L1 compression deformity. No relevant follow-up evidence is found in the connected demonstration record.</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">102 days</span><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">No owner</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Human review required</span></div><button onClick={()=>onOpen("FB-04417")} className="mt-5 rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900">Open demo case</button></Card>
      <Card className="p-6"><Eyebrow>Responsible AI boundary</Eyebrow><h2 className="mt-2 text-xl font-semibold text-slate-950">AI searches. People decide.</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-violet-50 p-4"><div className="text-xs font-semibold uppercase tracking-wider text-violet-700">AI supports</div><p className="mt-2 text-sm leading-6 text-slate-600">Report extraction, follow-up checks, case summaries, and draft communication.</p></div><div className="rounded-xl bg-teal-50 p-4"><div className="text-xs font-semibold uppercase tracking-wider text-teal-700">Human decides</div><p className="mt-2 text-sm leading-6 text-slate-600">Clinical context, ownership, outreach, treatment decisions, and closure.</p></div></div></Card>
    </div>
  </div>;
}
